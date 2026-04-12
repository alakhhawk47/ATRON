import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function CreateClass() {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [section, setSection] = useState("");
    const [semester, setSemester] = useState("");
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/classes", { name, subject, section, semester });
            setCreated(data);
        } catch (e) {
            alert(e.response?.data?.detail || "Failed to create class");
        } finally { setLoading(false); }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(created.class_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (created) {
        return (
            <div className="max-w-lg mx-auto py-8 sm:py-12">
                <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-primary/20 text-center ghost-border">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-primary">check_circle</span>
                    </div>
                    <h2 className="font-headline text-xl sm:text-2xl font-extrabold mb-2">Class Created!</h2>
                    <p className="text-muted-foreground mb-6">{created.name} - {created.subject}</p>
                    <div className="bg-muted/30 rounded-xl p-4 sm:p-6 mb-6">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Class Join Code</p>
                        <div className="flex items-center justify-center gap-3">
                            <span data-testid="class-code-display" className="text-3xl sm:text-4xl font-headline font-extrabold text-primary tracking-[0.2em] sm:tracking-[0.3em]">{created.class_code}</span>
                            <button onClick={copyCode} className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <span className="material-symbols-outlined text-lg text-muted-foreground">{copied ? "check" : "content_copy"}</span>
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">Share this code with your students</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => { setCreated(null); setName(""); setSubject(""); setSection(""); setSemester(""); }}
                            className="flex-1 py-3 rounded-xl theme-btn-outline text-sm font-bold hover:bg-muted/50 transition-colors">
                            Create Another
                        </button>
                        <button onClick={() => navigate("/dashboard")}
                            className="flex-1 py-3 rounded-xl theme-btn-primary text-sm font-bold active:scale-[0.98] duration-200">
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span> Back to Courses
                    </button>
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">Create New Class</h1>
                    <p className="text-muted-foreground text-sm mt-1">Set up your digital classroom environment. After saving, a secure code will be generated for your students.</p>
                </div>
                <div className="glass-card rounded-xl px-4 py-3 border border-secondary/20 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-lg">lightbulb</span>
                    <p className="text-xs text-muted-foreground"><span className="font-bold text-secondary">Pro Tip</span> — Semester dates sync automatically.</p>
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                {/* Main Form */}
                <div className="lg:col-span-8">
                    <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 ghost-border">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Class Name</label>
                                    <input
                                        data-testid="create-class-name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Advanced Neural Networks"
                                        className="w-full theme-input rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Subject Name</label>
                                    <input
                                        data-testid="create-class-subject"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="e.g. Computer Science CS402"
                                        className="w-full theme-input rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Section</label>
                                    <input
                                        data-testid="create-class-section"
                                        value={section}
                                        onChange={e => setSection(e.target.value)}
                                        placeholder="e.g. Section A-1"
                                        className="w-full theme-input rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Semester</label>
                                    <select
                                        data-testid="create-class-semester"
                                        value={semester}
                                        onChange={e => setSemester(e.target.value)}
                                        className="w-full theme-input rounded-xl h-12 px-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                                        required
                                    >
                                        <option value="">Select semester</option>
                                        <option value="Fall 2024">Fall 2024</option>
                                        <option value="Spring 2025">Spring 2025</option>
                                        <option value="Summer 2025">Summer 2025</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                <button
                                    data-testid="create-class-submit"
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 theme-btn-primary rounded-xl h-12 text-sm active:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="material-symbols-outlined text-lg">bolt</span> Initialize Class & Generate Code</>}
                                </button>
                                <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 sm:py-0 rounded-xl theme-btn-outline text-sm font-bold hover:bg-muted/50 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                    {/* Class Code Preview */}
                    <div className="glass-card rounded-2xl p-6 border border-border/50 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Unique Class Identity</span>
                        <div className="mt-4 py-6 rounded-xl bg-muted/30 border border-dashed border-border/50">
                            <span className="text-2xl font-headline font-bold text-muted-foreground tracking-[0.3em]">------</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">The system will generate a unique 6-digit alphanumeric code once you save.</p>
                    </div>

                    {/* Quick Info */}
                    <div className="glass-card rounded-2xl p-6 border border-border/50">
                        <h3 className="font-headline font-bold text-sm mb-4">Attendance Logic</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">check_circle</span> CSV & PDF Exports</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">check_circle</span> Email Automation</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">check_circle</span> Real-time tracking</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
