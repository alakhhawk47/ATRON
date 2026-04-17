import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";

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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#6D5AC1]" /></div>;

    const avgPct = report?.students?.length
        ? Math.round(report.students.reduce((a, s) => a + (s.percentage || 0), 0) / report.students.length) : 0;

    return (
        <div data-testid="reports-page" className="space-y-6 sm:space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-[#1A1A2E] mb-4 flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-base">arrow_back</span> Back
                    </button>
                    <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight text-[#1A1A2E]">Attendance Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">Generate and export attendance data for your classes.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select data-testid="report-class-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl h-10 px-4 text-sm focus:outline-none focus:border-[#6D5AC1]/50 appearance-none">
                        {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                    <button data-testid="export-excel-btn" onClick={exportExcel} disabled={exporting || !selectedClass}
                        className="flex items-center justify-center gap-2 theme-btn-primary px-6 py-2.5 text-sm active:scale-[0.98] duration-200 disabled:opacity-50">
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-lg">download</span>}
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <StatCard icon="pie_chart" value={`${avgPct}%`} label="Aggregate Attendance" color="primary" />
                <StatCard icon="groups" value={report?.students?.length || 0} label="Total Students" color="secondary" />
                <StatCard icon="event" value={report?.total_sessions || 0} label="Total Sessions" color="success" />
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-headline font-bold text-base sm:text-lg text-[#1A1A2E] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#6D5AC1]">table_chart</span>
                        Student Attendance Data
                    </h3>
                    <span className="text-xs text-gray-400">{report?.students?.length || 0} students</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                <th className="py-3.5 px-5">#</th>
                                <th className="py-3.5 px-5">Student Name</th>
                                <th className="py-3.5 px-5 hidden sm:table-cell">Email</th>
                                <th className="py-3.5 px-5 hidden md:table-cell">Attended</th>
                                <th className="py-3.5 px-5 hidden md:table-cell">Total</th>
                                <th className="py-3.5 px-5">%</th>
                                <th className="py-3.5 px-5">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(report?.students || []).map((s, i) => {
                                const pct = s.percentage || 0;
                                return (
                                    <tr key={i} data-testid={`report-row-${i}`} className="border-b border-gray-50 hover:bg-[#FAF8F0]/60 transition-colors">
                                        <td className="py-3.5 px-5 text-sm text-gray-400">{i + 1}</td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-[#6D5AC1]/10 flex items-center justify-center text-xs font-bold text-[#6D5AC1]">
                                                    {s.student_name?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm text-[#1A1A2E]">{s.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-sm text-gray-400 hidden sm:table-cell">{s.student_email}</td>
                                        <td className="py-3.5 px-5 text-sm hidden md:table-cell">{s.attended || 0}</td>
                                        <td className="py-3.5 px-5 text-sm hidden md:table-cell">{report?.total_sessions || 0}</td>
                                        <td className="py-3.5 px-5">
                                            <span className={`text-sm font-bold ${pct >= 75 ? "text-[#6D5AC1]" : "text-red-500"}`}>{pct}%</span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <StatusBadge status={pct >= 75 ? "on-track" : "at-risk"} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {(!report?.students || report.students.length === 0) && (
                        <div className="text-center py-16 text-gray-400">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">table_rows</span>
                            <p>No data available for this class</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
