import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
    sub?: string;
    variant?: "red" | "blue" | "orange" | "emerald" | "purple" | "gray";
    isCritical?: boolean;
    advice?: string | null;
}

export const MetricCard = ({ icon: Icon, label, value, sub, variant = "gray", isCritical, advice }: MetricCardProps) => {
    const style = isCritical ? { bg: "bg-red-500", light: "bg-red-50", text: "text-red-600" } :
        (variant === "red" ? { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50" } :
            variant === "blue" ? { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" } :
                variant === "orange" ? { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" } :
                    variant === "emerald" ? { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" } :
                        variant === "purple" ? { bg: "bg-purple-500", text: "text-purple-600", light: "bg-purple-50" } :
                            { bg: "bg-slate-500", text: "text-slate-600", light: "bg-slate-50" });

    return (
        <div className={`relative min-w-0 overflow-hidden px-4 py-4 sm:px-6 sm:py-4.5 rounded-[1.5rem] bg-white min-h-[120px] flex flex-col justify-center h-full transition-all duration-300 group hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${isCritical ? 'bg-red-50/30' : ''}`}>
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 ${style.bg}`} />

            <div className="relative z-10 flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isCritical ? 'bg-red-100 text-red-600' : `${style.light} ${style.text}`}`}><Icon className="w-4 h-4" /></div>
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${isCritical ? 'text-red-500' : 'text-slate-600'}`}>{label}</span>
            </div>
            <div className="relative z-10 mt-4 min-w-0">
                <div className={`min-w-0 text-xl sm:text-2xl font-black tracking-tight leading-tight tabular-nums ${isCritical ? 'text-red-800' : 'text-slate-900'}`}>{value}</div>
                {sub && <div className={`mt-1 text-[11px] font-semibold leading-snug sm:truncate ${isCritical ? 'text-red-600' : 'text-slate-500'}`}>{sub}</div>}
                {advice && <div className="mt-2 inline-flex items-center whitespace-nowrap rounded-lg border border-emerald-100 bg-emerald-50 px-1.5 py-1 text-[9px] leading-tight font-semibold text-emerald-700 sm:px-2 sm:text-[10px]">{advice}</div>}
            </div>
        </div>
    );
};
