import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;
    if (!classInfo) return <div className="text-center py-20 text-neutral-500">Class not found</div>;

    const totalStudents = students.length;
    const avgPct = totalStudents > 0 ? Math.round(students.reduce((a, s) => a + (s.attendance_percentage || 0), 0) / totalStudents) : 0;
    const atRisk = students.filter(s => (s.attendance_percentage || 0) < 75).length;

    const filteredStudents = filter === "all" ? students
        : filter === "atrisk" ? students.filter(s => (s.attendance_percentage || 0) < 75)
        : students.filter(s => (s.attendance_percentage || 0) >= 75);

    return (
        <div data-testid="class-management" className="space-y-8">
            {/* Header */}
            <div>
                <button onClick={() => navigate(-1)} className="text-sm text-neutral-500 hover:text-white mb-4 flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-headline font-black text-3xl tracking-tight">{classInfo.name}</h1>
                        <p className="text-neutral-500 text-sm mt-1">{classInfo.subject} - Section {classInfo.section}</p>
                    </div>
                    {user?.role === "teacher" && (
                        <div className="flex gap-3">
                            <button
                                data-testid="start-session-from-class"
                                onClick={() => navigate(`/attendance/${classId}`)}
                                className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 px-5 py-2.5 rounded-xl font-bold text-sm active:scale-[0.98] duration-200"
                            >
                                <span className="material-symbols-outlined text-lg">qr_code</span>
                                Start Session
                            </button>
                            <button
                                onClick={() => navigate(`/reports/${classId}`)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700 text-sm font-bold hover:bg-neutral-800/50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">assessment</span>
                                Reports
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bento Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-6 border border-cyan-400/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Attendance Pulse</span>
                        <span className="material-symbols-outlined text-cyan-400 text-lg">monitoring</span>
                    </div>
                    <p className="text-4xl font-headline font-extrabold text-cyan-400">{avgPct}%</p>
                    <p className="text-xs text-neutral-500 mt-1">Average attendance rate</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-amber-400/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Enrolled</span>
                        <span className="material-symbols-outlined text-amber-400 text-lg">groups</span>
                    </div>
                    <p className="text-4xl font-headline font-extrabold">{totalStudents}</p>
                    <p className="text-xs text-neutral-500 mt-1">Total students</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-red-400/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">At Risk</span>
                        <span className="material-symbols-outlined text-red-400 text-lg">warning</span>
                    </div>
                    <p className="text-4xl font-headline font-extrabold text-red-400">{atRisk}</p>
                    <p className="text-xs text-neutral-500 mt-1">Below 75% attendance</p>
                </div>
            </div>

            {/* Class Code */}
            <div className="glass-card rounded-2xl p-6 border border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-2xl text-cyan-400">key</span>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Class Join Code</p>
                        <p className="text-xl font-headline font-bold text-cyan-400 tracking-[0.2em]">{classInfo.class_code}</p>
                    </div>
                </div>
                <button
                    onClick={() => { navigator.clipboard.writeText(classInfo.class_code); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/50 text-sm font-bold text-neutral-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-base">content_copy</span>
                    Copy Code
                </button>
            </div>

            {/* Student Directory */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="font-headline text-xl font-bold">Student Directory</h3>
                    <div className="flex gap-2">
                        {["all", "safe", "atrisk"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    filter === f
                                        ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                                        : "bg-neutral-800/50 text-neutral-500 border border-transparent hover:text-white"
                                }`}
                            >
                                {f === "all" ? "All" : f === "safe" ? "On Track" : "At Risk"}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    {filteredStudents.map((s, i) => {
                        const pct = s.attendance_percentage || 0;
                        return (
                            <div key={i} data-testid={`student-row-${i}`} className="glass-card rounded-xl p-4 border border-neutral-800/50 flex items-center justify-between hover:border-cyan-400/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-sm font-bold text-cyan-400">
                                        {s.name?.charAt(0) || "S"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{s.name}</p>
                                        <p className="text-xs text-neutral-500">{s.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={`text-xl font-headline font-extrabold ${pct >= 75 ? "text-cyan-400" : "text-red-400"}`}>{pct}%</p>
                                        <p className="text-[10px] text-neutral-500">Attendance</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-lg ${pct >= 75 ? "text-cyan-400" : "text-red-400"}`}>
                                        {pct >= 75 ? "check_circle" : "error"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12 glass-card rounded-2xl border border-neutral-800/50">
                            <span className="material-symbols-outlined text-3xl text-neutral-700 mb-2">group_off</span>
                            <p className="text-neutral-500">No students found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
