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
            <div className="min-h-screen bg-background text-white font-body flex items-center justify-center p-6">
                <div className="glass-card rounded-[2rem] p-8 border border-cyan-400/20 text-center max-w-md">
                    <div className="w-20 h-20 rounded-2xl bg-cyan-400/20 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl text-cyan-400">check_circle</span>
                    </div>
                    <h2 className="font-headline text-3xl font-extrabold mb-2">You're In!</h2>
                    <p className="text-neutral-400 mb-8">Your attendance has been recorded successfully.</p>
                    <button onClick={() => navigate("/dashboard")}
                        className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 px-8 py-3 rounded-xl font-bold text-sm active:scale-[0.98] duration-200">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white font-body flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />

            <div className="glass-panel rounded-[2rem] p-8 border border-neutral-700/20 text-center max-w-md relative z-10 shadow-2xl">
                <div className="mb-6">
                    <span className="text-2xl font-black tracking-tighter text-cyan-400 font-headline">ATRON</span>
                </div>
                <span className="material-symbols-outlined text-6xl text-cyan-400 mb-4">touch_app</span>
                <h2 className="font-headline text-2xl font-extrabold mb-2">Mark Your Attendance</h2>
                <p className="text-neutral-500 mb-8">Tap below to confirm your presence in this session.</p>

                {error && (
                    <div data-testid="mark-error" className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-red-400 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                <button
                    data-testid="confirm-attendance-btn"
                    onClick={markAttendance}
                    disabled={marking}
                    className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 px-8 py-4 rounded-xl font-bold text-base disabled:opacity-50 flex items-center justify-center gap-2 mx-auto w-full active:scale-[0.98] duration-200"
                >
                    {marking ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="material-symbols-outlined text-xl">check_circle</span> Confirm Attendance</>}
                </button>

                <p className="text-xs text-neutral-600 mt-6">Secured by ATRON v2.0</p>
            </div>
        </div>
    );
}
