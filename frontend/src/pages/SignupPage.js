import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const { theme, toggleTheme } = useTheme();
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
        <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
                <span className="material-symbols-outlined text-xl text-muted-foreground">
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
                {/* Left Branding */}
                <section className="lg:col-span-7 hidden lg:flex flex-col gap-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-black tracking-tighter theme-primary font-headline">ATRON</span>
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold tracking-wider">Portal v2.0</span>
                    </div>
                    <h1 className="font-headline font-black text-5xl md:text-6xl leading-[0.95] tracking-tight editorial-text">
                        Join the<br />Future of<br />Attendance.
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                        Create your account and start tracking attendance with QR codes, real-time analytics, and zero-proxy protection.
                    </p>
                </section>

                {/* Right Form Panel */}
                <section className="lg:col-span-5 w-full flex justify-center">
                    <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-border/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />

                        {step === 1 ? (
                            <div className="relative z-10">
                                <div className="lg:hidden mb-6">
                                    <span className="text-2xl font-black tracking-tighter theme-primary font-headline">ATRON</span>
                                </div>
                                <h2 className="font-headline font-black text-2xl tracking-tight mb-2">I am a...</h2>
                                <p className="text-muted-foreground text-sm mb-8">Select your role to get started</p>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <button
                                        data-testid="role-student-btn"
                                        onClick={() => { setRole("student"); setStep(2); }}
                                        className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-muted/30 border border-border/10 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">school</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-bold text-base sm:text-lg">Student</h3>
                                            <p className="text-[11px] text-muted-foreground mt-1">Join classes & mark attendance</p>
                                        </div>
                                    </button>
                                    <button
                                        data-testid="role-teacher-btn"
                                        onClick={() => { setRole("teacher"); setStep(2); }}
                                        className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-muted/30 border border-border/10 hover:border-secondary/30 transition-all group"
                                    >
                                        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-secondary">person</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-bold text-base sm:text-lg">Teacher</h3>
                                            <p className="text-[11px] text-muted-foreground mt-1">Create classes & track attendance</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 transition-colors">
                                    <span className="material-symbols-outlined text-base">arrow_back</span> Change role
                                </button>
                                <h2 className="font-headline font-black text-2xl tracking-tight mb-1">Create Account</h2>
                                <p className="text-muted-foreground text-sm mb-6 sm:mb-8">
                                    Signing up as a <span className="text-primary font-bold capitalize">{role}</span>
                                </p>

                                {error && (
                                    <div data-testid="signup-error" className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">error</span>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Full Name</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">badge</span>
                                            <input
                                                data-testid="signup-name-input"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="Your full name"
                                                className="w-full theme-input rounded-xl h-12 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Academic Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">mail</span>
                                            <input
                                                data-testid="signup-email-input"
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="name@university.edu"
                                                className="w-full theme-input rounded-xl h-12 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Password</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">lock</span>
                                            <input
                                                data-testid="signup-password-input"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="Create a password"
                                                className="w-full theme-input rounded-xl h-12 pl-12 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/70">
                                                <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        data-testid="signup-submit-btn"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full theme-btn-primary rounded-xl h-12 text-sm active:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <span className="material-symbols-outlined text-lg">arrow_forward</span></>}
                                    </button>
                                </form>
                            </div>
                        )}

                        <footer className="mt-8 sm:mt-10 text-center relative z-10">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                            </p>
                        </footer>
                    </div>
                </section>
            </main>
        </div>
    );
}
