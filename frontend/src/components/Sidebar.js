import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, BookOpen, CalendarCheck, FileBarChart, BarChart3, LogOut, Plus, UserPlus } from "lucide-react";

const teacherLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/classes/create", icon: Plus, label: "Create Class" },
    { to: "/reports", icon: FileBarChart, label: "Reports" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

const studentLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/classes/join", icon: UserPlus, label: "Join Class" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Sidebar({ onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const links = user?.role === "teacher" ? teacherLinks : studentLinks;

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <aside data-testid="sidebar-nav" className="w-64 h-full bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col">
            <div className="p-6 border-b border-[#1a1a1a]">
                <h1 className="font-headline text-2xl font-extrabold tracking-tight">
                    <span className="text-gradient-primary">ATRON</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Smart Attendance</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`
                        }
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    data-testid="logout-button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
