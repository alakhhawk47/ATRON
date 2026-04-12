import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
    const { api, user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadAnalytics(); }, []);

    const loadAnalytics = async () => {
        try {
            const endpoint = user?.role === "teacher" ? "/analytics/teacher" : "/analytics/student";
            const { data } = await api.get(endpoint);
            setAnalytics(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const isTeacher = user?.role === "teacher";

    return (
        <div data-testid="analytics-page" className="space-y-6 sm:space-y-8">
            <div>
                <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">Analytics</h1>
                <p className="text-muted-foreground text-sm mt-1">Performance insights and attendance trends</p>
            </div>

            {isTeacher ? <TeacherAnalytics analytics={analytics} /> : <StudentAnalytics analytics={analytics} />}
        </div>
    );
}

function TeacherAnalytics({ analytics }) {
    const weeklyData = analytics?.weekly_trend || [];
    const maxVal = Math.max(...weeklyData.map(w => w.rate || 0), 1);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Total Classes", value: analytics?.total_classes || 0, icon: "school", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                    { label: "Total Students", value: analytics?.total_students || 0, icon: "groups", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
                    { label: "Avg Attendance", value: `${analytics?.attendance_rate || 0}%`, icon: "trending_up", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { label: "Today Sessions", value: analytics?.today_sessions || 0, icon: "calendar_today", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
                ].map((s, i) => (
                    <div key={i} className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${s.border}`}>
                        <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl ${s.bg} flex items-center justify-center mb-3 sm:mb-4`}>
                            <span className={`material-symbols-outlined text-lg sm:text-xl ${s.color}`}>{s.icon}</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-headline font-extrabold">{s.value}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-border/50">
                <h3 className="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">show_chart</span>
                    Weekly Attendance Trend
                </h3>
                {weeklyData.length > 0 ? (
                    <div className="flex items-end gap-2 sm:gap-3 h-36 sm:h-48">
                        {weeklyData.map((w, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-[10px] sm:text-xs font-bold text-primary">{Math.round(w.rate || 0)}%</span>
                                <div className="w-full rounded-t-lg bg-primary/20 relative overflow-hidden" style={{ height: `${Math.max(((w.rate || 0) / maxVal) * 100, 8)}%` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-primary/20" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] text-muted-foreground truncate w-full text-center">{w.week || `W${i + 1}`}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <span className="material-symbols-outlined text-3xl text-muted-foreground/30 mb-2">bar_chart</span>
                        <p>No trend data yet</p>
                    </div>
                )}
            </div>

            <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-border/50">
                <h3 className="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">compare</span>
                    Subject Comparison
                </h3>
                <div className="space-y-3 sm:space-y-4">
                    {(analytics?.class_breakdown || []).map((cls, i) => (
                        <div key={i} data-testid={`class-breakdown-${i}`} className="flex items-center gap-3 sm:gap-4">
                            <div className="w-24 sm:w-32 truncate text-sm font-bold">{cls.class_name}</div>
                            <div className="flex-1 h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        (cls.attendance_rate || 0) >= 75 ? "bg-gradient-to-r from-primary to-primary/80" : "bg-gradient-to-r from-destructive to-destructive/80"
                                    }`}
                                    style={{ width: `${cls.attendance_rate || 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-headline font-bold w-10 sm:w-12 text-right">{cls.attendance_rate || 0}%</span>
                        </div>
                    ))}
                    {(!analytics?.class_breakdown || analytics.class_breakdown.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">No class data available</p>
                    )}
                </div>
            </div>
        </>
    );
}

function StudentAnalytics({ analytics }) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                        <span className="material-symbols-outlined text-lg sm:text-xl text-primary">pie_chart</span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-headline font-extrabold text-primary">{analytics?.overall_attendance || 0}%</p>
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
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Alerts</p>
                </div>
            </div>

            <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-border/50">
                <h3 className="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">school</span>
                    Class Performance
                </h3>
                <div className="space-y-3 sm:space-y-4">
                    {(analytics?.class_breakdown || []).map((cls, i) => (
                        <div key={i} className="flex items-center gap-3 sm:gap-4">
                            <div className="w-28 sm:w-40 truncate text-sm font-bold">{cls.class_name}</div>
                            <div className="flex-1 h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        (cls.attendance_percentage || 0) >= 75 ? "bg-gradient-to-r from-primary to-primary/80" : "bg-gradient-to-r from-destructive to-destructive/80"
                                    }`}
                                    style={{ width: `${cls.attendance_percentage || 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-headline font-bold w-10 sm:w-12 text-right">{cls.attendance_percentage || 0}%</span>
                        </div>
                    ))}
                    {(!analytics?.class_breakdown || analytics.class_breakdown.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">Join classes to see your analytics</p>
                    )}
                </div>
            </div>
        </>
    );
}
