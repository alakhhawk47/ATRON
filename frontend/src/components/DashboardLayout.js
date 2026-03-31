import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, X, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-64 h-full">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-[#1a1a1a] px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                data-testid="mobile-menu-toggle"
                                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <div>
                                <h2 className="font-headline text-lg font-bold">
                                    Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                            </button>
                            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="p-6 max-w-7xl mx-auto">{children}</main>
            </div>
        </div>
    );
}
