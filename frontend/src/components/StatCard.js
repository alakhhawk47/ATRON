export default function StatCard({ icon, value, label, color = "primary", border, className = "" }) {
    const colorMap = {
        primary: { text: "text-[#6D5AC1]", bg: "bg-[#6D5AC1]/10", borderC: "border-[#6D5AC1]/15" },
        secondary: { text: "text-[#C9A84C]", bg: "bg-[#C9A84C]/10", borderC: "border-[#C9A84C]/15" },
        success: { text: "text-emerald-600", bg: "bg-emerald-50", borderC: "border-emerald-200" },
        destructive: { text: "text-red-500", bg: "bg-red-50", borderC: "border-red-200" },
    };
    const c = colorMap[color] || colorMap.primary;

    return (
        <div className={`bg-white rounded-2xl p-5 sm:p-6 border ${border || c.borderC} shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-xl ${c.text}`}>{icon}</span>
                </div>
                <span className="material-symbols-outlined text-gray-300 hidden sm:block">more_horiz</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-headline font-extrabold ${c.text}`}>{value}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{label}</p>
        </div>
    );
}
