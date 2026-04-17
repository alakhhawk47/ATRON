import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";

export default function AttendanceSession() {
    const { classId } = useParams();
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const canvasRef = useRef(null);
    const [session, setSession] = useState(location.state?.session || null);
    const [students, setStudents] = useState([]);
    const [qrUrl, setQrUrl] = useState("");
    const [elapsed, setElapsed] = useState(0);
    const [loading, setLoading] = useState(!location.state?.session);
    const [ending, setEnding] = useState(false);
    const [classInfo, setClassInfo] = useState(null);

    useEffect(() => {
        loadInitialData();
        const interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (session) {
            generateQR();
            const pollInterval = setInterval(pollAttendance, 5000);
            return () => clearInterval(pollInterval);
        }
    }, [session]);

    const loadInitialData = async () => {
        try {
            const { data } = await api.get(`/classes/${classId}`);
            setClassInfo(data);
            if (!session) {
                const sessRes = await api.post("/attendance/sessions", { class_id: classId });
                setSession(sessRes.data);
            }
        } catch (e) {
            console.error(e);
        } finally { setLoading(false); }
    };

    const generateQR = async () => {
        if (!session) return;
        const markUrl = `${window.location.origin}/mark-attendance/${session.session_code}`;
        setQrUrl(markUrl);
        if (canvasRef.current) {
            await QRCode.toCanvas(canvasRef.current, markUrl, {
                width: 280,
                margin: 2,
                color: { dark: "#6D5AC1", light: "#00000000" }
            });
        }
    };

    const pollAttendance = async () => {
        if (!session) return;
        try {
            const { data } = await api.get(`/attendance/sessions/${session.id}`);
            setStudents(data.records || []);
        } catch (e) { console.error(e); }
    };

    const endSession = async () => {
        setEnding(true);
        try {
            await api.put(`/attendance/sessions/${session.id}/end`);
            navigate(`/classes/${classId}`);
        } catch (e) {
            alert(e.response?.data?.detail || "Failed to end session");
        } finally { setEnding(false); }
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#6D5AC1]" /></div>;

    if (user?.role === "student") {
        return <StudentMarkView session={session} api={api} />;
    }

    const totalStudents = classInfo?.student_count || 0;
    const presentCount = students.length;
    const absentCount = totalStudents - presentCount;

    return (
        <div data-testid="attendance-session" className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <button onClick={() => navigate(`/classes/${classId}`)} className="text-sm text-gray-400 hover:text-[#1A1A2E] mb-4 flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span> Back to Class
                    </button>
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight text-[#1A1A2E]">{classInfo?.name || "Attendance Session"}</h1>
                    <p className="text-gray-500 text-sm mt-1">Active QR session in progress</p>
                </div>
                <button
                    data-testid="end-session-btn"
                    onClick={endSession}
                    disabled={ending}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold text-sm transition-all"
                >
                    {ending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-lg">stop_circle</span>}
                    End Session
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* QR Panel */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-[#6D5AC1]/15 shadow-sm text-center">
                    <div className="mb-6">
                        <div className="relative w-28 sm:w-32 h-28 sm:h-32 mx-auto flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" stroke="#6D5AC1" strokeOpacity="0.1" strokeWidth="4" fill="none" />
                                <circle cx="50%" cy="50%" r="45%" stroke="#6D5AC1" strokeWidth="4" fill="none"
                                    strokeDasharray={`${2 * Math.PI * 58}`}
                                    strokeDashoffset={`${2 * Math.PI * 58 * (1 - (elapsed % 3600) / 3600)}`}
                                    strokeLinecap="round" className="transition-all duration-1000" />
                            </svg>
                            <div className="text-center">
                                <p className="text-xl sm:text-2xl font-headline font-extrabold text-[#6D5AC1]">{formatTime(elapsed)}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-6 inline-block">
                        <canvas ref={canvasRef} data-testid="qr-canvas" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
                        <div className="bg-[#6D5AC1]/8 rounded-xl py-3">
                            <p className="text-xl sm:text-2xl font-headline font-extrabold text-[#6D5AC1]">{presentCount}</p>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Present</p>
                        </div>
                        <div className="bg-red-50 rounded-xl py-3">
                            <p className="text-xl sm:text-2xl font-headline font-extrabold text-red-500">{absentCount}</p>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Absent</p>
                        </div>
                        <div className="bg-[#C9A84C]/8 rounded-xl py-3">
                            <p className="text-xl sm:text-2xl font-headline font-extrabold text-[#C9A84C]">0</p>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider">Flagged</p>
                        </div>
                    </div>
                </div>

                {/* Live Feed */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="font-headline text-lg sm:text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#6D5AC1] animate-pulse" />
                                Live Check-in Feed
                            </h3>
                            <span className="text-xs text-gray-400">{presentCount} of {totalStudents} checked in</span>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                            {students.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">hourglass_empty</span>
                                    <p className="text-gray-400">Waiting for students to check in...</p>
                                </div>
                            ) : (
                                students.map((s, i) => (
                                    <div key={i} data-testid={`checkin-${i}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#6D5AC1]/15 transition-all">
                                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-[#6D5AC1]/10 flex items-center justify-center text-xs sm:text-sm font-bold text-[#6D5AC1]">
                                            {s.student_name?.charAt(0) || "S"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-[#1A1A2E] truncate">{s.student_name}</p>
                                            <p className="text-xs text-gray-400 truncate">{s.student_email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[#6D5AC1] font-bold">Verified</p>
                                            <p className="text-[10px] text-gray-400">{s.marked_at ? new Date(s.marked_at).toLocaleTimeString() : ""}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StudentMarkView({ session, api }) {
    const [marking, setMarking] = useState(false);
    const [marked, setMarked] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const markAttendance = async () => {
        setMarking(true);
        setError("");
        try {
            await api.post("/attendance/mark", { session_code: session?.session_code });
            setMarked(true);
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to mark attendance");
        } finally { setMarking(false); }
    };

    if (marked) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white rounded-2xl p-8 border border-[#6D5AC1]/15 shadow-sm text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-[#6D5AC1]/10 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-[#6D5AC1]">check_circle</span>
                    </div>
                    <h2 className="font-headline text-2xl font-extrabold mb-2 text-[#1A1A2E]">Attendance Marked!</h2>
                    <p className="text-gray-500 mb-6">You have been marked as present.</p>
                    <button onClick={() => navigate("/dashboard")} className="theme-btn-primary px-8 py-3 text-sm">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm text-center max-w-md">
                <span className="material-symbols-outlined text-5xl text-[#6D5AC1] mb-6">touch_app</span>
                <h2 className="font-headline text-2xl font-extrabold mb-2 text-[#1A1A2E]">Mark Your Attendance</h2>
                <p className="text-gray-500 mb-6">Tap below to confirm your presence in this session.</p>
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-600">{error}</div>
                )}
                <button data-testid="mark-attendance-btn" onClick={markAttendance} disabled={marking}
                    className="theme-btn-primary px-8 py-3 text-sm disabled:opacity-50 flex items-center justify-center gap-2 mx-auto">
                    {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="material-symbols-outlined text-lg">check_circle</span> Confirm Attendance</>}
                </button>
            </div>
        </div>
    );
}
