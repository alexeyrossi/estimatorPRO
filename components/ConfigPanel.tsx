import React from 'react';
import { EstimateInputs, NormalizedRow, EstimateResult } from '@/lib/types/estimator';
import { Settings, MapPin, Trash2, Shield, User, Plus } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import { Select } from './Select';
import { InputLabel } from './InputLabel';
import { AccessSegmented } from './AccessSegmented';
import { SmallInput } from './SmallInput';
import { SORTED_KEYS, KEY_REGEX, VOLUME_TABLE, LIFT_GATE_ITEMS } from '@/lib/dictionaries';

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
    inventoryClipped, setInventoryClipped, addRowInput, setAddRowInput, suggestedItems,
    handleNormalize, handleAddRow, handleRowQtyChange, estimate
}: ConfigPanelProps) => {

    const isLabor = inputs.moveType === "Labor";

    const handleClearInventory = () => {
        setInputs(prev => ({ ...prev, inventoryText: "" }));
        setNormalizedRows([]);
        // Overrides reset would happen at parent level ideally, but we'll leave it out here since it's an action in dashboard
    };

    const limitInventoryText = (val: string) => {
        const MAX_CHARS = 12000;
        let v = val ?? "";
        if (v.length > MAX_CHARS) v = v.slice(0, MAX_CHARS);
        return v;
    }

    const detectedQtyTotal = (estimate as any)?.detectedQtyTotal ?? 0;

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
                            className="w-full rounded-2xl px-4 py-3.5 text-sm font-bold outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                                const next = { ...prev, moveType: v as any };
                                if (v !== "Local" && prev.accessDest !== "ground") { next.accessDest = "ground"; next.stairsFlightsDest = 1; }
                                return next;
                            });
                        }}
                        options={[{ value: "Local", label: "Local" }, { value: "LD", label: "Long Distance" }, { value: "Labor", label: "Labor Only" }]} />
                </div>
                <div>
                    <InputLabel label="Packing" />
                    <Select id="packingLevel" value={inputs.packingLevel} onChange={e => setInputs({ ...inputs, packingLevel: e.target.value as any })} options={[{ value: "None", label: "No Packing" }, { value: "Partial", label: "Partial Packing" }, { value: "Full", label: "Full Packing" }]} />
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
                                        newStops[idx].access = v as any;
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
                            const newStops = [...(inputs.extraStops || []), { label: "", access: "ground" as any, stairsFlights: 1 }];
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
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-auto">
                        Inventory
                    </span>

                    {(inputs.inventoryText.length > 0 || normalizedRows.length > 0) && (
                        <button onClick={handleClearInventory}
                            className="px-3 py-1.5 rounded-lg font-medium text-[12px] flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                            <Trash2 className="w-4 h-4" strokeWidth={2} /> Clear
                        </button>
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${inventoryMode === "normalized" ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}>
                            {inventoryMode === "normalized"
                                ? <><User className="w-4 h-4" strokeWidth={2} /> Client View</>
                                : <><Shield className="w-4 h-4" strokeWidth={2} /> Admin Mode</>}
                        </button>
                    )}

                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${detectedQtyTotal > 0 ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)]' : 'bg-[#F2F2F7] text-gray-400 border border-gray-200'}`}>
                        {detectedQtyTotal} items
                    </span>
                </div>

                <div className="relative w-full">
                    <div className={`transition-all duration-300 ${inventoryMode === "raw" ? "opacity-100" : "opacity-0 h-0 overflow-hidden absolute inset-x-0"}`}>
                        <div className="relative w-full">
                            <textarea
                                value={inputs.inventoryText}
                                onChange={e => {
                                    const raw = e.target.value;
                                    const limited = limitInventoryText(raw);
                                    setInventoryClipped(limited.length !== raw.length);
                                    setInputs({ ...inputs, inventoryText: limited });
                                }}
                                className="custom-scrollbar block w-full h-56 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 text-[14px] font-mono leading-relaxed text-gray-800 outline-none resize-none shadow-sm focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 transition-all"
                                placeholder="Paste inventory here (e.g. Living Room: Sofa, TV...)"
                                style={{ WebkitOverflowScrolling: 'touch' }}
                            />
                        </div>
                    </div>
                    <div className={`transition-all duration-300 ${inventoryMode === "normalized" ? "opacity-100" : "opacity-0 h-0 overflow-hidden absolute inset-x-0"}`}>
                        <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
                            <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest px-1">Inventory Editor</div>
                            <div className="custom-scrollbar max-h-72 overflow-y-auto pr-1">
                                <div className="grid grid-cols-12 gap-1 mb-1 px-1 text-[9px] text-gray-400 font-bold sticky top-0 bg-white z-10 pb-1 border-b border-gray-50">
                                    <div className="col-span-5">Item</div><div className="col-span-2 text-center">Qty</div><div className="col-span-2 text-center">CF/ea</div><div className="col-span-2 text-center">Heavy</div><div className="col-span-1"></div>
                                </div>
                                {normalizedRows.map(row => (
                                    <div key={row.id} className="grid grid-cols-12 gap-1 items-center mb-1 text-[10px] font-semibold">
                                        <input className="col-span-5 rounded px-2 h-7 outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            value={row.name}
                                            onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, name: e.target.value } : r))}
                                        />
                                        <input type="number" className="col-span-2 rounded px-1 h-7 text-center outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            value={row.qty as string | number}
                                            onChange={e => handleRowQtyChange(row.id, e.target.value)}
                                            onBlur={() => handleRowQtyChange(row.id, row.qty as any, true)}
                                        />
                                        <input type="number" className="col-span-2 rounded px-1 h-7 text-center outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            value={row.cfUnit as string | number}
                                            onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, cfUnit: Number(e.target.value) || 1 } : r))}
                                        />
                                        <div className="col-span-2 flex justify-center">
                                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                                                checked={row.flags.heavy}
                                                onChange={e => setNormalizedRows(prev => prev.map(r => r.id === row.id ? { ...r, flags: { ...r.flags, heavy: e.target.checked } } : r))}
                                            />
                                        </div>
                                        <button onClick={() => setNormalizedRows(prev => prev.filter(r => r.id !== row.id))}
                                            className="col-span-1 flex justify-center items-center text-gray-300 hover:text-red-500 transition-colors cursor-pointer">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
                                <input className="flex-1 rounded-lg px-2 h-8 text-[11px] outline-none bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                    </div>
                </div>
                {inventoryClipped && <div className="mt-3 text-[10px] text-orange-600 bg-orange-50 p-2.5 rounded-lg font-semibold border border-orange-100">Inventory clipped (limit reached).</div>}
            </div>
        </div></GlassPanel>
    );
};

