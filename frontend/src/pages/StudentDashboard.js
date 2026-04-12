import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function StudentDashboard() {
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [analyticsRes, classesRes] = await Promise.all([
                api.get("/analytics/student"),
                api.get("/classes")
            ]);
            setAnalytics(analyticsRes.data);
            setClasses(classesRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const overallPct = analytics?.overall_attendance || 0;

    return (
        <div data-testid="student-dashboard" className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
                <div>
                    <p className="text-muted-foreground text-sm mb-1">Welcome back,</p>
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">
                        Hello, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2">Track your attendance and stay on top of your classes.</p>
                </div>
                <button
                    data-testid="join-class-btn"
                    onClick={() => navigate("/classes/join")}
                    className="inline-flex items-center gap-2 theme-btn-primary px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm active:scale-[0.98] duration-200"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Join a Class
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg sm:text-xl text-primary">pie_chart</span>
                        </div>
                        <span className={`text-xs font-bold ${overallPct >= 75 ? "text-emerald-500" : "text-destructive"}`}>
                            {overallPct >= 75 ? "On Track" : "At Risk"}
                        </span>
                    </div>
                    <p className={`text-2xl sm:text-3xl font-headline font-extrabold ${overallPct >= 75 ? "text-primary" : "text-destructive"}`}>{overallPct}%</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Overall Attendance</p>
                </div>
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-secondary/20">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-secondary/10 flex items-center justify-center mb-3 sm:mb-4">
                        <span className="material-symbols-outlined text-lg sm:text-xl text-secondary">school</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-headline font-extrabold">{analytics?.classes_joined || 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Classes Joined</p>
                </div>
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-destructive/20">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-destructive/10 flex items-center justify-center mb-3 sm:mb-4">
                        <span className="material-symbols-outlined text-lg sm:text-xl text-destructive">warning</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-headline font-extrabold">{analytics?.alerts?.length || 0}</p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Attendance Alerts</p>
                </div>
            </div>

            {/* Alerts */}
            {analytics?.alerts?.length > 0 && (
                <div className="space-y-2">
                    {analytics.alerts.map((alert, i) => (
                        <div key={i} data-testid={`alert-${i}`} className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive flex items-center gap-3">
                            <span className="material-symbols-outlined text-base">error</span>
                            {alert}
                        </div>
                    ))}
                </div>
            )}

            {/* Class List */}
            <div>
                <h3 className="font-headline text-lg sm:text-xl font-bold mb-4">Your Classes</h3>
                <div className="space-y-3">
                    {classes.map(cls => {
                        const pct = cls.attendance_percentage || 0;
                        const barColor = pct >= 75 ? "bg-primary" : pct >= 50 ? "bg-secondary" : "bg-destructive";
                        return (
                            <div
                                key={cls.id}
                                data-testid={`student-class-${cls.id}`}
                                className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 hover:border-primary/20 transition-all cursor-pointer group"
                                onClick={() => navigate(`/classes/${cls.id}`)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-headline font-bold text-sm sm:text-base group-hover:text-primary transition-colors">{cls.name}</h4>
                                        <p className="text-xs text-muted-foreground">{cls.subject} - {cls.teacher_name}</p>
                                    </div>
                                    <span className={`text-xl sm:text-2xl font-headline font-extrabold ${pct >= 75 ? "text-primary" : "text-destructive"}`}>
                                        {pct}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                                    <span>{cls.total_sessions || 0} sessions</span>
                                    <span className="material-symbols-outlined text-muted-foreground group-hover:text-primary transition-colors text-base">arrow_forward</span>
                                </div>
                            </div>
                        );
                    })}
                    {classes.length === 0 && (
                        <div className="text-center py-12 sm:py-16 glass-card rounded-2xl border border-border/50">
                            <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-4">school</span>
                            <p className="text-muted-foreground mb-2">No classes yet</p>
                            <button onClick={() => navigate("/classes/join")} className="text-primary font-bold text-sm hover:underline">Join your first class</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
