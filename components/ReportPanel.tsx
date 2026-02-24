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

            <GlassPanel><div className="p-7 flex flex-col gap-6 pb-32 md:pb-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <ConfidenceDonut score={estimate.confidence?.score || 0} label={estimate.confidence?.label || ""} />

                    {heavyBadgeText && (
                        <div className="self-start sm:self-auto bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> {heavyBadgeText}
                        </div>
                    )}
                </div>

                {estimate.unrecognizedDetails?.length > 0 && (
                    <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-[0_2px_12px_rgba(245,158,11,0.05)]">
                        <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-500" /><span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Estimated Items ({estimate.unrecognizedDetails.length})</span></div>
                        <p className="text-[11px] text-gray-500 mb-3 font-medium">These items weren't recognized. Smart Fallback applied (Box=5cf, Table=30cf).</p>
                        <div className="flex flex-wrap gap-2">{estimate.unrecognizedDetails.map((name, i) => <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 rounded-xl text-[10px] font-bold text-amber-800 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{name}</span>)}</div>
                    </div>
                )}

                {estimate.auditSummary?.length > 0 && <div className="bg-[#F8FAFC] border border-gray-900/5 rounded-2xl p-5 text-[11px] font-semibold text-gray-500 space-y-1.5">{estimate.auditSummary.map((x, i) => <div key={i}>• {x}</div>)}</div>}

                {inputs.moveType === "LD" && estimate.billableCF != null && estimate.billableCF > 0 && (
                    <div className="bg-[#F4F9FF] rounded-[1.5rem] p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <ArrowUpFromLine className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Long Distance Breakdown</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white p-3.5 rounded-xl text-center ring-1 ring-gray-900/5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                <div className="text-[10px] font-bold text-gray-400 mb-1">ITEMS VOLUME</div>
                                <div className="text-lg font-black text-gray-900"><CountUp end={estimate.billableCF || 0} duration={0.8} separator="," /></div>
                                <div className="text-[10px] font-semibold text-gray-500">Net Total, cf</div>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl text-center ring-1 ring-gray-900/5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                <div className="text-[10px] font-bold text-gray-400 mb-1">TRUCK LOAD</div>
                                <div className="text-lg font-black text-gray-900">~<CountUp end={estimate.truckSpaceCF || 0} duration={0.8} separator="," /></div>
                                <div className="text-[10px] font-semibold text-gray-500">Actual Space, cf</div>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl text-center ring-1 ring-gray-900/5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                                <div className="text-[10px] font-bold text-gray-400 mb-1">EST. WEIGHT</div>
                                <div className="text-lg font-black text-gray-900"><CountUp end={estimate.weight || 0} duration={0.8} separator="," /></div>
                                <div className="text-[10px] font-semibold text-gray-500">lbs</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-900/5 flex justify-between items-center"><span className="text-xs font-bold text-gray-500">Blankets</span><span className="text-lg font-black text-gray-900">{estimate.materials?.blankets || 0}</span></div>
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-900/5 flex justify-between items-center"><span className="text-xs font-bold text-gray-500">Boxes</span><span className="text-lg font-black text-gray-900">~{estimate.materials?.boxes || 0}</span></div>
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-900/5 flex justify-between items-center"><span className="text-xs font-bold text-gray-500">Wardrobes</span><span className="text-lg font-black text-gray-900">{estimate.materials?.wardrobes || 0}</span></div>
                </div>

                {estimate.advice?.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Smart Tips</span></div>
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 text-[11px] text-gray-700 space-y-2 font-bold leading-relaxed shadow-sm">{estimate.advice.map((x, i) => <div key={i} className="flex gap-2"><span className="text-amber-500">•</span><span>{x}</span></div>)}</div>
                    </div>
                )}

                {estimate.risks?.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk Factors</span></div>
                        <div className="space-y-2">{estimate.risks.map((r, i) => <div key={i} className={`p-4 rounded-3xl text-[11px] font-bold leading-snug flex items-start gap-2 shadow-sm border ${r.level === 'critical' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-orange-50 border-orange-100 text-orange-800'}`}><span>• {r.text}</span></div>)}</div>
                    </div>
                )}

                {/* MOBILE COMPACT SAVE BAR */}
                <div className="md:hidden flex items-center gap-2 pt-3">
                    <input type="text" placeholder="Client name" value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[12px] font-semibold outline-none shadow-sm" />
                    <button onClick={handleSaveEstimate} disabled={!clientName.trim() || isSaving}
                        className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold shadow-sm disabled:opacity-40 whitespace-nowrap">
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>

                {/* FLOATING BOTTOM BAR FOR MOBILE */}
                <div className="fixed bottom-4 left-4 right-4 md:static md:p-0 md:mt-2 md:border-t md:border-gray-100 md:pt-6 flex gap-3 z-50">
                    <button onClick={handleCopy} className="flex-1 md:flex-none md:w-[220px] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[12px] font-bold transition-all duration-300 bg-gray-900 text-white hover:bg-black active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.15)] whitespace-nowrap overflow-hidden">
                        {copyStatus === 'success' ? <><Check className="w-4 h-4 text-emerald-400 shrink-0" /><span className="truncate">COPIED</span></> : <><Clipboard className="w-4 h-4 shrink-0" /><span className="truncate">COPY REPORT</span></>}
                    </button>

                    <button onClick={() => setShowDetails(!showDetails)} className="flex-none flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-900/5 text-gray-700 px-6 py-4 rounded-2xl text-[12px] font-bold active:scale-95 transition-colors w-auto ml-auto">
                        {showDetails ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}{showDetails ? "Hide" : "Details"}
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
                            {estimate.overridesApplied?.length > 0 && <div className="mt-4 bg-white rounded-2xl p-4 text-[11px] text-gray-500 font-bold border border-gray-100 shadow-sm">Overrides Applied: {estimate.overridesApplied.join(", ")}</div>}
                        </div>
                    </div>
                )}
            </div></GlassPanel>
        </div>
    );
};
