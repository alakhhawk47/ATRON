import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import TeacherDashboard from "@/pages/TeacherDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import CreateClass from "@/pages/CreateClass";
import JoinClass from "@/pages/JoinClass";
import AttendanceSession from "@/pages/AttendanceSession";
import MarkAttendance from "@/pages/MarkAttendance";
import ClassManagement from "@/pages/ClassManagement";
import ReportsPage from "@/pages/ReportsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import DashboardLayout from "@/components/DashboardLayout";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function Dashboard() {
    const { user } = useAuth();
    if (user?.role === "teacher") return <TeacherDashboard />;
    return <StudentDashboard />;
}

function AppRoutes() {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
            <Route path="/attendance/mark/:sessionId" element={<MarkAttendance />} />
            <Route path="/mark-attendance/:sessionId" element={<MarkAttendance />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/classes/create" element={<ProtectedRoute><DashboardLayout><CreateClass /></DashboardLayout></ProtectedRoute>} />
            <Route path="/classes/join" element={<ProtectedRoute><DashboardLayout><JoinClass /></DashboardLayout></ProtectedRoute>} />
            <Route path="/classes/:classId" element={<ProtectedRoute><DashboardLayout><ClassManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path="/attendance/:classId" element={<ProtectedRoute><DashboardLayout><AttendanceSession /></DashboardLayout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><DashboardLayout><ReportsPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/reports/:classId" element={<ProtectedRoute><DashboardLayout><ReportsPage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><AnalyticsPage /></DashboardLayout></ProtectedRoute>} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
