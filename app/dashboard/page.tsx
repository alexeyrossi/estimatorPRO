"use client"

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Truck, Calculator, ClipboardList, X, Package, MapPin, Calendar, Undo2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EstimateHistoryItem, EstimateInputs, EstimateResult, InventoryMode, NormalizedRow } from '@/lib/types/estimator';
import { useDebounce } from '@/hooks/useDebounce';
import { getEstimate, normalizeInventoryAction, resolveItemAction, suggestItemsAction, saveEstimateAction, fetchHistoryAction, loadEstimateAction, deleteEstimateAction } from '@/app/actions/estimate';
import { signOutAction } from '@/app/actions/auth';
import { ConfigPanel } from '@/components/ConfigPanel';
import { ReportPanel } from '@/components/ReportPanel';
import {
    DEFAULT_ESTIMATE_INPUTS,
    clearDraft,
    loadDraft,
    migrateLegacyDraft,
    normalizeLegacyHomeSize,
    normalizeLegacyMoveType,
    saveDraft,
} from '@/lib/draftStorage';
import {
    buildEstimateRequest,
    buildRawTextFromRows,
    canReuseNormalizedRows,
    createInitialEstimateDraftState,
    estimateDraftReducer,
    hydrateDraftState,
    hydrateSavedEstimate,
} from '@/lib/estimateDraftReducer';

export default function DashboardPage() {
    const router = useRouter();

    const [hasMounted, setHasMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<"config" | "report">("config");
    const [showDetails, setShowDetails] = useState(false);
    const [copyStatus, setCopyStatus] = useState<"idle" | "success">("idle");
    const [isCalculating, setIsCalculating] = useState(false);
    const [clientName, setClientName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const [draftState, dispatchDraft] = useReducer(estimateDraftReducer, undefined, createInitialEstimateDraftState);
    const adminMode = true;

    const [addRowInput, setAddRowInput] = useState("");
    const [suggestedItems, setSuggestedItems] = useState<string[]>([]);
    const [inventoryClipped, setInventoryClipped] = useState(false);

    const [estimate, setEstimate] = useState<EstimateResult | Partial<EstimateResult>>({});
    const [estimateError, setEstimateError] = useState<string | null>(null);

    const [showHistory, setShowHistory] = useState(false);
    const [historyItems, setHistoryItems] = useState<EstimateHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Delayed deletion
    const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
    const { inputs, inventoryMode, normalizedRows, rowsStatus, overrides } = draftState;
    const hasUsableEstimate = typeof estimate.finalVolume === "number" && estimate.finalVolume > 0;
    const autosaveDraftState = useMemo(
        () => ({ inputs, inventoryMode, normalizedRows, rowsStatus }),
        [inputs, inventoryMode, normalizedRows, rowsStatus]
    );
    const estimateRequest = useMemo(() => buildEstimateRequest(draftState), [draftState]);
    const debouncedDraftState = useDebounce(autosaveDraftState, 900);
    const debouncedEstimateRequest = useDebounce(estimateRequest, 1000);

    const setInputs: React.Dispatch<React.SetStateAction<EstimateInputs>> = (value) => {
        const nextInputs = typeof value === "function" ? value(draftState.inputs) : value;
        dispatchDraft({ type: "replaceInputs", inputs: nextInputs });
    };

    const setNormalizedRows: React.Dispatch<React.SetStateAction<NormalizedRow[]>> = (value) => {
        const nextRows = typeof value === "function" ? value(draftState.normalizedRows) : value;
        dispatchDraft({ type: "setNormalizedRows", normalizedRows: nextRows });
    };

    const setOverrides: React.Dispatch<React.SetStateAction<Record<string, string>>> = (value) => {
        const nextOverrides = typeof value === "function" ? value(draftState.overrides) : value;
        dispatchDraft({ type: "setOverrides", overrides: nextOverrides });
    };

    const normalizeSavedInventoryMode = (mode?: InventoryMode) => mode === "normalized" ? "normalized" : "raw";

    const handleLogout = () => {
        clearDraft();
        void signOutAction();
    };

    // Flush pending deletes when history is closed
    useEffect(() => {
        if (!showHistory && pendingDeletes.size > 0) {
            const idsToDelete = Array.from(pendingDeletes);
            idsToDelete.forEach(id => deleteEstimateAction(id).catch(console.error));
            setHistoryItems(prev => prev.filter((item) => !pendingDeletes.has(item.id)));
            setPendingDeletes(new Set());
        }
    }, [showHistory, pendingDeletes]);

    // Hydration and deep linking
    useEffect(() => {
        const loadInitialState = async () => {
            const params = new URLSearchParams(window.location.search);
            const estimateId = params.get('estimate_id');

            if (estimateId) {
                try {
                    const data = await loadEstimateAction(estimateId);
                    if (data && data.inputs_state) {
                        const state = data.inputs_state;
                        setClientName(data.client_name || "");

                        if (state.inputs) {
                            const restoredInventoryMode = normalizeSavedInventoryMode(state.inventoryMode);
                            const restoredDraft = hydrateSavedEstimate({
                                inputs: {
                                    ...DEFAULT_ESTIMATE_INPUTS,
                                    ...state.inputs,
                                    homeSize: normalizeLegacyHomeSize(state.inputs.homeSize) || DEFAULT_ESTIMATE_INPUTS.homeSize,
                                    moveType: normalizeLegacyMoveType(state.inputs.moveType),
                                    inventoryText: state.inputs.inventoryText || ""
                                },
                                inventoryMode: restoredInventoryMode,
                                normalizedRows: state.normalizedRows || [],
                                rowsStatus: restoredInventoryMode === "raw" && (state.normalizedRows || []).length > 0 ? "stale" : undefined,
                            });
                            dispatchDraft({ type: "hydrate", state: restoredDraft });
                            saveDraft(
                                restoredDraft.inputs,
                                restoredDraft.inventoryMode,
                                restoredDraft.normalizedRows,
                                restoredDraft.rowsStatus
                            );
                        }

                        router.replace('/dashboard'); // Remove param from URL
                        setHasMounted(true);
                        return; // Skip normal hydration
                    }
                } catch (err: unknown) {
                    console.error("Failed to load estimate from DB:", err);
                    // Fall back to local storage if it fails
                }
            }

            const draftResult = loadDraft();
            if (draftResult.state) {
                dispatchDraft({ type: "hydrate", state: hydrateDraftState(draftResult.state) });
                setHasMounted(true);
                return;
            }

            if (draftResult.status === "missing") {
                const migratedDraft = migrateLegacyDraft();
                if (migratedDraft) {
                    dispatchDraft({ type: "hydrate", state: hydrateDraftState(migratedDraft) });
                    setHasMounted(true);
                    return;
                }
            }

            setHasMounted(true);
        };

        loadInitialState();
    }, [router]);

    // Autosave
    useEffect(() => {
        if (!hasMounted) return;
        saveDraft(
            debouncedDraftState.inputs,
            debouncedDraftState.inventoryMode,
            debouncedDraftState.normalizedRows,
            debouncedDraftState.rowsStatus
        );
    }, [debouncedDraftState, hasMounted]);

    useEffect(() => {
        if (!hasMounted) return;

        async function runEngine() {
            setIsCalculating(true);
            try {
                const result = await getEstimate(
                    debouncedEstimateRequest.inputs,
                    debouncedEstimateRequest.normalizedRows,
                    debouncedEstimateRequest.overrides
                );
                setEstimate(result);
                setEstimateError(null);
            } catch (err: unknown) {
                console.error("Estimate calculation failed", err);
                setEstimate({});
                setEstimateError("Calculation failed. Please review the inputs and retry.");
                toast.error("Failed to calculate estimate. Please try again.");
            } finally {
                setIsCalculating(false);
            }
        }
        runEngine();
    }, [debouncedEstimateRequest, hasMounted]);

    // Normalize Button action
    const handleNormalize = async () => {
        setIsCalculating(true);
        try {
            const rows = await normalizeInventoryAction(inputs.inventoryText);

            // Deep merge existing flags into newly parsed rows to preserve toggle state
            const mergedRows = rows.map(newRow => {
                const existing = normalizedRows.find(
                    r => r.name.toLowerCase() === newRow.name.toLowerCase() && (r.room || "").toLowerCase() === (newRow.room || "").toLowerCase()
                );
                if (existing && existing.flags) {
                    return { ...newRow, flags: { ...newRow.flags, ...existing.flags } };
                }
                return newRow;
            });

            dispatchDraft({ type: "normalizeSuccess", normalizedRows: mergedRows });
        } catch (e: unknown) {
            console.error(e);
            toast.error("Failed to parse inventory. Please try again.");
        } finally {
            setIsCalculating(false);
        }
    };

    const handleInventoryModeToggle = async () => {
        if (inventoryMode === "normalized") {
            dispatchDraft({
                type: "switchToRawFromRows",
                inventoryText: buildRawTextFromRows(normalizedRows),
            });
            return;
        }

        if (canReuseNormalizedRows(draftState)) {
            dispatchDraft({ type: "setInventoryMode", inventoryMode: "normalized" });
            return;
        }

        await handleNormalize();
    };

    const handleRawInventoryChange = (inventoryText: string) => {
        dispatchDraft({ type: "setRawText", inventoryText });
    };

    const clearOverrides = () => {
        dispatchDraft({ type: "clearOverrides" });
    };

    // Add row action
    const handleAddRow = async () => {
        if (!addRowInput.trim()) return;
        try {
            const resolved = await resolveItemAction(addRowInput);
            const newRow: NormalizedRow = {
                id: `custom_${Date.now()}`,
                raw: addRowInput,
                name: resolved.resolvedName,
                qty: 1,
                cfUnit: resolved.cfUnit,
                room: "",
                flags: { heavy: resolved.isHeavy, heavyWeight: false }
            };
            setNormalizedRows(prev => [...prev, newRow]);
            setAddRowInput("");
        } catch (e: unknown) {
            console.error(e);
        }
    };

    // Handle manual row editing safely
    const handleRowQtyChange = (id: string, value: string, blur: boolean = false) => {
        if (!blur) {
            if (value === "") return setNormalizedRows(prev => prev.map(r => r.id === id ? { ...r, qty: "", cfExact: undefined, isSynthetic: false } : r));
            const num = parseInt(value, 10);
            setNormalizedRows(prev => prev.map(r => r.id === id ? { ...r, qty: Number.isFinite(num) ? Math.max(1, num) : 1, cfExact: undefined, isSynthetic: false } : r));
        } else {
            setNormalizedRows(prev => prev.map(r => r.id === id ? { ...r, qty: r.qty === "" ? 1 : Math.max(1, parseInt(String(r.qty), 10) || 1), cfExact: undefined, isSynthetic: false } : r));
        }
    };

    // Autocomplete debounced search
    const debouncedAddInput = useDebounce(addRowInput, 300);
    useEffect(() => {
        if (debouncedAddInput.length > 1) {
            suggestItemsAction(debouncedAddInput).then(setSuggestedItems);
        } else {
            setSuggestedItems([]);
        }
    }, [debouncedAddInput]);

    const handleCopy = async () => {
        if (!estimate || !estimate.finalVolume) return;
        const est = estimate as EstimateResult;
        const isLabor = inputs.moveType === "Labor";
        const truckText = isLabor ? "N/A" : `${est.trucksFinal} x ${est.truckSizeLabel}`;
        const splitText = est.splitRecommended ? "(SPLIT TO 2 DAYS)" : "";
        const matList = [];
        if (est.materials?.blankets) matList.push(`${est.materials.blankets} blankets`);
        if (est.materials?.wardrobes) matList.push(`${est.materials.wardrobes} wardrobes`);
        if (est.materials?.boxes) matList.push(`~${est.materials.boxes} boxes`);
        const packingLine = `PACKING: ${matList.join(", ")}${est.smartEquipment?.length > 0 ? `, ${est.smartEquipment.join(", ")}` : ""}`;
        const ddtStr = est.isDDT ? "(DDT)" : "";
        const packStr = inputs.packingLevel === "None" ? "No packing" : `${inputs.packingLevel} packing`;
        const heavyStr = est.heavyItemNames?.length > 0 ? `\nHeavy items: ${est.heavyItemNames.join(", ")}` : "";

        const volText = est.billableCF
            ? `${est.billableCF} cf (billable) / ~${est.truckSpaceCF} cf (truck space)`
            : `${est.finalVolume} cf`;

        const originAcc = inputs.accessOrigin;
        const destAcc = inputs.accessDest;
        const stopsStr = (inputs.extraStops || []).length > 0
            ? ` -> ${inputs.extraStops.map((s, i) => `Stop ${i + 1}: ${s.access}${s.label ? ` [${s.label}]` : ""}`).join(" -> ")}`
            : "";
        const accessText = `${originAcc} (Origin)${stopsStr} -> ${destAcc} (Dest)`;

        const text = `${est.homeLabel} / ${inputs.moveType} Move / ${isLabor ? "N/A" : `${inputs.distance} miles`} ${ddtStr} / ${packStr}${heavyStr}
🚚 Trucks: ${truckText}
👥 Crew: ${est.crew} Movers
⏱ Time: ${est.timeMin} - ${est.timeMax} Hours ${splitText}
📦 Volume: ${volText}

${packingLine}

🛡 NOTES & RISKS
${est.risks?.length > 0 ? est.risks.map((r: { text: string }) => `-${r.text}`).join("\n") : "-Standard residential move."}
-Access: ${accessText}
${est.daMins > 0 ? `-Assembly: ~${est.daMins} min total` : ""}
-Confidence: ${est.confidence?.label} (${est.confidence?.score}%)`;

        const performCopy = () => { setCopyStatus("success"); setTimeout(() => setCopyStatus("idle"), 2000); };
        if (navigator.clipboard && window.isSecureContext) {
            try { await navigator.clipboard.writeText(text); performCopy(); return; } catch { }
        }
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "absolute"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); performCopy(); } catch { }
        document.body.removeChild(ta);
    };

    const handleSaveEstimate = async () => {
        if (!clientName.trim() || !estimate || !estimate.finalVolume) return;
        setIsSaving(true);
        setSaveStatus("idle");
        try {
            const res = await saveEstimateAction(
                clientName,
                inputs,
                normalizedRows,
                inventoryMode,
                overrides
            );

            if (res.success) {
                const newItem: EstimateHistoryItem = {
                    id: String(res.id),
                    client_name: clientName.trim(),
                    final_volume: estimate.finalVolume ?? null,
                    net_volume: estimate.netVolume ?? null,
                    home_size: inputs.homeSize,
                    move_type: inputs.moveType,
                    created_at: new Date().toISOString()
                };
                setHistoryItems(prev => [newItem, ...prev]);
                if (!showHistory) setShowHistory(true);
                setClientName("");
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 2000);
            } else if (res && !res.success) {
                console.error(res.error);
                setSaveStatus("error");
                setTimeout(() => setSaveStatus("idle"), 3000);
            }
        } catch (err: unknown) {
            console.error(err);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleHistory = async () => {
        if (showHistory) { setShowHistory(false); return; }
        setHistoryLoading(true);
        setShowHistory(true);
        try {
            const items = await fetchHistoryAction();
            setHistoryItems(items);
        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to load history. Please try again.");
        }
        setHistoryLoading(false);
    };

    const handleLoadEstimate = async (estimateId: string) => {
        const data = await loadEstimateAction(estimateId);
        if (data?.inputs_state) {
            setClientName(data.client_name || "");
            if (data.inputs_state.inputs) {
                const nextInventoryMode = normalizeSavedInventoryMode(data.inputs_state.inventoryMode);
                const nextDraft = hydrateSavedEstimate({
                    inputs: {
                        ...DEFAULT_ESTIMATE_INPUTS,
                        ...data.inputs_state.inputs,
                        homeSize: normalizeLegacyHomeSize(data.inputs_state.inputs.homeSize) || DEFAULT_ESTIMATE_INPUTS.homeSize,
                        moveType: normalizeLegacyMoveType(data.inputs_state.inputs.moveType),
                        inventoryText: data.inputs_state.inputs.inventoryText || ""
                    },
                    inventoryMode: nextInventoryMode,
                    normalizedRows: data.inputs_state.normalizedRows || [],
                    rowsStatus: nextInventoryMode === "raw" && (data.inputs_state.normalizedRows || []).length > 0 ? "stale" : undefined,
                });
                dispatchDraft({ type: "hydrate", state: nextDraft });
                saveDraft(
                    nextDraft.inputs,
                    nextDraft.inventoryMode,
                    nextDraft.normalizedRows,
                    nextDraft.rowsStatus
                );
            } else {
                dispatchDraft({
                    type: "hydrate",
                    state: hydrateSavedEstimate({
                        inputs: {
                            ...DEFAULT_ESTIMATE_INPUTS,
                        },
                        inventoryMode: "raw",
                        normalizedRows: [],
                        rowsStatus: "empty",
                    }),
                });
                saveDraft(
                    {
                        ...DEFAULT_ESTIMATE_INPUTS,
                    },
                    "raw",
                    [],
                    "empty"
                );
            }
            setShowHistory(false);
        }
    };

    if (!hasMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

    return (
        <div className="min-h-[100dvh] bg-[#F5F7FA] text-gray-900 font-sans p-4 md:p-8 flex flex-col items-center selection:bg-blue-100">
            <div className="w-full max-w-6xl mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-[1rem] bg-gray-900 flex items-center justify-center relative overflow-hidden group shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                        <Truck className="w-6 h-6 absolute -left-[2px] text-gray-400 group-hover:text-white transition-colors" />
                        <div className="absolute right-1 bottom-1 bg-white text-gray-900 rounded-[4px] p-0.5 shadow-sm">
                            <Calculator className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">
                            Estimator
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                                v11.59
                            </span>
                            <span className="text-[8px] font-black text-white bg-blue-600 shadow-sm px-1.5 py-0.5 rounded tracking-widest uppercase">
                                PRO
                            </span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3 relative">
                    {/* Save Island */}
                    <div className="flex items-center gap-2 bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-1.5 border border-transparent">
                        <input
                            type="text"
                            placeholder="Client name"
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            className="bg-gray-50 border-transparent rounded-xl px-4 py-2 text-[14px] text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all outline-none w-36"
                        />
                            <button
                                onClick={handleSaveEstimate}
                                disabled={!clientName.trim() || isSaving || !hasUsableEstimate}
                                className={`rounded-xl px-4 py-2 text-[14px] font-medium transition-all duration-300 whitespace-nowrap active:scale-95 w-[96px] flex justify-center items-center text-center disabled:opacity-50 disabled:cursor-not-allowed ${saveStatus === 'success' ? 'bg-emerald-500 text-white' :
                                    isSaving ? 'bg-gray-900 text-white' :
                                        clientName.trim() ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm' :
                                            'bg-gray-400 text-white'
                                    }`}
                        >
                            {saveStatus === 'success' ? '✓ Saved' : isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </button>
                    </div>
                    {saveStatus === 'error' && (
                        <div className="absolute top-[105%] left-4 text-red-500 text-[11px] font-bold">
                            Save failed. Please try again.
                        </div>
                    )}

                    {/* History Island */}
                    <button onClick={toggleHistory}
                        className="bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] px-4 py-2 flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 border border-transparent active:scale-95">
                        <ClipboardList className="w-4 h-4" strokeWidth={2} />
                        History
                    </button>

                    {/* Logout Island */}
                    <button onClick={handleLogout}
                        className="bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] px-4 py-2 flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 border border-transparent active:scale-95">
                        <LogOut className="w-4 h-4" strokeWidth={2} />
                        Logout
                    </button>
                </div>

                <div className="md:hidden flex w-full items-center gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-1 rounded-2xl bg-white border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-1.5">
                        {(["config", "report"] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === t ? "bg-gray-50 text-gray-900" : "text-gray-500 bg-transparent hover:bg-gray-50 hover:text-gray-900"}`}
                            >
                                {t === "config" ? "Config" : "Report"}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={toggleHistory}
                        className="shrink-0 rounded-2xl bg-white border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                        aria-label="Open history"
                        title="History"
                    >
                        <ClipboardList className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="shrink-0 rounded-2xl bg-white border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        aria-label="Logout"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {estimateError && (
                <div className="w-full max-w-6xl mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
                    {estimateError}
                </div>
            )}

            {showHistory && (
                <div className="w-full max-w-6xl mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-gray-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saved Estimates</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                {pendingDeletes.size > 0 && (
                                    <button
                                        onClick={() => {
                                            const lastDeletedId = Array.from(pendingDeletes).pop();
                                            if (lastDeletedId) {
                                                setPendingDeletes(prev => {
                                                    const next = new Set(prev);
                                                    next.delete(lastDeletedId);
                                                    return next;
                                                });
                                            }
                                        }}
                                        className="hover:text-gray-900 transition-colors"
                                        title="Undo last delete"
                                        aria-label="Undo last delete"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={() => setShowHistory(false)}
                                    className="hover:text-gray-900 transition-colors"
                                    aria-label="Close history">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {historyLoading ? (
                            <div className="text-center py-8 text-[11px] text-gray-400 font-semibold">Loading...</div>
                        ) : historyItems.length === 0 ? (
                            <div className="text-center py-8 text-[11px] text-gray-400 font-semibold">No saved estimates yet</div>
                        ) : (
                            <div className="flex flex-wrap gap-3 max-h-[260px] overflow-y-auto pr-1 mb-2">
                                {historyItems
                                    .filter((item) => !pendingDeletes.has(item.id))
                                    .map((item) => (
                                        <div key={item.id} className="relative group animate-in fade-in zoom-in-95">
                                            <button onClick={() => handleLoadEstimate(item.id)}
                                                className="text-left bg-white border-[1.5px] border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 rounded-xl px-3.5 py-3 transition-all duration-200 cursor-pointer w-full block min-h-[66px] overflow-hidden">
                                                <div className="text-[11px] font-bold text-gray-800 truncate pr-5">
                                                    {item.client_name}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-bold text-gray-600">
                                                    <Package className="w-3 h-3 text-gray-400" strokeWidth={2} />
                                                    <span className="tabular-nums">{(item.net_volume || item.final_volume)?.toLocaleString()} cf</span>
                                                    <span className="text-gray-300">·</span>
                                                    <MapPin className="w-3 h-3 text-gray-400" strokeWidth={2} />
                                                    <span>{!item.home_size ? "" : item.home_size === "Commercial" ? "Comm." : item.home_size === "1" ? "1BR/Less" : `${item.home_size}BR`}/{item.move_type === "LD" ? "LD" : item.move_type === "Labor" ? "Labor" : "Local"}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-gray-400">
                                                    <Calendar className="w-3 h-3" strokeWidth={2} />
                                                    {new Date(item.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPendingDeletes(prev => new Set(prev).add(item.id));
                                                }}
                                                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                aria-label="Delete estimate"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
                {/* LEFT: CONFIGURATION */}
                <div className={`w-full md:w-[420px] flex-shrink-0 flex flex-col gap-6 ${activeTab === "config" ? "block" : "hidden md:flex"}`}>
                    <ConfigPanel
                        inputs={inputs} setInputs={setInputs}
                        adminMode={adminMode} inventoryMode={inventoryMode}
                        normalizedRows={normalizedRows} setNormalizedRows={setNormalizedRows}
                        rowsStatus={rowsStatus}
                        inventoryClipped={inventoryClipped} setInventoryClipped={setInventoryClipped}
                        addRowInput={addRowInput} setAddRowInput={setAddRowInput}
                        suggestedItems={suggestedItems}
                        handleInventoryModeToggle={handleInventoryModeToggle}
                        handleRawInventoryChange={handleRawInventoryChange}
                        handleAddRow={handleAddRow}
                        handleRowQtyChange={handleRowQtyChange}
                        estimate={estimate}
                    />
                </div>

                {/* RIGHT: REPORT */}
                <div className={`flex-1 flex flex-col gap-6 ${activeTab === "report" ? "block" : "hidden md:flex"}`}>
                    <ReportPanel
                        estimate={estimate as EstimateResult}
                        inputs={debouncedEstimateRequest.inputs}
                        isCalculating={isCalculating}
                        adminMode={adminMode}
                        showDetails={showDetails}
                        setShowDetails={setShowDetails}
                        handleCopy={handleCopy}
                        copyStatus={copyStatus}
                        clientName={clientName}
                        setClientName={setClientName}
                        handleSaveEstimate={handleSaveEstimate}
                        isSaving={isSaving}
                        saveStatus={saveStatus}
                        overrides={overrides}
                        setOverrides={setOverrides}
                        clearOverrides={clearOverrides}
                    />
                </div>
            </div>
        </div>
    );
}
