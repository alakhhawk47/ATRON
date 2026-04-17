import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const HERO_IMG = "https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800";

    return (
        <div className="bg-[#FAF8F0] text-[#1A1A2E] font-body selection:bg-[#6D5AC1]/20 min-h-screen">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-4 sm:gap-8">
                    <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#6D5AC1] font-headline">ATRON</span>
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <a href="#" className="text-[#6D5AC1] font-bold transition-colors">Home</a>
                        <a href="#features" className="text-gray-500 hover:text-[#6D5AC1] transition-colors">Features</a>
                        <a href="#cta" className="text-gray-500 hover:text-[#6D5AC1] transition-colors">Contact</a>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button data-testid="nav-login-btn" onClick={() => navigate("/login")} className="px-3 sm:px-5 py-2 font-semibold text-gray-600 hover:text-[#6D5AC1] transition-colors text-sm sm:text-base">Login</button>
                    <button data-testid="nav-signup-btn" onClick={() => navigate("/signup")} className="theme-btn-primary px-5 sm:px-7 py-2 sm:py-2.5 text-sm sm:text-base active:scale-95 duration-200">Get Started</button>
                </div>
            </nav>

            <main className="relative pt-20 sm:pt-24">
                {/* Hero Section */}
                <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-24 overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#6D5AC1]/8 rounded-full blur-[120px] -z-10" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#C9A84C]/8 rounded-full blur-[100px] -z-10" />
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center w-full max-w-7xl mx-auto">
                        <div className="flex flex-col gap-6 sm:gap-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6D5AC1]/8 border border-[#6D5AC1]/15 w-fit">
                                <span className="w-2 h-2 rounded-full bg-[#6D5AC1] animate-pulse" />
                                <span className="text-xs font-bold tracking-widest uppercase text-[#6D5AC1]">Version 2.0 Now Live</span>
                            </div>
                            <h1 data-testid="hero-heading" className="font-headline font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#1A1A2E] leading-[0.9] tracking-tighter">
                                The Future of Campus Management.
                            </h1>
                            <p className="text-gray-500 text-base sm:text-lg md:text-xl max-w-md leading-relaxed">
                                Transform your institution with AI-driven presence verification. Eliminate manual logs and fraud with our frictionless, biometric-grade recognition system.
                            </p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                                <button data-testid="hero-get-started-btn" onClick={() => navigate("/signup")} className="theme-btn-primary px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base active:scale-95 duration-200 flex items-center gap-2">
                                    Get Started
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                                <button data-testid="hero-demo-btn" onClick={() => navigate("/login")} className="theme-btn-outline px-7 sm:px-9 py-3 sm:py-3.5 font-bold text-sm sm:text-base hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">play_circle</span>
                                    View Demo
                                </button>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="relative z-10 p-8 bg-white rounded-[2.5rem] border border-gray-200/60 shadow-[0_8px_40px_rgba(109,90,193,0.08)] overflow-hidden">
                                <img alt="University campus with students" className="w-full rounded-2xl hover:scale-[1.02] transition-transform duration-700 object-cover aspect-[4/3]" src={HERO_IMG} />
                                <div className="absolute top-12 -left-12 p-4 bg-white border border-[#6D5AC1]/15 rounded-2xl shadow-lg flex items-center gap-4 animate-float">
                                    <span className="material-symbols-outlined text-[#6D5AC1]">verified</span>
                                    <div>
                                        <p className="font-bold text-sm">100.0% Match</p>
                                        <p className="text-[10px] text-gray-400">0.42ms Response</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-12 -right-12 p-4 bg-white border border-[#C9A84C]/20 rounded-2xl shadow-lg flex items-center gap-4">
                                    <span className="material-symbols-outlined text-[#C9A84C]">qr_code_scanner</span>
                                    <div>
                                        <p className="font-bold text-sm">QR Session</p>
                                        <p className="text-[10px] text-gray-400">24 Present</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section id="features" className="px-4 sm:px-6 lg:px-24 py-16 sm:py-32 max-w-7xl mx-auto">
                    <div className="mb-10 sm:mb-16">
                        <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1A1A2E] inline-block">Smart Attendance. Zero Proxies.</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-[#6D5AC1] to-[#C9A84C] rounded-full mt-4 sm:mt-6" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                        {/* Proxy Prevention - Large */}
                        <div className="md:col-span-8 group relative overflow-hidden bg-white rounded-[2rem] p-6 sm:p-10 flex flex-col justify-between border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow min-h-[280px] sm:min-h-[350px]">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold tracking-wider uppercase mb-4 sm:mb-6">Security First</span>
                                <h3 className="font-headline font-black text-2xl sm:text-3xl mb-3 text-[#1A1A2E]">Proxy Prevention Engine</h3>
                                <p className="text-gray-500 max-w-lg leading-relaxed text-sm sm:text-base">Advanced geo-fencing and liveness detection ensure that attendance is marked only by those physically present. No exceptions.</p>
                            </div>
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-[#6D5AC1]/10 absolute bottom-4 sm:bottom-6 right-6 sm:right-8 group-hover:text-[#6D5AC1]/25 transition-colors">shield</span>
                        </div>
                        {/* QR Attendance - Small */}
                        <div className="md:col-span-4 bg-gradient-to-br from-[#C9A84C]/10 to-transparent border border-[#C9A84C]/15 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center items-center text-center">
                            <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#C9A84C] mb-4">qr_code_scanner</span>
                            <h3 className="font-headline font-bold text-lg sm:text-xl mb-2 text-[#1A1A2E]">QR Attendance</h3>
                            <p className="text-gray-500 text-sm">Dynamic, time-limited QR codes for frictionless check-ins.</p>
                        </div>
                        {/* Real-time Analytics - Small */}
                        <div className="md:col-span-4 bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 overflow-hidden relative group shadow-sm">
                            <span className="material-symbols-outlined text-3xl sm:text-4xl text-[#6D5AC1] mb-4">monitoring</span>
                            <h3 className="font-headline font-bold text-lg sm:text-xl mb-2 text-[#1A1A2E]">Live Insights</h3>
                            <p className="text-gray-500 text-sm">Monitor campus density and class engagement in real-time.</p>
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-[#6D5AC1]/5 blur-2xl group-hover:bg-[#6D5AC1]/10 transition-colors" />
                        </div>
                        {/* Automated Reports - Large */}
                        <div className="md:col-span-8 bg-white rounded-[2rem] p-6 sm:p-10 flex flex-col md:flex-row gap-6 sm:gap-10 items-center border border-gray-200/60 shadow-sm">
                            <div className="flex-1">
                                <h3 className="font-headline font-bold text-xl sm:text-2xl mb-3 text-[#1A1A2E]">Automated Reports</h3>
                                <p className="text-gray-500 leading-relaxed mb-4 text-sm sm:text-base">Weekly, monthly, and semester logs generated automatically. Direct integration with your existing LMS/ERP systems.</p>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#6D5AC1] text-base">check_circle</span> CSV & PDF Exports</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[#6D5AC1] text-base">check_circle</span> Email Automation</li>
                                </ul>
                            </div>
                            <span className="material-symbols-outlined text-6xl sm:text-7xl text-[#C9A84C]/15">description</span>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-16 sm:py-24 bg-white/60 border-y border-gray-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                        <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-[0.3em] font-bold mb-6 sm:mb-8">Trusted by Next-Gen Institutions</p>
                        <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap opacity-30">
                            {["Stanford", "MIT", "Oxford", "Harvard"].map(name => (
                                <span key={name} className="font-headline text-xl sm:text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors cursor-default">{name}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="cta" className="px-4 sm:px-6 py-16 sm:py-32">
                    <div className="max-w-5xl mx-auto bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-center relative overflow-hidden border border-gray-200/60 shadow-[0_8px_40px_rgba(109,90,193,0.06)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6D5AC1]/3 to-[#C9A84C]/3" />
                        <div className="relative z-10">
                            <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6 tracking-tight text-[#1A1A2E]">Ready to experience frictionless attendance?</h2>
                            <p className="text-gray-500 mb-6 sm:mb-10 max-w-xl mx-auto text-base sm:text-lg">Get the latest campus tech updates.</p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                                <button data-testid="cta-demo-btn" onClick={() => navigate("/signup")} className="theme-btn-primary px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base active:scale-95 duration-200">Schedule a Demo</button>
                                <button data-testid="cta-trial-btn" onClick={() => navigate("/signup")} className="theme-btn-gold px-7 sm:px-9 py-3 sm:py-3.5 text-sm sm:text-base active:scale-95 duration-200">Start Free Trial</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white/50 pt-16 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 border-t border-gray-200/50">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-16 sm:mb-24">
                    <div className="col-span-2">
                        <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#6D5AC1] font-headline">ATRON</span>
                        <p className="text-gray-500 mt-4 max-w-sm leading-relaxed text-sm sm:text-base">Defining the standard for high-integrity attendance systems in the age of automation.</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Product</p>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#features" className="hover:text-[#6D5AC1] transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-[#6D5AC1] transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-[#6D5AC1] transition-colors">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Company</p>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-[#6D5AC1] transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-[#6D5AC1] transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-[#6D5AC1] transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 sm:pt-12 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                    <p className="text-gray-400 text-sm">2025 ATRON. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-gray-400">
                        <a href="#" className="hover:text-[#6D5AC1] transition-colors text-sm">Privacy</a>
                        <a href="#" className="hover:text-[#6D5AC1] transition-colors text-sm">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
