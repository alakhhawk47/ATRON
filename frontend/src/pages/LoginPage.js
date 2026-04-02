import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("student");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="bg-background text-white font-body selection:bg-cyan-400/30 min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background blurs */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left Branding Panel */}
                <section className="lg:col-span-7 hidden lg:flex flex-col gap-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-black tracking-tighter text-cyan-400 font-headline">ATRON</span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-400/10 text-cyan-400 text-[10px] font-bold tracking-wider">Portal v2.0</span>
                    </div>
                    <h1 className="font-headline font-black text-5xl md:text-6xl leading-[0.95] tracking-tight editorial-text">
                        Authenticate.<br />Access.<br />Achieve.
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
                        The next-generation portal for attendance tracking, course management, and real-time analytics. Designed for the modern scholar.
                    </p>
                    <div className="glass-card rounded-2xl p-6 border border-neutral-700/20 max-w-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-cyan-400">qr_code_scanner</span>
                            <span className="font-bold text-sm">QR-based attendance tracking</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-amber-400">shield</span>
                            <span className="font-bold text-sm">Anti-proxy protection</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-400">monitoring</span>
                            <span className="font-bold text-sm">Real-time analytics</span>
                        </div>
                    </div>
                </section>

                {/* Right Auth Panel */}
                <section className="lg:col-span-5 w-full flex justify-center">
                    <div className="glass-panel w-full max-w-md rounded-3xl p-8 lg:p-10 border border-neutral-700/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
                        <header className="mb-10 relative z-10">
                            <div className="lg:hidden mb-6">
                                <span className="text-2xl font-black tracking-tighter text-cyan-400 font-headline">ATRON</span>
                            </div>
                            <h2 className="font-headline font-black text-2xl tracking-tight">Welcome Back</h2>
                            <p className="text-neutral-500 text-sm mt-1">Select your role to get started</p>
                        </header>

                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                data-testid="role-student-chip"
                                type="button"
                                onClick={() => setRole("student")}
                                className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                                    role === "student"
                                        ? "bg-cyan-400/10 border-2 border-cyan-400"
                                        : "bg-neutral-900/50 border border-neutral-700/10 hover:border-neutral-700/30"
                                }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${role === "student" ? "text-cyan-400" : "text-neutral-500"}`}>school</span>
                                <span className={`text-sm font-bold ${role === "student" ? "text-cyan-400" : "text-neutral-400"}`}>Student</span>
                            </button>
                            <button
                                data-testid="role-teacher-chip"
                                type="button"
                                onClick={() => setRole("teacher")}
                                className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                                    role === "teacher"
                                        ? "bg-cyan-400/10 border-2 border-cyan-400"
                                        : "bg-neutral-900/50 border border-neutral-700/10 hover:border-neutral-700/30"
                                }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${role === "teacher" ? "text-cyan-400" : "text-neutral-500"}`}>person</span>
                                <span className={`text-sm font-bold ${role === "teacher" ? "text-cyan-400" : "text-neutral-400"}`}>Teacher</span>
                            </button>
                        </div>

                        {error && (
                            <div data-testid="login-error" className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-red-400 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Academic Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">mail</span>
                                    <input
                                        data-testid="login-email-input"
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
                                        data-testid="login-password-input"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full bg-neutral-900/80 border border-neutral-700/30 rounded-xl h-12 pl-12 pr-12 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                                        <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                            </div>
                            <button
                                data-testid="login-submit-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 rounded-xl h-12 font-bold text-sm active:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In to Portal <span className="material-symbols-outlined text-lg">arrow_forward</span></>}
                            </button>
                        </form>

                        {/* Social Login */}
                        <div className="mt-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-neutral-800" />
                                <span className="text-xs text-neutral-600 uppercase tracking-wider">or join with</span>
                                <div className="flex-1 h-px bg-neutral-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/20 text-sm font-semibold text-neutral-400 hover:text-white hover:border-neutral-600/50 transition-all">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/20 text-sm font-semibold text-neutral-400 hover:text-white hover:border-neutral-600/50 transition-all">
                                    <span className="material-symbols-outlined text-base">key</span>
                                    Azure ID
                                </button>
                            </div>
                        </div>

                        <footer className="mt-10 text-center">
                            <p className="text-sm text-neutral-500">
                                New to institution?{" "}
                                <Link to="/signup" className="text-cyan-400 font-bold hover:underline">Create Account</Link>
                            </p>
                        </footer>
                    </div>
                </section>
            </main>
        </div>
    );
}
