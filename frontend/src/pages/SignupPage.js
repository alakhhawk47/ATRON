import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
        <div className="bg-background text-white font-body selection:bg-cyan-400/30 min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left Branding */}
                <section className="lg:col-span-7 hidden lg:flex flex-col gap-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-black tracking-tighter text-cyan-400 font-headline">ATRON</span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-400/10 text-cyan-400 text-[10px] font-bold tracking-wider">Portal v2.0</span>
                    </div>
                    <h1 className="font-headline font-black text-5xl md:text-6xl leading-[0.95] tracking-tight editorial-text">
                        Join the<br />Future of<br />Attendance.
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
                        Create your account and start tracking attendance with QR codes, real-time analytics, and zero-proxy protection.
                    </p>
                </section>

                {/* Right Form Panel */}
                <section className="lg:col-span-5 w-full flex justify-center">
                    <div className="glass-panel w-full max-w-md rounded-3xl p-8 lg:p-10 border border-neutral-700/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />

                        {step === 1 ? (
                            <div className="relative z-10">
                                <div className="lg:hidden mb-6">
                                    <span className="text-2xl font-black tracking-tighter text-cyan-400 font-headline">ATRON</span>
                                </div>
                                <h2 className="font-headline font-black text-2xl tracking-tight mb-2">I am a...</h2>
                                <p className="text-neutral-500 text-sm mb-8">Select your role to get started</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        data-testid="role-student-btn"
                                        onClick={() => { setRole("student"); setStep(2); }}
                                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-700/10 hover:border-cyan-400/30 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 flex items-center justify-center group-hover:bg-cyan-400/20 transition-colors">
                                            <span className="material-symbols-outlined text-3xl text-cyan-400">school</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-bold text-lg">Student</h3>
                                            <p className="text-[11px] text-neutral-500 mt-1">Join classes & mark attendance</p>
                                        </div>
                                    </button>
                                    <button
                                        data-testid="role-teacher-btn"
                                        onClick={() => { setRole("teacher"); setStep(2); }}
                                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-700/10 hover:border-amber-400/30 transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                                            <span className="material-symbols-outlined text-3xl text-amber-400">person</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-bold text-lg">Teacher</h3>
                                            <p className="text-[11px] text-neutral-500 mt-1">Create classes & track attendance</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <button onClick={() => setStep(1)} className="text-sm text-neutral-500 hover:text-white mb-6 flex items-center gap-1 transition-colors">
                                    <span className="material-symbols-outlined text-base">arrow_back</span> Change role
                                </button>
                                <h2 className="font-headline font-black text-2xl tracking-tight mb-1">Create Account</h2>
                                <p className="text-neutral-500 text-sm mb-8">
                                    Signing up as a <span className="text-cyan-400 font-bold capitalize">{role}</span>
                                </p>

                                {error && (
                                    <div data-testid="signup-error" className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-red-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">error</span>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Full Name</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">badge</span>
                                            <input
                                                data-testid="signup-name-input"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="Your full name"
                                                className="w-full bg-neutral-900/80 border border-neutral-700/30 rounded-xl h-12 pl-12 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Academic Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">mail</span>
                                            <input
                                                data-testid="signup-email-input"
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="name@university.edu"
                                                className="w-full bg-neutral-900/80 border border-neutral-700/30 rounded-xl h-12 pl-12 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Password</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">lock</span>
                                            <input
                                                data-testid="signup-password-input"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="Create a password"
                                                className="w-full bg-neutral-900/80 border border-neutral-700/30 rounded-xl h-12 pl-12 pr-12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                                                <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        data-testid="signup-submit-btn"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 rounded-xl h-12 font-bold text-sm active:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <span className="material-symbols-outlined text-lg">arrow_forward</span></>}
                                    </button>
                                </form>
                            </div>
                        )}

                        <footer className="mt-10 text-center relative z-10">
                            <p className="text-sm text-neutral-500">
                                Already have an account?{" "}
                                <Link to="/login" className="text-cyan-400 font-bold hover:underline">Sign in</Link>
                            </p>
                        </footer>
                    </div>
                </section>
            </main>
        </div>
    );
}
