'use client';
import React, { useState, useEffect, useRef, useId, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

const TOOLTIP_WIDTH = 224;
const TOOLTIP_GAP = 8;
const VIEWPORT_PADDING = 16;

type TooltipPosition = {
    top: number;
    left: number;
    width: number;
};

export const ConfidenceDonut = ({
    score,
    label,
    factors,
}: {
    score: number;
    label: string;
    factors: string[];
}) => {
    const size = 72;
    const stroke = 5;
    const radius = 31;
    const circumference = 2 * Math.PI * radius;

    const [displayScore, setDisplayScore] = useState(0);
    const [dashOffset, setDashOffset] = useState(circumference);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [supportsHover, setSupportsHover] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
    const prevScore = useRef(0);
    const rafRef = useRef<number>(0);
    const tooltipRootRef = useRef<HTMLDivElement | null>(null);
    const tooltipTriggerRef = useRef<HTMLButtonElement | null>(null);
    const tooltipCardRef = useRef<HTMLDivElement | null>(null);
    const tooltipId = useId();

    const colors = label === "High"
        ? {
            ring: "#34D399",
            text: "text-emerald-700",
            bg: "bg-emerald-50",
            headingText: "text-emerald-700",
            iconText: "text-emerald-600",
            iconHoverBg: "hover:bg-emerald-50 focus:bg-emerald-50",
            iconHoverText: "hover:text-emerald-700 focus:text-emerald-700",
        }
        : label === "Medium"
            ? {
                ring: "#FBBF24",
                text: "text-amber-700",
                bg: "bg-amber-50",
                headingText: "text-amber-700",
                iconText: "text-amber-600",
                iconHoverBg: "hover:bg-amber-50 focus:bg-amber-50",
                iconHoverText: "hover:text-amber-700 focus:text-amber-700",
            }
            : {
                ring: "#F87171",
                text: "text-red-700",
                bg: "bg-red-50",
                headingText: "text-red-700",
                iconText: "text-red-600",
                iconHoverBg: "hover:bg-red-50 focus:bg-red-50",
                iconHoverText: "hover:text-red-700 focus:text-red-700",
            };
    const tooltipSummary = label === "High"
        ? "Mostly direct inventory matches."
        : label === "Medium"
            ? "Some inventory details were inferred."
            : "Several inventory details were inferred.";
    const tooltipFactors = (Array.isArray(factors) && factors.length > 0
        ? factors
        : ["Most items were recognized directly from the inventory."]
    ).slice(0, 3);

    const updateTooltipPosition = useCallback(() => {
        if (typeof window === 'undefined' || !tooltipTriggerRef.current) return;

        const triggerRect = tooltipTriggerRef.current.getBoundingClientRect();
        const tooltipWidth = Math.min(
            TOOLTIP_WIDTH,
            Math.max(0, window.innerWidth - VIEWPORT_PADDING * 2)
        );
        const tooltipHeight = tooltipCardRef.current?.getBoundingClientRect().height ?? 0;
        const centeredLeft = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        const maxLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - VIEWPORT_PADDING - tooltipWidth);
        const left = Math.min(Math.max(VIEWPORT_PADDING, centeredLeft), maxLeft);
        const belowTop = triggerRect.bottom + TOOLTIP_GAP;
        const aboveTop = triggerRect.top - TOOLTIP_GAP - tooltipHeight;
        let top = belowTop;

        if (
            tooltipHeight > 0
            && belowTop + tooltipHeight > window.innerHeight - VIEWPORT_PADDING
            && aboveTop >= VIEWPORT_PADDING
        ) {
            top = aboveTop;
        } else if (tooltipHeight > 0) {
            top = Math.min(
                Math.max(VIEWPORT_PADDING, belowTop),
                Math.max(VIEWPORT_PADDING, window.innerHeight - VIEWPORT_PADDING - tooltipHeight)
            );
        }

        setTooltipPosition((current) => (
            current
            && current.top === top
            && current.left === left
            && current.width === tooltipWidth
                ? current
                : { top, left, width: tooltipWidth }
        ));
    }, []);

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

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        const syncSupport = () => setSupportsHover(mediaQuery.matches);

        syncSupport();

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', syncSupport);
            return () => mediaQuery.removeEventListener('change', syncSupport);
        }

        mediaQuery.addListener(syncSupport);
        return () => mediaQuery.removeListener(syncSupport);
    }, []);

    useLayoutEffect(() => {
        if (!tooltipOpen) return;
        updateTooltipPosition();
    }, [tooltipFactors.length, tooltipOpen, tooltipSummary, updateTooltipPosition]);

    useEffect(() => {
        if (!tooltipOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (
                !tooltipRootRef.current?.contains(target)
                && !tooltipCardRef.current?.contains(target)
            ) {
                setTooltipOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setTooltipOpen(false);
            }
        };

        const handlePositionChange = () => {
            updateTooltipPosition();
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handlePositionChange);
        window.addEventListener('scroll', handlePositionChange, true);
        window.visualViewport?.addEventListener('resize', handlePositionChange);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handlePositionChange);
            window.removeEventListener('scroll', handlePositionChange, true);
            window.visualViewport?.removeEventListener('resize', handlePositionChange);
        };
    }, [tooltipOpen, updateTooltipPosition]);

    const tooltipPortal = tooltipOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
                ref={tooltipCardRef}
                id={tooltipId}
                role="tooltip"
                className="fixed z-[80] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
                style={tooltipPosition
                    ? {
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        width: tooltipPosition.width,
                    }
                    : {
                        top: 0,
                        left: 0,
                        width: TOOLTIP_WIDTH,
                        visibility: 'hidden',
                    }}
                onMouseEnter={() => {
                    if (supportsHover) setTooltipOpen(true);
                }}
                onMouseLeave={(event) => {
                    if (
                        supportsHover
                        && !tooltipRootRef.current?.contains(event.relatedTarget as Node | null)
                    ) {
                        setTooltipOpen(false);
                    }
                }}
            >
                <div className="text-[11px] font-bold text-slate-800">
                    {tooltipSummary}
                </div>
                <div className="mt-2 space-y-1.5">
                    {tooltipFactors.map((factor) => (
                        <div key={factor} className="text-[11px] font-medium leading-relaxed text-slate-600">
                            {factor}
                        </div>
                    ))}
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <div className="flex items-center justify-center gap-3 sm:justify-start sm:gap-5">
                <div className="relative h-[60px] w-[60px] flex-shrink-0 sm:h-[72px] sm:w-[72px]">
                    <svg
                        viewBox={`0 0 ${size} ${size}`}
                        width={size}
                        height={size}
                        className="relative h-full w-full transform -rotate-90 overflow-visible"
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
                        <span className="text-[15px] font-black text-slate-900 tabular-nums sm:text-[16px]">
                            {displayScore}
                        </span>
                    </div>
                </div>
                <div className="flex min-w-0 flex-col items-center text-center sm:items-start sm:text-left">
                    <div
                        ref={tooltipRootRef}
                        className="mb-1.5 flex items-center justify-center gap-1.5 sm:justify-start"
                        onMouseEnter={() => {
                            if (supportsHover) setTooltipOpen(true);
                        }}
                        onMouseLeave={(event) => {
                            if (
                                supportsHover
                                && !tooltipCardRef.current?.contains(event.relatedTarget as Node | null)
                            ) {
                                setTooltipOpen(false);
                            }
                        }}
                        onBlur={(event) => {
                            const nextTarget = event.relatedTarget as Node | null;
                            if (
                                !event.currentTarget.contains(nextTarget)
                                && !tooltipCardRef.current?.contains(nextTarget)
                            ) {
                                setTooltipOpen(false);
                            }
                        }}
                    >
                        <span className={`text-[10px] font-semibold uppercase tracking-widest ${colors.headingText}`}>
                            Confidence
                        </span>
                        <button
                            ref={tooltipTriggerRef}
                            type="button"
                            aria-label="Why this confidence score"
                            aria-describedby={tooltipOpen ? tooltipId : undefined}
                            aria-expanded={tooltipOpen}
                            className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors focus:outline-none ${colors.iconText} ${colors.iconHoverBg} ${colors.iconHoverText}`}
                            onFocus={() => {
                                if (supportsHover) setTooltipOpen(true);
                            }}
                            onClick={() => {
                                if (supportsHover) {
                                    setTooltipOpen(true);
                                    return;
                                }

                                setTooltipOpen((current) => !current);
                            }}
                        >
                            <Info className="h-3.5 w-3.5" strokeWidth={2.25} />
                        </button>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-xl text-[11px] font-bold ${colors.text} ${colors.bg}`}>
                        {label} Score
                    </span>
                </div>
            </div>
            {tooltipPortal}
        </>
    );
};
