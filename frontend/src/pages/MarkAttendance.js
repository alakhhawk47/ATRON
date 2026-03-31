import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle, XCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarkAttendance() {
    const { sessionCode } = useParams();
    const { user, loading: authLoading, api } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading, success, error, login_required
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setStatus("login_required");
            return;
        }
        if (user.role !== "student") {
            setStatus("error");
            setMessage("Only students can mark attendance");
            return;
        }
        markAttendance();
    }, [user, authLoading]);

    const markAttendance = async () => {
        try {
            const { data } = await api.post("/attendance/mark", { session_code: sessionCode });
            setStatus("success");
            setMessage(data.message);
        } catch (e) {
            setStatus("error");
            setMessage(e.response?.data?.detail || "Failed to mark attendance");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="glass-card rounded-[2rem] p-10 border border-[#1a1a1a] max-w-md w-full text-center">
                <h1 className="font-headline text-2xl font-extrabold mb-2">
                    <span className="text-gradient-primary">ATRON</span>
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-8">Attendance Check-in</p>

                {status === "loading" && (
                    <div data-testid="mark-loading">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Marking your attendance...</p>
                    </div>
                )}

                {status === "success" && (
                    <div data-testid="mark-success">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-2 text-primary">Attendance Marked!</h3>
                        <p className="text-sm text-muted-foreground mb-6">{message}</p>
                        <Button className="bg-primary text-primary-foreground rounded-xl" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                    </div>
                )}

                {status === "error" && (
                    <div data-testid="mark-error">
                        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-destructive" />
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-2 text-destructive">Error</h3>
                        <p className="text-sm text-muted-foreground mb-6">{message}</p>
                        <Button variant="outline" className="rounded-xl border-[#2a2a2a]" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                    </div>
                )}

                {status === "login_required" && (
                    <div data-testid="mark-login-required">
                        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                            <LogIn className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-2">Login Required</h3>
                        <p className="text-sm text-muted-foreground mb-6">You need to sign in as a student to mark your attendance.</p>
                        <Button className="bg-primary text-primary-foreground rounded-xl" onClick={() => navigate(`/login?redirect=/mark-attendance/${sessionCode}`)}>
                            Sign In to Mark Attendance
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
