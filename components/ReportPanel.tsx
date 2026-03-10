import React, { useMemo, useState, useEffect, useRef } from 'react';
import { EstimateInputs, EstimateResult } from '@/lib/types/estimator';
import { OVERRIDE_KEYS } from '@/lib/estimatePolicy';
import { buildReportSummaryNotes } from '@/lib/reportNotes';
import {
    Truck, Box, List, Weight, Terminal, ChevronRight, Lock, Scale, PackageOpen, Clock, CalendarDays, Info, Users, AlertTriangle, ArrowUpFromLine, ArrowLeft, Check, Clipboard, Loader2, SlidersHorizontal
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
        () => buildReportSummaryNotes(estimate.auditSummary, estimate.advice),
        [estimate.auditSummary, estimate.advice]
    );

    const heavyItems = useMemo(
        () => estimate.heavyItemNames || [],
        [estimate.heavyItemNames]
    );

    useEffect(() => {
        if (reportView === displayedReportView) return;

        const leaveTimer = window.setTimeout(() => {
            setReportViewPhase("leaving");
        }, 0);
        const swapTimer = window.setTimeout(() => {
            setDisplayedReportView(reportView);
            setReportViewPhase("entering");
        }, 140);

        return () => {
            window.clearTimeout(leaveTimer);
            window.clearTimeout(swapTimer);
        };
    }, [displayedReportView, reportView]);

    useEffect(() => {
        if (reportViewPhase !== "entering") return;

        const frame = window.requestAnimationFrame(() => {
            setReportViewPhase("idle");
        });

        return () => window.cancelAnimationFrame(frame);
    }, [reportViewPhase]);

    const summaryShellClass = "h-auto";
    const framedReportShellClass = "h-[57dvh] min-h-[390px] max-h-[520px] md:h-[635px] md:min-h-[635px] md:max-h-[635px]";
    const reportViewMotionClass = reportViewPhase === "leaving"
        ? "opacity-0 [transform:rotateY(82deg)_scale(0.985)]"
        : reportViewPhase === "entering"
            ? "opacity-0 [transform:rotateY(-82deg)_scale(0.985)]"
            : "opacity-100 [transform:rotateY(0deg)_scale(1)]";
    const isDisplayedInventory = displayedReportView === "inventory";
    const isDisplayedDetails = displayedReportView === "details";

    const detailsTopControl = (
        <button
            onClick={() => toggleReportView("details")}
            aria-label={isDisplayedDetails ? "Back" : "Details"}
            title={isDisplayedDetails ? "Back" : "Details"}
            className={`group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl active:scale-[1.02] ${isDisplayedDetails ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
            style={softActionButtonTransition}
        >
            {isDisplayedDetails ? (
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-active:scale-95" />
            ) : (
                <SlidersHorizontal className="w-4 h-4 transition-transform duration-200 group-active:scale-95" />
            )}
        </button>
    );

    const summaryContent = (
        <div className="flex min-h-0 flex-col">
            <div className="flex items-start justify-between gap-4 py-3">
                <ConfidenceDonut score={estimate.confidence?.score || 0} label={estimate.confidence?.label || ""} />
                {detailsTopControl}
            </div>
            <div className="min-h-0 flex-1 pr-1 md:pr-2">
                <div className="flex flex-col">
                    {heavyItems.length > 0 && (
                        <>
                            <div className="border-t border-gray-100" />
                            <div className="py-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Weight className="w-4 h-4 shrink-0" strokeWidth={2.5} color="#f43f5e" />
                                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Heavy Items ({heavyItems.length})</span>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium mb-2">These items were flagged as heavy.</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {heavyItems.map((name, i) => (
                                        <span key={`${name}-${i}`} className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">{name}</span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

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
                                    <span>💡</span> Smart Tips
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
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-2">
                        <List className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detected Items</span>
                    </div>
                    {detailsTopControl}
                </div>

                <div className="mt-3 h-0 min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-gray-100 bg-gray-50/60 p-3 md:p-4">
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
        </div>
    );

    const detailsContent = (
        <div className="flex h-full min-h-0 flex-col overflow-hidden p-1">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-end">
                    {detailsTopControl}
                </div>
                <div className="mt-6 h-0 min-h-0 flex-1 overflow-y-auto pr-1 md:pr-2">
                    <div className="flex min-h-full flex-col gap-6">
                        <div className="bg-gray-900 rounded-[2rem] p-6 shadow-lg">
                        <div className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-4 h-4 text-white" /> Manual Overrides
                            <button
                                onClick={clearOverrides}
                                disabled={Object.keys(overrides).length === 0}
                                className="ml-auto rounded-lg border border-gray-700 px-2 py-1 text-[9px] font-bold text-gray-300 transition-colors hover:border-gray-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Clear
                            </button>
                        </div>
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
                            <div className="flex items-center gap-2 mb-2"><Terminal className="w-4 h-4 text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume Calculation Path</span></div>
                            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Inventory Volume</span>
                                        <span className="text-xl font-black text-gray-300">{rawInventoryVolume} <span className="text-sm font-medium text-gray-500">cu ft</span></span>
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-gray-700 hidden md:block" />

                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Adjusted Volume</span>
                                        <span className="text-xl font-black text-gray-300">{estimate.billableCF || estimate.finalVolume || 0} <span className="text-sm font-medium text-gray-500">cu ft</span></span>
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-gray-700 hidden md:block" />

                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">Truck Space</span>
                                        <span className="text-2xl font-black text-emerald-400">{estimate.truckSpaceCF || Math.round((estimate.finalVolume || 0) * 1.083)} <span className="text-sm font-medium text-emerald-500/50">cu ft</span></span>
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
                        <div className="flex-1" />
                    </div>
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
                <MetricCard icon={estimate.splitRecommended ? CalendarDays : Clock} label={estimate.splitRecommended ? "Split Rec." : "Time Est."} value={<><AnimatedNumber value={estimate.timeMin} />–<AnimatedNumber value={estimate.timeMax} />h</>} sub={estimate.splitRecommended ? "SPLIT TO 2 DAYS" : "Est. Range"} variant={estimate.splitRecommended ? "red" : "purple"} isCritical={estimate.splitRecommended} />
                {isLabor ? <MetricCard icon={Info} label="Service" value="Labor" sub="No Trucks" variant="gray" /> : <MetricCard icon={Truck} label="Trucks" value={<AnimatedNumber value={estimate.trucksFinal} />} sub={estimate.truckSizeLabel?.replace(/\s*Truck\s*/i, ' ').trim()} variant="orange" />}
                <MetricCard icon={Users} label="Crew" value={<AnimatedNumber value={estimate.crew} />} sub="Movers" variant="emerald" advice={estimate.nextMoverSavingsLabel} />
            </div>

            <div className="relative rounded-[2rem] bg-white" style={{ perspective: '1400px' }}>
                <div
                    className={`flex flex-col px-7 py-7 transition-[transform,opacity] duration-200 ease-out will-change-transform ${reportViewMotionClass} ${isCalculating ? 'opacity-60' : 'opacity-100'}`}
                    style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                >
                    {displayedReportView === "summary" ? (
                        <div className={summaryShellClass}>
                            <div key={displayedReportView}>
                                {reportContent}
                            </div>
                        </div>
                    ) : (
                        <div className={`${framedReportShellClass} overflow-hidden`}>
                            <div key={displayedReportView} className="h-full">
                                {reportContent}
                            </div>
                        </div>
                    )}

                    <div data-no-pdf className="flex flex-col mt-2">
                        <div className="border-t border-gray-100" />
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
                            <div className="ml-auto flex min-w-0 shrink-0 items-center justify-end">
                                <button
                                    onClick={() => toggleReportView("inventory")}
                                    aria-label="Toggle inventory"
                                    title="Inventory"
                                    className={`group flex h-[42px] w-auto items-center justify-center gap-1 md:gap-2 rounded-xl px-1.5 md:px-4 py-0 md:py-3 text-[10px] md:text-[14px] font-bold uppercase active:scale-[1.02] ${isDisplayedInventory ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                                    style={softActionButtonTransition}
                                >
                                    {isDisplayedInventory ? (
                                        <>
                                            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-active:scale-95" />
                                            <span>BACK</span>
                                        </>
                                    ) : (
                                        <>
                                            <List className="w-4 h-4 transition-transform duration-200 group-active:scale-95" />
                                            <span>INVENTORY</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
