export default function StatusBadge({ status, className = "" }) {
    const styles = {
        "on-track": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "at-risk": "bg-red-50 text-red-600 border-red-200",
        "active": "bg-[#6D5AC1]/10 text-[#6D5AC1] border-[#6D5AC1]/20",
        "present": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "absent": "bg-red-50 text-red-600 border-red-200",
        "verified": "bg-[#6D5AC1]/10 text-[#6D5AC1] border-[#6D5AC1]/20",
        "flagged": "bg-amber-50 text-amber-700 border-amber-200",
    };

    const labels = {
        "on-track": { icon: "check_circle", text: "On Track" },
        "at-risk": { icon: "warning", text: "At Risk" },
        "active": { icon: "radio_button_checked", text: "Active" },
        "present": { icon: "check_circle", text: "Present" },
        "absent": { icon: "cancel", text: "Absent" },
        "verified": { icon: "verified", text: "Verified" },
        "flagged": { icon: "flag", text: "Flagged" },
    };

    const style = styles[status] || styles["active"];
    const label = labels[status] || { icon: "info", text: status };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${style} ${className}`}>
            <span className="material-symbols-outlined text-xs">{label.icon}</span>
            {label.text}
        </span>
    );
}
