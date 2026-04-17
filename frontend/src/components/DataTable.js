export default function DataTable({ columns, data, emptyIcon = "table_rows", emptyText = "No data available" }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`py-3.5 px-5 text-left text-[10px] uppercase tracking-widest font-bold text-gray-400 ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-[#FAF8F0]/60 transition-colors">
                                {columns.map((col, j) => (
                                    <td key={j} className={`py-3.5 px-5 text-sm ${col.cellClassName || ""}`}>
                                        {col.render ? col.render(row, i) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">{emptyIcon}</span>
                        <p>{emptyText}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
