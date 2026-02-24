import React from 'react';

export const GlassPanel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[2rem] ${className}`}>
        {children}
    </div>
);
