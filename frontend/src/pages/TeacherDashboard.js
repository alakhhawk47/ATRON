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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

    const stats = [
        { label: "Total Classes", value: analytics?.total_classes || 0, icon: "school", color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
        { label: "Total Students", value: analytics?.total_students || 0, icon: "groups", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
        { label: "Attendance Rate", value: `${analytics?.attendance_rate || 0}%`, icon: "trending_up", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
        { label: "Today's Sessions", value: analytics?.today_sessions || 0, icon: "calendar_today", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
    ];

    return (
        <div data-testid="teacher-dashboard" className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-headline font-black text-3xl tracking-tight">Faculty Dashboard</h1>
                    <p className="text-neutral-500 text-sm mt-1">Overview of your classes and attendance metrics</p>
                </div>
                <button
                    data-testid="start-attendance-btn"
                    onClick={() => setShowStartDialog(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 px-6 py-3 rounded-xl font-bold text-sm active:scale-[0.98] duration-200 neon-glow"
                >
                    <span className="material-symbols-outlined text-lg">qr_code</span>
                    Start QR Session
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} data-testid={`stat-card-${i}`} className={`glass-card rounded-2xl p-6 border ${s.border} group hover:neon-glow-primary transition-all`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
                            </div>
                            <span className="material-symbols-outlined text-neutral-700 group-hover:text-neutral-500 transition-colors">more_horiz</span>
                        </div>
                        <p className="text-3xl font-headline font-extrabold">{s.value}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Classes List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-headline text-xl font-bold">Your Classes</h3>
                    <button
                        onClick={() => navigate("/classes/create")}
                        className="flex items-center gap-2 text-sm text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">add</span> New Class
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map(cls => (
                        <div
                            key={cls.id}
                            data-testid={`class-card-${cls.id}`}
                            className="glass-card rounded-2xl p-6 border border-neutral-800/50 hover:border-cyan-400/20 transition-all cursor-pointer group"
                            onClick={() => navigate(`/classes/${cls.id}`)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-headline font-bold text-lg group-hover:text-cyan-400 transition-colors">{cls.name}</h4>
                                    <p className="text-sm text-neutral-500">{cls.subject} - Section {cls.section}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-neutral-800/50 text-[10px] font-bold text-neutral-500 uppercase">Sem {cls.semester}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-neutral-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">group</span>
                                    {cls.student_count} students
                                </span>
                                <span>{cls.total_sessions} sessions</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-neutral-800/30 flex items-center justify-between">
                                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Code: <span className="text-cyan-400">{cls.class_code}</span></span>
                                <span className="material-symbols-outlined text-neutral-600 group-hover:text-cyan-400 transition-colors text-lg">arrow_forward</span>
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="col-span-full text-center py-16 glass-card rounded-2xl border border-neutral-800/50">
                            <span className="material-symbols-outlined text-4xl text-neutral-700 mb-4">school</span>
                            <p className="text-neutral-500 mb-2">No classes yet</p>
                            <button onClick={() => navigate("/classes/create")} className="text-cyan-400 font-bold text-sm hover:underline">Create your first class</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Start Session Dialog */}
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
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
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-800/50 hover:bg-cyan-400/10 hover:border-cyan-400/20 border border-transparent transition-all text-left"
                            >
                                <div>
                                    <p className="font-bold">{cls.name}</p>
                                    <p className="text-sm text-neutral-500">{cls.subject}</p>
                                </div>
                                {startingClass === cls.id
                                    ? <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                                    : <span className="material-symbols-outlined text-cyan-400">play_circle</span>
                                }
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
