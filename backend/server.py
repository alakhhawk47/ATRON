from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, Request, HTTPException, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import os
import logging
import bcrypt
import jwt
import secrets
import random
import string
import io

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="ATRON API", redirect_slashes=False)

# ====== CORS MIDDLEWARE ======
# Must be added immediately after app creation for cross-origin requests
origins = [
    "https://atron-924h5jjpd-alakhhawk47s-projects.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ATRON backend running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

JWT_ALGORITHM = "HS256"

def get_jwt_secret():
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=24), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def generate_class_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def generate_session_code():
    return secrets.token_urlsafe(16)

# ====== MODELS ======
class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

class CreateClassRequest(BaseModel):
    name: str
    subject: str
    section: str
    semester: str

class JoinClassRequest(BaseModel):
    class_code: str

class StartSessionRequest(BaseModel):
    class_id: str

class MarkAttendanceRequest(BaseModel):
    session_code: str

# ====== ROUTERS ======
auth_router = APIRouter(prefix="/api/auth", tags=["Auth"])
class_router = APIRouter(prefix="/api/classes", tags=["Classes"])
attendance_router = APIRouter(prefix="/api/attendance", tags=["Attendance"])
report_router = APIRouter(prefix="/api/reports", tags=["Reports"])
analytics_router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

# ====== AUTH ENDPOINTS ======
@auth_router.post("/register")
async def register(req: RegisterRequest, response: Response):
    email = req.email.lower().strip()
    if req.role not in ["teacher", "student"]:
        raise HTTPException(status_code=400, detail="Role must be 'teacher' or 'student'")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_doc = {
        "email": email,
        "password_hash": hash_password(req.password),
        "name": req.name,
        "role": req.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="none", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="none", max_age=604800, path="/")
    return {"_id": user_id, "email": email, "name": req.name, "role": req.role, "token": access_token}

@auth_router.post("/login")
async def login(req: LoginRequest, response: Response, request: Request):
    email = req.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("attempts", 0) >= 5:
        locked_until = attempt.get("locked_until")
        if locked_until and datetime.now(timezone.utc) < datetime.fromisoformat(locked_until):
            raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")
        else:
            await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        if attempt:
            new_attempts = attempt.get("attempts", 0) + 1
            update_data = {"attempts": new_attempts}
            if new_attempts >= 5:
                update_data["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
            await db.login_attempts.update_one({"identifier": identifier}, {"$set": update_data})
        else:
            await db.login_attempts.insert_one({"identifier": identifier, "attempts": 1})
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_many({"identifier": identifier})
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="none", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="none", max_age=604800, path="/")
    return {"_id": user_id, "email": email, "name": user["name"], "role": user["role"], "token": access_token}

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@auth_router.get("/me")
async def get_me(request: Request):
    return await get_current_user(request)

# ====== CLASS ENDPOINTS ======
@class_router.get("")
async def list_classes(request: Request):
    user = await get_current_user(request)
    if user["role"] == "teacher":
        classes = await db.classes.find({"teacher_id": user["_id"]}, {"_id": 0}).to_list(100)
    else:
        memberships = await db.class_members.find({"student_id": user["_id"]}, {"_id": 0}).to_list(100)
        class_ids = [m["class_id"] for m in memberships]
        classes = await db.classes.find({"id": {"$in": class_ids}}, {"_id": 0}).to_list(100)

    class_ids = [cls["id"] for cls in classes]
    # Batch aggregations instead of N+1 queries
    student_counts = {}
    async for doc in db.class_members.aggregate([
        {"$match": {"class_id": {"$in": class_ids}}},
        {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
    ]):
        student_counts[doc["_id"]] = doc["count"]

    session_counts = {}
    async for doc in db.attendance_sessions.aggregate([
        {"$match": {"class_id": {"$in": class_ids}}},
        {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
    ]):
        session_counts[doc["_id"]] = doc["count"]

    attendance_counts = {}
    if user["role"] == "student":
        async for doc in db.attendance_records.aggregate([
            {"$match": {"class_id": {"$in": class_ids}, "student_id": user["_id"]}},
            {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
        ]):
            attendance_counts[doc["_id"]] = doc["count"]

    for cls in classes:
        cls["student_count"] = student_counts.get(cls["id"], 0)
        total_sessions = session_counts.get(cls["id"], 0)
        cls["total_sessions"] = total_sessions
        if user["role"] == "student" and total_sessions > 0:
            attended = attendance_counts.get(cls["id"], 0)
            cls["attendance_percentage"] = round((attended / total_sessions) * 100, 1)
        else:
            cls["attendance_percentage"] = 0
    return classes

@class_router.post("")
async def create_class(req: CreateClassRequest, request: Request):
    user = await get_current_user(request)
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create classes")
    class_code = generate_class_code()
    while await db.classes.find_one({"class_code": class_code}):
        class_code = generate_class_code()
    class_doc = {
        "id": str(ObjectId()),
        "name": req.name,
        "subject": req.subject,
        "section": req.section,
        "semester": req.semester,
        "teacher_id": user["_id"],
        "teacher_name": user["name"],
        "class_code": class_code,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.classes.insert_one(class_doc)
    class_doc.pop("_id", None)
    return class_doc

@class_router.get("/{class_id}")
async def get_class(class_id: str, request: Request):
    await get_current_user(request)
    cls = await db.classes.find_one({"id": class_id}, {"_id": 0})
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    cls["student_count"] = await db.class_members.count_documents({"class_id": class_id})
    cls["total_sessions"] = await db.attendance_sessions.count_documents({"class_id": class_id})
    return cls

@class_router.post("/join")
async def join_class(req: JoinClassRequest, request: Request):
    user = await get_current_user(request)
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can join classes")
    cls = await db.classes.find_one({"class_code": req.class_code.upper().strip()}, {"_id": 0})
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found with this code")
    existing = await db.class_members.find_one({"class_id": cls["id"], "student_id": user["_id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Already joined this class")
    await db.class_members.insert_one({
        "class_id": cls["id"],
        "student_id": user["_id"],
        "student_name": user["name"],
        "student_email": user["email"],
        "joined_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Successfully joined class", "class": cls}

@class_router.get("/{class_id}/students")
async def get_class_students(class_id: str, request: Request):
    await get_current_user(request)
    members = await db.class_members.find({"class_id": class_id}, {"_id": 0}).to_list(200)
    total_sessions = await db.attendance_sessions.count_documents({"class_id": class_id})

    # Batch: count attendance per student
    attendance_map = {}
    async for doc in db.attendance_records.aggregate([
        {"$match": {"class_id": class_id}},
        {"$group": {"_id": "$student_id", "count": {"$sum": 1}}}
    ]):
        attendance_map[doc["_id"]] = doc["count"]

    # Batch: last attendance per student
    last_att_map = {}
    async for doc in db.attendance_records.aggregate([
        {"$match": {"class_id": class_id}},
        {"$sort": {"marked_at": -1}},
        {"$group": {"_id": "$student_id", "last": {"$first": "$marked_at"}}}
    ]):
        last_att_map[doc["_id"]] = doc["last"]

    for member in members:
        sid = member["student_id"]
        attended = attendance_map.get(sid, 0)
        if total_sessions > 0:
            member["attendance_percentage"] = round((attended / total_sessions) * 100, 1)
            member["total_sessions"] = total_sessions
            member["attended_sessions"] = attended
        else:
            member["attendance_percentage"] = 0
            member["total_sessions"] = 0
            member["attended_sessions"] = 0
        member["last_attendance"] = last_att_map.get(sid, None)
    return members

# ====== ATTENDANCE ENDPOINTS ======
@attendance_router.post("/sessions")
async def start_session(req: StartSessionRequest, request: Request):
    user = await get_current_user(request)
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can start sessions")
    active = await db.attendance_sessions.find_one({"class_id": req.class_id, "is_active": True})
    if active:
        raise HTTPException(status_code=400, detail="An active session already exists for this class")
    session_code = generate_session_code()
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    session_doc = {
        "id": str(ObjectId()),
        "class_id": req.class_id,
        "teacher_id": user["_id"],
        "session_code": session_code,
        "qr_data": f"{frontend_url}/mark-attendance/{session_code}",
        "started_at": datetime.now(timezone.utc).isoformat(),
        "ended_at": None,
        "is_active": True
    }
    await db.attendance_sessions.insert_one(session_doc)
    session_doc.pop("_id", None)
    cls = await db.classes.find_one({"id": req.class_id}, {"_id": 0})
    session_doc["class_name"] = cls["name"] if cls else "Unknown"
    session_doc["total_students"] = await db.class_members.count_documents({"class_id": req.class_id})
    return session_doc

@attendance_router.get("/sessions/{session_id}")
async def get_session(session_id: str, request: Request):
    await get_current_user(request)
    session = await db.attendance_sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    records = await db.attendance_records.find({"session_id": session_id}, {"_id": 0}).to_list(200)
    session["records"] = records
    session["total_students"] = await db.class_members.count_documents({"class_id": session["class_id"]})
    session["present_count"] = len(records)
    cls = await db.classes.find_one({"id": session["class_id"]}, {"_id": 0})
    session["class_name"] = cls["name"] if cls else "Unknown"
    return session

@attendance_router.put("/sessions/{session_id}/end")
async def end_session(session_id: str, request: Request):
    user = await get_current_user(request)
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can end sessions")
    session = await db.attendance_sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.attendance_sessions.update_one(
        {"id": session_id},
        {"$set": {"is_active": False, "ended_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Session ended"}

@attendance_router.post("/mark")
async def mark_attendance(req: MarkAttendanceRequest, request: Request):
    user = await get_current_user(request)
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can mark attendance")
    session = await db.attendance_sessions.find_one({"session_code": req.session_code, "is_active": True})
    if not session:
        raise HTTPException(status_code=404, detail="No active session found with this code")
    membership = await db.class_members.find_one({"class_id": session["class_id"], "student_id": user["_id"]})
    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this class")
    existing = await db.attendance_records.find_one({"session_id": session["id"], "student_id": user["_id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this session")
    record = {
        "id": str(ObjectId()),
        "session_id": session["id"],
        "class_id": session["class_id"],
        "student_id": user["_id"],
        "student_name": user["name"],
        "student_email": user["email"],
        "marked_at": datetime.now(timezone.utc).isoformat(),
        "method": "qr_code"
    }
    await db.attendance_records.insert_one(record)
    record.pop("_id", None)
    return {"message": "Attendance marked successfully", "record": record}

@attendance_router.get("/sessions/active/{class_id}")
async def get_active_session(class_id: str, request: Request):
    await get_current_user(request)
    session = await db.attendance_sessions.find_one({"class_id": class_id, "is_active": True}, {"_id": 0})
    if not session:
        return {"active": False}
    records = await db.attendance_records.find({"session_id": session["id"]}, {"_id": 0}).to_list(200)
    session["records"] = records
    session["total_students"] = await db.class_members.count_documents({"class_id": class_id})
    session["present_count"] = len(records)
    session["active"] = True
    return session

# ====== REPORT ENDPOINTS ======
@report_router.get("/{class_id}")
async def get_class_report(class_id: str, request: Request):
    await get_current_user(request)
    cls = await db.classes.find_one({"id": class_id}, {"_id": 0})
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    members = await db.class_members.find({"class_id": class_id}, {"_id": 0}).to_list(200)
    total_sessions = await db.attendance_sessions.count_documents({"class_id": class_id})

    # Batch: count attendance per student
    attendance_map = {}
    async for doc in db.attendance_records.aggregate([
        {"$match": {"class_id": class_id}},
        {"$group": {"_id": "$student_id", "count": {"$sum": 1}}}
    ]):
        attendance_map[doc["_id"]] = doc["count"]

    report_data = []
    for member in members:
        attended = attendance_map.get(member["student_id"], 0)
        percentage = round((attended / total_sessions) * 100, 1) if total_sessions > 0 else 0
        report_data.append({
            "student_name": member["student_name"],
            "student_email": member["student_email"],
            "total_sessions": total_sessions,
            "attended": attended,
            "absent": total_sessions - attended,
            "percentage": percentage
        })
    return {"class": cls, "total_sessions": total_sessions, "students": report_data}

@report_router.get("/{class_id}/export")
async def export_report(class_id: str, request: Request):
    await get_current_user(request)
    import openpyxl
    cls = await db.classes.find_one({"id": class_id}, {"_id": 0})
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    members = await db.class_members.find({"class_id": class_id}, {"_id": 0}).to_list(200)
    total_sessions = await db.attendance_sessions.count_documents({"class_id": class_id})

    # Batch: count attendance per student
    attendance_map = {}
    async for doc in db.attendance_records.aggregate([
        {"$match": {"class_id": class_id}},
        {"$group": {"_id": "$student_id", "count": {"$sum": 1}}}
    ]):
        attendance_map[doc["_id"]] = doc["count"]

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Attendance Report"
    ws.append(["ATRON - Attendance Report"])
    ws.append([f"Class: {cls['name']} - {cls['subject']}"])
    ws.append([f"Section: {cls['section']}, Semester: {cls['semester']}"])
    ws.append([f"Total Sessions: {total_sessions}"])
    ws.append([])
    ws.append(["#", "Student Name", "Email", "Attended", "Absent", "Percentage"])
    for i, member in enumerate(members, 1):
        attended = attendance_map.get(member["student_id"], 0)
        percentage = round((attended / total_sessions) * 100, 1) if total_sessions > 0 else 0
        ws.append([i, member["student_name"], member["student_email"], attended, total_sessions - attended, f"{percentage}%"])
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="ATRON_{cls["name"]}_Report.xlsx"'}
    )

# ====== ANALYTICS ENDPOINTS ======
@analytics_router.get("/teacher")
async def teacher_analytics(request: Request):
    user = await get_current_user(request)
    if user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Teacher access only")
    classes = await db.classes.find({"teacher_id": user["_id"]}, {"_id": 0}).to_list(100)
    class_ids = [cls["id"] for cls in classes]

    # Batch aggregations
    student_counts = {}
    async for doc in db.class_members.aggregate([
        {"$match": {"class_id": {"$in": class_ids}}},
        {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
    ]):
        student_counts[doc["_id"]] = doc["count"]

    session_counts = {}
    async for doc in db.attendance_sessions.aggregate([
        {"$match": {"class_id": {"$in": class_ids}}},
        {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
    ]):
        session_counts[doc["_id"]] = doc["count"]

    record_counts = {}
    async for doc in db.attendance_records.aggregate([
        {"$match": {"class_id": {"$in": class_ids}}},
        {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
    ]):
        record_counts[doc["_id"]] = doc["count"]

    total_students = 0
    total_sessions = 0
    total_records = 0
    total_possible = 0
    class_stats = []
    for cls in classes:
        students = student_counts.get(cls["id"], 0)
        sessions = session_counts.get(cls["id"], 0)
        records = record_counts.get(cls["id"], 0)
        total_students += students
        total_sessions += sessions
        total_records += records
        total_possible += students * sessions
        rate = round((records / (students * sessions)) * 100, 1) if students > 0 and sessions > 0 else 0
        class_stats.append({"class_name": cls["name"], "subject": cls["subject"], "students": students, "sessions": sessions, "attendance_rate": rate, "class_id": cls["id"]})
    avg_rate = round((total_records / total_possible) * 100, 1) if total_possible > 0 else 0
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_sessions = await db.attendance_sessions.count_documents({"teacher_id": user["_id"], "started_at": {"$gte": today_start.isoformat()}})
    return {
        "total_classes": len(classes),
        "total_students": total_students,
        "total_sessions": total_sessions,
        "attendance_rate": avg_rate,
        "today_sessions": today_sessions,
        "class_stats": class_stats
    }

@analytics_router.get("/student")
async def student_analytics(request: Request):
    user = await get_current_user(request)
    if user["role"] != "student":
        raise HTTPException(status_code=403, detail="Student access only")
    memberships = await db.class_members.find({"student_id": user["_id"]}, {"_id": 0}).to_list(100)
    class_ids = [m["class_id"] for m in memberships]
    classes = await db.classes.find({"id": {"$in": class_ids}}, {"_id": 0}).to_list(100)

    # Batch aggregations
    session_counts = {}
    async for doc in db.attendance_sessions.aggregate([
        {"$match": {"class_id": {"$in": class_ids}}},
        {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
    ]):
        session_counts[doc["_id"]] = doc["count"]

    attended_counts = {}
    async for doc in db.attendance_records.aggregate([
        {"$match": {"class_id": {"$in": class_ids}, "student_id": user["_id"]}},
        {"$group": {"_id": "$class_id", "count": {"$sum": 1}}}
    ]):
        attended_counts[doc["_id"]] = doc["count"]

    total_sessions_all = 0
    total_attended_all = 0
    class_stats = []
    alerts = []
    for cls in classes:
        total_sessions = session_counts.get(cls["id"], 0)
        attended = attended_counts.get(cls["id"], 0)
        total_sessions_all += total_sessions
        total_attended_all += attended
        percentage = round((attended / total_sessions) * 100, 1) if total_sessions > 0 else 0
        class_stats.append({"class_name": cls["name"], "subject": cls["subject"], "class_id": cls["id"], "total_sessions": total_sessions, "attended": attended, "percentage": percentage})
        if percentage < 75 and total_sessions > 0:
            alerts.append(f"Low attendance in {cls['name']}: {percentage}%")
    overall = round((total_attended_all / total_sessions_all) * 100, 1) if total_sessions_all > 0 else 0
    return {"overall_attendance": overall, "classes_joined": len(classes), "total_sessions": total_sessions_all, "attended_sessions": total_attended_all, "class_stats": class_stats, "alerts": alerts}

# ====== SEED DATA ======
async def seed_data():
    user_count = await db.users.count_documents({})
    if user_count > 0:
        logger.info("Data already exists, skipping seed")
        return
    logger.info("Seeding demo data...")
    teacher_doc = {"email": "teacher@atron.edu", "password_hash": hash_password("teacher123"), "name": "Dr. Sarah Mitchell", "role": "teacher", "created_at": datetime.now(timezone.utc).isoformat()}
    teacher_result = await db.users.insert_one(teacher_doc)
    teacher_id = str(teacher_result.inserted_id)
    students_data = [
        {"name": "Alex Thompson", "email": "student@atron.edu"},
        {"name": "Aria Sterling", "email": "aria@atron.edu"},
        {"name": "Dev Mishra", "email": "dev@atron.edu"},
        {"name": "Priya Sen", "email": "priya@atron.edu"},
        {"name": "Julian Kross", "email": "julian@atron.edu"},
        {"name": "Maya Patel", "email": "maya@atron.edu"},
        {"name": "Marcus Chen", "email": "marcus@atron.edu"},
        {"name": "Elena Rodriguez", "email": "elena@atron.edu"},
    ]
    student_ids = []
    for s in students_data:
        result = await db.users.insert_one({"email": s["email"], "password_hash": hash_password("student123"), "name": s["name"], "role": "student", "created_at": datetime.now(timezone.utc).isoformat()})
        student_ids.append({"id": str(result.inserted_id), "name": s["name"], "email": s["email"]})
    classes_data = [
        {"name": "Data Structures", "subject": "CS301", "section": "A", "semester": "5"},
        {"name": "Database Systems", "subject": "CS302", "section": "A", "semester": "5"},
        {"name": "Machine Learning", "subject": "CS401", "section": "B", "semester": "7"},
    ]
    class_ids = []
    for c in classes_data:
        class_id = str(ObjectId())
        class_code = generate_class_code()
        await db.classes.insert_one({"id": class_id, "name": c["name"], "subject": c["subject"], "section": c["section"], "semester": c["semester"], "teacher_id": teacher_id, "teacher_name": "Dr. Sarah Mitchell", "class_code": class_code, "created_at": datetime.now(timezone.utc).isoformat()})
        class_ids.append(class_id)
        for sid in student_ids:
            await db.class_members.insert_one({"class_id": class_id, "student_id": sid["id"], "student_name": sid["name"], "student_email": sid["email"], "joined_at": datetime.now(timezone.utc).isoformat()})
    for class_id in class_ids:
        for day_offset in range(10):
            session_date = datetime.now(timezone.utc) - timedelta(days=day_offset)
            session_id = str(ObjectId())
            session_code = generate_session_code()
            await db.attendance_sessions.insert_one({"id": session_id, "class_id": class_id, "teacher_id": teacher_id, "session_code": session_code, "qr_data": f"https://atron.edu/mark/{session_code}", "started_at": session_date.isoformat(), "ended_at": (session_date + timedelta(minutes=30)).isoformat(), "is_active": False})
            attending = random.sample(student_ids, k=random.randint(5, len(student_ids)))
            for sid in attending:
                await db.attendance_records.insert_one({"id": str(ObjectId()), "session_id": session_id, "class_id": class_id, "student_id": sid["id"], "student_name": sid["name"], "student_email": sid["email"], "marked_at": (session_date + timedelta(minutes=random.randint(1, 10))).isoformat(), "method": "qr_code"})
    logger.info("Demo data seeded successfully!")

# ====== STARTUP ======
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.classes.create_index("class_code")
    await db.classes.create_index("teacher_id")
    await db.class_members.create_index([("class_id", 1), ("student_id", 1)], unique=True)
    await db.attendance_sessions.create_index("session_code")
    await db.attendance_sessions.create_index([("class_id", 1), ("is_active", 1)])
    await db.attendance_records.create_index([("session_id", 1), ("student_id", 1)], unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_data()
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# ATRON Test Credentials\n\n## Teacher Account\n- Email: teacher@atron.edu\n- Password: teacher123\n- Role: teacher\n\n## Student Account\n- Email: student@atron.edu\n- Password: student123\n- Role: student\n\n## Auth Endpoints\n- POST /api/auth/register\n- POST /api/auth/login\n- POST /api/auth/logout\n- GET /api/auth/me\n")
    logger.info("ATRON backend started successfully!")

@app.on_event("shutdown")
async def shutdown():
    client.close()

app.include_router(auth_router)
app.include_router(class_router)
app.include_router(attendance_router)
app.include_router(report_router)
app.include_router(analytics_router)

@app.get("/api")
async def api_root():
    return {"message": "ATRON API v1.0"}

@app.get("/api/health")
async def api_health():
    return {"status": "healthy"}
