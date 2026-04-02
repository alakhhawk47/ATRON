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

    useEffect(() => {
        loadClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) loadReport(selectedClass);
    }, [selectedClass]);

    const loadClasses = async () => {
        try {
            const { data } = await api.get("/classes");
            setClasses(data);
            if (!selectedClass && data.length > 0) setSelectedClass(data[0].id);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const loadReport = async (cId) => {
        try {
            const { data } = await api.get(`/reports/${cId}`);
            setReport(data);
        } catch (e) { console.error(e); }
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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

    const avgPct = report?.students?.length
        ? Math.round(report.students.reduce((a, s) => a + (s.percentage || 0), 0) / report.students.length)
        : 0;

    return (
        <div data-testid="reports-page" className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-neutral-500 hover:text-white mb-4 flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span> Back
                    </button>
                    <h1 className="font-headline font-black text-3xl tracking-tight">Attendance Reports</h1>
                    <p className="text-neutral-500 text-sm mt-1">Generate and export attendance data for your classes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        data-testid="report-class-select"
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        className="bg-neutral-900/80 border border-neutral-700/30 rounded-xl h-10 px-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 appearance-none"
                    >
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button
                        data-testid="export-excel-btn"
                        onClick={exportExcel}
                        disabled={exporting || !selectedClass}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-neutral-950 px-5 py-2.5 rounded-xl font-bold text-sm active:scale-[0.98] duration-200 disabled:opacity-50"
                    >
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-lg">download</span>}
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Aggregate Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-6 border border-cyan-400/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Aggregate Attendance</span>
                    <p className="text-4xl font-headline font-extrabold text-cyan-400 mt-2">{avgPct}%</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-amber-400/20">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total Students</span>
                    <p className="text-4xl font-headline font-extrabold mt-2">{report?.students?.length || 0}</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-neutral-800/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Total Sessions</span>
                    <p className="text-4xl font-headline font-extrabold mt-2">{report?.total_sessions || 0}</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass-card rounded-[2rem] border border-neutral-800/50 overflow-hidden">
                <div className="p-6 border-b border-neutral-800/50 flex items-center justify-between">
                    <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-cyan-400">table_chart</span>
                        Student Attendance Data
                    </h3>
                    <span className="text-xs text-neutral-500">{report?.students?.length || 0} students</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] uppercase tracking-widest text-neutral-500 border-b border-neutral-800/50">
                                <th className="py-4 px-6">#</th>
                                <th className="py-4 px-6">Student Name</th>
                                <th className="py-4 px-6">Email</th>
                                <th className="py-4 px-6">Classes Attended</th>
                                <th className="py-4 px-6">Total Classes</th>
                                <th className="py-4 px-6">Attendance %</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report?.students || []).map((s, i) => {
                                const pct = s.percentage || 0;
                                return (
                                    <tr key={i} data-testid={`report-row-${i}`} className="border-b border-neutral-800/30 hover:bg-neutral-800/20 transition-colors">
                                        <td className="py-4 px-6 text-sm text-neutral-500">{i + 1}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center text-xs font-bold text-cyan-400">
                                                    {s.student_name?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm">{s.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-neutral-500">{s.student_email}</td>
                                        <td className="py-4 px-6 text-sm">{s.attended || 0}</td>
                                        <td className="py-4 px-6 text-sm">{report?.total_sessions || 0}</td>
                                        <td className="py-4 px-6">
                                            <span className={`text-sm font-bold ${pct >= 75 ? "text-cyan-400" : "text-red-400"}`}>{pct}%</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                pct >= 75 ? "bg-cyan-400/10 text-cyan-400" : "bg-red-400/10 text-red-400"
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
                        <div className="text-center py-12 text-neutral-500">
                            <span className="material-symbols-outlined text-3xl text-neutral-700 mb-2">table_rows</span>
                            <p>No data available for this class</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
