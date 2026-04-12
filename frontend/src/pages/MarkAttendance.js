import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function MarkAttendance() {
    const { sessionId } = useParams();
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [marking, setMarking] = useState(false);
    const [marked, setMarked] = useState(false);
    const [error, setError] = useState("");

    const markAttendance = async () => {
        setMarking(true);
        setError("");
        try {
            await api.post("/attendance/mark", { session_code: sessionId });
            setMarked(true);
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to mark attendance");
        } finally { setMarking(false); }
    };

    useEffect(() => {
        if (!user) return;
        if (user.role === "teacher") {
            navigate("/dashboard");
        }
    }, [user]);

    if (marked) {
        return (
            <div className="min-h-screen bg-background text-foreground font-body flex items-center justify-center p-4 sm:p-6">
                <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-primary/20 text-center max-w-md w-full">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary">check_circle</span>
                    </div>
                    <h2 className="font-headline text-2xl sm:text-3xl font-extrabold mb-2">You're In!</h2>
                    <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Your attendance has been recorded successfully.</p>
                    <button onClick={() => navigate("/dashboard")}
                        className="theme-btn-primary px-8 py-3 rounded-xl text-sm active:scale-[0.98] duration-200">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-body flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[120px]" />

            <div className="glass-panel rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-border/20 text-center max-w-md w-full relative z-10 shadow-2xl">
                <div className="mb-6">
                    <span className="text-2xl font-black tracking-tighter theme-primary font-headline">ATRON</span>
                </div>
                <span className="material-symbols-outlined text-5xl sm:text-6xl text-primary mb-4">touch_app</span>
                <h2 className="font-headline text-xl sm:text-2xl font-extrabold mb-2">Mark Your Attendance</h2>
                <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Tap below to confirm your presence in this session.</p>

                {error && (
                    <div data-testid="mark-error" className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive flex items-center gap-2 text-left">
                        <span className="material-symbols-outlined text-base shrink-0">error</span>
                        {error}
                    </div>
                )}

                <button
                    data-testid="confirm-attendance-btn"
                    onClick={markAttendance}
                    disabled={marking}
                    className="theme-btn-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base disabled:opacity-50 flex items-center justify-center gap-2 mx-auto w-full active:scale-[0.98] duration-200"
                >
                    {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="material-symbols-outlined text-xl">check_circle</span> Confirm Attendance</>}
                </button>

                <p className="text-[10px] sm:text-xs text-muted-foreground mt-6">Secured by ATRON v2.0</p>
            </div>
        </div>
    );
}
