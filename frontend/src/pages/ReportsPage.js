import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Download, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
    const { classId } = useParams();
    const { api } = useAuth();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(classId || "");
    const [report, setReport] = useState(null);
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
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadReport = async (cId) => {
        try {
            const { data } = await api.get(`/reports/${cId}`);
            setReport(data);
        } catch (e) {
            console.error(e);
        }
    };

    const exportExcel = async () => {
        setExporting(true);
        try {
            const response = await api.get(`/reports/${selectedClass}/export`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ATRON_Report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            alert("Failed to export");
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div data-testid="reports-page" className="space-y-6">
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="font-headline text-3xl font-extrabold">Reports</h2>
                    <p className="text-muted-foreground">View and export attendance reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger data-testid="report-class-select" className="w-[200px] bg-muted border-[#2a2a2a] rounded-xl">
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-[#2a2a2a]">
                            {classes.map(cls => (
                                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        data-testid="export-excel-btn"
                        onClick={exportExcel}
                        disabled={exporting || !selectedClass}
                        className="bg-primary text-primary-foreground rounded-xl"
                    >
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4 mr-2" /> Export Excel</>}
                    </Button>
                </div>
            </div>

            {/* Report Header */}
            {report && (
                <div className="glass-card rounded-[2rem] p-8 border border-[#1a1a1a]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileSpreadsheet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-headline text-xl font-bold">{report.class?.name}</h3>
                            <p className="text-sm text-muted-foreground">{report.class?.subject} - Section {report.class?.section}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Total Sessions: <strong className="text-foreground">{report.total_sessions}</strong></span>
                        <span>Students: <strong className="text-foreground">{report.students?.length}</strong></span>
                    </div>
                </div>
            )}

            {/* Report Table */}
            {report && (
                <div className="glass-card rounded-[2rem] border border-[#1a1a1a] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#1a1a1a]">
                                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">#</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Attended</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Absent</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Percentage</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.students?.map((s, i) => (
                                    <tr key={i} data-testid={`report-row-${i}`} className="border-b border-[#0a0a0a] hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                    {s.student_name?.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-bold text-sm">{s.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{s.student_email}</td>
                                        <td className="px-6 py-4 text-sm text-center">{s.attended}</td>
                                        <td className="px-6 py-4 text-sm text-center text-destructive">{s.absent}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${s.percentage >= 75 ? "text-primary" : "text-destructive"}`}>{s.percentage}%</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                s.percentage >= 90 ? "bg-primary/20 text-primary" :
                                                s.percentage >= 75 ? "bg-green-500/20 text-green-400" :
                                                s.percentage >= 60 ? "bg-secondary/20 text-secondary" :
                                                "bg-destructive/20 text-destructive"
                                            }`}>
                                                {s.percentage >= 90 ? "Excellent" : s.percentage >= 75 ? "On Track" : s.percentage >= 60 ? "Borderline" : "Warning"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
