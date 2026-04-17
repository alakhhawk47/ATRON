import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#6D5AC1]" /></div>;

    const isTeacher = user?.role === "teacher";

    return (
        <div data-testid="analytics-page" className="space-y-6 sm:space-y-8">
            <PageHeader title="Analytics" subtitle="Performance insights and attendance trends" />
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
                <StatCard icon="school" value={analytics?.total_classes || 0} label="Total Classes" color="primary" />
                <StatCard icon="groups" value={analytics?.total_students || 0} label="Total Students" color="secondary" />
                <StatCard icon="trending_up" value={`${analytics?.attendance_rate || 0}%`} label="Avg Attendance" color="success" />
                <StatCard icon="calendar_today" value={analytics?.today_sessions || 0} label="Today Sessions" color="destructive" />
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm">
                <h3 className="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6 text-[#1A1A2E] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6D5AC1]">show_chart</span>
                    Weekly Attendance Trend
                </h3>
                {weeklyData.length > 0 ? (
                    <div className="flex items-end gap-2 sm:gap-3 h-36 sm:h-48">
                        {weeklyData.map((w, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-[10px] sm:text-xs font-bold text-[#6D5AC1]">{Math.round(w.rate || 0)}%</span>
                                <div className="w-full rounded-t-lg bg-[#6D5AC1]/10 relative overflow-hidden" style={{ height: `${Math.max(((w.rate || 0) / maxVal) * 100, 8)}%` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#6D5AC1]/50 to-[#6D5AC1]/15" />
                                </div>
                                <span className="text-[9px] sm:text-[10px] text-gray-400 truncate w-full text-center">{w.week || `W${i + 1}`}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <span className="material-symbols-outlined text-3xl text-gray-300 mb-2">bar_chart</span>
                        <p>No trend data yet</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm">
                <h3 className="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6 text-[#1A1A2E] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C9A84C]">compare</span>
                    Subject Comparison
                </h3>
                <div className="space-y-3 sm:space-y-4">
                    {(analytics?.class_breakdown || []).map((cls, i) => (
                        <div key={i} data-testid={`class-breakdown-${i}`} className="flex items-center gap-3 sm:gap-4">
                            <div className="w-24 sm:w-32 truncate text-sm font-bold text-[#1A1A2E]">{cls.class_name}</div>
                            <div className="flex-1 h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        (cls.attendance_rate || 0) >= 75 ? "bg-gradient-to-r from-[#6D5AC1] to-[#6D5AC1]/70" : "bg-gradient-to-r from-red-500 to-red-400"
                                    }`}
                                    style={{ width: `${cls.attendance_rate || 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-headline font-bold w-10 sm:w-12 text-right text-[#1A1A2E]">{cls.attendance_rate || 0}%</span>
                        </div>
                    ))}
                    {(!analytics?.class_breakdown || analytics.class_breakdown.length === 0) && (
                        <p className="text-center text-gray-400 py-8">No class data available</p>
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
                <StatCard icon="pie_chart" value={`${analytics?.overall_attendance || 0}%`} label="Overall Attendance" color="primary" />
                <StatCard icon="school" value={analytics?.classes_joined || 0} label="Classes Joined" color="secondary" />
                <StatCard icon="warning" value={analytics?.alerts?.length || 0} label="Alerts" color="destructive" />
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm">
                <h3 className="font-headline font-bold text-base sm:text-lg mb-4 sm:mb-6 text-[#1A1A2E] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#6D5AC1]">school</span>
                    Class Performance
                </h3>
                <div className="space-y-3 sm:space-y-4">
                    {(analytics?.class_breakdown || []).map((cls, i) => (
                        <div key={i} className="flex items-center gap-3 sm:gap-4">
                            <div className="w-28 sm:w-40 truncate text-sm font-bold text-[#1A1A2E]">{cls.class_name}</div>
                            <div className="flex-1 h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        (cls.attendance_percentage || 0) >= 75 ? "bg-gradient-to-r from-[#6D5AC1] to-[#6D5AC1]/70" : "bg-gradient-to-r from-red-500 to-red-400"
                                    }`}
                                    style={{ width: `${cls.attendance_percentage || 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-headline font-bold w-10 sm:w-12 text-right text-[#1A1A2E]">{cls.attendance_percentage || 0}%</span>
                        </div>
                    ))}
                    {(!analytics?.class_breakdown || analytics.class_breakdown.length === 0) && (
                        <p className="text-center text-gray-400 py-8">Join classes to see your analytics</p>
                    )}
                </div>
            </div>
        </>
    );
}
