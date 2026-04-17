export default function PageHeader({ title, subtitle, children }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
                <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight text-[#1A1A2E]">{title}</h1>
                {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    );
}
