import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Check } from "lucide-react";

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
        } finally {
            setLoading(false);
        }
    };

    if (joined) {
        return (
            <div className="max-w-lg mx-auto py-12">
                <div className="glass-card rounded-[2rem] p-8 border border-[#1a1a1a] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-headline text-2xl font-extrabold mb-2">Joined Successfully!</h2>
                    <p className="text-muted-foreground mb-2">{joined.name}</p>
                    <p className="text-sm text-muted-foreground mb-6">{joined.subject} - Teacher: {joined.teacher_name}</p>
                    <Button className="bg-primary text-primary-foreground rounded-xl" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto py-8">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-headline text-3xl font-extrabold mb-2">Join a Class</h2>
            <p className="text-muted-foreground mb-8">Enter the class code provided by your teacher.</p>
            {error && <div data-testid="join-error" className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label className="text-sm font-semibold">Class Code</Label>
                    <Input
                        data-testid="join-class-code-input"
                        value={code}
                        onChange={e => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter 6-digit code"
                        className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-14 text-center text-2xl font-headline font-bold tracking-[0.3em] uppercase"
                        maxLength={6}
                        required
                    />
                </div>
                <Button data-testid="join-class-submit" type="submit" disabled={loading || code.length < 4} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 text-base font-bold">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Class"}
                </Button>
            </form>
        </div>
    );
}
