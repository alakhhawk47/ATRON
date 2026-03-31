import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, StopCircle, Users, CheckCircle, Clock, ArrowLeft } from "lucide-react";

export default function AttendanceSession() {
    const { classId } = useParams();
    const { state } = useLocation();
    const { api } = useAuth();
    const navigate = useNavigate();
    const [session, setSession] = useState(state?.session || null);
    const [loading, setLoading] = useState(!state?.session);
    const [ending, setEnding] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    const loadSession = useCallback(async () => {
        try {
            const { data } = await api.get(`/attendance/sessions/active/${classId}`);
            if (data.active) setSession(data);
            else setSession(null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [api, classId]);

    useEffect(() => {
        if (!session) loadSession();
    }, [session, loadSession]);

    // Poll for new attendance records
    useEffect(() => {
        if (!session?.id) return;
        const interval = setInterval(async () => {
            try {
                const { data } = await api.get(`/attendance/sessions/${session.id}`);
                setSession(prev => ({ ...prev, records: data.records, present_count: data.present_count, total_students: data.total_students }));
            } catch {}
        }, 5000);
        return () => clearInterval(interval);
    }, [session?.id, api]);

    // Timer
    useEffect(() => {
        if (!session?.started_at) return;
        const start = new Date(session.started_at).getTime();
        const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
        return () => clearInterval(timer);
    }, [session?.started_at]);

    const endSession = async () => {
        setEnding(true);
        try {
            await api.put(`/attendance/sessions/${session.id}/end`);
            navigate("/dashboard");
        } catch (e) {
            alert(e.response?.data?.detail || "Failed to end session");
        } finally {
            setEnding(false);
        }
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    if (!session) {
        return (
            <div className="max-w-lg mx-auto py-12 text-center">
                <p className="text-muted-foreground mb-4">No active session for this class.</p>
                <Button onClick={() => navigate("/dashboard")} variant="outline" className="rounded-xl border-[#2a2a2a]">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
            </div>
        );
    }

    const records = session.records || [];
    const presentCount = session.present_count || records.length;
    const totalStudents = session.total_students || 0;
    const absentCount = totalStudents - presentCount;

    return (
        <div data-testid="attendance-session" className="space-y-6">
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Code Panel */}
                <div className="glass-card rounded-[2rem] p-8 border border-[#1a1a1a] flex flex-col items-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary mb-4">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> LIVE SESSION
                    </div>
                    <h3 className="font-headline text-lg font-bold mb-1">{session.class_name || "Class"}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                        <Clock className="w-4 h-4" /> {formatTime(elapsed)}
                    </div>

                    {/* QR Code */}
                    <div data-testid="qr-code-display" className="bg-white rounded-2xl p-4 mb-6">
                        <QRCodeSVG value={session.qr_data || ""} size={200} level="H" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mb-6">Students scan this QR code to mark their attendance</p>

                    <Button
                        data-testid="end-session-btn"
                        onClick={endSession}
                        disabled={ending}
                        variant="destructive"
                        className="w-full rounded-xl py-5 font-bold"
                    >
                        {ending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><StopCircle className="w-5 h-5 mr-2" /> End Session</>}
                    </Button>
                </div>

                {/* Live Check-in Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-card rounded-2xl p-5 text-center border border-[#1a1a1a]">
                            <p data-testid="present-count" className="text-4xl font-headline font-extrabold text-primary">{presentCount}</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Present</p>
                        </div>
                        <div className="glass-card rounded-2xl p-5 text-center border border-[#1a1a1a]">
                            <p className="text-4xl font-headline font-extrabold text-destructive">{absentCount}</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Not Yet</p>
                        </div>
                        <div className="glass-card rounded-2xl p-5 text-center border border-[#1a1a1a]">
                            <p className="text-4xl font-headline font-extrabold text-secondary">{totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}%</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Rate</p>
                        </div>
                    </div>

                    {/* Live Feed */}
                    <div className="glass-card rounded-[2rem] p-6 border border-[#1a1a1a]">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-headline text-lg font-bold">Live Check-ins</h3>
                                <p className="text-xs text-muted-foreground">Updates every 5 seconds</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-primary font-bold">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> LIVE
                            </div>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                            {records.map((record, i) => (
                                <div key={i} data-testid={`checkin-${i}`} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            {record.student_name?.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{record.student_name}</p>
                                            <p className="text-[10px] text-muted-foreground">{new Date(record.marked_at).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-primary" />
                                </div>
                            ))}
                            {records.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Waiting for students to check in...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
