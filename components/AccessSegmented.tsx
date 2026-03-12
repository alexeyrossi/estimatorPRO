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
        <div className="relative w-full rounded-2xl bg-gray-50 hover:bg-gray-100 border-transparent p-1 flex items-center transition-colors">
            <div className="absolute top-1 bottom-1 rounded-xl bg-white border border-gray-200 transition-transform duration-300 ease-out" style={{ width: `calc((100% - 8px) / 3)`, transform: `translateX(${idx * 100}%)` }} />
            <div className="relative z-10 grid grid-cols-3 gap-1 w-full">
                {options.map((opt) => (
                    <button key={opt.id} type="button" onClick={() => onChange(opt.id as typeof value)} className={`h-8 rounded-xl flex items-center justify-center gap-1.5 px-1 text-[11px] font-bold transition-colors duration-200 ${opt.id === value ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                        <opt.icon className={`w-3.5 h-3.5 shrink-0 ${opt.id === value ? "text-blue-600" : "text-current"}`} /><span className="leading-none truncate">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
