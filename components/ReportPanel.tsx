import React, { useMemo } from 'react';
import { EstimateInputs, EstimateResult } from '@/lib/types/estimator';
import {
    Box, Truck, Clock, ShieldCheck, History, Info, ChevronRight, ArrowUpFromLine,
    CalendarDays, Users, ShieldAlert, AlertTriangle, Lightbulb, Check, Clipboard, ChevronDown, Lock, List, Terminal
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { MetricCard } from './MetricCard';
import { ConfidenceDonut } from './ConfidenceDonut';
import { LDBrokerPanel } from './LDBrokerPanel';
import CountUp from 'react-countup';

interface ReportPanelProps {
    estimate: EstimateResult;
    inputs: EstimateInputs;
    isCalculating: boolean;
    adminMode: boolean;
    showDetails: boolean;
    setShowDetails: (v: boolean) => void;
    handleCopy: () => void;
    copyStatus: "idle" | "success";
    clientName: string;
    setClientName: (v: string) => void;
    handleSaveEstimate: () => void;
    isSaving: boolean;
    saveStatus: "idle" | "success" | "error";
    overrides: Record<string, string>;
    setOverrides: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const ReportPanel = ({
    estimate,
    inputs,
    isCalculating,
    adminMode,
    showDetails,
    setShowDetails,
    handleCopy,
    copyStatus,
    clientName,
    setClientName,
    handleSaveEstimate,
    isSaving,
    saveStatus,
    overrides,
    setOverrides
}: ReportPanelProps) => {

    const isLabor = inputs.moveType === "Labor";

    const heavyBadgeText = useMemo(() => {
        const arr = estimate.heavyItemNames || []; if (!arr.length) return null;
        const first = String(arr[0]).replace(/\s*\(.*?\)\s*/g, "").trim(); const lower = first.toLowerCase();
        let label = lower.includes("piano") ? "PIANO" : lower.includes("safe") ? "SAFE" : lower.includes("pool") ? "POOL TABLE" : lower.includes("clock") ? "CLOCK" : lower.includes("copier") ? "COPIER" : lower.includes("treadmill") ? "TREADMILL" : lower.includes("gym") ? "GYM" : first.toUpperCase();
        return `HEAVY: ${label}${arr.length > 1 ? ` +${arr.length - 1}` : ""}`;
    }, [estimate.heavyItemNames]);

    return (
        <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={Box} label="Volume" value={<CountUp end={estimate.finalVolume} duration={0.8} separator="," />} sub="Cubic Feet" variant="blue" />
                <MetricCard icon={estimate.splitRecommended ? CalendarDays : Clock} label={estimate.splitRecommended ? "Split Rec." : "Time Est."} value={<><CountUp end={estimate.timeMin} duration={0.8} /> - <CountUp end={estimate.timeMax} duration={0.8} />h</>} sub={estimate.splitRecommended ? "SPLIT TO 2 DAYS" : "Est. Range"} variant={estimate.splitRecommended ? "red" : "purple"} isCritical={estimate.splitRecommended} />
                {isLabor ? <MetricCard icon={Info} label="Service" value="Labor" sub="No Trucks" variant="gray" /> : <MetricCard icon={Truck} label="Trucks" value={<CountUp end={estimate.trucksFinal} duration={0.8} decimals={estimate.trucksFinal % 1 !== 0 ? 1 : 0} />} sub={estimate.truckSizeLabel} variant="orange" />}
                <MetricCard icon={Users} label="Crew" value={<CountUp end={estimate.crew} duration={0.8} />} sub="Movers" variant="emerald" advice={estimate.crewSuggestion} />
            </div>

            <GlassPanel><div className="p-7 flex flex-col pb-32 md:pb-7">

                {/* CONFIDENCE + HEAVY */}
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <ConfidenceDonut score={estimate.confidence?.score || 0} label={estimate.confidence?.label || ""} />

                    {heavyBadgeText && (
                        <div className="self-start sm:self-auto bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4" /> {heavyBadgeText}
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
                {estimate.auditSummary?.length > 0 && (
                    <>
                        <div className="border-t border-gray-100" />
                        <div className="py-3 space-y-1.5">
                            {estimate.auditSummary.map((x, i) => (
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
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Items Volume</div>
                                    <div className="text-2xl font-black text-gray-900"><CountUp end={estimate.billableCF || 0} duration={0.8} separator="," /></div>
                                    <div className="text-[10px] font-medium text-gray-400 mt-0.5">Net Total, cf</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Truck Load</div>
                                    <div className="text-2xl font-black text-gray-900">~<CountUp end={estimate.truckSpaceCF || 0} duration={0.8} separator="," /></div>
                                    <div className="text-[10px] font-medium text-gray-400 mt-0.5">Actual Space, cf</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Est. Weight</div>
                                    <div className="text-2xl font-black text-gray-900"><CountUp end={estimate.weight || 0} duration={0.8} separator="," /></div>
                                    <div className="text-[10px] font-medium text-gray-400 mt-0.5">lbs</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* MATERIALS */}
                <div className="border-t border-gray-100" />
                <div className="py-4">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Blankets</div>
                            <div className="text-2xl font-black text-gray-900">{estimate.materials?.blankets || 0}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Boxes</div>
                            <div className="text-2xl font-black text-gray-900">~{estimate.materials?.boxes || 0}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Wardrobes</div>
                            <div className="text-2xl font-black text-gray-900">{estimate.materials?.wardrobes || 0}</div>
                        </div>
                    </div>
                </div>

                {/* SMART TIPS */}
                {estimate.advice?.length > 0 && (
                    <>
                        <div className="border-t border-gray-100" />
                        <div className="py-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <span>💡</span> Smart Tips
                            </div>
                            <div className="space-y-1.5">
                                {estimate.advice.map((x, i) => (
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
                                    <div key={i} className={`text-[12px] font-medium flex items-start gap-2 ${r.level === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>
                                        <span className="mt-0.5">•</span>
                                        <span>{r.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* MOBILE COMPACT SAVE BAR */}
                <div className="md:hidden flex items-center gap-2 pt-3">
                    <input type="text" placeholder="Client name" value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="flex-1 bg-gray-50 border-transparent rounded-xl px-3 py-2.5 text-[12px] font-semibold outline-none" />
                    <button onClick={handleSaveEstimate} disabled={!clientName.trim() || isSaving}
                        className={`px-4 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${clientName.trim() ? 'bg-gray-900 text-white' : 'bg-gray-400 text-white cursor-not-allowed'}`}>
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>

                {/* ACTION BAR */}
                <div className="border-t border-gray-100 mt-2" />
                <div className="flex items-center gap-3 pt-4">
                    <button onClick={handleCopy} className="flex-1 md:flex-none md:w-[220px] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[12px] font-bold transition-all duration-300 bg-gray-900 text-white hover:bg-black active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.15)] whitespace-nowrap overflow-hidden">
                        {copyStatus === 'success' ? <><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span className="truncate">COPIED</span></> : <><Clipboard className="w-4 h-4 shrink-0" /><span className="truncate">COPY REPORT</span></>}
                    </button>

                    <button onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-colors py-2 px-1 ml-auto">
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
                        <span>{showDetails ? 'Hide' : 'Details'}</span>
                    </button>
                </div>

                {showDetails && (
                    <div className="pt-8 mt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">

                        {adminMode && (
                            <div className="mb-6 bg-gray-900 rounded-[2rem] p-6 shadow-lg">
                                <div className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-white" /> Manager Overrides
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {["volume", "trucks", "crew", "timeMin", "timeMax", "blankets", "boxes"].map(k => (
                                        <input
                                            key={k}
                                            placeholder={`${k.charAt(0).toUpperCase() + k.slice(1)} (${k === 'blankets' || k === 'boxes'
                                                ? estimate.materials?.[k as "blankets" | "boxes" | "wardrobes"] || 0
                                                : estimate[k as keyof EstimateResult] || 0
                                                })`}
                                            value={overrides[k] || ""}
                                            onChange={e => setOverrides({ ...overrides, [k]: e.target.value })}
                                            className="text-[11px] font-bold p-3.5 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none focus:bg-gray-700 focus:border-gray-500 placeholder:text-gray-500 transition-colors"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2"><List className="w-4 h-4 text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detected Items</span></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 pb-2">
                                    {estimate.parsedItems?.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                                            <span className="font-bold text-gray-700 text-[11px] truncate mr-2">
                                                {item.name}
                                                {item.room && <span className="text-gray-400 ml-1 font-semibold text-[9px]">[{item.room}]</span>}
                                                {item.isWeightHeavy && <span className="text-red-500 ml-1 font-black text-[9px]">(HEAVY)</span>}
                                            </span>
                                            <span className="text-gray-500 whitespace-nowrap text-[11px] font-mono font-medium flex items-center gap-2">
                                                <span>x{item.qty}</span>
                                                <span className="text-gray-200">|</span>
                                                <span className="font-bold text-gray-600">{item.cf}cf</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2"><Terminal className="w-4 h-4 text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Engine Logic</span></div>
                                <div className="p-6 bg-gray-900 rounded-[2rem] text-[11px] font-mono font-medium text-gray-300 space-y-2.5 max-h-64 overflow-y-auto shadow-inner">
                                    {estimate.logs?.map((log, i) => <div key={i} className="flex gap-3"><span className="text-gray-600 w-5 shrink-0 text-right">{i + 1}.</span><span>{log}</span></div>)}
                                </div>
                            </div>
                            {estimate.overridesApplied?.length > 0 && <div className="mt-4 text-[11px] text-gray-500 font-bold">Overrides Applied: {estimate.overridesApplied.join(", ")}</div>}
                        </div>
                    </div>
                )}
            </div></GlassPanel>
        </div>
    );
};
