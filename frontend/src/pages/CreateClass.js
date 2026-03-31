import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Check, Copy } from "lucide-react";

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
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(created.class_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (created) {
        return (
            <div className="max-w-lg mx-auto py-12">
                <div className="glass-card rounded-[2rem] p-8 border border-[#1a1a1a] text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-headline text-2xl font-extrabold mb-2">Class Created!</h2>
                    <p className="text-muted-foreground mb-6">{created.name} - {created.subject}</p>
                    <div className="bg-muted rounded-xl p-4 mb-6">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Class Join Code</p>
                        <div className="flex items-center justify-center gap-3">
                            <span data-testid="class-code-display" className="text-3xl font-headline font-extrabold text-primary tracking-[0.3em]">{created.class_code}</span>
                            <button onClick={copyCode} className="p-2 rounded-lg hover:bg-background transition-colors">
                                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Share this code with your students so they can join the class.</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-xl border-[#2a2a2a]" onClick={() => { setCreated(null); setName(""); setSubject(""); setSection(""); setSemester(""); }}>Create Another</Button>
                        <Button className="flex-1 bg-primary text-primary-foreground rounded-xl" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto py-8">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-headline text-3xl font-extrabold mb-2">Create a Class</h2>
            <p className="text-muted-foreground mb-8">Set up a new class and get a join code for your students.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label className="text-sm font-semibold">Class Name</Label>
                    <Input data-testid="create-class-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Data Structures" className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12" required />
                </div>
                <div>
                    <Label className="text-sm font-semibold">Subject Code</Label>
                    <Input data-testid="create-class-subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. CS301" className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm font-semibold">Section</Label>
                        <Input data-testid="create-class-section" value={section} onChange={e => setSection(e.target.value)} placeholder="e.g. A" className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12" required />
                    </div>
                    <div>
                        <Label className="text-sm font-semibold">Semester</Label>
                        <Input data-testid="create-class-semester" value={semester} onChange={e => setSemester(e.target.value)} placeholder="e.g. 5" className="mt-2 bg-muted border-[#2a2a2a] rounded-xl h-12" required />
                    </div>
                </div>
                <Button data-testid="create-class-submit" type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 text-base font-bold">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Class Code"}
                </Button>
            </form>
        </div>
    );
}
