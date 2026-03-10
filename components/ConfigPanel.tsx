import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { EstimateInputs, NormalizedRow, EstimateResult, RowsStatus } from '@/lib/types/estimator';
import { Settings, MapPin, Trash2, Plus, Weight, Undo2, ListChecks, RefreshCcw, AlignLeft } from 'lucide-react';
import { MAX_EXTRA_STOPS } from '@/lib/estimatePolicy';
import { GlassPanel } from './GlassPanel';
import { Select } from './Select';
import { InputLabel } from './InputLabel';
import { AccessSegmented } from './AccessSegmented';

type InventoryViewportMetrics = {
    isMobile: boolean;
    rawMinHeight: number;
    rawMaxHeight: number;
    normalizedMaxHeight: number;
};

const DESKTOP_VIEWPORT_METRICS: InventoryViewportMetrics = {
    isMobile: false,
    rawMinHeight: 224,
    rawMaxHeight: 320,
    normalizedMaxHeight: 288,
};

const INVENTORY_SCROLL_MARGIN_BOTTOM = 'calc(8rem + env(safe-area-inset-bottom))';

const getInventoryViewportMetrics = (): InventoryViewportMetrics => {
    if (typeof window === 'undefined') return DESKTOP_VIEWPORT_METRICS;

    const isMobile = window.innerWidth < 768;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const rawMinHeight = isMobile ? 96 : 224;
    const rawMaxHeight = isMobile
        ? Math.max(rawMinHeight, Math.min(260, Math.round(viewportHeight * 0.32)))
        : 320;
    const normalizedMaxHeight = isMobile
        ? Math.max(220, Math.min(360, Math.round(viewportHeight * 0.4)))
        : 288;

    return {
        isMobile,
        rawMinHeight,
        rawMaxHeight,
        normalizedMaxHeight,
    };
};

const hasSameViewportMetrics = (a: InventoryViewportMetrics, b: InventoryViewportMetrics) =>
    a.isMobile === b.isMobile
    && a.rawMinHeight === b.rawMinHeight
    && a.rawMaxHeight === b.rawMaxHeight
    && a.normalizedMaxHeight === b.normalizedMaxHeight;

let inventoryViewportSnapshot = DESKTOP_VIEWPORT_METRICS;

const measureRawComposer = (
    textarea: HTMLTextAreaElement | null,
    viewport: InventoryViewportMetrics
): { height: number; overflowY: 'hidden' | 'auto' } | null => {
    if (!textarea) return null;

    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;

    return {
        height: Math.max(viewport.rawMinHeight, Math.min(scrollHeight, viewport.rawMaxHeight)),
        overflowY: scrollHeight > viewport.rawMaxHeight ? 'auto' : 'hidden',
    };
};

const subscribeToInventoryViewport = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    window.addEventListener('resize', callback);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener('resize', callback);

    return () => {
        window.removeEventListener('resize', callback);
        visualViewport?.removeEventListener('resize', callback);
    };
};

const getInventoryViewportSnapshot = () => {
    const nextViewport = getInventoryViewportMetrics();
    if (!hasSameViewportMetrics(inventoryViewportSnapshot, nextViewport)) {
        inventoryViewportSnapshot = nextViewport;
    }
    return inventoryViewportSnapshot;
};

const getInventoryViewportServerSnapshot = () => DESKTOP_VIEWPORT_METRICS;

const getInventoryModeToggleMeta = (
    inventoryMode: "raw" | "normalized",
    rowsStatus: RowsStatus
) => {
    if (inventoryMode === "normalized") {
        return { label: "Text View", title: "Switch to text view", Icon: AlignLeft };
    }

    if (rowsStatus === "stale") {
        return { label: "Re-sync Items", title: "Re-sync detected items", Icon: RefreshCcw };
    }

    return { label: "Item Editor", title: "Open item editor", Icon: ListChecks };
};

interface ConfigPanelProps {
    inputs: EstimateInputs;
    setInputs: React.Dispatch<React.SetStateAction<EstimateInputs>>;
    inventoryMode: "raw" | "normalized";
    normalizedRows: NormalizedRow[];
    setNormalizedRows: React.Dispatch<React.SetStateAction<NormalizedRow[]>>;
    rowsStatus: RowsStatus;
    inventoryClipped: boolean;
    setInventoryClipped: (v: boolean) => void;
    addRowInput: string;
    setAddRowInput: (v: string) => void;
    suggestedItems: string[];
    handleInventoryModeToggle: () => void | Promise<void>;
    handleRawInventoryChange: (text: string) => void;
    handleAddRow: () => void;
    handleRowQtyChange: (id: string, value: string, blur?: boolean) => void;
    estimate: EstimateResult | Partial<EstimateResult>;
}

export const ConfigPanel = ({
    inputs, setInputs, inventoryMode, normalizedRows, setNormalizedRows, rowsStatus,
    inventoryClipped, setInventoryClipped, addRowInput, setAddRowInput, suggestedItems,
    handleInventoryModeToggle, handleRawInventoryChange, handleAddRow, handleRowQtyChange, estimate
}: ConfigPanelProps) => {

    const isLabor = inputs.moveType === "Labor";
    const inventoryModeToggle = getInventoryModeToggleMeta(inventoryMode, rowsStatus);

    const [undoCache, setUndoCache] = useState<{ text: string; rows: NormalizedRow[] } | null>(null);
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rawTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const inventoryViewport = useSyncExternalStore(
        subscribeToInventoryViewport,
        getInventoryViewportSnapshot,
        getInventoryViewportServerSnapshot
    );

    const handleClearInventory = () => {
        // Save current state for undo
        setUndoCache({ text: inputs.inventoryText, rows: [...normalizedRows] });

        // Clear
        setInputs(prev => ({ ...prev, inventoryText: "" }));
        setNormalizedRows([]);

        // Auto-expire undo after 10 seconds
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = setTimeout(() => setUndoCache(null), 10000);
    };

    const handleUndo = () => {
        if (!undoCache) return;
        setInputs(prev => ({ ...prev, inventoryText: undoCache.text }));
        setNormalizedRows(undoCache.rows);
        setUndoCache(null);
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };

    const limitInventoryText = (val: string) => {
        const MAX_CHARS = 12000;
        let v = val ?? "";
        if (v.length > MAX_CHARS) v = v.slice(0, MAX_CHARS);
        return v;
    }

    const detectedQtyTotal = (estimate as EstimateResult)?.detectedQtyTotal ?? 0;

    useEffect(() => {
        return () => {
            if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (inventoryMode !== "raw") return;

        const nextStyle = measureRawComposer(rawTextareaRef.current, inventoryViewport);
        if (!nextStyle) return;
        const textarea = rawTextareaRef.current;
        if (!textarea) return;

        textarea.style.height = `${nextStyle.height}px`;
        textarea.style.overflowY = nextStyle.overflowY;
    }, [inputs.inventoryText, inventoryMode, inventoryViewport]);

    const handleRawInventoryFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        const target = event.currentTarget;
        requestAnimationFrame(() => {
            target.scrollIntoView({ block: 'nearest' });
        });
    };

    return (
        <GlassPanel><div className="p-4 md:p-6 flex-1 flex flex-col space-y-5 md:space-y-6">
            <div className="hidden md:flex items-center gap-2 mb-2 pb-5 border-b border-gray-100">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parameters</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputLabel label="Size" />
                    <Select id="homeSize" value={inputs.homeSize} onChange={e => setInputs({ ...inputs, homeSize: e.target.value })} options={[
                        { value: "1", label: "1 BDR / Less" }, { value: "2", label: "2 BDR" },
                        { value: "3", label: "3 BDR" }, { value: "4", label: "4 BDR" }, { value: "5", label: "5+ BDR" }, { value: "Commercial", label: "Commercial" }
                    ]} />
                </div>
                <div>
                    <InputLabel label="Distance" />
                    <div className={`relative ${isLabor ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input
                            type="text" inputMode="numeric" disabled={isLabor} value={inputs.distance}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
                                setInputs({ ...inputs, distance: val });
                            }}
                            className="w-full rounded-2xl px-4 py-3.5 text-base font-bold outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            aria-label="Moving distance in miles"
                        />
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputLabel label="Service" />
                    <Select id="moveType" value={inputs.moveType}
                        onChange={e => {
                            const v = e.target.value;
                            setInputs(prev => {
                                const next = { ...prev, moveType: v as "Local" | "LD" | "Labor" };
                                if (v !== "Local" && prev.accessDest !== "ground") { next.accessDest = "ground"; }
                                return next;
                            });
                        }}
                        options={[{ value: "Local", label: "Local" }, { value: "LD", label: "Long Distance" }, { value: "Labor", label: "Labor" }]} />
                </div>
                <div>
                    <InputLabel label="Packing" />
                    <Select id="packingLevel" value={inputs.packingLevel} onChange={e => setInputs({ ...inputs, packingLevel: e.target.value as "None" | "Partial" | "Full" })} options={[{ value: "None", label: "No Packing" }, { value: "Partial", label: "Partial Packing" }, { value: "Full", label: "Full Packing" }]} />
                </div>
            </div>

            <div className="space-y-4 pt-1 md:pt-2">
                <div>
                    <InputLabel label={inputs.moveType === "Local" ? "Origin Access" : "Location Access"} />
                    <AccessSegmented value={inputs.accessOrigin} onChange={(v) => setInputs({ ...inputs, accessOrigin: v })} />
                </div>
                {inputs.moveType === "Local" && (
                    <div>
                        <InputLabel label="Destination Access" />
                        <AccessSegmented value={inputs.accessDest} onChange={(v) => setInputs({ ...inputs, accessDest: v })} />
                    </div>
                )}
            </div>

            {inputs.moveType !== "Labor" && (
                <div className="pt-1 md:pt-2">
                    <InputLabel label="Extra Stops" />
                    {(inputs.extraStops || []).map((stop, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">STOP {idx + 1}</span>
                                    <input type="text" placeholder="Label (e.g. Storage unit)"
                                        value={stop.label || ""} maxLength={30}
                                        onChange={e => {
                                            const newStops = [...(inputs.extraStops || [])];
                                            newStops[idx].label = e.target.value;
                                            setInputs({ ...inputs, extraStops: newStops });
                                        }}
                                        className="flex-1 rounded-lg px-2.5 py-2 text-base md:py-1.5 md:text-[11px] font-medium outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        aria-label={`Extra stop ${idx + 1} label`} />
                                    <button onClick={() => {
                                        const newStops = (inputs.extraStops || []).filter((_, i) => i !== idx);
                                        setInputs({ ...inputs, extraStops: newStops });
                                    }}
                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 border border-transparent hover:border-red-100 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AccessSegmented value={stop.access} onChange={v => {
                                        const newStops = [...(inputs.extraStops || [])];
                                        newStops[idx].access = v as "ground" | "elevator" | "stairs";
                                        setInputs({ ...inputs, extraStops: newStops });
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {(inputs.extraStops || []).length < MAX_EXTRA_STOPS && (
                        <button onClick={() => {
                            const newStops = [...(inputs.extraStops || []), { label: "", access: "ground" as "ground" | "elevator" | "stairs" }];
                            setInputs({ ...inputs, extraStops: newStops });
                        }}
                            className="flex items-center justify-center w-full gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl px-3 py-2.5 transition-all active:scale-95">
                            <Plus className="w-3.5 h-3.5" /> ADD EXTRA STOP
                        </button>
                    )}
                </div>
            )}

            <div className="flex-1 flex flex-col relative pt-2 md:pt-3 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-1.5 mb-3 ml-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Inventory
                    </span>

                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold whitespace-nowrap inline-flex justify-center bg-[#F2F2F7] text-gray-500 border border-gray-200 mr-auto ml-2 select-none cursor-default">
                        <span className="inline-block w-[20px] text-right tabular-nums">{detectedQtyTotal}</span>
                        <span className="inline-block w-[26px] text-left ml-0.5">{detectedQtyTotal === 1 ? 'item' : 'items'}</span>
                    </span>

                    {(inputs.inventoryText.length > 0 || normalizedRows.length > 0 || undoCache) && (
                        <div className="flex items-center gap-1.5 ml-auto">
                            {(inputs.inventoryText.length > 0 || normalizedRows.length > 0) && (
                                <button onClick={handleClearInventory}
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Clear inventory" aria-label="Clear inventory">
                                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                                </button>
                            )}
                            {undoCache && (
                                <button onClick={handleUndo}
                                    className="p-1.5 rounded-lg text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 transition-all animate-in fade-in zoom-in duration-200" title="Undo clear" aria-label="Undo clear">
                                    <Undo2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    <button onClick={handleInventoryModeToggle}
                        title={inventoryModeToggle.title}
                        aria-label={inventoryModeToggle.title}
                        className="relative inline-flex flex-none shrink-0 overflow-hidden rounded-lg bg-gray-50 text-[10px] font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                        <span aria-hidden="true" className="invisible flex items-center justify-center gap-1.5 whitespace-nowrap px-2.5 py-1.5">
                            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                                <RefreshCcw className="w-3.5 h-3.5" />
                            </span>
                            <span className="whitespace-nowrap">Re-sync Items</span>
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center gap-1.5 px-2.5 py-1.5">
                            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                                <inventoryModeToggle.Icon className="w-3.5 h-3.5" />
                            </span>
                            <span className="whitespace-nowrap">{inventoryModeToggle.label}</span>
                        </span>
                    </button>
                </div>

                <div className="w-full">
                    {inventoryMode === "raw" ? (
                        <>
                            <textarea
                                ref={rawTextareaRef}
                                value={inputs.inventoryText}
                                onChange={e => {
                                    const raw = e.target.value;
                                    const limited = limitInventoryText(raw);
                                    setInventoryClipped(limited.length !== raw.length);
                                    handleRawInventoryChange(limited);
                                }}
                                onFocus={handleRawInventoryFocus}
                                className="block w-full min-h-[96px] md:min-h-[224px] bg-white border border-gray-200 rounded-2xl px-4 py-3.5 sm:p-5 text-base md:text-[14px] leading-relaxed text-gray-800 outline-none resize-none shadow-sm font-mono transition-colors"
                                placeholder="Paste inventory..."
                                style={{
                                    maxHeight: inventoryViewport.rawMaxHeight,
                                    WebkitOverflowScrolling: 'touch',
                                    scrollMarginBottom: INVENTORY_SCROLL_MARGIN_BOTTOM,
                                }}
                                aria-label="Raw inventory text input"
                            />
                            {rowsStatus === "stale" && (
                                <div className="mt-2 px-1 text-[10px] font-bold text-amber-600">
                                    Rows stale. Re-normalize to sync.
                                </div>
                            )}
                        </>
                    ) : (
                        <div
                            className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm"
                            style={{ scrollMarginBottom: INVENTORY_SCROLL_MARGIN_BOTTOM }}
                        >
                            <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest px-1">Item Editor</div>
                            <div
                                className="overflow-y-auto overflow-x-auto pr-1"
                                style={{
                                    maxHeight: inventoryViewport.normalizedMaxHeight,
                                    WebkitOverflowScrolling: 'touch',
                                }}
                            >
                                <div className="min-w-[260px] w-full">
                                    <div className="grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_1.5rem] gap-1.5 mb-1 px-1 text-[9px] text-gray-400 font-bold sticky top-0 bg-white z-10 pb-1 border-b border-gray-50">
                                        <div>Item</div><div className="text-center">Qty</div><div className="text-center">CF/ea</div><div className="text-center">Heavy</div><div></div>
                                    </div>
                                    {normalizedRows.map(row => (
                                        <div key={row.id} className="grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_1.5rem] gap-1.5 items-center mb-1 text-[10px] font-semibold">
                                            <input className="min-w-0 rounded px-2 h-7 outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                value={row.name}
                                                onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, name: e.target.value, cfExact: undefined, isSynthetic: false } : r))}
                                                aria-label={`Item name for ${row.name}`}
                                            />
                                            <input type="number" className="rounded px-1 h-7 text-center outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                value={row.qty as string | number}
                                                onChange={e => handleRowQtyChange(row.id, e.target.value)}
                                                onBlur={() => handleRowQtyChange(row.id, row.qty as string, true)}
                                                aria-label={`Quantity for ${row.name}`}
                                            />
                                            <input type="number" className="rounded px-1 h-7 text-center outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                value={row.cfUnit as string | number}
                                                onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, cfUnit: Number(e.target.value) || 1, cfExact: undefined, isSynthetic: false } : r))}
                                                aria-label={`Cubic feet per unit for ${row.name}`}
                                            />
                                            <div className="flex justify-center">
                                                <label className="inline-flex items-center cursor-pointer group relative">
                                                    <input type="checkbox" className="sr-only"
                                                        checked={row.flags.heavy}
                                                        onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, flags: { ...r.flags, heavy: e.target.checked } } : r))}
                                                        aria-label={`Mark ${row.name} as heavy item`}
                                                    />
                                                    <div className={`w-[22px] h-[22px] rounded-md flex items-center justify-center transition-all duration-200 ease-out shadow-sm ${row.flags.heavy ? 'bg-gray-900 border-[1.5px] border-gray-900' : 'bg-transparent hover:bg-gray-100'}`}>
                                                        <Weight className={`w-3.5 h-3.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${row.flags.heavy ? 'text-white scale-110' : 'text-gray-300'}`} strokeWidth={2.5} />
                                                    </div>
                                                </label>
                                            </div>
                                            <button onClick={() => setNormalizedRows(prev => prev.filter(r => r.id !== row.id))}
                                                className="flex justify-center items-center text-gray-300 hover:text-red-500 transition-colors cursor-pointer p-2 -mr-1"
                                                aria-label="Delete item">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
                                <input className="flex-1 rounded-lg px-2 h-8 text-base outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="Add item (e.g. piano)"
                                    list="volumeSuggestions"
                                    value={addRowInput}
                                    onChange={e => setAddRowInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter") handleAddRow(); }}
                                    aria-label="Add new item name"
                                />
                                <datalist id="volumeSuggestions">
                                    {addRowInput.length > 1 && suggestedItems.map(item => <option key={item} value={item} />)}
                                </datalist>
                                <button onClick={handleAddRow} className="px-4 h-8 bg-gray-900 text-white rounded-lg text-[11px] font-bold active:scale-95 transition-all whitespace-nowrap flex items-center gap-1 shadow-sm">
                                    <Plus className="w-3.5 h-3.5" /> ADD
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {inventoryClipped && <div className="mt-3 text-[10px] text-orange-600 bg-orange-50 p-2.5 rounded-lg font-semibold border border-orange-100">Inventory clipped (limit reached).</div>}
            </div>
        </div></GlassPanel>
    );
};
