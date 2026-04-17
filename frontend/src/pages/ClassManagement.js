import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export default function ClassManagement() {
    const { classId } = useParams();
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => { loadData(); }, [classId]);

    const loadData = async () => {
        try {
            const { data } = await api.get(`/classes/${classId}`);
            setClassInfo(data);
            setStudents(data.students || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#6D5AC1]" /></div>;
    if (!classInfo) return <div className="text-center py-20 text-gray-500">Class not found</div>;

    const totalStudents = students.length;
    const avgPct = totalStudents > 0 ? Math.round(students.reduce((a, s) => a + (s.attendance_percentage || 0), 0) / totalStudents) : 0;
    const atRisk = students.filter(s => (s.attendance_percentage || 0) < 75).length;

    const filteredStudents = filter === "all" ? students
        : filter === "atrisk" ? students.filter(s => (s.attendance_percentage || 0) < 75)
        : students.filter(s => (s.attendance_percentage || 0) >= 75);

    return (
        <div data-testid="class-management" className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div>
                <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-[#1A1A2E] mb-4 flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight text-[#1A1A2E]">{classInfo.name}</h1>
                        <p className="text-gray-500 text-sm mt-1">{classInfo.subject} - Section {classInfo.section}</p>
                    </div>
                    {user?.role === "teacher" && (
                        <div className="flex gap-3">
                            <button data-testid="start-session-from-class" onClick={() => navigate(`/attendance/${classId}`)}
                                className="flex items-center gap-2 theme-btn-primary px-5 sm:px-6 py-2.5 text-sm active:scale-[0.98] duration-200">
                                <span className="material-symbols-outlined text-lg">qr_code</span> Start Session
                            </button>
                            <button onClick={() => navigate(`/reports/${classId}`)}
                                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full theme-btn-outline text-sm font-bold">
                                <span className="material-symbols-outlined text-lg">assessment</span> Reports
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bento Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#6D5AC1]/15 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Attendance Pulse</span>
                        <span className="material-symbols-outlined text-[#6D5AC1] text-lg">monitoring</span>
                    </div>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold text-[#6D5AC1]">{avgPct}%</p>
                    <p className="text-xs text-gray-400 mt-1">Average attendance rate</p>
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#C9A84C]/15 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Enrolled</span>
                        <span className="material-symbols-outlined text-[#C9A84C] text-lg">groups</span>
                    </div>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold text-[#1A1A2E]">{totalStudents}</p>
                    <p className="text-xs text-gray-400 mt-1">Total students</p>
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-red-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">At Risk</span>
                        <span className="material-symbols-outlined text-red-500 text-lg">warning</span>
                    </div>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold text-red-500">{atRisk}</p>
                    <p className="text-xs text-gray-400 mt-1">Below 75% attendance</p>
                </div>
            </div>

            {/* Class Code */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-2xl text-[#6D5AC1]">key</span>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Class Join Code</p>
                        <p className="text-xl font-headline font-bold text-[#6D5AC1] tracking-[0.2em]">{classInfo.class_code}</p>
                    </div>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(classInfo.class_code); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-sm font-bold text-gray-500 hover:text-[#1A1A2E] hover:bg-gray-100 transition-colors border border-gray-200">
                    <span className="material-symbols-outlined text-base">content_copy</span> Copy Code
                </button>
            </div>

            {/* Student Directory */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                    <h3 className="font-headline text-lg sm:text-xl font-bold text-[#1A1A2E]">Student Directory</h3>
                    <div className="flex gap-2">
                        {["all", "safe", "atrisk"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    filter === f
                                        ? "bg-[#6D5AC1]/10 text-[#6D5AC1] border border-[#6D5AC1]/15"
                                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:text-[#1A1A2E]"
                                }`}>
                                {f === "all" ? "All" : f === "safe" ? "On Track" : "At Risk"}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredStudents.map((s, i) => {
                        const pct = s.attendance_percentage || 0;
                        return (
                            <div key={i} data-testid={`student-row-${i}`} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200/60 shadow-sm flex items-center justify-between hover:border-[#6D5AC1]/15 transition-all">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-[#6D5AC1]/10 flex items-center justify-center text-xs sm:text-sm font-bold text-[#6D5AC1]">
                                        {s.name?.charAt(0) || "S"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-[#1A1A2E]">{s.name}</p>
                                        <p className="text-xs text-gray-400">{s.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="text-right">
                                        <p className={`text-lg sm:text-xl font-headline font-extrabold ${pct >= 75 ? "text-[#6D5AC1]" : "text-red-500"}`}>{pct}%</p>
                                        <p className="text-[10px] text-gray-400">Attendance</p>
                                    </div>
                                    <StatusBadge status={pct >= 75 ? "on-track" : "at-risk"} />
                                </div>
                            </div>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200/60 shadow-sm">
                            <span className="material-symbols-outlined text-3xl text-gray-300 mb-2">group_off</span>
                            <p className="text-gray-400">No students found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
