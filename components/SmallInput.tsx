import React from 'react';

interface SmallInputProps {
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
}

export const SmallInput = ({ value, onChange, placeholder }: SmallInputProps) => (
    <div className="ml-2 flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-gray-400 uppercase">FL:</span>
        <input
            type="number" inputMode="numeric" min="1" max="10"
            className="w-10 h-8 text-center text-xs font-bold rounded-xl outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder={placeholder} value={value || ""} onChange={e => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        />
    </div>
);
