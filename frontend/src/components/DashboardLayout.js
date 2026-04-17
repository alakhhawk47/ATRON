import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground font-body">
            {/* Top Nav */}
            <nav className="fixed top-0 w-full z-50 theme-nav flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-4">
                    <button
                        data-testid="mobile-menu-toggle"
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <span className="material-symbols-outlined text-xl text-gray-600">{sidebarOpen ? "close" : "menu"}</span>
                    </button>
                    <span className="text-2xl font-black tracking-tighter text-[#6D5AC1] font-headline lg:hidden">ATRON</span>
                    <div className="hidden lg:flex items-center gap-6 text-sm">
                        <span className="text-gray-500">
                            Welcome, <span className="text-[#6D5AC1] font-bold">{user?.name?.split(' ')[0]}</span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
                        <span className="material-symbols-outlined text-xl text-gray-500">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6D5AC1] rounded-full" />
                    </button>
                    <button className="hidden sm:block p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-xl text-gray-500">settings</span>
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-[#6D5AC1]/10 flex items-center justify-center text-sm font-bold text-[#6D5AC1]">
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
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-64 h-full">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-20 sm:pt-24 px-4 sm:px-6 pb-12 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
