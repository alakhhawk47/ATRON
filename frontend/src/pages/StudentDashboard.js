import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart, UserPlus, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

export default function StudentDashboard() {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [analyticsRes, classesRes] = await Promise.all([
                api.get("/analytics/student"),
                api.get("/classes")
            ]);
            setAnalytics(analyticsRes.data);
            setClasses(classesRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const overallColor = (analytics?.overall_attendance || 0) >= 75 ? "text-primary" : "text-destructive";

    return (
        <div data-testid="student-dashboard" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <PieChart className="w-5 h-5 text-primary" />
                    </div>
                    <p className={`text-3xl font-headline font-extrabold ${overallColor}`}>{analytics?.overall_attendance || 0}%</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Overall Attendance</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                        <UserPlus className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-3xl font-headline font-extrabold">{analytics?.classes_joined || 0}</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Classes Joined</p>
                </div>
                <div className="glass-card rounded-2xl p-6 border border-[#1a1a1a]">
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <p className="text-3xl font-headline font-extrabold">{analytics?.alerts?.length || 0}</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Alerts</p>
                </div>
            </div>

            {/* Alerts */}
            {analytics?.alerts?.length > 0 && (
                <div className="space-y-2">
                    {analytics.alerts.map((alert, i) => (
                        <div key={i} data-testid={`alert-${i}`} className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {alert}
                        </div>
                    ))}
                </div>
            )}

            {/* Join Class Button */}
            <Button data-testid="join-class-btn" onClick={() => navigate("/classes/join")} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-5 text-base font-bold">
                <UserPlus className="w-5 h-5 mr-2" /> Join a Class
            </Button>

            {/* Class List with Attendance */}
            <div>
                <h3 className="font-headline text-xl font-bold mb-4">Your Classes</h3>
                <div className="space-y-3">
                    {classes.map(cls => (
                        <div
                            key={cls.id}
                            data-testid={`student-class-${cls.id}`}
                            className="glass-card rounded-2xl p-5 border border-[#1a1a1a] hover:border-primary/30 transition-all cursor-pointer group"
                            onClick={() => navigate(`/classes/${cls.id}`)}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h4 className="font-headline font-bold group-hover:text-primary transition-colors">{cls.name}</h4>
                                    <p className="text-xs text-muted-foreground">{cls.subject} - {cls.teacher_name}</p>
                                </div>
                                <span className={`text-2xl font-headline font-extrabold ${(cls.attendance_percentage || 0) >= 75 ? "text-primary" : "text-destructive"}`}>
                                    {cls.attendance_percentage || 0}%
                                </span>
                            </div>
                            <Progress value={cls.attendance_percentage || 0} className="h-2 bg-muted" />
                            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                                <span>{cls.total_sessions || 0} sessions</span>
                                <ArrowRight className="w-4 h-4 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-lg mb-2">No classes yet</p>
                            <p className="text-sm">Join a class using a class code to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
