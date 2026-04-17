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
        <div className="bg-[#FAF8F0] text-[#1A1A2E] font-body min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#6D5AC1]/6 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#C9A84C]/6 rounded-full blur-[120px]" />

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
                {/* Left Branding */}
                <section className="lg:col-span-7 hidden lg:flex flex-col gap-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-black tracking-tighter text-[#6D5AC1] font-headline">ATRON</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#6D5AC1]/10 text-[#6D5AC1] text-[10px] font-bold tracking-wider">Portal v2.0</span>
                    </div>
                    <h1 className="font-headline font-black text-5xl md:text-6xl leading-[0.95] tracking-tight text-[#1A1A2E]">
                        Join the<br />Future of<br />Attendance.
                    </h1>
                    <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                        Create your account and start tracking attendance with QR codes, real-time analytics, and zero-proxy protection.
                    </p>
                </section>

                {/* Right Form Panel */}
                <section className="lg:col-span-5 w-full flex justify-center">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-200/60 shadow-[0_8px_40px_rgba(109,90,193,0.08)] relative overflow-hidden">

                        {step === 1 ? (
                            <div>
                                <div className="lg:hidden mb-6">
                                    <span className="text-2xl font-black tracking-tighter text-[#6D5AC1] font-headline">ATRON</span>
                                </div>
                                <h2 className="font-headline font-black text-2xl tracking-tight mb-2 text-[#1A1A2E]">I am a...</h2>
                                <p className="text-gray-500 text-sm mb-8">Select your role to get started</p>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <button
                                        data-testid="role-student-btn"
                                        onClick={() => { setRole("student"); setStep(2); }}
                                        className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200/60 hover:border-[#6D5AC1]/30 hover:bg-[#6D5AC1]/5 transition-all group"
                                    >
                                        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#6D5AC1]/10 flex items-center justify-center group-hover:bg-[#6D5AC1]/15 transition-colors">
                                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#6D5AC1]">school</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-bold text-base sm:text-lg text-[#1A1A2E]">Student</h3>
                                            <p className="text-[11px] text-gray-400 mt-1">Join classes & mark attendance</p>
                                        </div>
                                    </button>
                                    <button
                                        data-testid="role-teacher-btn"
                                        onClick={() => { setRole("teacher"); setStep(2); }}
                                        className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200/60 hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 transition-all group"
                                    >
                                        <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center group-hover:bg-[#C9A84C]/15 transition-colors">
                                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#C9A84C]">person</span>
                                        </div>
                                        <div>
                                            <h3 className="font-headline font-bold text-base sm:text-lg text-[#1A1A2E]">Teacher</h3>
                                            <p className="text-[11px] text-gray-400 mt-1">Create classes & track attendance</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-[#1A1A2E] mb-6 flex items-center gap-1 transition-colors">
                                    <span className="material-symbols-outlined text-base">arrow_back</span> Change role
                                </button>
                                <h2 className="font-headline font-black text-2xl tracking-tight mb-1 text-[#1A1A2E]">Create Account</h2>
                                <p className="text-gray-500 text-sm mb-6 sm:mb-8">
                                    Signing up as a <span className="text-[#6D5AC1] font-bold capitalize">{role}</span>
                                </p>

                                {error && (
                                    <div data-testid="signup-error" className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-600 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">error</span>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">badge</span>
                                            <input data-testid="signup-name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
                                                className="w-full bg-white border border-gray-200 rounded-xl h-12 pl-12 pr-4 text-sm focus:outline-none focus:border-[#6D5AC1]/50 focus:ring-2 focus:ring-[#6D5AC1]/10 transition-all placeholder:text-gray-400" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Academic Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">mail</span>
                                            <input data-testid="signup-email-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@university.edu"
                                                className="w-full bg-white border border-gray-200 rounded-xl h-12 pl-12 pr-4 text-sm focus:outline-none focus:border-[#6D5AC1]/50 focus:ring-2 focus:ring-[#6D5AC1]/10 transition-all placeholder:text-gray-400" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
                                            <input data-testid="signup-password-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password"
                                                className="w-full bg-white border border-gray-200 rounded-xl h-12 pl-12 pr-12 text-sm focus:outline-none focus:border-[#6D5AC1]/50 focus:ring-2 focus:ring-[#6D5AC1]/10 transition-all placeholder:text-gray-400" required />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <button data-testid="signup-submit-btn" type="submit" disabled={loading}
                                        className="w-full theme-btn-primary h-12 text-sm active:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <span className="material-symbols-outlined text-lg">arrow_forward</span></>}
                                    </button>
                                </form>
                            </div>
                        )}

                        <footer className="mt-8 sm:mt-10 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}
                                <Link to="/login" className="text-[#6D5AC1] font-bold hover:underline">Sign in</Link>
                            </p>
                        </footer>
                    </div>
                </section>
            </main>
        </div>
    );
}
