import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ReportsPage() {
    const { classId } = useParams();
    const { api } = useAuth();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(classId || "");
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => { loadClasses(); }, []);
    useEffect(() => { if (selectedClass) loadReport(selectedClass); }, [selectedClass]);

    const loadClasses = async () => {
        try {
            const { data } = await api.get("/classes");
            setClasses(data);
            if (!selectedClass && data.length > 0) setSelectedClass(data[0].id);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const loadReport = async (cId) => {
        try { const { data } = await api.get(`/reports/${cId}`); setReport(data); }
        catch (e) { console.error(e); }
    };

    const exportExcel = async () => {
        if (!selectedClass) return;
        setExporting(true);
        try {
            const response = await api.get(`/reports/${selectedClass}/export`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `attendance_report_${selectedClass}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            alert("Export failed: " + (e.response?.data?.detail || e.message));
        } finally { setExporting(false); }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const avgPct = report?.students?.length
        ? Math.round(report.students.reduce((a, s) => a + (s.percentage || 0), 0) / report.students.length) : 0;

    return (
        <div data-testid="reports-page" className="space-y-6 sm:space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span> Back
                    </button>
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">Attendance Reports</h1>
                    <p className="text-muted-foreground text-sm mt-1">Generate and export attendance data for your classes.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select
                        data-testid="report-class-select"
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        className="theme-input rounded-xl h-10 px-4 text-sm focus:outline-none focus:border-primary/50 appearance-none"
                    >
                        {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                    <button
                        data-testid="export-excel-btn"
                        onClick={exportExcel}
                        disabled={exporting || !selectedClass}
                        className="flex items-center justify-center gap-2 theme-btn-primary px-5 py-2.5 rounded-xl text-sm active:scale-[0.98] duration-200 disabled:opacity-50"
                    >
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-lg">download</span>}
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Aggregate Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Aggregate Attendance</span>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold text-primary mt-2">{avgPct}%</p>
                </div>
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-secondary/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Students</span>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold mt-2">{report?.students?.length || 0}</p>
                </div>
                <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Sessions</span>
                    <p className="text-3xl sm:text-4xl font-headline font-extrabold mt-2">{report?.total_sessions || 0}</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass-card rounded-[1.5rem] sm:rounded-[2rem] border border-border/50 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-headline font-bold text-base sm:text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">table_chart</span>
                        Student Attendance Data
                    </h3>
                    <span className="text-xs text-muted-foreground">{report?.students?.length || 0} students</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
                                <th className="py-3 sm:py-4 px-4 sm:px-6">#</th>
                                <th className="py-3 sm:py-4 px-4 sm:px-6">Student Name</th>
                                <th className="py-3 sm:py-4 px-4 sm:px-6 hidden sm:table-cell">Email</th>
                                <th className="py-3 sm:py-4 px-4 sm:px-6 hidden md:table-cell">Attended</th>
                                <th className="py-3 sm:py-4 px-4 sm:px-6 hidden md:table-cell">Total</th>
                                <th className="py-3 sm:py-4 px-4 sm:px-6">%</th>
                                <th className="py-3 sm:py-4 px-4 sm:px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report?.students || []).map((s, i) => {
                                const pct = s.percentage || 0;
                                return (
                                    <tr key={i} data-testid={`report-row-${i}`} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm text-muted-foreground">{i + 1}</td>
                                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {s.student_name?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm">{s.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm text-muted-foreground hidden sm:table-cell">{s.student_email}</td>
                                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm hidden md:table-cell">{s.attended || 0}</td>
                                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm hidden md:table-cell">{report?.total_sessions || 0}</td>
                                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                                            <span className={`text-sm font-bold ${pct >= 75 ? "text-primary" : "text-destructive"}`}>{pct}%</span>
                                        </td>
                                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                                            <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                pct >= 75 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                                            }`}>
                                                <span className="material-symbols-outlined text-xs">{pct >= 75 ? "check_circle" : "warning"}</span>
                                                {pct >= 75 ? "On Track" : "At Risk"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(!report?.students || report.students.length === 0) && (
                        <div className="text-center py-12 text-muted-foreground">
                            <span className="material-symbols-outlined text-3xl text-muted-foreground/30 mb-2">table_rows</span>
                            <p>No data available for this class</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
