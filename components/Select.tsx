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
        <select id={id} value={value} onChange={onChange} disabled={disabled} className={`w-full appearance-none rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
            {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {!disabled && <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"><ChevronDown className="w-4 h-4" /></div>}
    </div>
);
