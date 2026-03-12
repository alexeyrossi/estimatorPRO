import React, { useMemo, useState, useEffect, useRef } from 'react';
import { EstimateInputs, EstimateResult } from '@/lib/types/estimator';
import { OVERRIDE_KEYS, sanitizeOverrides } from '@/lib/estimatePolicy';
import { buildReportSummaryNotes } from '@/lib/reportNotes';
import {
    Truck, Box, List, Weight, Terminal, ChevronRight, Lock, Scale, PackageOpen, Clock, CalendarDays, Info, Users, AlertTriangle, ArrowUpFromLine, ArrowLeft, Check, Clipboard, Loader2, SlidersVertical
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { MetricCard } from './MetricCard';
import { ConfidenceDonut } from './ConfidenceDonut';



const AnimatedNumber = ({ value: rawValue, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
    const value = rawValue || 0;
    const [display, setDisplay] = useState(value);
    const prevValue = useRef(value);
    const rafId = useRef(0);
    const firstRender = useRef(true);

    useEffect(() => {
        const safeValue = rawValue || 0;

        // Fix warning: avoid calling setState if this is truly the first render where nothing changed
        if (firstRender.current) {
            firstRender.current = false;
            prevValue.current = safeValue;
            if (display !== safeValue) setDisplay(safeValue);
            return;
        }

        const from = prevValue.current;
        const to = safeValue;
        prevValue.current = to;

        if (from === to) return;

        const duration = 600;
        let startTime: number | null = null;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplay(Math.round(from + (to - from) * eased));

            if (progress < 1) {
                rafId.current = requestAnimationFrame(step);
            }
        };

        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawValue]);

    return <>{prefix}{(display ?? 0).toLocaleString()}{suffix}</>;
};

const measureElementHeight = (node: HTMLDivElement | null) => {
    if (!node) return null;
    return Math.ceil(node.getBoundingClientRect().height);
};

interface ReportPanelProps {
    estimate: EstimateResult;
    inputs: EstimateInputs;
    isCalculating: boolean;
    reportView: "summary" | "inventory" | "details";
    setReportView: (view: "summary" | "inventory" | "details") => void;
    handleCopy: () => void;
    copyStatus: "idle" | "success";
    clientName: string;
    setClientName: (v: string) => void;
    handleSaveEstimate: () => void;
    isSaving: boolean;
    saveErrorMessage: string | null;
    saveStatus: "idle" | "success" | "error";
    overrides: Record<string, string>;
    setOverrides: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    clearOverrides: () => void;
    handleDownloadPdf: () => void;
    isGeneratingPdf: boolean;
    detectedItemCount: number;
    rawInventoryVolume: number;
}

export const ReportPanel = ({
    estimate,
    inputs,
    isCalculating,
    reportView,
    setReportView,
    handleCopy,
    copyStatus,
    clientName,
    setClientName,
    handleSaveEstimate,
    isSaving,
    saveErrorMessage,
    saveStatus,
    overrides,
    setOverrides,
    clearOverrides,
    handleDownloadPdf,
    isGeneratingPdf,
    detectedItemCount,
    rawInventoryVolume,
}: ReportPanelProps) => {

    const isLabor = inputs.moveType === "Labor";
    const hasUsableEstimate = typeof estimate.finalVolume === "number" && estimate.finalVolume > 0;
    const [displayedReportView, setDisplayedReportView] = useState(reportView);
    const [reportViewPhase, setReportViewPhase] = useState<"idle" | "leaving" | "entering">("idle");
    const [contentViewportHeight, setContentViewportHeight] = useState<number | null>(null);
    const [activeContentNode, setActiveContentNode] = useState<HTMLDivElement | null>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const swapTimerRef = useRef<number | null>(null);
    const enterFrameRef = useRef<number | null>(null);
    const resizeFrameRef = useRef<number | null>(null);
    const softActionButtonTransition = {
        transitionProperty: "transform, background-color, color",
        transitionDuration: "150ms, 200ms, 200ms",
        transitionTimingFunction: "ease-out",
    } as const;
    const toggleReportView = (view: "inventory" | "details") => {
        setReportView(reportView === view ? "summary" : view);
    };

    const formatMetric = (val: React.ReactNode | number, unit: string) => (
        <span className="tabular-nums inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:flex-nowrap">
            <span>{typeof val === 'number' ? val.toLocaleString() : (val || 0)}</span>
            <span className="text-[12px] sm:text-[13px] font-bold text-gray-400 lowercase tracking-normal">
                {unit}
            </span>
        </span>
    );

    const primaryVolume = inputs.moveType === "LD" && estimate.billableCF ? estimate.billableCF : estimate.finalVolume;
    const primaryVolumeLabel = "Volume";
    const primaryVolumeSub = inputs.moveType === "LD" && estimate.billableCF ? "Adjusted Estimate" : "Based on Inventory";
    const overrideAutoValues = {
        volume: estimate.finalVolume,
        trucks: estimate.trucksFinal,
        crew: estimate.crew,
        blankets: estimate.materials?.blankets,
        boxes: estimate.materials?.boxes,
        wardrobes: estimate.materials?.wardrobes,
    };
    const { compactAuditSummary, actionableAdvice } = useMemo(
        () => buildReportSummaryNotes(estimate.auditSummary, estimate.advice, estimate.truckFitNote),
        [estimate.auditSummary, estimate.advice, estimate.truckFitNote]
    );

    const heavyItems = useMemo(
        () => estimate.heavyItemNames || [],
        [estimate.heavyItemNames]
    );
    const hasManualOverrideValues = useMemo(
        () => Object.keys(sanitizeOverrides(overrides)).length > 0,
        [overrides]
    );

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

        syncPreference();

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", syncPreference);
            return () => mediaQuery.removeEventListener("change", syncPreference);
        }

        mediaQuery.addListener(syncPreference);
        return () => mediaQuery.removeListener(syncPreference);
    }, []);

    useEffect(() => {
        if (reportView === displayedReportView) return;

        if (swapTimerRef.current !== null) {
            window.clearTimeout(swapTimerRef.current);
            swapTimerRef.current = null;
        }
        if (enterFrameRef.current !== null) {
            window.cancelAnimationFrame(enterFrameRef.current);
            enterFrameRef.current = null;
        }

        if (prefersReducedMotion) {
            enterFrameRef.current = window.requestAnimationFrame(() => {
                setDisplayedReportView(reportView);
                setReportViewPhase("idle");
                enterFrameRef.current = null;
            });
            return;
        }

        enterFrameRef.current = window.requestAnimationFrame(() => {
            setReportViewPhase("leaving");
            enterFrameRef.current = null;
            swapTimerRef.current = window.setTimeout(() => {
                setDisplayedReportView(reportView);
                setReportViewPhase("entering");
                swapTimerRef.current = null;
            }, 120);
        });

        return () => {
            if (swapTimerRef.current !== null) {
                window.clearTimeout(swapTimerRef.current);
                swapTimerRef.current = null;
            }
            if (enterFrameRef.current !== null) {
                window.cancelAnimationFrame(enterFrameRef.current);
                enterFrameRef.current = null;
            }
        };
    }, [displayedReportView, prefersReducedMotion, reportView]);

    useEffect(() => {
        if (reportViewPhase !== "entering" || prefersReducedMotion) return;

        enterFrameRef.current = window.requestAnimationFrame(() => {
            const nextHeight = measureElementHeight(activeContentNode);
            if (nextHeight != null) {
                setContentViewportHeight((prev) => prev === nextHeight ? prev : nextHeight);
            }
            setReportViewPhase("idle");
            enterFrameRef.current = null;
        });

        return () => {
            if (enterFrameRef.current !== null) {
                window.cancelAnimationFrame(enterFrameRef.current);
                enterFrameRef.current = null;
            }
        };
    }, [activeContentNode, prefersReducedMotion, reportViewPhase]);

    useEffect(() => {
        if (!activeContentNode) return;

        const syncHeight = () => {
            const nextHeight = measureElementHeight(activeContentNode);
            if (nextHeight != null) {
                setContentViewportHeight((prev) => prev === nextHeight ? prev : nextHeight);
            }
        };

        syncHeight();

        if (typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(() => {
            if (resizeFrameRef.current !== null) {
                window.cancelAnimationFrame(resizeFrameRef.current);
            }

            resizeFrameRef.current = window.requestAnimationFrame(() => {
                syncHeight();
                resizeFrameRef.current = null;
            });
        });

        observer.observe(activeContentNode);

        return () => {
            observer.disconnect();
            if (resizeFrameRef.current !== null) {
                window.cancelAnimationFrame(resizeFrameRef.current);
                resizeFrameRef.current = null;
            }
        };
    }, [activeContentNode]);

    const framedReportBodyClass = "h-[calc(57dvh-3.25rem)] min-h-[338px] max-h-[468px] md:h-[492px] md:min-h-[492px] md:max-h-[492px]";
    const isDisplayedInventory = displayedReportView === "inventory";
    const isDisplayedDetails = displayedReportView === "details";
    const activeReportBodyClass = displayedReportView === "summary"
        ? "h-auto"
        : `${framedReportBodyClass} overflow-hidden`;
    const reportMotionStyle: React.CSSProperties = reportViewPhase === "leaving"
        ? {
            opacity: 0,
            transform: "translateY(-4px)",
        }
        : reportViewPhase === "entering"
            ? {
                opacity: 0,
                transform: "translateY(6px)",
            }
            : {
                opacity: isCalculating ? 0.6 : 1,
                transform: "translateY(0px)",
            };
    const reportViewportStyle: React.CSSProperties = {
        height: contentViewportHeight != null ? `${contentViewportHeight}px` : undefined,
        transition: "height 220ms ease-out",
    };

    const detailsTopControl = (
        <button
            onClick={() => toggleReportView("details")}
            aria-label={isDisplayedDetails ? "Back" : "View estimate details"}
            title={isDisplayedDetails ? "Back" : "View estimate details"}
            aria-pressed={isDisplayedDetails}
            className={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] md:w-auto md:gap-2 md:px-3.5 ${isDisplayedDetails ? "text-gray-900 md:bg-gray-100" : ""}`}
            style={softActionButtonTransition}
        >
            <span className="relative h-4 w-4 shrink-0">
                {isDisplayedDetails ? <ArrowLeft className="h-4 w-4" /> : <SlidersVertical className="h-4 w-4" />}
            </span>
            <span className="hidden md:inline text-[11px] font-bold leading-none">
                {isDisplayedDetails ? "Back" : "Details"}
            </span>
        </button>
    );
    const inventoryTopControl = (
        <button
            onClick={() => toggleReportView("inventory")}
            aria-label={isDisplayedInventory ? "Back" : "Inventory View"}
            title={isDisplayedInventory ? "Back" : "Inventory View"}
            aria-pressed={isDisplayedInventory}
            className={`group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] md:w-auto md:gap-2 md:px-3.5 ${isDisplayedInventory ? "text-gray-900 md:bg-gray-100" : ""}`}
            style={softActionButtonTransition}
        >
            <span className="relative h-4 w-4 shrink-0">
                {isDisplayedInventory ? <ArrowLeft className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </span>
            <span className="hidden md:inline text-[11px] font-bold leading-none">
                {isDisplayedInventory ? "Back" : "Inventory"}
            </span>
        </button>
    );
    const panelLayerLabelClass = "flex items-center gap-2";
    const panelLayerTitleClass = "text-[10px] font-bold text-gray-800 uppercase tracking-widest";
    const clearOverridesButton = (
        <button
            onClick={clearOverrides}
            disabled={!hasManualOverrideValues}
            aria-hidden={!hasManualOverrideValues}
            className={`rounded-xl border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-500 transition-[opacity,color,border-color] hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed ${hasManualOverrideValues ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
            Clear
        </button>
    );
    const shellHeaderMeta = displayedReportView === "inventory"
        ? { Icon: List, title: "Detected Items" }
        : displayedReportView === "details"
            ? { Icon: Lock, title: "Manual Overrides" }
            : { Icon: Clipboard, title: "Summary" };
    const shellHeaderActions = (
        <div className="flex items-center gap-2">
            {isDisplayedDetails && clearOverridesButton}
            {inventoryTopControl}
            {detailsTopControl}
        </div>
    );
    const reportShellHeaderLabel = (
        <div className={panelLayerLabelClass}>
            <shellHeaderMeta.Icon className="w-4 h-4 text-gray-800" />
            <span className={panelLayerTitleClass}>{shellHeaderMeta.title}</span>
        </div>
    );
    const reportShellHeader = (
        <>
            <div className="flex items-center justify-between gap-3 pb-2 md:hidden">
                {reportShellHeaderLabel}
                {shellHeaderActions}
            </div>
            <div className="hidden md:flex items-center justify-between gap-3 pb-2">
                {reportShellHeaderLabel}
                {shellHeaderActions}
            </div>
        </>
    );

    const summaryContent = (
        <div className="flex min-h-0 flex-col">
            <div className={`grid gap-y-4 pb-4 ${heavyItems.length > 0 ? "grid-cols-2 items-start gap-x-8" : ""}`}>
                <div className="w-full px-1 py-1">
                    <ConfidenceDonut score={estimate.confidence?.score || 0} label={estimate.confidence?.label || ""} />
                </div>
                {heavyItems.length > 0 && (
                    <div className="w-full px-1 py-1">
                        <div className="mb-2 flex items-center gap-2">
                            <Weight className="w-4 h-4 shrink-0" strokeWidth={2.5} color="#f43f5e" />
                            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Heavy Items ({heavyItems.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {heavyItems.map((name, i) => (
                                <span key={`${name}-${i}`} className="rounded-lg bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-600">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="min-h-0 flex-1 pr-1 md:pr-2">
                <div className="flex flex-col">
                    {estimate.unrecognizedDetails?.length > 0 && (
                        <>
                            <div className="border-t border-gray-100" />
                            <div className="py-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Estimated Items ({estimate.unrecognizedDetails.length})</span>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium mb-2">These items weren&apos;t recognized. Smart Fallback applied.</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {estimate.unrecognizedDetails.map((name, i) => (
                                        <span key={i} className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">{name}</span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {compactAuditSummary.length > 0 && (
                        <>
                            <div className="border-t border-gray-100" />
                            <div className="py-3 space-y-1.5">
                                {compactAuditSummary.map((x, i) => (
                                    <div key={i} className="text-[12px] text-gray-400 font-medium leading-relaxed">
                                        {x}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {inputs.moveType === "LD" && estimate.billableCF != null && estimate.billableCF > 0 && (
                        <>
                            <div className="border-t border-gray-100" />
                            <div className="py-4">
                                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ArrowUpFromLine className="w-4 h-4" /> Long Distance Breakdown
                                </div>
                                <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
                                    <div className="min-w-0 text-center">
                                        <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Inventory Volume</div>
                                        <div className="text-lg min-[375px]:text-xl sm:text-2xl font-black text-gray-900 tabular-nums leading-tight">{formatMetric(<AnimatedNumber value={rawInventoryVolume} />, "cu ft")}</div>
                                        <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 mt-1 leading-tight sm:truncate">Items Only</div>
                                    </div>
                                    <div className="min-w-0 text-center">
                                        <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Truck Load</div>
                                        <div className="text-lg min-[375px]:text-xl sm:text-2xl font-black text-gray-900 tabular-nums leading-tight">{formatMetric(<AnimatedNumber value={estimate.truckSpaceCF || 0} prefix="~" />, "cu ft")}</div>
                                        <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 mt-1 leading-tight sm:truncate">Actual Space Needed</div>
                                    </div>
                                    <div className="min-w-0 text-center">
                                        <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Est. Weight</div>
                                        <div className="text-lg min-[375px]:text-xl sm:text-2xl font-black text-gray-900 tabular-nums leading-tight">{formatMetric(<AnimatedNumber value={estimate.weight || 0} />, "lbs")}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="border-t border-gray-100" />
                    <div className="py-4">
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-6">
                            <div className="min-w-0 text-center">
                                <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Blankets</div>
                                <div className="text-lg min-[375px]:text-xl sm:text-2xl font-black text-gray-900 tabular-nums leading-tight">{estimate.materials?.blankets || 0}</div>
                            </div>
                            <div className="min-w-0 text-center">
                                <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Boxes</div>
                                <div className="text-lg min-[375px]:text-xl sm:text-2xl font-black text-gray-900 tabular-nums leading-tight">~{estimate.materials?.boxes || 0}</div>
                            </div>
                            <div className="min-w-0 text-center">
                                <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Wardrobes</div>
                                <div className="text-lg min-[375px]:text-xl sm:text-2xl font-black text-gray-900 tabular-nums leading-tight">{estimate.materials?.wardrobes || 0}</div>
                            </div>
                        </div>
                    </div>

                    {actionableAdvice.length > 0 && (
                        <>
                            <div className="border-t border-gray-100" />
                            <div className="py-3">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <span>💡</span> Dispatch Notes
                                </div>
                                <div className="space-y-1.5">
                                    {actionableAdvice.map((x, i) => (
                                        <div key={i} className="text-[12px] text-gray-400 font-medium leading-relaxed">
                                            {x}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {estimate.risks?.length > 0 && (
                        <>
                            <div className="border-t border-gray-100" />
                            <div className="py-3">
                                <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-500" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Factors</span></div>
                                <div className="space-y-1.5">
                                    {estimate.risks.map((r, i) => (
                                        <div key={i} className={`text-[12px] font-medium leading-relaxed ${r.level === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                                            {r.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const inventoryContent = (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="h-full min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-gray-100 bg-gray-50/60 p-3 md:p-4">
                {detectedItemCount > 0 ? (
                    <div className="h-full min-h-0 overflow-y-auto pr-1 md:pr-2">
                        <div className="grid grid-cols-1 gap-3 pb-1 md:grid-cols-2">
                            {estimate.parsedItems?.map((item, i) => (
                                <div key={i} className="flex justify-between items-center bg-white border border-gray-100 px-4 py-3 rounded-[1rem] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-colors">
                                    <span className="font-bold text-gray-700 text-[11px] truncate mr-2">
                                        {item.name}
                                        {item.room && <span className="text-gray-400 ml-1 font-semibold text-[9px]">[{item.room}]</span>}
                                        {item.sourceCount && item.sourceCount > 1 && (
                                            <span className="text-gray-400 ml-1 font-semibold text-[9px]">({item.sourceCount} lines)</span>
                                        )}
                                        {item.isSynthetic && (
                                            <span className="text-amber-600 ml-1 font-semibold text-[9px]">(bundle)</span>
                                        )}
                                        {item.flags?.heavy && (
                                            <Weight className="w-3 h-3 text-red-500 ml-1 inline-block" strokeWidth={2.5} />
                                        )}
                                    </span>
                                    <span className="text-gray-500 whitespace-nowrap text-[11px] font-medium flex items-center gap-2" style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace' }}>
                                        <span>x{item.qty}</span>
                                        <span className="text-gray-200">|</span>
                                        <span className="font-bold text-gray-600">{item.cf}cf</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <List className="mb-3 h-6 w-6 text-gray-300" />
                        <div className="text-sm font-bold text-gray-700">No detected items yet</div>
                        <div className="mt-1 max-w-xs text-[12px] font-medium leading-relaxed text-gray-400">
                            Add or parse inventory in Parameters. Detected items will show here.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const detailsContent = (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="h-0 min-h-0 flex-1 overflow-y-auto pr-1 md:pr-2">
                <div className="flex min-h-full flex-col gap-5">
                    <div className="bg-gray-900 rounded-[2rem] p-6 shadow-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {OVERRIDE_KEYS.map((key) => {
                                const autoValue = overrideAutoValues[key];
                                const label = key.charAt(0).toUpperCase() + key.slice(1);
                                const placeholder = autoValue != null ? `${label} (Auto: ${autoValue})` : `${label} (Auto)`;
                                return (
                                    <input
                                        key={key}
                                        placeholder={placeholder}
                                        value={overrides[key as keyof typeof overrides] || ""}
                                        onChange={e => setOverrides({ ...overrides, [key]: e.target.value })}
                                        className="text-[11px] font-bold p-3.5 rounded-xl bg-gray-800 text-white border border-transparent outline-none focus:bg-gray-700 placeholder:text-gray-500 transition-colors"
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className={panelLayerLabelClass}>
                            <Terminal className="w-4 h-4 text-gray-800" />
                            <span className={panelLayerTitleClass}>Volume Calculation Path</span>
                        </div>
                        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                            <div className="grid grid-cols-2 gap-x-5 gap-y-4 min-[390px]:grid-cols-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-6 md:gap-y-0">
                                <div className="min-w-0 flex flex-col">
                                    <span className="mb-1 text-[9px] font-bold uppercase leading-tight tracking-[0.2em] text-gray-500 min-[390px]:text-[10px] md:text-[11px] md:tracking-widest">Inventory Volume</span>
                                    <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-1 text-[16px] font-black text-gray-300 min-[390px]:text-xl">
                                        <span>{rawInventoryVolume.toLocaleString()}</span>
                                        <span className="text-[12px] font-medium text-gray-500">cu ft</span>
                                    </span>
                                </div>

                                <ChevronRight className="hidden h-5 w-5 text-gray-700 md:block" />

                                <div className="min-w-0 flex flex-col">
                                    <span className="mb-1 text-[9px] font-bold uppercase leading-tight tracking-[0.2em] text-gray-500 min-[390px]:text-[10px] md:text-[11px] md:tracking-widest">Adjusted Volume</span>
                                    <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-1 text-[16px] font-black text-gray-300 min-[390px]:text-xl">
                                        <span>{(estimate.billableCF || estimate.finalVolume || 0).toLocaleString()}</span>
                                        <span className="text-[12px] font-medium text-gray-500">cu ft</span>
                                    </span>
                                </div>

                                <ChevronRight className="hidden h-5 w-5 text-gray-700 md:block" />

                                <div className="col-span-2 min-[390px]:col-span-1 md:col-span-1 min-w-0 flex flex-col">
                                    <span className="mb-1 text-[9px] font-bold uppercase leading-tight tracking-[0.2em] text-emerald-500/80 min-[390px]:text-[10px] md:text-[11px] md:tracking-widest">Truck Space</span>
                                    <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-1 text-[18px] font-black text-emerald-400 min-[390px]:text-2xl">
                                        <span>{(estimate.truckSpaceCF || Math.round((estimate.finalVolume || 0) * 1.083)).toLocaleString()}</span>
                                        <span className="text-[12px] font-medium text-emerald-500/50">cu ft</span>
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-gray-800/80 grid grid-cols-2 gap-y-6 gap-x-8">
                                <div className="flex gap-3 items-start">
                                    <Scale className="w-4 h-4 text-gray-600 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Weight Baseline</span>
                                        <span className="text-[13px] font-bold text-gray-300">7 lbs / cu ft</span>
                                        <span className="text-[11px] text-gray-600 mt-0.5">DOT Tariff Standard</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <PackageOpen className="w-4 h-4 text-gray-600 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Stacking Factor</span>
                                        <span className="text-[13px] font-bold text-gray-300">~10% Volume Allowance</span>
                                        <span className="text-[11px] text-gray-600 mt-0.5">Furniture is not perfectly square</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <Box className="w-4 h-4 text-gray-600 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Box Algorithm</span>
                                        <span className="text-[13px] font-bold text-gray-300">Auto-Generated</span>
                                        <span className="text-[11px] text-gray-600 mt-0.5">Min. requirement for safe transport</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <Clock className="w-4 h-4 text-gray-600 mt-0.5" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Labor Algorithm</span>
                                        <span className="text-[13px] font-bold text-gray-300">Volume + Access Factors</span>
                                        <span className="text-[11px] text-gray-600 mt-0.5">Accounts for stairs & elevators</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {estimate.overridesApplied?.length > 0 && <div className="text-[11px] text-gray-500 font-bold">Overrides Applied: {estimate.overridesApplied.join(", ")}</div>}
                </div>
            </div>
        </div>
    );

    const reportContent = displayedReportView === "inventory"
        ? inventoryContent
        : displayedReportView === "details"
            ? detailsContent
            : summaryContent;

    return (
        <div id="pdf-export-area" className="flex-1 flex flex-col gap-6">
            <div className={`grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isCalculating ? 'opacity-60' : 'opacity-100'}`}>
                <MetricCard icon={Box} label={primaryVolumeLabel} value={formatMetric(<AnimatedNumber value={primaryVolume} />, "cu ft")} sub={primaryVolumeSub} variant="blue" />
                <MetricCard icon={estimate.splitRecommended ? CalendarDays : Clock} label={estimate.splitRecommended ? "Move Plan" : "Time Est."} value={<><AnimatedNumber value={estimate.timeMin} />–<AnimatedNumber value={estimate.timeMax} />h</>} sub={estimate.splitRecommended ? "SPLIT TO 2 DAYS" : "Est. Range"} variant={estimate.splitRecommended ? "red" : "purple"} isCritical={estimate.splitRecommended} />
                {isLabor ? <MetricCard icon={Info} label="Service" value="Labor" sub="No Trucks" variant="gray" /> : <MetricCard icon={Truck} label="Trucks" value={<AnimatedNumber value={estimate.trucksFinal} />} sub={estimate.truckSizeLabel?.replace(/\s*Truck\s*/i, ' ').trim()} variant="orange" />}
                <MetricCard icon={Users} label="Crew" value={<AnimatedNumber value={estimate.crew} />} sub="Recommended Crew" variant="emerald" advice={estimate.nextMoverSavingsLabel} />
            </div>

            <GlassPanel className="overflow-hidden">
                <div className="flex flex-col p-4 md:p-6">
                    {reportShellHeader}
                    <div className="report-view-viewport overflow-hidden" style={reportViewportStyle}>
                        <div
                            key={displayedReportView}
                            ref={setActiveContentNode}
                            className={`report-view-motion ${activeReportBodyClass} transition-[opacity,transform] duration-[180ms] ease-out`}
                            style={reportMotionStyle}
                        >
                            {reportContent}
                        </div>
                    </div>

                    <div data-no-pdf className="flex flex-col mt-2">
                        <div className="border-t border-gray-100 md:border-t-0" />
                        <div className="-mx-2 flex w-[calc(100%+1rem)] min-w-0 items-center gap-1 pt-4 md:mx-0 md:w-full md:gap-3">
                            <div className="flex min-w-0 shrink-0 items-center gap-1.5 md:gap-3">
                                <button onClick={handleCopy} disabled={!hasUsableEstimate} className={`h-[42px] w-[112px] md:h-auto md:w-[220px] flex items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-3 md:py-4 rounded-xl text-[10px] md:text-[12px] font-bold transition-colors duration-300 active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.15)] whitespace-nowrap overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${copyStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                    {copyStatus === 'success'
                                        ? <><Check className="w-4 h-4 shrink-0" /><span className="inline-block min-w-[48px] md:min-w-[74px] text-left">Copied!</span></>
                                        : <><Clipboard className="w-4 h-4 shrink-0" /><span className="inline-block min-w-[48px] md:min-w-[74px] text-left">COPY REPORT</span></>}
                                </button>
                                <button
                                    onClick={handleDownloadPdf}
                                    disabled={isGeneratingPdf || !hasUsableEstimate}
                                    aria-label={isGeneratingPdf ? "Generating PDF" : "Download PDF"}
                                    title="Download PDF"
                                    className={`group h-[42px] w-auto flex items-center justify-center gap-1 md:gap-2 rounded-xl px-2 md:px-5 py-0 md:py-3 text-[10px] md:text-[14px] font-bold transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isGeneratingPdf ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin transition-transform duration-200 group-active:scale-90" />
                                            <span className="md:hidden">PDF</span>
                                            <span className="hidden md:inline">Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="transition-transform duration-200 group-active:-translate-y-0.5 group-active:scale-95" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                            <span>PDF</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassPanel>

            <GlassPanel className="md:hidden">
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Client name"
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-2.5 py-2.5 text-base font-semibold outline-none"
                        />
                        <button
                            onClick={handleSaveEstimate}
                            disabled={!clientName.trim() || isSaving || !hasUsableEstimate}
                            className={`px-4 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-300 active:scale-95 min-w-[88px] disabled:opacity-50 disabled:cursor-not-allowed ${saveStatus === 'success' ? 'bg-emerald-500 text-white' : isSaving ? 'bg-gray-900 text-white' : clientName.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-400 text-white'}`}
                        >
                            {saveStatus === 'success' ? '✓ Saved' : isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save'}
                        </button>
                    </div>
                    {saveStatus === 'error' && (
                        <div className="px-1 text-red-500 text-[11px] font-bold">
                            {saveErrorMessage || 'Save failed. Please try again.'}
                        </div>
                    )}
                </div>
            </GlassPanel>

        </div>
    );
};
