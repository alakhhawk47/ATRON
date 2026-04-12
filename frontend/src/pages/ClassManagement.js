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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!classInfo) return <div className="text-center py-20 text-muted-foreground">Class not found</div>;

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
                <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-base">arrow_back</span> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">{classInfo.name}</h1>
                        <p className="text-muted-foreground text-sm mt-1">{classInfo.subject} - Section {classInfo.section}</p>
                    </div>
                    {user?.role === "teacher" && (
                        <div className="flex gap-3">
                            <button
                                data-testid="start-session-from-class"
                                onClick={() => navigate(`/attendance/${classId}`)}
                                className="flex items-center gap-2 theme-btn-primary px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm active:scale-[0.98] duration-200"
                            >
                                <span className="material-symbols-outlined text-lg">qr_code</span>
                                Start Session
                            </button>
                            <button
                                onClick={() => navigate(`/reports/${classId}`)}
                                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl theme-btn-outline text-sm font-bold hover:bg-muted/50 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">assessment</span>
                                Reports
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bento Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Attendance Pulse</span>
                        <span className="material-symbols-outlined text-primary text-lg">monitoring</span>
                    </div>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold text-primary">{avgPct}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Average attendance rate</p>
                </div>
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-secondary/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Enrolled</span>
                        <span className="material-symbols-outlined text-secondary text-lg">groups</span>
                    </div>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold">{totalStudents}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total students</p>
                </div>
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-destructive/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">At Risk</span>
                        <span className="material-symbols-outlined text-destructive text-lg">warning</span>
                    </div>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold text-destructive">{atRisk}</p>
                    <p className="text-xs text-muted-foreground mt-1">Below 75% attendance</p>
                </div>
            </div>

            {/* Class Code */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-2xl text-primary">key</span>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Class Join Code</p>
                        <p className="text-xl font-headline font-bold text-primary tracking-[0.2em]">{classInfo.class_code}</p>
                    </div>
                </div>
                <button
                    onClick={() => { navigator.clipboard.writeText(classInfo.class_code); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <span className="material-symbols-outlined text-base">content_copy</span>
                    Copy Code
                </button>
            </div>

            {/* Student Directory */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                    <h3 className="font-headline text-lg sm:text-xl font-bold">Student Directory</h3>
                    <div className="flex gap-2">
                        {["all", "safe", "atrisk"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    filter === f
                                        ? "bg-primary/10 text-primary border border-primary/20"
                                        : "bg-muted/30 text-muted-foreground border border-transparent hover:text-foreground"
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
                            <div key={i} data-testid={`student-row-${i}`} className="glass-card rounded-xl p-3 sm:p-4 border border-border/50 flex items-center justify-between hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-xs sm:text-sm font-bold text-primary">
                                        {s.name?.charAt(0) || "S"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{s.name}</p>
                                        <p className="text-xs text-muted-foreground">{s.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="text-right">
                                        <p className={`text-lg sm:text-xl font-headline font-extrabold ${pct >= 75 ? "text-primary" : "text-destructive"}`}>{pct}%</p>
                                        <p className="text-[10px] text-muted-foreground">Attendance</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-lg ${pct >= 75 ? "text-primary" : "text-destructive"}`}>
                                        {pct >= 75 ? "check_circle" : "error"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12 glass-card rounded-2xl border border-border/50">
                            <span className="material-symbols-outlined text-3xl text-muted-foreground/30 mb-2">group_off</span>
                            <p className="text-muted-foreground">No students found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
