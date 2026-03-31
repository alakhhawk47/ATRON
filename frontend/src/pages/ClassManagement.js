import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Users, CalendarCheck, Copy, Check, Play } from "lucide-react";

export default function ClassManagement() {
    const { classId } = useParams();
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [cls, setCls] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => { loadData(); }, [classId]);

    const loadData = async () => {
        try {
            const [classRes, studentsRes] = await Promise.all([
                api.get(`/classes/${classId}`),
                api.get(`/classes/${classId}/students`)
            ]);
            setCls(classRes.data);
            setStudents(studentsRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        if (cls?.class_code) {
            navigator.clipboard.writeText(cls.class_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const startSession = async () => {
        try {
            const { data } = await api.post("/attendance/sessions", { class_id: classId });
            navigate(`/attendance/${classId}`, { state: { session: data } });
        } catch (e) {
            alert(e.response?.data?.detail || "Failed to start session");
        }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!cls) return <div className="text-center py-12 text-muted-foreground">Class not found</div>;

    return (
        <div data-testid="class-management" className="space-y-6">
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {/* Class Header */}
            <div className="glass-card rounded-[2rem] p-8 border border-[#1a1a1a]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="font-headline text-3xl font-extrabold">{cls.name}</h2>
                        <p className="text-muted-foreground">{cls.subject} - Section {cls.section} - Semester {cls.semester}</p>
                        <p className="text-sm text-muted-foreground mt-1">Teacher: {cls.teacher_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {user?.role === "teacher" && (
                            <>
                                <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
                                    <span className="text-xs text-muted-foreground">Code:</span>
                                    <span data-testid="class-code" className="font-headline font-bold text-primary tracking-wider">{cls.class_code}</span>
                                    <button onClick={copyCode} className="p-1 hover:bg-background rounded transition-colors">
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                                    </button>
                                </div>
                                <Button data-testid="start-session-from-class" onClick={startSession} className="bg-primary text-primary-foreground rounded-xl">
                                    <Play className="w-4 h-4 mr-2" /> Start Session
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" /> {cls.student_count} students
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarCheck className="w-4 h-4" /> {cls.total_sessions} sessions
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="glass-card rounded-[2rem] border border-[#1a1a1a] overflow-hidden">
                <div className="p-6 border-b border-[#1a1a1a]">
                    <h3 className="font-headline text-xl font-bold">Students</h3>
                    <p className="text-sm text-muted-foreground">{students.length} enrolled students</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#1a1a1a]">
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Attendance</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Last Seen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, i) => (
                                <tr key={i} data-testid={`student-row-${i}`} className="border-b border-[#0a0a0a] hover:bg-primary/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                {s.student_name?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-bold text-sm">{s.student_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.student_email}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Progress value={s.attendance_percentage} className="w-20 h-2 bg-muted" />
                                            <span className={`text-sm font-bold ${s.attendance_percentage >= 75 ? "text-primary" : "text-destructive"}`}>
                                                {s.attendance_percentage}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {s.last_attendance ? new Date(s.last_attendance).toLocaleDateString() : "Never"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            {user?.role === "teacher" && (
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-[#2a2a2a]" onClick={() => navigate(`/reports/${classId}`)}>
                        View Reports
                    </Button>
                </div>
            )}
        </div>
    );
}
