import React, { useState, useRef } from 'react';
import { EstimateInputs, NormalizedRow, EstimateResult } from '@/lib/types/estimator';
import { Settings, MapPin, Trash2, Shield, User, Plus, Weight, Undo2 } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { Select } from './Select';
import { InputLabel } from './InputLabel';
import { AccessSegmented } from './AccessSegmented';
import { SmallInput } from './SmallInput';
import { SORTED_KEYS } from '@/lib/dictionaries';

interface ConfigPanelProps {
    inputs: EstimateInputs;
    setInputs: React.Dispatch<React.SetStateAction<EstimateInputs>>;
    adminMode: boolean;
    inventoryMode: "raw" | "normalized";
    setInventoryMode: React.Dispatch<React.SetStateAction<"raw" | "normalized">>;
    normalizedRows: NormalizedRow[];
    setNormalizedRows: React.Dispatch<React.SetStateAction<NormalizedRow[]>>;
    inventoryClipped: boolean;
    setInventoryClipped: (v: boolean) => void;
    addRowInput: string;
    setAddRowInput: (v: string) => void;
    suggestedItems: string[];
    handleNormalize: () => void;
    handleAddRow: () => void;
    handleRowQtyChange: (id: string, value: string, blur?: boolean) => void;
    estimate: EstimateResult | Partial<EstimateResult>;
}

export const ConfigPanel = ({
    inputs, setInputs, adminMode, inventoryMode, setInventoryMode, normalizedRows, setNormalizedRows,
    inventoryClipped, setInventoryClipped, addRowInput, setAddRowInput,
    handleNormalize, handleAddRow, handleRowQtyChange, estimate
}: ConfigPanelProps) => {

    const isLabor = inputs.moveType === "Labor";

    const [undoCache, setUndoCache] = useState<{ text: string; rows: NormalizedRow[] } | null>(null);
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    return (
        <GlassPanel><div className="p-7 flex-1 flex flex-col space-y-6">
            <div className="flex items-center gap-2 mb-2 pb-5 border-b border-gray-100">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parameters</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputLabel label="Size" />
                    <Select id="homeSize" value={inputs.homeSize} onChange={e => setInputs({ ...inputs, homeSize: e.target.value })} options={[
                        { value: "0", label: "Studio / Less" }, { value: "1", label: "1 BDR" }, { value: "2", label: "2 BDR" },
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
                                if (v !== "Local" && prev.accessDest !== "ground") { next.accessDest = "ground"; next.stairsFlightsDest = 1; }
                                return next;
                            });
                        }}
                        options={[{ value: "Local", label: "Local" }, { value: "LD", label: "Long Distance" }, { value: "Labor", label: "Labor Only" }]} />
                </div>
                <div>
                    <InputLabel label="Packing" />
                    <Select id="packingLevel" value={inputs.packingLevel} onChange={e => setInputs({ ...inputs, packingLevel: e.target.value as "None" | "Partial" | "Full" })} options={[{ value: "None", label: "No Packing" }, { value: "Partial", label: "Partial Packing" }, { value: "Full", label: "Full Packing" }]} />
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <div>
                    <InputLabel label={inputs.moveType === "Local" ? "Origin Access" : "Location Access"} />
                    <div className="flex items-center gap-3 w-full">
                        <AccessSegmented value={inputs.accessOrigin} onChange={(v) => setInputs({ ...inputs, accessOrigin: v })} />
                        {inputs.accessOrigin === "stairs" && <SmallInput value={inputs.stairsFlightsOrigin} onChange={v => setInputs({ ...inputs, stairsFlightsOrigin: v })} placeholder="1" />}
                    </div>
                </div>
                {inputs.moveType === "Local" && (
                    <div>
                        <InputLabel label="Destination Access" />
                        <div className="flex items-center gap-3 w-full">
                            <AccessSegmented value={inputs.accessDest} onChange={(v) => setInputs({ ...inputs, accessDest: v })} />
                            {inputs.accessDest === "stairs" && <SmallInput value={inputs.stairsFlightsDest} onChange={v => setInputs({ ...inputs, stairsFlightsDest: v })} placeholder="1" />}
                        </div>
                    </div>
                )}
            </div>

            {inputs.moveType !== "Labor" && (
                <div className="pt-2">
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
                                        className="flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
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
                                    {stop.access === "stairs" && <SmallInput value={stop.stairsFlights || 1} onChange={v => {
                                        const newStops = [...(inputs.extraStops || [])];
                                        newStops[idx].stairsFlights = v;
                                        setInputs({ ...inputs, extraStops: newStops });
                                    }} placeholder="1" />}
                                </div>
                            </div>
                        </div>
                    ))}
                    {(inputs.extraStops || []).length < 4 && (
                        <button onClick={() => {
                            const newStops = [...(inputs.extraStops || []), { label: "", access: "ground" as "ground" | "elevator" | "stairs", stairsFlights: 1 }];
                            setInputs({ ...inputs, extraStops: newStops });
                        }}
                            className="flex items-center justify-center w-full gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl px-3 py-2.5 transition-all active:scale-95">
                            <Plus className="w-3.5 h-3.5" /> ADD EXTRA STOP
                        </button>
                    )}
                </div>
            )}

            <div className="flex-1 flex flex-col relative pt-3 border-t border-gray-100">
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

                    {adminMode && (
                        <button onClick={async () => {
                            const grouped = normalizedRows.reduce((acc, row) => {
                                const room = row.room || 'General';
                                if (!acc[room]) acc[room] = [];
                                acc[room].push(`${row.qty === "" ? 1 : row.qty} ${row.name}`);
                                return acc;
                            }, {} as Record<string, string[]>);

                            const genText = Object.entries(grouped)
                                .map(([room, items]) => `${room === 'General' ? '' : room + ': '}${items.join(', ')}`)
                                .join('\n');

                            if (inventoryMode === "raw") {
                                if (inputs.inventoryText.trim() === genText.trim() && normalizedRows.length > 0) {
                                    setInventoryMode("normalized");
                                } else {
                                    handleNormalize();
                                }
                            } else {
                                setInputs({ ...inputs, inventoryText: genText });
                                setInventoryMode("raw");
                            }
                        }}
                            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors w-[110px] bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                            {inventoryMode === "normalized"
                                ? <><User className="w-4 h-4" strokeWidth={2} /> Client View</>
                                : <><Shield className="w-4 h-4" strokeWidth={2} /> Admin Mode</>}
                        </button>
                    )}
                </div>

                <div className="w-full">
                    {inventoryMode === "raw" ? (
                        <textarea
                            value={inputs.inventoryText}
                            onChange={e => {
                                const raw = e.target.value;
                                const limited = limitInventoryText(raw);
                                setInventoryClipped(limited.length !== raw.length);
                                setInputs({ ...inputs, inventoryText: limited });
                            }}
                            className="block w-full h-56 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 text-[14px] leading-relaxed text-gray-800 outline-none resize-none shadow-sm"
                            placeholder="Paste inventory here (e.g. Living Room: Sofa, TV...)"
                            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace', WebkitOverflowScrolling: 'touch' }}
                        />
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                            <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest px-1">Inventory Editor</div>
                            <div className="max-h-72 overflow-y-auto overflow-x-auto pr-1">
                                <div className="min-w-[260px] w-full">
                                    <div className="grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_1.5rem] gap-1.5 mb-1 px-1 text-[9px] text-gray-400 font-bold sticky top-0 bg-white z-10 pb-1 border-b border-gray-50">
                                        <div>Item</div><div className="text-center">Qty</div><div className="text-center">CF/ea</div><div className="text-center">Heavy</div><div></div>
                                    </div>
                                    {normalizedRows.map(row => (
                                        <div key={row.id} className="grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_1.5rem] gap-1.5 items-center mb-1 text-[10px] font-semibold">
                                            <input className="min-w-0 rounded px-2 h-7 outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                value={row.name}
                                                onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, name: e.target.value } : r))}
                                            />
                                            <input type="number" className="rounded px-1 h-7 text-center outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                value={row.qty as string | number}
                                                onChange={e => handleRowQtyChange(row.id, e.target.value)}
                                                onBlur={() => handleRowQtyChange(row.id, row.qty as string, true)}
                                            />
                                            <input type="number" className="rounded px-1 h-7 text-center outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                value={row.cfUnit as string | number}
                                                onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, cfUnit: Number(e.target.value) || 1 } : r))}
                                            />
                                            <div className="flex justify-center">
                                                <label className="inline-flex items-center cursor-pointer group relative">
                                                    <input type="checkbox" className="sr-only"
                                                        checked={row.flags.heavy}
                                                        onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, flags: { ...r.flags, heavy: e.target.checked } } : r))}
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
                                />
                                <datalist id="volumeSuggestions">
                                    {addRowInput.length > 1 && SORTED_KEYS.filter(k => k.toLowerCase().includes(addRowInput.toLowerCase())).slice(0, 20).map(k => <option key={k} value={k} />)}
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

