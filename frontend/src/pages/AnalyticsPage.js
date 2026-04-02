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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

    const isTeacher = user?.role === "teacher";

    return (
        <div data-testid="analytics-page" className="space-y-8">
            <div>
                <h1 className="font-headline font-black text-3xl tracking-tight">Analytics</h1>
                <p className="text-neutral-500 text-sm mt-1">Performance insights and attendance trends</p>
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Classes", value: analytics?.total_classes || 0, icon: "school", color: "cyan" },
                    { label: "Total Students", value: analytics?.total_students || 0, icon: "groups", color: "amber" },
                    { label: "Avg Attendance", value: `${analytics?.attendance_rate || 0}%`, icon: "trending_up", color: "emerald" },
                    { label: "Today Sessions", value: analytics?.today_sessions || 0, icon: "calendar_today", color: "red" },
                ].map((s, i) => (
                    <div key={i} className={`glass-card rounded-2xl p-6 border border-${s.color}-400/20`}>
                        <div className={`w-10 h-10 rounded-xl bg-${s.color}-400/10 flex items-center justify-center mb-4`}>
                            <span className={`material-symbols-outlined text-xl text-${s.color}-400`}>{s.icon}</span>
                        </div>
                        <p className="text-3xl font-headline font-extrabold">{s.value}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Weekly Trend Chart */}
            <div className="glass-card rounded-[2rem] p-8 border border-neutral-800/50">
                <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400">show_chart</span>
                    Weekly Attendance Trend
                </h3>
                {weeklyData.length > 0 ? (
                    <div className="flex items-end gap-3 h-48">
                        {weeklyData.map((w, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-bold text-cyan-400">{Math.round(w.rate || 0)}%</span>
                                <div className="w-full rounded-t-lg bg-cyan-400/20 relative overflow-hidden" style={{ height: `${Math.max(((w.rate || 0) / maxVal) * 100, 8)}%` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/60 to-cyan-400/20" />
                                </div>
                                <span className="text-[10px] text-neutral-500 truncate w-full text-center">{w.week || `W${i + 1}`}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-neutral-500">
                        <span className="material-symbols-outlined text-3xl text-neutral-700 mb-2">bar_chart</span>
                        <p>No trend data yet</p>
                    </div>
                )}
            </div>

            {/* Class Comparison */}
            <div className="glass-card rounded-[2rem] p-8 border border-neutral-800/50">
                <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400">compare</span>
                    Subject Comparison
                </h3>
                <div className="space-y-4">
                    {(analytics?.class_breakdown || []).map((cls, i) => (
                        <div key={i} data-testid={`class-breakdown-${i}`} className="flex items-center gap-4">
                            <div className="w-32 truncate text-sm font-bold">{cls.class_name}</div>
                            <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        (cls.attendance_rate || 0) >= 75 ? "bg-gradient-to-r from-cyan-400 to-cyan-500" : "bg-gradient-to-r from-red-400 to-red-500"
                                    }`}
                                    style={{ width: `${cls.attendance_rate || 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-headline font-bold w-12 text-right">{cls.attendance_rate || 0}%</span>
                        </div>
                    ))}
                    {(!analytics?.class_breakdown || analytics.class_breakdown.length === 0) && (
                        <p className="text-center text-neutral-500 py-8">No class data available</p>
                    )}
                </div>
            </div>
        </>
    );
}

function StudentAnalytics({ analytics }) {
    return (
        <>
            {/* Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-6 border border-cyan-400/20">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-xl text-cyan-400">pie_chart</span>
                    </div>
                    <p className="text-3xl font-headline font-extrabold text-cyan-400">{analytics?.overall_attendance || 0}%</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Overall Attendance</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-amber-400/20">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-xl text-amber-400">school</span>
                    </div>
                    <p className="text-3xl font-headline font-extrabold">{analytics?.classes_joined || 0}</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Classes Joined</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-red-400/20">
                    <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-xl text-red-400">warning</span>
                    </div>
                    <p className="text-3xl font-headline font-extrabold">{analytics?.alerts?.length || 0}</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Alerts</p>
                </div>
            </div>

            {/* Subject Breakdown */}
            <div className="glass-card rounded-[2rem] p-8 border border-neutral-800/50">
                <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400">school</span>
                    Class Performance
                </h3>
                <div className="space-y-4">
                    {(analytics?.class_breakdown || []).map((cls, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-40 truncate text-sm font-bold">{cls.class_name}</div>
                            <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        (cls.attendance_percentage || 0) >= 75 ? "bg-gradient-to-r from-cyan-400 to-cyan-500" : "bg-gradient-to-r from-red-400 to-red-500"
                                    }`}
                                    style={{ width: `${cls.attendance_percentage || 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-headline font-bold w-12 text-right">{cls.attendance_percentage || 0}%</span>
                        </div>
                    ))}
                    {(!analytics?.class_breakdown || analytics.class_breakdown.length === 0) && (
                        <p className="text-center text-neutral-500 py-8">Join classes to see your analytics</p>
                    )}
                </div>
            </div>
        </>
    );
}
