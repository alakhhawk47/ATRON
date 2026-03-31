import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, TrendingUp, CalendarCheck, Plus, ArrowRight, Play, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TeacherDashboard() {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStartDialog, setShowStartDialog] = useState(false);
    const [startingClass, setStartingClass] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [analyticsRes, classesRes] = await Promise.all([
                api.get("/analytics/teacher"),
                api.get("/classes")
            ]);
            setAnalytics(analyticsRes.data);
            setClasses(classesRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const startSession = async (classId) => {
        setStartingClass(classId);
        try {
            const { data } = await api.post("/attendance/sessions", { class_id: classId });
            navigate(`/attendance/${classId}`, { state: { session: data } });
        } catch (e) {
            alert(e.response?.data?.detail || "Failed to start session");
        } finally {
            setStartingClass(null);
            setShowStartDialog(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const stats = [
        { label: "Total Classes", value: analytics?.total_classes || 0, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total Students", value: analytics?.total_students || 0, icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
        { label: "Attendance Rate", value: `${analytics?.attendance_rate || 0}%`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
        { label: "Today's Sessions", value: analytics?.today_sessions || 0, icon: CalendarCheck, color: "text-destructive", bg: "bg-destructive/10" },
    ];

    return (
        <div data-testid="teacher-dashboard" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} data-testid={`stat-card-${i}`} className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-headline font-extrabold">{s.value}</p>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Start Attendance Button */}
            <Button
                data-testid="start-attendance-btn"
                onClick={() => setShowStartDialog(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-6 text-base font-bold neon-glow"
            >
                <Play className="w-5 h-5 mr-2" /> Start Attendance Session
            </Button>

            {/* Classes List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline text-xl font-bold">Your Classes</h3>
                    <Button variant="ghost" className="text-primary text-sm" onClick={() => navigate("/classes/create")}>
                        <Plus className="w-4 h-4 mr-1" /> New Class
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map(cls => (
                        <div
                            key={cls.id}
                            data-testid={`class-card-${cls.id}`}
                            className="glass-card rounded-2xl p-6 border border-[#1a1a1a] hover:border-primary/30 transition-all cursor-pointer group"
                            onClick={() => navigate(`/classes/${cls.id}`)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-headline font-bold text-lg group-hover:text-primary transition-colors">{cls.name}</h4>
                                    <p className="text-sm text-muted-foreground">{cls.subject} - Section {cls.section}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-muted text-xs font-bold text-muted-foreground">Sem {cls.semester}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground"><Users className="w-4 h-4 inline mr-1" />{cls.student_count} students</span>
                                <span className="text-muted-foreground">{cls.total_sessions} sessions</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Code: {cls.class_code}</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Start Session Dialog */}
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent className="bg-card border-[#1a1a1a]">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Select a Class</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                        {classes.map(cls => (
                            <button
                                key={cls.id}
                                data-testid={`start-session-${cls.id}`}
                                onClick={() => startSession(cls.id)}
                                disabled={startingClass === cls.id}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-primary/10 transition-all text-left"
                            >
                                <div>
                                    <p className="font-bold">{cls.name}</p>
                                    <p className="text-sm text-muted-foreground">{cls.subject}</p>
                                </div>
                                {startingClass === cls.id ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Play className="w-5 h-5 text-primary" />}
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
