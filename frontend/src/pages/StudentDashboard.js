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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

    const overallPct = analytics?.overall_attendance || 0;
    const overallColor = overallPct >= 75 ? "text-cyan-400" : "text-red-400";

    return (
        <div data-testid="student-dashboard" className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <p className="text-neutral-500 text-sm mb-1">Welcome back,</p>
                    <h1 className="font-headline font-black text-3xl tracking-tight">
                        Hello, <span className="text-cyan-400">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-neutral-500 text-sm mt-2">Track your attendance and stay on top of your classes.</p>
                </div>
                <button
                    data-testid="join-class-btn"
                    onClick={() => navigate("/classes/join")}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 px-6 py-3 rounded-xl font-bold text-sm active:scale-[0.98] duration-200"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Join a Class
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-6 border border-cyan-400/20">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl text-cyan-400">pie_chart</span>
                        </div>
                        <span className={`text-xs font-bold ${overallPct >= 75 ? "text-emerald-400" : "text-red-400"}`}>
                            {overallPct >= 75 ? "On Track" : "At Risk"}
                        </span>
                    </div>
                    <p className={`text-3xl font-headline font-extrabold ${overallColor}`}>{overallPct}%</p>
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
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Attendance Alerts</p>
                </div>
            </div>

            {/* Alerts */}
            {analytics?.alerts?.length > 0 && (
                <div className="space-y-2">
                    {analytics.alerts.map((alert, i) => (
                        <div key={i} data-testid={`alert-${i}`} className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-3">
                            <span className="material-symbols-outlined text-base">error</span>
                            {alert}
                        </div>
                    ))}
                </div>
            )}

            {/* Class List */}
            <div>
                <h3 className="font-headline text-xl font-bold mb-4">Your Classes</h3>
                <div className="space-y-3">
                    {classes.map(cls => {
                        const pct = cls.attendance_percentage || 0;
                        const barColor = pct >= 75 ? "bg-cyan-400" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
                        return (
                            <div
                                key={cls.id}
                                data-testid={`student-class-${cls.id}`}
                                className="glass-card rounded-2xl p-5 border border-neutral-800/50 hover:border-cyan-400/20 transition-all cursor-pointer group"
                                onClick={() => navigate(`/classes/${cls.id}`)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-headline font-bold group-hover:text-cyan-400 transition-colors">{cls.name}</h4>
                                        <p className="text-xs text-neutral-500">{cls.subject} - {cls.teacher_name}</p>
                                    </div>
                                    <span className={`text-2xl font-headline font-extrabold ${pct >= 75 ? "text-cyan-400" : "text-red-400"}`}>
                                        {pct}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
                                    <span>{cls.total_sessions || 0} sessions</span>
                                    <span className="material-symbols-outlined text-neutral-600 group-hover:text-cyan-400 transition-colors text-base">arrow_forward</span>
                                </div>
                            </div>
                        );
                    })}
                    {classes.length === 0 && (
                        <div className="text-center py-16 glass-card rounded-2xl border border-neutral-800/50">
                            <span className="material-symbols-outlined text-4xl text-neutral-700 mb-4">school</span>
                            <p className="text-neutral-500 mb-2">No classes yet</p>
                            <button onClick={() => navigate("/classes/join")} className="text-cyan-400 font-bold text-sm hover:underline">Join your first class</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
