import React from 'react';
import { Move, ArrowUpFromLine, AlignStartVertical } from 'lucide-react';

interface AccessSegmentedProps {
    value: "ground" | "elevator" | "stairs";
    onChange: (val: "ground" | "elevator" | "stairs") => void;
}

export const AccessSegmented = ({ value, onChange }: AccessSegmentedProps) => {
    const options = [{ id: "ground", label: "Ground", icon: Move }, { id: "elevator", label: "Elevator", icon: ArrowUpFromLine }, { id: "stairs", label: "Stairs", icon: AlignStartVertical }] as const;
    const idx = Math.max(0, options.findIndex((o) => o.id === value));
    return (
        <div className="relative flex w-full items-center rounded-2xl bg-slate-50 p-1 transition-colors hover:bg-slate-100">
            <div className="absolute top-1 bottom-1 rounded-xl border border-slate-200 bg-white transition-transform duration-300 ease-out" style={{ width: `calc((100% - 8px) / 3)`, transform: `translateX(${idx * 100}%)` }} />
            <div className="relative z-10 grid grid-cols-3 gap-1 w-full">
                {options.map((opt) => (
                    <button key={opt.id} type="button" onClick={() => onChange(opt.id as typeof value)} className={`flex h-8 items-center justify-center gap-1.5 rounded-xl px-1 text-[11px] font-bold transition-colors duration-200 ${opt.id === value ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
                        <opt.icon className={`h-3.5 w-3.5 shrink-0 ${opt.id === value ? "text-blue-600" : "text-current"}`} /><span className="leading-none truncate">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
