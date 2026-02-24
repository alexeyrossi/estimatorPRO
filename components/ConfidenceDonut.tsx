'use client';
import { useState, useEffect, useRef } from 'react';

export const ConfidenceDonut = ({ score, label }: { score: number; label: string }) => {
    const size = 72;
    const stroke = 5;
    const radius = 31;
    const circumference = 2 * Math.PI * radius;

    const [displayScore, setDisplayScore] = useState(0);
    const [dashOffset, setDashOffset] = useState(circumference);
    const prevScore = useRef(0);
    const rafRef = useRef<number>(0);

    const colors = label === "High"
        ? { ring: "#34D399", glow: "rgba(52,211,153,0.3)", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" }
        : label === "Medium"
            ? { ring: "#FBBF24", glow: "rgba(251,191,36,0.3)", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" }
            : { ring: "#F87171", glow: "rgba(248,113,113,0.3)", text: "text-red-700", bg: "bg-red-50", border: "border-red-200" };

    useEffect(() => {
        const from = prevScore.current;
        const to = Math.max(0, Math.min(100, score));
        prevScore.current = to;

        const duration = 1200;
        let start: number | null = null;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);

            // Apple-style spring easing (ease-out with slight overshoot)
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const current = Math.round(from + (to - from) * eased);
            setDisplayScore(current);

            const targetOffset = circumference - (current / 100) * circumference;
            setDashOffset(targetOffset);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [score, circumference]);

    return (
        <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    className="relative transform -rotate-90 overflow-visible"
                    style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
                >
                    {/* Background track */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke="#F3F4F6"
                        strokeWidth={stroke}
                    />
                    {/* Animated progress ring */}
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={colors.ring}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{
                            transition: 'none', /* we animate via RAF, not CSS */
                        }}
                    />
                </svg>
                {/* Center number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[16px] font-black text-gray-800 tabular-nums">
                        {displayScore}
                    </span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Confidence
                </span>
                <span className={`inline-block px-3 py-1 rounded-xl text-[11px] font-bold ${colors.text} ${colors.bg}`}>
                    {label} Score
                </span>
            </div>
        </div>
    );
};
