import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

export default function LandingPage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const HERO_IMG = "https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800";

    return (
        <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 theme-nav flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-4 sm:gap-8">
                    <span className="text-xl sm:text-2xl font-black tracking-tighter theme-primary font-headline">ATRON</span>
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <a href="#" className="theme-primary font-bold transition-colors">Home</a>
                        <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
                        <a href="#cta" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        data-testid="theme-toggle-landing"
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <span className="material-symbols-outlined text-xl text-muted-foreground">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                    <button data-testid="nav-login-btn" onClick={() => navigate("/login")} className="px-3 sm:px-5 py-2 font-semibold hover:text-primary transition-colors text-sm sm:text-base">Login</button>
                    <button data-testid="nav-signup-btn" onClick={() => navigate("/signup")} className="theme-btn-primary px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base active:scale-95 duration-200">Get Started</button>
                </div>
            </nav>

            <main className="relative pt-20 sm:pt-24">
                {/* Hero Section */}
                <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-24 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-destructive/10 rounded-full blur-[100px] -translate-x-1/2" />
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center w-full max-w-7xl mx-auto">
                        <div className="flex flex-col gap-6 sm:gap-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/20 w-fit">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Version 2.0 Now Live</span>
                            </div>
                            <h1 data-testid="hero-heading" className="font-headline font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl editorial-text leading-[0.9] tracking-tighter">
                                The Future of Campus Management.
                            </h1>
                            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-md leading-relaxed">
                                Transform your institution with AI-driven presence verification. Eliminate manual logs and fraud with our frictionless, biometric-grade recognition system.
                            </p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                                <button data-testid="hero-get-started-btn" onClick={() => navigate("/signup")} className="theme-btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base active:scale-95 duration-200 neon-glow flex items-center gap-2">
                                    Get Started
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                                <button data-testid="hero-demo-btn" onClick={() => navigate("/login")} className="theme-btn-outline px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-muted/50 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">play_circle</span>
                                    View Demo
                                </button>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="relative z-10 p-8 glass-card rounded-[2.5rem] border border-border/10 shadow-2xl overflow-hidden">
                                <img alt="University campus with students" className="w-full rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-[4/3]" src={HERO_IMG} />
                                <div className="absolute top-12 -left-12 p-4 glass-card border border-primary/30 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce duration-[3000ms]">
                                    <span className="material-symbols-outlined text-primary">verified</span>
                                    <div>
                                        <p className="font-bold text-sm">100.0% Match</p>
                                        <p className="text-[10px] text-muted-foreground">0.42ms Response</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-12 -right-12 p-4 glass-card border border-secondary/30 rounded-2xl shadow-xl flex items-center gap-4">
                                    <span className="material-symbols-outlined text-secondary">qr_code_scanner</span>
                                    <div>
                                        <p className="font-bold text-sm">QR Session</p>
                                        <p className="text-[10px] text-muted-foreground">24 Present</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full -z-10" />
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section id="features" className="px-4 sm:px-6 lg:px-24 py-16 sm:py-32 max-w-7xl mx-auto">
                    <div className="mb-10 sm:mb-16">
                        <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl tracking-tight editorial-text inline-block">Smart Attendance. Zero Proxies.</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mt-4 sm:mt-6" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                        {/* Proxy Prevention - Large */}
                        <div className="md:col-span-8 group relative overflow-hidden glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 flex flex-col justify-between border border-transparent hover:border-primary/20 transition-all min-h-[280px] sm:min-h-[350px]">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold tracking-wider uppercase mb-4 sm:mb-6">Security First</span>
                                <h3 className="font-headline font-black text-2xl sm:text-3xl mb-3">Proxy Prevention Engine</h3>
                                <p className="text-muted-foreground max-w-lg leading-relaxed text-sm sm:text-base">Advanced geo-fencing and liveness detection ensure that attendance is marked only by those physically present. No exceptions.</p>
                            </div>
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-primary/20 absolute bottom-4 sm:bottom-6 right-6 sm:right-8 group-hover:text-primary/40 transition-colors">shield</span>
                        </div>
                        {/* QR Attendance - Small */}
                        <div className="md:col-span-4 bg-gradient-to-br from-secondary/10 to-transparent border border-border/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex flex-col justify-center items-center text-center">
                            <span className="material-symbols-outlined text-4xl sm:text-5xl text-secondary mb-4">qr_code_scanner</span>
                            <h3 className="font-headline font-bold text-lg sm:text-xl mb-2">QR Attendance</h3>
                            <p className="text-muted-foreground text-sm">Dynamic, time-limited QR codes for frictionless check-ins.</p>
                        </div>
                        {/* Real-time Analytics - Small */}
                        <div className="md:col-span-4 glass-card border border-border/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 overflow-hidden relative group">
                            <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary mb-4">monitoring</span>
                            <h3 className="font-headline font-bold text-lg sm:text-xl mb-2">Live Insights</h3>
                            <p className="text-muted-foreground text-sm">Monitor campus density and class engagement in real-time.</p>
                            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
                        </div>
                        {/* Automated Reports - Large */}
                        <div className="md:col-span-8 glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 flex flex-col md:flex-row gap-6 sm:gap-10 items-center border border-border/10">
                            <div className="flex-1">
                                <h3 className="font-headline font-bold text-xl sm:text-2xl mb-3">Automated Reports</h3>
                                <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">Weekly, monthly, and semester logs generated automatically. Direct integration with your existing LMS/ERP systems.</p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">check_circle</span> CSV & PDF Exports</li>
                                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">check_circle</span> Email Automation</li>
                                </ul>
                            </div>
                            <span className="material-symbols-outlined text-6xl sm:text-7xl text-secondary/20">description</span>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-16 sm:py-24 bg-muted/30 border-y border-border/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                        <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-[0.3em] font-bold mb-6 sm:mb-8">Trusted by Next-Gen Institutions</p>
                        <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap opacity-40">
                            {["Stanford", "MIT", "Oxford", "Harvard"].map(name => (
                                <span key={name} className="font-headline text-xl sm:text-2xl font-bold text-muted-foreground hover:text-foreground/60 transition-colors cursor-default">{name}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="cta" className="px-4 sm:px-6 py-16 sm:py-32">
                    <div className="max-w-5xl mx-auto glass-card rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                        <div className="relative z-10">
                            <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6 tracking-tight">Ready to experience frictionless attendance?</h2>
                            <p className="text-muted-foreground mb-6 sm:mb-10 max-w-xl mx-auto text-base sm:text-lg">Get the latest campus tech updates.</p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                                <button data-testid="cta-demo-btn" onClick={() => navigate("/signup")} className="theme-btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base active:scale-95 duration-200">Schedule a Demo</button>
                                <button data-testid="cta-trial-btn" onClick={() => navigate("/signup")} className="theme-btn-outline px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-muted/50 transition-colors">Start Free Trial</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-muted/20 pt-16 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 border-t border-border/5">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-16 sm:mb-24">
                    <div className="col-span-2">
                        <span className="text-2xl sm:text-3xl font-black tracking-tighter theme-primary font-headline">ATRON</span>
                        <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed text-sm sm:text-base">Defining the standard for high-integrity attendance systems in the age of automation.</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Product</p>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Company</p>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 sm:pt-12 border-t border-border/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                    <p className="text-muted-foreground text-sm">2025 ATRON. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors text-sm">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors text-sm">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
