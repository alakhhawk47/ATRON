import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#69daff", "#fd9d06", "#ff6e82", "#4ade80", "#a78bfa"];

export default function AnalyticsPage() {
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadAnalytics(); }, []);

    const loadAnalytics = async () => {
        try {
            const endpoint = user?.role === "teacher" ? "/analytics/teacher" : "/analytics/student";
            const { data } = await api.get(endpoint);
            setData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!data) return <div className="text-center py-12 text-muted-foreground">No analytics data available</div>;

    const barData = (data.class_stats || []).map(c => ({
        name: c.class_name?.length > 15 ? c.class_name.substring(0, 15) + '...' : c.class_name,
        rate: c.attendance_rate || c.percentage || 0
    }));

    const pieData = (data.class_stats || []).map(c => ({
        name: c.class_name,
        value: c.students || c.attended || 0
    }));

    return (
        <div data-testid="analytics-page" className="space-y-6">
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <h2 className="font-headline text-3xl font-extrabold">Analytics</h2>

            {/* Overview Stats */}
            {user?.role === "teacher" ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Total Classes</p>
                        <p className="text-3xl font-headline font-extrabold">{data.total_classes}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Total Students</p>
                        <p className="text-3xl font-headline font-extrabold">{data.total_students}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Sessions</p>
                        <p className="text-3xl font-headline font-extrabold">{data.total_sessions}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Avg Rate</p>
                        <p className="text-3xl font-headline font-extrabold text-primary">{data.attendance_rate}%</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Overall</p>
                        <p className={`text-3xl font-headline font-extrabold ${data.overall_attendance >= 75 ? "text-primary" : "text-destructive"}`}>{data.overall_attendance}%</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Classes</p>
                        <p className="text-3xl font-headline font-extrabold">{data.classes_joined}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2">Attended</p>
                        <p className="text-3xl font-headline font-extrabold">{data.attended_sessions}/{data.total_sessions}</p>
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Attendance by Class */}
                <div className="glass-card rounded-[2rem] p-8 border border-[#1a1a1a]">
                    <h3 className="font-headline text-xl font-bold mb-6">Attendance by Class</h3>
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <XAxis dataKey="name" tick={{ fill: '#adaaaa', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#adaaaa', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#fff' }}
                                    cursor={{ fill: 'rgba(105, 218, 255, 0.1)' }}
                                />
                                <Bar dataKey="rate" fill="#69daff" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">No data available</p>
                    )}
                </div>

                {/* Pie Chart - Distribution */}
                <div className="glass-card rounded-[2rem] p-8 border border-[#1a1a1a]">
                    <h3 className="font-headline text-xl font-bold mb-6">{user?.role === "teacher" ? "Students per Class" : "Attendance Distribution"}</h3>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={5} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">No data available</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-4">
                        {pieData.map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-muted-foreground">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Class Performance Table */}
            <div className="glass-card rounded-[2rem] border border-[#1a1a1a] overflow-hidden">
                <div className="p-6 border-b border-[#1a1a1a]">
                    <h3 className="font-headline text-xl font-bold">Class Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#1a1a1a]">
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Class</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{user?.role === "teacher" ? "Students" : "Sessions"}</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Rate</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.class_stats || []).map((c, i) => {
                                const rate = c.attendance_rate || c.percentage || 0;
                                return (
                                    <tr key={i} className="border-b border-[#0a0a0a] hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm">{c.class_name}</p>
                                            <p className="text-xs text-muted-foreground">{c.subject}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{c.students || c.total_sessions || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${rate >= 75 ? "text-primary" : "text-destructive"}`}>{rate}%</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {rate >= 75 ? (
                                                <span className="inline-flex items-center gap-1 text-primary text-xs"><TrendingUp className="w-3 h-3" /> Good</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-destructive text-xs"><TrendingDown className="w-3 h-3" /> Low</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
