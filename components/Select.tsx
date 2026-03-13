import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    disabled?: boolean;
}

export const Select = ({ id, value, onChange, options, disabled }: SelectProps) => (
    <div className="relative">
        <select id={id} value={value} onChange={onChange} disabled={disabled} className={`w-full appearance-none rounded-2xl border border-transparent bg-slate-50 px-4 py-3.5 text-base font-semibold text-slate-900 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-0 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
            {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {!disabled && <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><ChevronDown className="w-4 h-4" /></div>}
    </div>
);
