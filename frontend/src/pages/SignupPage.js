import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, GraduationCap, BookOpen } from "lucide-react";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await register(email, password, name, role);
        setLoading(false);
        if (result.success) navigate("/dashboard");
        else setError(result.error);
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
                </div>
                <div className="relative z-10 px-16 text-center">
                    <h1 className="font-headline text-6xl font-extrabold mb-4">
                        <span className="text-gradient-primary">ATRON</span>
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-6">Join the future of attendance</p>
                    <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">Create your account and start tracking attendance with QR codes, real-time analytics, and zero-proxy protection.</p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to home
                    </Link>

                    {step === 1 ? (
                        <>
                            <h2 className="font-headline text-3xl font-extrabold mb-2">I am a...</h2>
                            <p className="text-muted-foreground mb-8">Select your role to get started</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    data-testid="role-student-btn"
                                    onClick={() => { setRole("student"); setStep(2); }}
                                    className="glass-card rounded-2xl p-8 border border-[#1a1a1a] hover:border-primary/50 transition-all text-center group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                        <GraduationCap className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-headline font-bold text-lg">Student</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Join classes & mark attendance</p>
                                </button>
                                <button
                                    data-testid="role-teacher-btn"
                                    onClick={() => { setRole("teacher"); setStep(2); }}
                                    className="glass-card rounded-2xl p-8 border border-[#1a1a1a] hover:border-secondary/50 transition-all text-center group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                                        <BookOpen className="w-8 h-8 text-secondary" />
                                    </div>
                                    <h3 className="font-headline font-bold text-lg">Teacher</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Create classes & track attendance</p>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors">
                                <ArrowLeft className="w-3 h-3" /> Change role
                            </button>
                            <h2 className="font-headline text-3xl font-extrabold mb-2">Create account</h2>
                            <p className="text-muted-foreground mb-8">Signing up as a <span className="text-primary font-semibold capitalize">{role}</span></p>

                            {error && <div data-testid="signup-error" className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive">{error}</div>}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                                    <Input data-testid="signup-name-input" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12" required />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                                    <Input data-testid="signup-email-input" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12" required />
                                </div>
                                <div>
                                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                    <Input data-testid="signup-password-input" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12" required />
                                </div>
                                <Button data-testid="signup-submit-btn" type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 text-base font-bold">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                                </Button>
                            </form>
                        </>
                    )}

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
