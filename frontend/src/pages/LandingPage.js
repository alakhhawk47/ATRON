import { useNavigate } from "react-router-dom";
import { QrCode, Shield, Activity, FileSpreadsheet, BarChart3, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    { icon: QrCode, title: "QR Attendance", desc: "Scan to mark attendance instantly with dynamic QR codes" },
    { icon: Shield, title: "Proxy Prevention", desc: "Time-limited windows, device fingerprinting, geofence checks" },
    { icon: Activity, title: "Real-time Tracking", desc: "Watch attendance come in live as students check in" },
    { icon: FileSpreadsheet, title: "Excel Reports", desc: "Export detailed attendance reports with one click" },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Visual insights into attendance trends and patterns" },
    { icon: Zap, title: "Instant Setup", desc: "Create a class and start taking attendance in seconds" },
];

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-[#1a1a1a]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-headline text-2xl font-extrabold text-gradient-primary">ATRON</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button data-testid="nav-login-btn" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/login")}>Login</Button>
                        <Button data-testid="nav-signup-btn" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl" onClick={() => navigate("/signup")}>Get Started</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                        Beta Launch
                    </div>
                    <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                        <span className="text-gradient-primary">ATRON</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground font-bold uppercase tracking-[0.3em] mb-8">
                        Smart Attendance. Zero Proxies.
                    </p>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                        The modern university attendance platform. Teachers create sessions, students scan QR codes, 
                        and attendance is tracked automatically with anti-proxy protection.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Button
                            data-testid="hero-get-started-btn"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-6 text-base font-bold neon-glow"
                            onClick={() => navigate("/signup")}
                        >
                            Get Started <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            data-testid="hero-login-btn"
                            variant="outline"
                            className="border-[#2a2a2a] hover:bg-muted rounded-xl px-8 py-6 text-base font-bold"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">Features</p>
                        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold">Everything you need</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                data-testid={`feature-card-${i}`}
                                className="glass-card rounded-2xl p-8 border border-[#1a1a1a] hover:border-primary/30 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <f.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-headline text-lg font-bold mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto glass-panel rounded-[2rem] p-12 text-center border border-[#1a1a1a]">
                    <h2 className="font-headline text-3xl sm:text-4xl font-extrabold mb-4">Ready to transform attendance?</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join hundreds of universities already using ATRON to streamline attendance tracking.</p>
                    <Button
                        data-testid="cta-get-started-btn"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-6 text-base font-bold"
                        onClick={() => navigate("/signup")}
                    >
                        Start Free Beta <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-[#1a1a1a]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="font-headline font-bold text-muted-foreground">ATRON</span>
                    <span className="text-xs text-muted-foreground">Smart Attendance. Zero Proxies.</span>
                </div>
            </footer>
        </div>
    );
}
