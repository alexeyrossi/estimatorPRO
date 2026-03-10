import React, { useMemo, useState, useEffect, useRef } from 'react';
import { EstimateInputs, EstimateResult } from '@/lib/types/estimator';
import { OVERRIDE_KEYS } from '@/lib/estimatePolicy';
import { buildReportSummaryNotes } from '@/lib/reportNotes';
import {
    Truck, Box, List, Weight, Terminal, ChevronRight, Lock, Scale, PackageOpen, Clock, CalendarDays, Info, Users, AlertTriangle, ArrowUpFromLine, Check, Clipboard, Loader2
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
    showDetails: boolean;
    setShowDetails: (v: boolean) => void;
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
}

export const ReportPanel = ({
    estimate,
    inputs,
    isCalculating,
    showDetails,
    setShowDetails,
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
}: ReportPanelProps) => {

    const isLabor = inputs.moveType === "Labor";
    const hasUsableEstimate = typeof estimate.finalVolume === "number" && estimate.finalVolume > 0;

    const formatMetric = (val: React.ReactNode | number, unit: string) => (
        <span className="tabular-nums inline-flex max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:flex-nowrap">
            <span>{typeof val === 'number' ? val.toLocaleString() : (val || 0)}</span>
            <span className="text-[12px] sm:text-[13px] font-bold text-gray-400 lowercase tracking-normal">
                {unit}
            </span>
        </span>
    );

    const rawInventoryVolume = useMemo(() => {
        const raw = (estimate.parsedItems || []).reduce((sum, item) => sum + (item.cf || 0), 0);
        return raw > 0 ? Math.round(raw / 25) * 25 : 0;
    }, [estimate.parsedItems]);
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

    const heavyBadgeText = useMemo(() => {
        const arr = estimate.heavyItemNames || []; if (!arr.length) return null;
        const first = String(arr[0]).replace(/\s*\(.*?\)\s*/g, "").trim(); const lower = first.toLowerCase();
        const label = lower.includes("piano") ? "PIANO" : lower.includes("safe") ? "SAFE" : lower.includes("pool") ? "POOL TABLE" : lower.includes("clock") ? "CLOCK" : lower.includes("copier") ? "COPIER" : lower.includes("treadmill") ? "TREADMILL" : lower.includes("gym") ? "GYM" : first.toUpperCase();
        return `HEAVY: ${label}${arr.length > 1 ? ` +${arr.length - 1}` : ""}`;
    }, [estimate.heavyItemNames]);

    return (
        <div id="pdf-export-area" className="flex-1 flex flex-col gap-6">
            <div className={`grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isCalculating ? 'opacity-60' : 'opacity-100'}`}>
                <MetricCard icon={Box} label={primaryVolumeLabel} value={formatMetric(<AnimatedNumber value={primaryVolume} />, "cu ft")} sub={primaryVolumeSub} variant="blue" />
                <MetricCard icon={estimate.splitRecommended ? CalendarDays : Clock} label={estimate.splitRecommended ? "Split Rec." : "Time Est."} value={<><AnimatedNumber value={estimate.timeMin} />–<AnimatedNumber value={estimate.timeMax} />h</>} sub={estimate.splitRecommended ? "SPLIT TO 2 DAYS" : "Est. Range"} variant={estimate.splitRecommended ? "red" : "purple"} isCritical={estimate.splitRecommended} />
                {isLabor ? <MetricCard icon={Info} label="Service" value="Labor" sub="No Trucks" variant="gray" /> : <MetricCard icon={Truck} label="Trucks" value={<AnimatedNumber value={estimate.trucksFinal} />} sub={estimate.truckSizeLabel?.replace(/\s*Truck\s*/i, ' ').trim()} variant="orange" />}
                <MetricCard icon={Users} label="Crew" value={<AnimatedNumber value={estimate.crew} />} sub="Movers" variant="emerald" advice={estimate.nextMoverSavingsLabel} />
            </div>

            <GlassPanel><div className="p-7 flex flex-col">

                <div className={`flex flex-col transition-opacity duration-300 ${isCalculating ? 'opacity-60' : 'opacity-100'}`}>
                    {/* CONFIDENCE + HEAVY */}
                    <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="group relative cursor-help inline-block self-start sm:self-auto">
                            <ConfidenceDonut score={estimate.confidence?.score || 0} label={estimate.confidence?.label || ""} />

                            {/* Elegant Glassmorphism Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 text-center shadow-[0_12px_40px_rgba(0,0,0,0.08)] pointer-events-none border-t-white/40">
                                <div className="text-[12px] font-bold text-gray-900 mb-1">
                                    <span className="text-emerald-500">{estimate.confidence?.score || 0}%</span> Match Accuracy
                                </div>
                                <div className="text-[10px] leading-relaxed text-gray-500 font-medium">
                                    Based on {estimate.detectedQtyTotal || 0} items. {100 - (estimate.confidence?.score || 0)}% of volume is derived from approximate categorical matches.
                                </div>
                                {/* Tooltip Arrow (Glassy) */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white/80 backdrop-blur-md border-r border-b border-white/20 rotate-45 -mt-[6px]"></div>
                            </div>
                        </div>

                        {heavyBadgeText && (
                            <div className="inline-flex w-fit max-w-full self-start sm:self-auto items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-full select-none cursor-default">
                                <Weight className="w-3.5 h-3.5 text-rose-600" strokeWidth={2.5} />
                                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                                    {heavyBadgeText}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* UNRECOGNIZED ITEMS */}
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

                    {/* AUDIT SUMMARY */}
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

                    {/* LD BREAKDOWN */}
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

                    {/* MATERIALS */}
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

                    {/* SMART TIPS */}
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

                    {/* RISK FACTORS */}
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
                {/* ACTION BAR */}
                <div data-no-pdf className="flex flex-col mt-2">
                    <div className="border-t border-gray-100" />
                    <div className="flex items-center justify-between w-full pt-4">
                        <div className="flex items-center gap-3">
                            <button onClick={handleCopy} disabled={!hasUsableEstimate} className={`flex-1 md:flex-none min-w-[148px] md:w-[220px] flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-[12px] font-bold transition-colors duration-300 active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.15)] whitespace-nowrap overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${copyStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                {copyStatus === 'success'
                                    ? <><Check className="w-4 h-4 shrink-0" /><span className="inline-block min-w-[74px] text-left">Copied!</span></>
                                    : <><Clipboard className="w-4 h-4 shrink-0" /><span className="inline-block min-w-[74px] text-left">COPY REPORT</span></>}
                            </button>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isGeneratingPdf || !hasUsableEstimate}
                                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-bold transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isGeneratingPdf ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        PDF
                                    </>
                                )}
                            </button>
                        </div>

                        <button onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center justify-center gap-2 w-[120px] py-3 rounded-xl text-[14px] font-bold transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98] ml-auto">
                            <span>{showDetails ? 'Hide' : 'Details'}</span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showDetails ? '-rotate-90' : ''}`} />
                        </button>
                    </div>
                    <div className="md:hidden pt-4">
                        <div className="flex flex-col gap-2 rounded-[1.5rem] border border-gray-100 bg-[#F7F8FB] p-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Client name"
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                                className="flex-1 bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-[12px] font-semibold outline-none"
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
                    </div>
                </div>

                <div className={`grid transition-all duration-500 ease-in-out ${showDetails ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div className="pt-8 mt-4 border-t border-gray-100">

                            <div className="mb-6 bg-gray-900 rounded-[2rem] p-6 shadow-lg">
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

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2"><List className="w-4 h-4 text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detected Items</span></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 pb-2">
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
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-2"><Terminal className="w-4 h-4 text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume Calculation Path</span></div>
                                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                                            {/* Step 1: Inventory Volume */}
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Inventory Volume</span>
                                                <span className="text-xl font-black text-gray-300">{rawInventoryVolume} <span className="text-sm font-medium text-gray-500">cu ft</span></span>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-700 hidden md:block" />

                                            {/* Step 2: Adjusted Volume */}
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Adjusted Volume</span>
                                                <span className="text-xl font-black text-gray-300">{estimate.billableCF || estimate.finalVolume || 0} <span className="text-sm font-medium text-gray-500">cu ft</span></span>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-700 hidden md:block" />

                                            {/* Step 3: Truck Space */}
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">Truck Space</span>
                                                <span className="text-2xl font-black text-emerald-400">{estimate.truckSpaceCF || Math.round((estimate.finalVolume || 0) * 1.083)} <span className="text-sm font-medium text-emerald-500/50">cu ft</span></span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-5 border-t border-gray-800/80 grid grid-cols-2 gap-y-6 gap-x-8">
                                            {/* 1. Weight Baseline */}
                                            <div className="flex gap-3 items-start">
                                                <Scale className="w-4 h-4 text-gray-600 mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Weight Baseline</span>
                                                    <span className="text-[13px] font-bold text-gray-300">7 lbs / cu ft</span>
                                                    <span className="text-[11px] text-gray-600 mt-0.5">DOT Tariff Standard</span>
                                                </div>
                                            </div>

                                            {/* 2. Stacking Factor */}
                                            <div className="flex gap-3 items-start">
                                                <PackageOpen className="w-4 h-4 text-gray-600 mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Stacking Factor</span>
                                                    <span className="text-[13px] font-bold text-gray-300">~10% Volume Allowance</span>
                                                    <span className="text-[11px] text-gray-600 mt-0.5">Furniture is not perfectly square</span>
                                                </div>
                                            </div>

                                            {/* 3. Box Algorithm */}
                                            <div className="flex gap-3 items-start">
                                                <Box className="w-4 h-4 text-gray-600 mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Box Algorithm</span>
                                                    <span className="text-[13px] font-bold text-gray-300">Auto-Generated</span>
                                                    <span className="text-[11px] text-gray-600 mt-0.5">Min. requirement for safe transport</span>
                                                </div>
                                            </div>

                                            {/* 4. Labor Algorithm (NEW - MUST BE RENDERED) */}
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
                                {estimate.overridesApplied?.length > 0 && <div className="mt-4 text-[11px] text-gray-500 font-bold">Overrides Applied: {estimate.overridesApplied.join(", ")}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div></GlassPanel>

        </div>
    );
};
