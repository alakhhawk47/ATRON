import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-white font-body">
            {/* Top Nav */}
            <nav className="fixed top-0 w-full z-50 bg-neutral-950/60 backdrop-blur-xl border-b border-neutral-800/50 flex items-center justify-between px-6 py-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
                <div className="flex items-center gap-4">
                    <button
                        data-testid="mobile-menu-toggle"
                        className="lg:hidden p-2 rounded-lg hover:bg-neutral-800/50 transition-colors"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <span className="material-symbols-outlined text-xl">{sidebarOpen ? "close" : "menu"}</span>
                    </button>
                    <span className="text-2xl font-black tracking-tighter text-cyan-400 font-headline lg:hidden">ATRON</span>
                    <div className="hidden lg:flex items-center gap-6 text-sm">
                        <span className="text-neutral-400">
                            Welcome, <span className="text-cyan-400 font-bold">{user?.name?.split(' ')[0]}</span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg hover:bg-neutral-800/50 transition-colors relative">
                        <span className="material-symbols-outlined text-xl text-neutral-400">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-neutral-800/50 transition-colors">
                        <span className="material-symbols-outlined text-xl text-neutral-400">settings</span>
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-cyan-400/20 flex items-center justify-center text-sm font-bold text-cyan-400">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                </div>
            </nav>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-64 h-full">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-24 px-6 pb-12 min-h-screen relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-[5%] left-[10%] w-[300px] h-[300px] bg-red-500/3 rounded-full blur-[100px] -z-10" />
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
