import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function JoinClass() {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await api.post("/classes/join", { class_code: code });
            setJoined(data.class);
        } catch (e) {
            setError(e.response?.data?.detail || "Failed to join class");
        } finally { setLoading(false); }
    };

    if (joined) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] p-4">
                <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-primary/20 text-center max-w-md w-full">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-primary">check_circle</span>
                    </div>
                    <h2 className="font-headline text-xl sm:text-2xl font-extrabold mb-2">Joined Successfully!</h2>
                    <p className="text-muted-foreground mb-2">{joined.name}</p>
                    <p className="text-sm text-muted-foreground mb-6">{joined.subject} - Teacher: {joined.teacher_name}</p>
                    <button onClick={() => navigate("/dashboard")}
                        className="theme-btn-primary px-8 py-3 rounded-xl text-sm active:scale-[0.98] duration-200">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] relative p-4">
            {/* Floating key icon */}
            <div className="absolute top-8 sm:top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-20">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">vpn_key</span>
                </div>
            </div>

            <div className="glass-panel p-6 sm:p-8 md:p-12 rounded-[1.5rem] sm:rounded-[2rem] border border-border/20 shadow-2xl max-w-xl w-full pt-12 sm:pt-16 mt-8 sm:mt-0">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight mb-2">Join a New Class</h1>
                    <p className="text-muted-foreground text-sm">Enter the 6-digit access code provided by your instructor to get started.</p>
                </div>

                {error && (
                    <div data-testid="join-error" className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* 6-digit code input */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block text-center">Access Code</label>
                        <input
                            data-testid="join-class-code-input"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            placeholder="XXXXXX"
                            className="w-full theme-input rounded-2xl h-14 sm:h-16 px-4 sm:px-6 text-center text-2xl sm:text-3xl font-headline font-bold tracking-[0.2em] sm:tracking-[0.4em] text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                            maxLength={6}
                            required
                        />
                    </div>

                    <button
                        data-testid="join-class-submit"
                        type="submit"
                        disabled={loading || code.length < 4}
                        className="w-full theme-btn-primary rounded-xl h-12 text-sm active:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="material-symbols-outlined text-lg">verified</span> Verify and Join</>}
                    </button>

                    <p className="text-center text-sm text-muted-foreground">
                        <span className="material-symbols-outlined text-xs align-middle mr-1">help</span>
                        Need help with your code?
                    </p>
                </form>

                {/* Back */}
                <div className="mt-8 flex justify-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        Back to Courses
                    </button>
                </div>
            </div>
        </div>
    );
}
