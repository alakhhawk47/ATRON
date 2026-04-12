import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const teacherLinks = [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/classes/create", icon: "school", label: "Courses" },
    { to: "/reports", icon: "assessment", label: "Reports" },
    { to: "/analytics", icon: "analytics", label: "Analytics" },
];

const studentLinks = [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/classes/join", icon: "school", label: "Courses" },
    { to: "/analytics", icon: "analytics", label: "Analytics" },
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
        <aside data-testid="sidebar-nav" className="w-64 h-full theme-sidebar shadow-2xl flex flex-col pt-24">
            {/* Logo */}
            <div className="px-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tighter theme-primary font-headline">ATRON</span>
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-bold tracking-wider">v2.0</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1 uppercase tracking-wider">{user?.role === "teacher" ? "Faculty Portal" : "Student Portal"}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        end={link.to === "/dashboard"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                            }`
                        }
                    >
                        <span className="material-symbols-outlined text-xl">{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Action Button */}
            <div className="px-4 pb-4">
                {user?.role === "teacher" ? (
                    <button
                        data-testid="sidebar-start-session"
                        onClick={() => { onClose?.(); navigate("/classes/create"); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl theme-btn-primary text-sm active:scale-[0.98] duration-200"
                    >
                        <span className="material-symbols-outlined text-lg">qr_code</span>
                        Start QR Session
                    </button>
                ) : (
                    <button
                        data-testid="sidebar-checkin"
                        onClick={() => { onClose?.(); navigate("/classes/join"); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl theme-btn-primary text-sm active:scale-[0.98] duration-200"
                    >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Check In Now
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 space-y-1">
                <div className="flex items-center gap-3 px-4 py-3">
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}
