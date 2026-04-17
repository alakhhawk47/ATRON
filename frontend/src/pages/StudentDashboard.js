import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#6D5AC1]" /></div>;

    const overallPct = analytics?.overall_attendance || 0;

    return (
        <div data-testid="student-dashboard" className="space-y-6 sm:space-y-8">
            <PageHeader
                title={<>Hello, <span className="text-[#6D5AC1]">{user?.name?.split(' ')[0]}</span></>}
                subtitle="Track your attendance and stay on top of your classes."
            >
                <button
                    data-testid="join-class-btn"
                    onClick={() => navigate("/classes/join")}
                    className="inline-flex items-center gap-2 theme-btn-primary px-6 sm:px-7 py-2.5 sm:py-3 text-sm active:scale-[0.98] duration-200"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Join a Class
                </button>
            </PageHeader>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <StatCard
                    icon="pie_chart"
                    value={`${overallPct}%`}
                    label="Overall Attendance"
                    color={overallPct >= 75 ? "primary" : "destructive"}
                />
                <StatCard icon="school" value={analytics?.classes_joined || 0} label="Classes Joined" color="secondary" />
                <StatCard icon="warning" value={analytics?.alerts?.length || 0} label="Attendance Alerts" color="destructive" />
            </div>

            {/* Alerts */}
            {analytics?.alerts?.length > 0 && (
                <div className="space-y-2">
                    {analytics.alerts.map((alert, i) => (
                        <div key={i} data-testid={`alert-${i}`} className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center gap-3">
                            <span className="material-symbols-outlined text-base">error</span>
                            {alert}
                        </div>
                    ))}
                </div>
            )}

            {/* Class List */}
            <div>
                <h3 className="font-headline text-lg sm:text-xl font-bold mb-4 text-[#1A1A2E]">Your Classes</h3>
                <div className="space-y-3">
                    {classes.map(cls => {
                        const pct = cls.attendance_percentage || 0;
                        const barColor = pct >= 75 ? "bg-[#6D5AC1]" : pct >= 50 ? "bg-[#C9A84C]" : "bg-red-500";
                        return (
                            <div
                                key={cls.id}
                                data-testid={`student-class-${cls.id}`}
                                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-[#6D5AC1]/20 transition-all cursor-pointer group"
                                onClick={() => navigate(`/classes/${cls.id}`)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-headline font-bold text-sm sm:text-base text-[#1A1A2E] group-hover:text-[#6D5AC1] transition-colors">{cls.name}</h4>
                                        <p className="text-xs text-gray-500">{cls.subject} - {cls.teacher_name}</p>
                                    </div>
                                    <span className={`text-xl sm:text-2xl font-headline font-extrabold ${pct >= 75 ? "text-[#6D5AC1]" : "text-red-500"}`}>
                                        {pct}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                                </div>
                                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                    <span>{cls.total_sessions || 0} sessions</span>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-[#6D5AC1] transition-colors text-base">arrow_forward</span>
                                </div>
                            </div>
                        );
                    })}
                    {classes.length === 0 && (
                        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200/60 shadow-sm">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">school</span>
                            <p className="text-gray-500 mb-2">No classes yet</p>
                            <button onClick={() => navigate("/classes/join")} className="text-[#6D5AC1] font-bold text-sm hover:underline">Join your first class</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
