import React, { useMemo, useState, useEffect, useRef } from 'react';
import { EstimateInputs, EstimateResult } from '@/lib/types/estimator';
import {
    Box, Truck, Clock, ShieldCheck, History, Info, ChevronRight, ArrowUpFromLine,
    CalendarDays, Users, ShieldAlert, AlertTriangle, Lightbulb, Check, Clipboard, ChevronDown, Lock, List, Terminal, Weight, Scale, PackageOpen
} from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { MetricCard } from './MetricCard';
import { ConfidenceDonut } from './ConfidenceDonut';
import { LDBrokerPanel } from './LDBrokerPanel';
import jsPDF from 'jspdf';



const AnimatedNumber = ({ value: rawValue, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
    const value = rawValue || 0;
    const [display, setDisplay] = useState(value);
    const prevValue = useRef(value);
    const rafId = useRef(0);
    const firstRender = useRef(true);

    useEffect(() => {
        const safeValue = rawValue || 0;
        if (firstRender.current) {
            firstRender.current = false;
            setDisplay(safeValue);
            prevValue.current = safeValue;
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
    }, [rawValue]);

    return <>{prefix}{(display ?? 0).toLocaleString()}{suffix}</>;
};

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

    const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

    const isLabor = inputs.moveType === "Labor";

    const formatMetric = (val: React.ReactNode | number, unit: string) => (
        <span className="tabular-nums whitespace-nowrap inline-flex items-baseline">
            {typeof val === 'number' ? val.toLocaleString() : (val || 0)}
            <span className="ml-1.5 text-[13px] font-bold text-gray-400 lowercase tracking-normal">
                {unit}
            </span>
        </span>
    );

    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const W = pdf.internal.pageSize.getWidth();
            const H = pdf.internal.pageSize.getHeight();
            const M = 16;
            let y = M;

            const addText = (text: string, x: number, size: number, color: [number, number, number], weight: string = 'normal') => {
                pdf.setFontSize(size);
                pdf.setTextColor(...color);
                pdf.setFont('helvetica', weight);
                pdf.text(text, x, y);
            };

            const drawLine = (y1: number) => {
                pdf.setDrawColor(230);
                pdf.setLineWidth(0.3);
                pdf.line(M, y1, W - M, y1);
            };

            const checkPage = (needed: number) => {
                if (y + needed > H - 20) {
                    pdf.addPage();
                    y = M;
                }
            };

            // ========== HEADER ==========
            addText('MOVING ESTIMATE', M, 22, [30, 30, 30], 'bold');
            y += 7;
            const today = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            addText(today, M, 9, [160, 160, 160]);

            if (clientName) {
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(30, 30, 30);
                pdf.text(clientName, W - M, y - 7, { align: 'right' });
            }
            const paramLine = [inputs.homeSize, `${inputs.distance} mi`, inputs.moveType]
                .filter(Boolean).join(' · ');
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(160, 160, 160);
            pdf.text(paramLine, W - M, y, { align: 'right' });

            y += 4;
            pdf.setDrawColor(30);
            pdf.setLineWidth(0.6);
            pdf.line(M, y, W - M, y);
            y += 10;

            // ========== METRICS ROW ==========
            const metrics = [
                { label: 'VOLUME', value: `${(estimate.finalVolume || 0).toLocaleString()} cf` },
                { label: 'TIME EST.', value: `${estimate.timeMin || 0}\u2013${estimate.timeMax || 0}h` },
                { label: 'TRUCKS', value: `${estimate.trucksFinal || 0}` },
                { label: 'CREW', value: `${estimate.crew || 0} movers` },
            ];
            const colW = (W - M * 2) / 4;
            metrics.forEach((m, i) => {
                const x = M + i * colW;
                pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(160, 160, 160);
                pdf.text(m.label, x, y);
                pdf.setFontSize(18); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 30, 30);
                pdf.text(m.value, x, y + 8);
            });
            y += 16;
            drawLine(y); y += 8;

            // ========== CONFIDENCE + HEAVY ==========
            pdf.setFontSize(14); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(16, 185, 129);
            pdf.text(`${estimate.confidence?.score || 0}%`, M, y);
            pdf.setFontSize(10); pdf.setTextColor(160, 160, 160);
            pdf.text('Confidence', M + 18, y);

            if (estimate.heavyItemNames?.length && estimate.heavyItemNames.length > 0) {
                const heavyText = `HEAVY: ${estimate.heavyItemNames.join(', ')}`;
                const textWidth = pdf.getTextWidth(heavyText);
                const badgeW = textWidth + 10;
                const badgeX = W - M - badgeW;
                const badgeY = y - 4;
                // Draw rounded red badge background
                pdf.setFillColor(254, 242, 242); // red-50
                pdf.roundedRect(badgeX, badgeY, badgeW, 6, 3, 3, 'F');
                pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(220, 50, 50);
                pdf.text(heavyText, badgeX + 5, y);
            }
            y += 6;

            // ========== AUDIT NOTES ==========
            if (estimate.auditSummary?.length && estimate.auditSummary.length > 0) {
                y += 2;
                pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(140, 140, 140);
                estimate.auditSummary.forEach((tip: string) => {
                    checkPage(6);
                    pdf.text(tip, M, y);
                    y += 5;
                });
            }
            y += 2; drawLine(y); y += 8;

            // ========== LD BREAKDOWN / LOCAL LINE ==========
            if (inputs.moveType === 'LD' && estimate.billableCF != null && estimate.billableCF > 0) {
                checkPage(30);
                pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(59, 130, 246);
                pdf.text('LONG DISTANCE BREAKDOWN', M, y);
                y += 7;
                const ldData = [
                    { label: 'Items Volume', value: `${(estimate.billableCF || 0).toLocaleString()} cf` },
                    { label: 'Truck Load', value: `~${(estimate.truckSpaceCF || 0).toLocaleString()} cf` },
                    { label: 'Est. Weight', value: `${(estimate.weight || 0).toLocaleString()} lbs` },
                ];
                const ldColW = (W - M * 2) / 3;
                ldData.forEach((d, i) => {
                    const x = M + i * ldColW;
                    pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(160, 160, 160);
                    pdf.text(d.label, x, y);
                    pdf.setFontSize(14); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 30, 30);
                    pdf.text(d.value, x, y + 6);
                });
                y += 14; drawLine(y); y += 8;
            } else if (inputs.moveType === 'Local') {
                checkPage(10);
                pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(160, 160, 160);
                const accessInfo = inputs.accessOrigin || 'ground';
                pdf.text(`Local Service \u00b7 ${inputs.distance} miles \u00b7 ${accessInfo} access`, M, y);
                y += 4; drawLine(y); y += 8;
            }

            // ========== MATERIALS ==========
            checkPage(20);
            const matData = [
                { label: 'Blankets', value: `${estimate.materials?.blankets || 0}` },
                { label: 'Boxes', value: `~${estimate.materials?.boxes || 0}` },
                { label: 'Wardrobes', value: `${estimate.materials?.wardrobes || 0}` },
            ];
            const matColW = (W - M * 2) / 3;
            matData.forEach((d, i) => {
                const x = M + i * matColW;
                pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(160, 160, 160);
                pdf.text(d.label.toUpperCase(), x, y);
                pdf.setFontSize(16); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 30, 30);
                pdf.text(d.value, x, y + 7);
            });
            y += 14; drawLine(y); y += 8;

            // ========== INVENTORY TABLE ==========
            if (estimate.parsedItems?.length && estimate.parsedItems.length > 0) {
                checkPage(15);
                pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(160, 160, 160);
                pdf.text(`DETECTED ITEMS (${estimate.detectedQtyTotal || estimate.parsedItems.length})`, M, y);
                y += 6;

                const half = Math.ceil(estimate.parsedItems.length / 2);
                const col1 = estimate.parsedItems.slice(0, half);
                const col2 = estimate.parsedItems.slice(half);
                const tableW = (W - M * 2 - 8) / 2;

                let maxY = y;
                [col1, col2].forEach((col, ci) => {
                    let localY = y;
                    const xBase = M + ci * (tableW + 8);
                    col.forEach(item => {
                        checkPage(5);
                        pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(80, 80, 80);
                        pdf.text(item.name || '', xBase, localY);
                        pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 30, 30);
                        pdf.text(`x${item.qty}`, xBase + tableW - 2, localY, { align: 'right' });
                        localY += 5;
                    });
                    maxY = Math.max(maxY, localY);
                });
                y = maxY;
                y += 2; drawLine(y); y += 8;
            }

            // ========== RISKS & TIPS ==========
            const tips = [...(estimate.advice || [])];
            const risks = (estimate.risks || []).filter((r: any) => r.text).map((r: any) => r.text);
            const allNotes = [...tips, ...risks];

            if (allNotes.length > 0) {
                checkPage(10);
                pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(160, 160, 160);
                pdf.text('NOTES & RECOMMENDATIONS', M, y);
                y += 6;

                allNotes.forEach((note: string) => {
                    checkPage(6);
                    pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(120, 120, 120);
                    const lines = pdf.splitTextToSize(note, W - M * 2);
                    lines.forEach((l: string) => { pdf.text(l, M, y); y += 4.5; });
                });
            }

            // ========== FOOTER ON ALL PAGES ==========
            const totalPages = pdf.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(7); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(180, 180, 180);
                pdf.text(
                    `Generated ${today} | Estimator V11.59 PRO | Page ${i} of ${totalPages}`,
                    W / 2, H - 8, { align: 'center' }
                );
            }

            // ========== SAVE ==========
            const fn = clientName
                ? `Estimate_${clientName.replace(/\s+/g, '_')}.pdf`
                : 'Moving_Estimate.pdf';
            pdf.save(fn);

        } catch (e) {
            console.error('PDF error:', e);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const heavyBadgeText = useMemo(() => {
        const arr = estimate.heavyItemNames || []; if (!arr.length) return null;
        const first = String(arr[0]).replace(/\s*\(.*?\)\s*/g, "").trim(); const lower = first.toLowerCase();
        let label = lower.includes("piano") ? "PIANO" : lower.includes("safe") ? "SAFE" : lower.includes("pool") ? "POOL TABLE" : lower.includes("clock") ? "CLOCK" : lower.includes("copier") ? "COPIER" : lower.includes("treadmill") ? "TREADMILL" : lower.includes("gym") ? "GYM" : first.toUpperCase();
        return `HEAVY: ${label}${arr.length > 1 ? ` +${arr.length - 1}` : ""}`;
    }, [estimate.heavyItemNames]);

    return (
        <div id="pdf-export-area" className="flex-1 flex flex-col gap-6">
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isCalculating ? 'opacity-60' : 'opacity-100'}`}>
                <MetricCard icon={Box} label="Volume" value={formatMetric(<AnimatedNumber value={estimate.finalVolume} />, "cu ft")} sub="Based on Inventory" variant="blue" />
                <MetricCard icon={estimate.splitRecommended ? CalendarDays : Clock} label={estimate.splitRecommended ? "Split Rec." : "Time Est."} value={<><AnimatedNumber value={estimate.timeMin} />–<AnimatedNumber value={estimate.timeMax} />h</>} sub={estimate.splitRecommended ? "SPLIT TO 2 DAYS" : "Est. Range"} variant={estimate.splitRecommended ? "red" : "purple"} isCritical={estimate.splitRecommended} />
                {isLabor ? <MetricCard icon={Info} label="Service" value="Labor" sub="No Trucks" variant="gray" /> : <MetricCard icon={Truck} label="Trucks" value={<AnimatedNumber value={estimate.trucksFinal} />} sub={estimate.truckSizeLabel?.replace(/\s*Truck\s*/i, ' ').trim()} variant="orange" />}
                <MetricCard icon={Users} label="Crew" value={<AnimatedNumber value={estimate.crew} />} sub="Movers" variant="emerald" advice={estimate.crewSuggestion} />
            </div>

            <GlassPanel><div className="p-7 flex flex-col pb-32 md:pb-7">

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
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 backdrop-blur-md rounded-full select-none">
                                <Weight className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
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
                                        <div className="text-2xl font-black text-gray-900 tabular-nums">{formatMetric(<AnimatedNumber value={estimate.billableCF || 0} />, "cu ft")}</div>
                                        <div className="text-[10px] font-medium text-gray-400 mt-0.5">Net Total</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Truck Load</div>
                                        <div className="text-2xl font-black text-gray-900 tabular-nums">{formatMetric(<AnimatedNumber value={estimate.truckSpaceCF || 0} prefix="~" />, "cu ft")}</div>
                                        <div className="text-[10px] font-medium text-gray-400 mt-0.5">Actual Space</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Est. Weight</div>
                                        <div className="text-2xl font-black text-gray-900 tabular-nums">{formatMetric(<AnimatedNumber value={estimate.weight || 0} />, "lbs")}</div>
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
                                <div className="text-2xl font-black text-gray-900 tabular-nums">{estimate.materials?.blankets || 0}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Boxes</div>
                                <div className="text-2xl font-black text-gray-900 tabular-nums">~{estimate.materials?.boxes || 0}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Wardrobes</div>
                                <div className="text-2xl font-black text-gray-900 tabular-nums">{estimate.materials?.wardrobes || 0}</div>
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
                                        <div key={i} className={`text-[12px] font-medium leading-relaxed ${r.level === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                                            {r.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* MOBILE COMPACT SAVE BAR */}
                <div className="md:hidden flex items-center gap-2 pt-3">
                    <input type="text" placeholder="Client name" value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className="flex-1 bg-gray-50 border-transparent rounded-xl px-3 py-2.5 text-[12px] font-semibold outline-none" />
                    <button onClick={handleSaveEstimate} disabled={!clientName.trim() || isSaving}
                        className={`px-4 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-300 active:scale-95 ${saveStatus === 'success' ? 'bg-emerald-500 text-white' :
                            isSaving ? 'bg-gray-900 text-white animate-pulse' :
                                clientName.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' :
                                    'bg-gray-400 text-white cursor-not-allowed'
                            }`}>
                        {saveStatus === 'success' ? '✓ Saved' : isSaving ? '...' : 'Save'}
                    </button>
                </div>

                {/* ACTION BAR */}
                <div data-no-pdf className="flex flex-col mt-2">
                    <div className="border-t border-gray-100" />
                    <div className="flex items-center justify-between w-full pt-4">
                        <div className="flex items-center gap-3">
                            <button onClick={handleCopy} className={`flex-1 md:flex-none md:w-[220px] flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-[12px] font-bold transition-all duration-300 active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.15)] whitespace-nowrap overflow-hidden ${copyStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                {copyStatus === 'success' ? <><Check className="w-4 h-4 shrink-0" /><span className="truncate">✓ Copied!</span></> : <><Clipboard className="w-4 h-4 shrink-0" /><span className="truncate">COPY REPORT</span></>}
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isGeneratingPDF}
                                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-bold transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98] ${isGeneratingPDF ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isGeneratingPDF ? (
                                    'Generating...'
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        PDF
                                    </>
                                )}
                            </button>
                        </div>

                        <button onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-colors py-2 px-1 ml-auto">
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`} />
                            <span>{showDetails ? 'Hide' : 'Details'}</span>
                        </button>
                    </div>
                </div>

                <div className={`grid transition-all duration-500 ease-in-out ${showDetails ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div className="pt-8 mt-4 border-t border-gray-100">

                            {adminMode && (
                                <div className="mb-6 bg-gray-900 rounded-[2rem] p-6 shadow-lg">
                                    <div className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-white" /> Manager Overrides
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {["volume", "trucks", "crew", "timeMin", "timeMax", "blankets"].map(k => (
                                            <input
                                                key={k}
                                                placeholder={`${k.charAt(0).toUpperCase() + k.slice(1)} (${k === 'blankets' || k === 'boxes'
                                                    ? estimate.materials?.[k as "blankets" | "boxes" | "wardrobes"] || 0
                                                    : estimate[k as keyof EstimateResult] || 0
                                                    })`}
                                                value={overrides[k as keyof typeof overrides] || ""}
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
                                                <div className="flex items-center gap-2 mr-2 overflow-hidden">
                                                    <span className="font-bold text-gray-700 text-[11px] truncate">
                                                        {item.name}
                                                        {item.room && <span className="text-gray-400 ml-1 font-semibold text-[9px]">[{item.room}]</span>}
                                                    </span>
                                                    {(item.isWeightHeavy || item.isManualHeavy) && (
                                                        <div title="Heavy Item" className="flex items-center justify-center shrink-0">
                                                            <Weight className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
                                                        </div>
                                                    )}
                                                </div>
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
                                    <div className="flex items-center gap-2 mb-2"><Terminal className="w-4 h-4 text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Volume Calculation Path</span></div>
                                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                                            {/* Step 1: Raw Inventory */}
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Raw Inventory</span>
                                                <span className="text-xl font-black text-gray-300">{estimate.netVolume || Math.round((estimate.finalVolume || 0) / 1.05)} <span className="text-sm font-medium text-gray-500">cu ft</span></span>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-700 hidden md:block" />

                                            {/* Step 2: Safety Margin */}
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">+ Safety Margin (5-10%)</span>
                                                <span className="text-xl font-black text-gray-300">{estimate.billableCF || estimate.finalVolume || 0} <span className="text-sm font-medium text-gray-500">cu ft</span></span>
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-gray-700 hidden md:block" />

                                            {/* Step 3: Actual Space (Final) */}
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">+ Loading Gaps ({`~`}8.3%)</span>
                                                <span className="text-2xl font-black text-emerald-400">{estimate.truckSpaceCF || Math.round((estimate.finalVolume || 0) * 1.083)} <span className="text-sm font-medium text-emerald-500/50">cu ft</span></span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-5 border-t border-gray-800/80 flex flex-wrap items-center gap-x-12 gap-y-4">
                                            <div className="flex gap-3 items-start">
                                                <Scale className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Weight Baseline</span>
                                                    <span className="text-[13px] font-bold text-gray-300">7 lbs / cu ft</span>
                                                    <span className="text-[11px] text-gray-600 mt-0.5">DOT Tariff Standard</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 items-start">
                                                <PackageOpen className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Stacking Factor</span>
                                                    <span className="text-[13px] font-bold text-gray-300">~10% Volume Allowance</span>
                                                    <span className="text-[11px] text-gray-600 mt-0.5">Furniture is not perfectly square</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 items-start">
                                                <Box className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Box Algorithm</span>
                                                    <span className="text-[13px] font-bold text-gray-300">Auto-Generated ({inputs.homeSize})</span>
                                                    <span className="text-[11px] text-gray-600 mt-0.5">Min. requirement for safe transport</span>
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
