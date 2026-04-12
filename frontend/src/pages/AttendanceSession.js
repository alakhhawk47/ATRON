import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";

export default function AttendanceSession() {
    const { classId } = useParams();
    const { api, user } = useAuth();
    const { theme } = useTheme();
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
    }, [session, theme]);

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
            const qrColor = theme === 'light' ? "#6B5B95" : "#69daff";
            await QRCode.toCanvas(canvasRef.current, markUrl, {
                width: 280,
                margin: 2,
                color: { dark: qrColor, light: "#00000000" }
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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

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
                    <button onClick={() => navigate(`/classes/${classId}`)} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span> Back to Class
                    </button>
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">{classInfo?.name || "Attendance Session"}</h1>
                    <p className="text-muted-foreground text-sm mt-1">Active QR session in progress</p>
                </div>
                <button
                    data-testid="end-session-btn"
                    onClick={endSession}
                    disabled={ending}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 font-bold text-sm transition-all"
                >
                    {ending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-lg">stop_circle</span>}
                    End Session
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* QR Panel */}
                <div className="lg:col-span-5 glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-primary/20 text-center ghost-border">
                    <div className="mb-6">
                        <div className="relative w-28 sm:w-32 h-28 sm:h-32 mx-auto flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" stroke="hsl(var(--primary) / 0.1)" strokeWidth="4" fill="none" />
                                <circle cx="50%" cy="50%" r="45%" stroke="hsl(var(--primary))" strokeWidth="4" fill="none"
                                    strokeDasharray={`${2 * Math.PI * 58}`}
                                    strokeDashoffset={`${2 * Math.PI * 58 * (1 - (elapsed % 3600) / 3600)}`}
                                    strokeLinecap="round" className="transition-all duration-1000" />
                            </svg>
                            <div className="text-center">
                                <p className="text-xl sm:text-2xl font-headline font-extrabold text-primary">{formatTime(elapsed)}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-2xl p-4 sm:p-6 mb-6 inline-block">
                        <canvas ref={canvasRef} data-testid="qr-canvas" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
                        <div className="bg-primary/10 rounded-xl py-3">
                            <p className="text-xl sm:text-2xl font-headline font-extrabold text-primary">{presentCount}</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Present</p>
                        </div>
                        <div className="bg-destructive/10 rounded-xl py-3">
                            <p className="text-xl sm:text-2xl font-headline font-extrabold text-destructive">{absentCount}</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Absent</p>
                        </div>
                        <div className="bg-secondary/10 rounded-xl py-3">
                            <p className="text-xl sm:text-2xl font-headline font-extrabold text-secondary">0</p>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Flagged</p>
                        </div>
                    </div>
                </div>

                {/* Live Feed */}
                <div className="lg:col-span-7">
                    <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-border/50">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="font-headline text-lg sm:text-xl font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Live Check-in Feed
                            </h3>
                            <span className="text-xs text-muted-foreground">{presentCount} of {totalStudents} checked in</span>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                            {students.length === 0 ? (
                                <div className="text-center py-12">
                                    <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-4">hourglass_empty</span>
                                    <p className="text-muted-foreground">Waiting for students to check in...</p>
                                </div>
                            ) : (
                                students.map((s, i) => (
                                    <div key={i} data-testid={`checkin-${i}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-all">
                                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center text-xs sm:text-sm font-bold text-primary">
                                            {s.student_name?.charAt(0) || "S"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{s.student_name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{s.student_email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-primary font-bold">Verified</p>
                                            <p className="text-[10px] text-muted-foreground">{s.marked_at ? new Date(s.marked_at).toLocaleTimeString() : ""}</p>
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
                <div className="glass-card rounded-[2rem] p-8 border border-primary/20 text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-primary">check_circle</span>
                    </div>
                    <h2 className="font-headline text-2xl font-extrabold mb-2">Attendance Marked!</h2>
                    <p className="text-muted-foreground mb-6">You have been marked as present.</p>
                    <button onClick={() => navigate("/dashboard")} className="theme-btn-primary px-8 py-3 rounded-xl text-sm">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="glass-card rounded-[2rem] p-8 border border-border/50 text-center max-w-md">
                <span className="material-symbols-outlined text-5xl text-primary mb-6">touch_app</span>
                <h2 className="font-headline text-2xl font-extrabold mb-2">Mark Your Attendance</h2>
                <p className="text-muted-foreground mb-6">Tap below to confirm your presence in this session.</p>
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive">{error}</div>
                )}
                <button data-testid="mark-attendance-btn" onClick={markAttendance} disabled={marking}
                    className="theme-btn-primary px-8 py-3 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2 mx-auto">
                    {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="material-symbols-outlined text-lg">check_circle</span> Confirm Attendance</>}
                </button>
            </div>
        </div>
    );
}
