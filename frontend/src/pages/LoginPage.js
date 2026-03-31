import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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
        <div className="min-h-screen bg-background flex">
            {/* Left Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-[100px]" />
                </div>
                <div className="relative z-10 px-16 text-center">
                    <h1 className="font-headline text-6xl font-extrabold mb-4">
                        <span className="text-gradient-primary">ATRON</span>
                    </h1>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Smart Attendance. Zero Proxies.</p>
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a] text-left space-y-3">
                        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-sm text-muted-foreground">QR-based attendance tracking</span></div>
                        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-secondary" /><span className="text-sm text-muted-foreground">Anti-proxy protection</span></div>
                        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-destructive" /><span className="text-sm text-muted-foreground">Real-time analytics</span></div>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to home
                    </Link>
                    <h2 className="font-headline text-3xl font-extrabold mb-2">Welcome back</h2>
                    <p className="text-muted-foreground mb-8">Sign in to your ATRON account</p>

                    {error && <div data-testid="login-error" className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-6 text-sm text-destructive">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                            <Input
                                data-testid="login-email-input"
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@university.edu"
                                className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                            <Input
                                data-testid="login-password-input"
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12"
                                required
                            />
                        </div>
                        <Button
                            data-testid="login-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 text-base font-bold"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
