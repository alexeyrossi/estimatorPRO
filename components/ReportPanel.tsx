import React, { useMemo, useState, useEffect, useRef } from 'react';
import { EstimateInputs, EstimateResult } from '@/lib/types/estimator';
import {
    Truck, Box, List, Weight, Terminal, ChevronRight, Lock, Scale, PackageOpen, Clock, CalendarDays, Info, Users, AlertTriangle, ArrowUpFromLine, Check, Clipboard, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { GlassPanel } from './GlassPanel';
import { MetricCard } from './MetricCard';
import { ConfidenceDonut } from './ConfidenceDonut';
import jsPDF from 'jspdf';



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

    const rawInventoryVolume = useMemo(() => {
        const raw = (estimate.parsedItems || []).reduce((sum, item) => sum + (item.cf || 0), 0);
        return raw > 0 ? Math.round(raw / 25) * 25 : 0;
    }, [estimate.parsedItems]);
    const primaryVolume = inputs.moveType === "LD" && estimate.billableCF ? estimate.billableCF : estimate.finalVolume;
    const primaryVolumeLabel = "Volume";
    const primaryVolumeSub = inputs.moveType === "LD" && estimate.billableCF ? "Adjusted Estimate" : "Based on Inventory";

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
                if (y + needed > H - 40) {
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
            const homeSizeLabel = inputs.homeSize === 'Commercial' ? 'Commercial' : inputs.homeSize === '1' ? '1 BDR / Less' : `${inputs.homeSize} BDR`;
            const paramLine = [homeSizeLabel, `${inputs.distance} mi`, inputs.moveType]
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
                { label: inputs.moveType === 'LD' ? 'SHIPMENT SIZE' : 'VOLUME', value: `${(inputs.moveType === 'LD' && estimate.billableCF ? estimate.billableCF : estimate.finalVolume || 0).toLocaleString()} cf` },
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
                    { label: 'Inventory Volume', value: `${rawInventoryVolume.toLocaleString()} cf` },
                    { label: 'Truck Load', value: `~${(estimate.truckSpaceCF || 0).toLocaleString()} cf` },
                    { label: 'Est. Weight', value: `${(estimate.weight || 0).toLocaleString()} lbs` },
                ];
                const ldColW = (W - M * 2) / 3;
                ldData.forEach((d, i) => {
                    const x = M + i * ldColW;
                    pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(160, 160, 160);
                    pdf.text(d.label, x, y);
                    pdf.setFontSize(13); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 30, 30);
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
                const xLeft = M;
                const xRight = M + tableW + 8;
                const rowCount = Math.max(col1.length, col2.length);

                const drawItem = (item: { qty?: number; name?: string; cf?: number }, xBase: number) => {
                    pdf.setFontSize(9); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 30, 30);
                    pdf.text(`x${item.qty}`, xBase, y);
                    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(80, 80, 80);
                    pdf.text(item.name || '', xBase + 14, y);
                    const cfTotal = item.cf || 0;
                    pdf.setFont('helvetica', 'normal'); pdf.setTextColor(140, 140, 140);
                    pdf.text(`${cfTotal} cf`, xBase + tableW - 2, y, { align: 'right' });
                };

                for (let r = 0; r < rowCount; r++) {
                    checkPage(5);
                    if (col1[r]) drawItem(col1[r], xLeft);
                    if (col2[r]) drawItem(col2[r], xRight);
                    y += 5;
                }

                y += 2; drawLine(y); y += 8;
            }

            // ========== RISKS & TIPS ==========
            const tips = [...(estimate.advice || [])];
            const risks = (estimate.risks || [])
                .filter((r: { text?: string; level?: string }) => r.text)
                .map((r: { text?: string; level?: string }) => r.text);
            const allNotes = [...tips, ...risks];

            if (allNotes.length > 0) {
                checkPage(10);
                pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(160, 160, 160);
                pdf.text('NOTES & RECOMMENDATIONS', M, y);
                y += 6;

                allNotes.forEach((note: string | undefined) => {
                    if (!note) return;
                    checkPage(6);
                    pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(120, 120, 120);
                    const lines = pdf.splitTextToSize(note, W - M * 2);
                    lines.forEach((l: string) => { pdf.text(l, M, y); y += 4.5; });
                });
            }

            // ========== FOOTER ==========
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(150);

                // Page number on every page
                const pageLabel = `Page ${i} of ${pageCount}`;
                const pageLabelW = pdf.getTextWidth(pageLabel);
                pdf.text(pageLabel, (W / 2) - (pageLabelW / 2), H - 10);

                // "Generated" stamp only on the last page
                if (i === pageCount) {
                    const stamp = `Generated ${today} | Estimator V11.59 PRO`;
                    const stampW = pdf.getTextWidth(stamp);
                    pdf.text(stamp, (W / 2) - (stampW / 2), H - 15);
                }
            }

            // ========== SAVE ==========
            const fn = clientName
                ? `Estimate_${clientName.replace(/\s+/g, '_')}.pdf`
                : 'Moving_Estimate.pdf';
            pdf.save(fn);

        } catch (e) {
            console.error('PDF error:', e);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const heavyBadgeText = useMemo(() => {
        const arr = estimate.heavyItemNames || []; if (!arr.length) return null;
        const first = String(arr[0]).replace(/\s*\(.*?\)\s*/g, "").trim(); const lower = first.toLowerCase();
        const label = lower.includes("piano") ? "PIANO" : lower.includes("safe") ? "SAFE" : lower.includes("pool") ? "POOL TABLE" : lower.includes("clock") ? "CLOCK" : lower.includes("copier") ? "COPIER" : lower.includes("treadmill") ? "TREADMILL" : lower.includes("gym") ? "GYM" : first.toUpperCase();
        return `HEAVY: ${label}${arr.length > 1 ? ` +${arr.length - 1}` : ""}`;
    }, [estimate.heavyItemNames]);

    return (
        <div id="pdf-export-area" className="flex-1 flex flex-col gap-6">
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${isCalculating ? 'opacity-60' : 'opacity-100'}`}>
                <MetricCard icon={Box} label={primaryVolumeLabel} value={formatMetric(<AnimatedNumber value={primaryVolume} />, "cu ft")} sub={primaryVolumeSub} variant="blue" />
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
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-full select-none cursor-default">
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
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Inventory Volume</div>
                                        <div className="text-2xl font-black text-gray-900 tabular-nums">{formatMetric(<AnimatedNumber value={rawInventoryVolume} />, "cu ft")}</div>
                                        <div className="text-[11px] font-semibold text-gray-400 mt-0.5 truncate">Items Only</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Truck Load</div>
                                        <div className="text-2xl font-black text-gray-900 tabular-nums">{formatMetric(<AnimatedNumber value={estimate.truckSpaceCF || 0} prefix="~" />, "cu ft")}</div>
                                        <div className="text-[11px] font-semibold text-gray-400 mt-0.5 truncate">Actual Space Needed</div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                                    <span>💡</span> Move Logic & Tips
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
                        className={`px-4 py-2.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${saveStatus === 'success' ? 'bg-emerald-500 text-white' :
                            isSaving ? 'bg-gray-900 text-white' :
                                clientName.trim() ? 'bg-gray-900 text-white hover:bg-gray-800' :
                                    'bg-gray-400 text-white'
                            }`}>
                        {saveStatus === 'success' ? '✓ Saved' : isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </button>
                </div>
                {saveStatus === 'error' && (
                    <div className="md:hidden text-red-500 text-[11px] font-bold mt-2 text-right">
                        Save failed. Please try again.
                    </div>
                )}

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
                                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-bold transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isGeneratingPDF ? (
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
                                        {["volume", "trucks", "crew", "timeMin", "timeMax", "blankets"].map(k => {
                                            const autoValue = k === 'blankets' || k === 'boxes'
                                                ? estimate.materials?.[k as "blankets" | "boxes" | "wardrobes"]
                                                : estimate[k as keyof EstimateResult];
                                            const label = k.charAt(0).toUpperCase() + k.slice(1);
                                            const placeholder = autoValue ? `${label} (Auto: ${autoValue})` : `${label} (Auto)`;
                                            return (
                                                <input
                                                    key={k}
                                                    placeholder={placeholder}
                                                    value={overrides[k as keyof typeof overrides] || ""}
                                                    onChange={e => setOverrides({ ...overrides, [k]: e.target.value })}
                                                    className="text-[11px] font-bold p-3.5 rounded-xl bg-gray-800 text-white border border-transparent outline-none focus:bg-gray-700 placeholder:text-gray-500 transition-colors"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

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
