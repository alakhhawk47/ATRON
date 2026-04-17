import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";

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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#6D5AC1]" /></div>;

    return (
        <div data-testid="teacher-dashboard" className="space-y-6 sm:space-y-8">
            <PageHeader title="Faculty Dashboard" subtitle="Overview of your classes and attendance metrics">
                <button
                    data-testid="start-attendance-btn"
                    onClick={() => setShowStartDialog(true)}
                    className="inline-flex items-center gap-2 theme-btn-primary px-6 sm:px-7 py-2.5 sm:py-3 text-sm active:scale-[0.98] duration-200"
                >
                    <span className="material-symbols-outlined text-lg">qr_code</span>
                    Start QR Session
                </button>
            </PageHeader>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard icon="school" value={analytics?.total_classes || 0} label="Total Classes" color="primary" />
                <StatCard icon="groups" value={analytics?.total_students || 0} label="Total Students" color="secondary" />
                <StatCard icon="trending_up" value={`${analytics?.attendance_rate || 0}%`} label="Attendance Rate" color="success" />
                <StatCard icon="calendar_today" value={analytics?.today_sessions || 0} label="Today's Sessions" color="destructive" />
            </div>

            {/* Classes List */}
            <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-headline text-lg sm:text-xl font-bold text-[#1A1A2E]">Your Classes</h3>
                    <button
                        onClick={() => navigate("/classes/create")}
                        className="flex items-center gap-2 text-sm text-[#6D5AC1] font-bold hover:opacity-80 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">add</span> New Class
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {classes.map(cls => (
                        <div
                            key={cls.id}
                            data-testid={`class-card-${cls.id}`}
                            className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/60 shadow-sm hover:shadow-md hover:border-[#6D5AC1]/20 transition-all cursor-pointer group"
                            onClick={() => navigate(`/classes/${cls.id}`)}
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div>
                                    <h4 className="font-headline font-bold text-base sm:text-lg text-[#1A1A2E] group-hover:text-[#6D5AC1] transition-colors">{cls.name}</h4>
                                    <p className="text-xs sm:text-sm text-gray-500">{cls.subject} - Section {cls.section}</p>
                                </div>
                                <span className="px-2 sm:px-3 py-1 rounded-full bg-gray-100 text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase">Sem {cls.semester}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">group</span>
                                    {cls.student_count} students
                                </span>
                                <span>{cls.total_sessions} sessions</span>
                            </div>
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Code: <span className="text-[#6D5AC1]">{cls.class_code}</span></span>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-[#6D5AC1] transition-colors text-lg">arrow_forward</span>
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="col-span-full text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200/60 shadow-sm">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">school</span>
                            <p className="text-gray-500 mb-2">No classes yet</p>
                            <button onClick={() => navigate("/classes/create")} className="text-[#6D5AC1] font-bold text-sm hover:underline">Create your first class</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Start Session Dialog */}
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
                <DialogContent className="bg-white border-gray-200 text-[#1A1A2E]">
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
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-[#6D5AC1]/5 hover:border-[#6D5AC1]/20 border border-transparent transition-all text-left"
                            >
                                <div>
                                    <p className="font-bold">{cls.name}</p>
                                    <p className="text-sm text-gray-500">{cls.subject}</p>
                                </div>
                                {startingClass === cls.id
                                    ? <Loader2 className="w-5 h-5 animate-spin text-[#6D5AC1]" />
                                    : <span className="material-symbols-outlined text-[#6D5AC1]">play_circle</span>
                                }
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
