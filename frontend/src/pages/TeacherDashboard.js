import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TeacherDashboard() {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStartDialog, setShowStartDialog] = useState(false);
    const [startingClass, setStartingClass] = useState(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [analyticsRes, classesRes] = await Promise.all([
                api.get("/analytics/teacher"),
                api.get("/classes")
            ]);
            setAnalytics(analyticsRes.data);
            setClasses(classesRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
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
        { label: "Total Classes", value: analytics?.total_classes || 0, icon: "school", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
        { label: "Total Students", value: analytics?.total_students || 0, icon: "groups", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
        { label: "Attendance Rate", value: `${analytics?.attendance_rate || 0}%`, icon: "trending_up", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Today's Sessions", value: analytics?.today_sessions || 0, icon: "calendar_today", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
    ];

    return (
        <div data-testid="teacher-dashboard" className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">Faculty Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Overview of your classes and attendance metrics</p>
                </div>
                <button
                    data-testid="start-attendance-btn"
                    onClick={() => setShowStartDialog(true)}
                    className="inline-flex items-center gap-2 theme-btn-primary px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm active:scale-[0.98] duration-200 neon-glow"
                >
                    <span className="material-symbols-outlined text-lg">qr_code</span>
                    Start QR Session
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((s, i) => (
                    <div key={i} data-testid={`stat-card-${i}`} className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${s.border} group hover:neon-glow-primary transition-all`}>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl ${s.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-lg sm:text-xl ${s.color}`}>{s.icon}</span>
                            </div>
                            <span className="material-symbols-outlined text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors hidden sm:block">more_horiz</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-headline font-extrabold">{s.value}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Classes List */}
            <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-headline text-lg sm:text-xl font-bold">Your Classes</h3>
                    <button
                        onClick={() => navigate("/classes/create")}
                        className="flex items-center gap-2 text-sm text-primary font-bold hover:opacity-80 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">add</span> New Class
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {classes.map(cls => (
                        <div
                            key={cls.id}
                            data-testid={`class-card-${cls.id}`}
                            className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50 hover:border-primary/20 transition-all cursor-pointer group"
                            onClick={() => navigate(`/classes/${cls.id}`)}
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div>
                                    <h4 className="font-headline font-bold text-base sm:text-lg group-hover:text-primary transition-colors">{cls.name}</h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{cls.subject} - Section {cls.section}</p>
                                </div>
                                <span className="px-2 sm:px-3 py-1 rounded-full bg-muted/50 text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">Sem {cls.semester}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">group</span>
                                    {cls.student_count} students
                                </span>
                                <span>{cls.total_sessions} sessions</span>
                            </div>
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/30 flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Code: <span className="text-primary">{cls.class_code}</span></span>
                                <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors text-lg">arrow_forward</span>
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="col-span-full text-center py-12 sm:py-16 glass-card rounded-2xl border border-border/50">
                            <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-4">school</span>
                            <p className="text-muted-foreground mb-2">No classes yet</p>
                            <button onClick={() => navigate("/classes/create")} className="text-primary font-bold text-sm hover:underline">Create your first class</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Start Session Dialog */}
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent className="bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-xl">Select a Class</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                        {classes.map(cls => (
                            <button
                                key={cls.id}
                                data-testid={`start-session-${cls.id}`}
                                onClick={() => startSession(cls.id)}
                                disabled={startingClass === cls.id}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all text-left"
                            >
                                <div>
                                    <p className="font-bold">{cls.name}</p>
                                    <p className="text-sm text-muted-foreground">{cls.subject}</p>
                                </div>
                                {startingClass === cls.id
                                    ? <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    : <span className="material-symbols-outlined text-primary">play_circle</span>
                                }
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
