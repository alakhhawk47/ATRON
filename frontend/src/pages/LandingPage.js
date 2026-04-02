import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const HERO_IMG = "https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800";

    return (
        <div className="bg-background text-white font-body selection:bg-primary/30 min-h-screen">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-neutral-950/60 backdrop-blur-xl border-b border-neutral-800/50 flex items-center justify-between px-6 py-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
                <div className="flex items-center gap-8">
                    <span className="text-2xl font-black tracking-tighter text-cyan-400 font-headline">ATRON</span>
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <a href="#" className="text-cyan-400 font-bold transition-colors">Home</a>
                        <a href="#features" className="text-neutral-400 hover:text-cyan-300 transition-colors">Features</a>
                        <a href="#cta" className="text-neutral-400 hover:text-cyan-300 transition-colors">Contact</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button data-testid="nav-login-btn" onClick={() => navigate("/login")} className="px-5 py-2 text-white font-semibold hover:text-cyan-400 transition-colors">Login</button>
                    <button data-testid="nav-signup-btn" onClick={() => navigate("/signup")} className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-neutral-950 px-6 py-2.5 rounded-xl font-bold active:scale-95 duration-200">Get Started</button>
                </div>
            </nav>

            <main className="relative pt-24">
                {/* Hero Section */}
                <section className="relative min-h-[85vh] flex items-center px-6 lg:px-24 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] -translate-x-1/2" />
                    <div className="grid lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/50 border border-neutral-700/20 w-fit">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Version 2.0 Now Live</span>
                            </div>
                            <h1 data-testid="hero-heading" className="font-headline font-black text-5xl md:text-7xl lg:text-8xl editorial-text leading-[0.9] tracking-tighter">
                                The Future of Campus Management.
                            </h1>
                            <p className="text-neutral-400 text-lg md:text-xl max-w-md leading-relaxed">
                                Transform your institution with AI-driven presence verification. Eliminate manual logs and fraud with our frictionless, biometric-grade recognition system.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button data-testid="hero-get-started-btn" onClick={() => navigate("/signup")} className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-neutral-950 px-8 py-3.5 rounded-xl font-bold text-base active:scale-95 duration-200 neon-glow flex items-center gap-2">
                                    Get Started
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                                <button data-testid="hero-demo-btn" onClick={() => navigate("/login")} className="border border-neutral-700 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-neutral-800/50 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">play_circle</span>
                                    View Demo
                                </button>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="relative z-10 p-8 glass-card rounded-[2.5rem] border border-neutral-700/10 shadow-2xl overflow-hidden">
                                <img alt="University campus with students" className="w-full rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-[4/3]" src={HERO_IMG} />
                                <div className="absolute top-12 -left-12 p-4 glass-card border border-cyan-500/30 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce duration-[3000ms]">
                                    <span className="material-symbols-outlined text-cyan-400">verified</span>
                                    <div>
                                        <p className="font-bold text-sm text-white">100.0% Match</p>
                                        <p className="text-[10px] text-neutral-400">0.42ms Response</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-12 -right-12 p-4 glass-card border border-amber-500/30 rounded-2xl shadow-xl flex items-center gap-4">
                                    <span className="material-symbols-outlined text-amber-400">qr_code_scanner</span>
                                    <div>
                                        <p className="font-bold text-sm text-white">QR Session</p>
                                        <p className="text-[10px] text-neutral-400">24 Present</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-cyan-500/5 blur-3xl rounded-full -z-10" />
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section id="features" className="px-6 lg:px-24 py-32 max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="font-headline font-black text-4xl md:text-5xl tracking-tight editorial-text inline-block">Smart Attendance. Zero Proxies.</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full mt-6" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Proxy Prevention - Large */}
                        <div className="md:col-span-8 group relative overflow-hidden bg-neutral-900/50 rounded-[2rem] p-10 flex flex-col justify-between border border-transparent hover:border-cyan-500/20 transition-all min-h-[350px]">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold tracking-wider uppercase mb-6">Security First</span>
                                <h3 className="font-headline font-black text-3xl mb-3">Proxy Prevention Engine</h3>
                                <p className="text-neutral-400 max-w-lg leading-relaxed">Advanced geo-fencing and liveness detection ensure that attendance is marked only by those physically present. No exceptions.</p>
                            </div>
                            <span className="material-symbols-outlined text-6xl text-cyan-400/20 absolute bottom-6 right-8 group-hover:text-cyan-400/40 transition-colors">shield</span>
                        </div>
                        {/* QR Attendance - Small */}
                        <div className="md:col-span-4 bg-gradient-to-br from-amber-500/10 to-transparent border border-neutral-700/10 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
                            <span className="material-symbols-outlined text-5xl text-amber-400 mb-4">qr_code_scanner</span>
                            <h3 className="font-headline font-bold text-xl mb-2">QR Attendance</h3>
                            <p className="text-neutral-400 text-sm">Dynamic, time-limited QR codes for frictionless check-ins.</p>
                        </div>
                        {/* Real-time Analytics - Small */}
                        <div className="md:col-span-4 bg-neutral-800/50 border border-neutral-700/10 rounded-[2rem] p-8 overflow-hidden relative group">
                            <span className="material-symbols-outlined text-4xl text-cyan-400 mb-4">monitoring</span>
                            <h3 className="font-headline font-bold text-xl mb-2">Live Insights</h3>
                            <p className="text-neutral-400 text-sm">Monitor campus density and class engagement in real-time.</p>
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
                        </div>
                        {/* Automated Reports - Large */}
                        <div className="md:col-span-8 bg-neutral-900/50 rounded-[2rem] p-10 flex flex-col md:flex-row gap-10 items-center border border-neutral-700/10">
                            <div className="flex-1">
                                <h3 className="font-headline font-bold text-2xl mb-3">Automated Reports</h3>
                                <p className="text-neutral-400 leading-relaxed mb-4">Weekly, monthly, and semester logs generated automatically. Direct integration with your existing LMS/ERP systems.</p>
                                <ul className="space-y-2 text-sm text-neutral-400">
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-cyan-400 text-base">check_circle</span> CSV & PDF Exports</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-cyan-400 text-base">check_circle</span> Email Automation</li>
                                </ul>
                            </div>
                            <span className="material-symbols-outlined text-7xl text-amber-400/20">description</span>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-24 bg-neutral-900/30 border-y border-neutral-800/10">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <p className="text-neutral-500 text-sm uppercase tracking-[0.3em] font-bold mb-8">Trusted by Next-Gen Institutions</p>
                        <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
                            {["Stanford", "MIT", "Oxford", "Harvard"].map(name => (
                                <span key={name} className="font-headline text-2xl font-bold text-neutral-500 hover:text-neutral-300 transition-colors cursor-default">{name}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="cta" className="px-6 py-32">
                    <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-amber-500/5" />
                        <div className="relative z-10">
                            <h2 className="font-headline font-black text-3xl md:text-5xl mb-6 tracking-tight">Ready to experience frictionless attendance?</h2>
                            <p className="text-neutral-400 mb-10 max-w-xl mx-auto text-lg">Get the latest campus tech updates.</p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <button data-testid="cta-demo-btn" onClick={() => navigate("/signup")} className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-neutral-950 px-8 py-3.5 rounded-xl font-bold active:scale-95 duration-200">Schedule a Demo</button>
                                <button data-testid="cta-trial-btn" onClick={() => navigate("/signup")} className="border border-neutral-700 px-8 py-3.5 rounded-xl font-bold hover:bg-neutral-800/50 transition-colors">Start Free Trial</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-neutral-950 pt-24 pb-12 px-6 border-t border-neutral-800/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-24">
                    <div className="md:col-span-2">
                        <span className="text-3xl font-black tracking-tighter text-cyan-400 font-headline">ATRON</span>
                        <p className="text-neutral-500 mt-4 max-w-sm leading-relaxed">Defining the standard for high-integrity attendance systems in the age of automation.</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Product</p>
                        <ul className="space-y-3 text-sm text-neutral-400">
                            <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Company</p>
                        <ul className="space-y-3 text-sm text-neutral-400">
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-12 border-t border-neutral-800/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-neutral-600 text-sm">2025 ATRON. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-neutral-600">
                        <a href="#" className="hover:text-cyan-400 transition-colors text-sm">Privacy</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors text-sm">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
