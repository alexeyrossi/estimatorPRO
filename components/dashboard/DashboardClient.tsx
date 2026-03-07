"use client";

import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  normalizeInventoryAction,
  resolveItemAction,
  saveEstimateAction,
} from "@/app/actions/estimate";
import { signOutAction } from "@/app/actions/auth";
import { ConfigPanel } from "@/components/ConfigPanel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { ReportPanel } from "@/components/ReportPanel";
import { useEstimateHistory } from "@/hooks/useEstimateHistory";
import { useEstimateRunner } from "@/hooks/useEstimateRunner";
import { useInventorySuggestions } from "@/hooks/useInventorySuggestions";
import { useDebounce } from "@/hooks/useDebounce";
import { buildRawTextFromRows } from "@/lib/estimatePolicy";
import { generateEstimatePdf } from "@/lib/estimatePdf";
import { copyEstimateReportText, formatEstimateReportText } from "@/lib/estimateReport";
import { createDraftStateFromSavedEstimate } from "@/lib/estimateSavedState";
import {
  clearDraft,
  loadDraft,
  migrateLegacyDraft,
  saveDraft,
} from "@/lib/draftStorage";
import {
  buildEstimateRequest,
  canReuseNormalizedRows,
  createInitialEstimateDraftState,
  estimateDraftReducer,
  hydrateDraftState,
} from "@/lib/estimateDraftReducer";
import type { SessionAccess } from "@/lib/types/auth";
import type {
  EstimateHistoryItem,
  EstimateInputs,
  EstimateResult,
  NormalizedRow,
  SavedEstimateRecord,
} from "@/lib/types/estimator";

type DashboardClientProps = {
  access: SessionAccess;
};

export function DashboardClient({ access }: DashboardClientProps) {
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "report">("config");
  const [showDetails, setShowDetails] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success">("idle");
  const [clientName, setClientName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [addRowInput, setAddRowInput] = useState("");
  const [inventoryClipped, setInventoryClipped] = useState(false);

  const [draftState, dispatchDraft] = useReducer(estimateDraftReducer, undefined, createInitialEstimateDraftState);
  const { inputs, inventoryMode, normalizedRows, rowsStatus, overrides } = draftState;

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

  const autosaveDraftState = useMemo(
    () => ({ inputs, inventoryMode, normalizedRows, rowsStatus }),
    [inputs, inventoryMode, normalizedRows, rowsStatus]
  );
  const debouncedDraftState = useDebounce(autosaveDraftState, 900);
  const estimateRequest = useMemo(() => buildEstimateRequest(draftState), [draftState]);
  const suggestedItems = useInventorySuggestions(addRowInput);
  const {
    debouncedEstimateRequest,
    estimate,
    estimateError,
    isEstimateRunning,
  } = useEstimateRunner(estimateRequest, hasMounted);
  const hasUsableEstimate = typeof estimate.finalVolume === "number" && estimate.finalVolume > 0;
  const rawInventoryVolume = useMemo(() => {
    const raw = (estimate.parsedItems || []).reduce((sum, item) => sum + (item.cf || 0), 0);
    return raw > 0 ? Math.round(raw / 25) * 25 : 0;
  }, [estimate.parsedItems]);
  const isCalculating = isEstimateRunning || isNormalizing;

  const persistDraftState = useCallback((nextDraft: ReturnType<typeof hydrateDraftState>) => {
    dispatchDraft({ type: "hydrate", state: nextDraft });
    saveDraft(
      nextDraft.inputs,
      nextDraft.inventoryMode,
      nextDraft.normalizedRows,
      nextDraft.rowsStatus
    );
  }, []);

  const applySavedRecord = useCallback((record: SavedEstimateRecord) => {
    setClientName(record.client_name || "");
    persistDraftState(createDraftStateFromSavedEstimate(record.inputs_state));
  }, [persistDraftState]);

  const {
    historyItems,
    historyLoading,
    pendingDeletes,
    setHistoryItems,
    setPendingDeletes,
    showHistory,
    setShowHistory,
    toggleHistory,
    handleLoadEstimate,
  } = useEstimateHistory({
    onLoadRecord: applySavedRecord,
  });

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
    let active = true;

    async function loadInitialState() {
      const params = new URLSearchParams(window.location.search);
      const estimateId = params.get("estimate_id");

      if (estimateId) {
        try {
          const data = await handleLoadEstimate(estimateId);
          if (active && data) {
            router.replace("/dashboard");
            setHasMounted(true);
            return;
          }
        } catch (error: unknown) {
          console.error("Failed to load estimate from DB:", error);
        }
      }

      const draftResult = loadDraft();
      if (draftResult.state) {
        dispatchDraft({ type: "hydrate", state: hydrateDraftState(draftResult.state) });
        if (active) setHasMounted(true);
        return;
      }

      if (draftResult.status === "missing") {
        const migratedDraft = migrateLegacyDraft();
        if (migratedDraft) {
          dispatchDraft({ type: "hydrate", state: hydrateDraftState(migratedDraft) });
          if (active) setHasMounted(true);
          return;
        }
      }

      if (active) setHasMounted(true);
    }

    void loadInitialState();

    return () => {
      active = false;
    };
  }, [handleLoadEstimate, router]);

  const handleLogout = () => {
    clearDraft();
    void signOutAction();
  };

  const handleNormalize = async () => {
    setIsNormalizing(true);
    try {
      const rows = await normalizeInventoryAction(inputs.inventoryText);
      const mergedRows = rows.map((newRow) => {
        const existing = normalizedRows.find(
          (row) => row.name.toLowerCase() === newRow.name.toLowerCase()
            && (row.room || "").toLowerCase() === (newRow.room || "").toLowerCase()
        );
        if (existing?.flags) {
          return { ...newRow, flags: { ...newRow.flags, ...existing.flags } };
        }
        return newRow;
      });
      dispatchDraft({ type: "normalizeSuccess", normalizedRows: mergedRows });
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to parse inventory. Please try again.");
    } finally {
      setIsNormalizing(false);
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
        flags: { heavy: resolved.isHeavy, heavyWeight: false },
      };
      setNormalizedRows((prev) => [...prev, newRow]);
      setAddRowInput("");
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleRowQtyChange = (id: string, value: string, blur = false) => {
    if (!blur) {
      if (value === "") {
        setNormalizedRows((prev) => prev.map((row) => row.id === id ? { ...row, qty: "", cfExact: undefined, isSynthetic: false } : row));
        return;
      }

      const num = parseInt(value, 10);
      setNormalizedRows((prev) => prev.map((row) => row.id === id ? { ...row, qty: Number.isFinite(num) ? Math.max(1, num) : 1, cfExact: undefined, isSynthetic: false } : row));
      return;
    }

    setNormalizedRows((prev) => prev.map((row) => row.id === id ? { ...row, qty: row.qty === "" ? 1 : Math.max(1, parseInt(String(row.qty), 10) || 1), cfExact: undefined, isSynthetic: false } : row));
  };

  const handleCopy = async () => {
    if (!hasUsableEstimate) return;
    try {
      await copyEstimateReportText(
        formatEstimateReportText(
          debouncedEstimateRequest.inputs,
          estimate as EstimateResult
        )
      );
      setCopyStatus("success");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      console.error("Copy failed", error);
      toast.error("Failed to copy report. Please try again.");
    }
  };

  const handleDownloadPdf = async () => {
    if (!hasUsableEstimate) return;
    setIsGeneratingPdf(true);
    try {
      await generateEstimatePdf({
        clientName,
        estimate: estimate as EstimateResult,
        inputs: debouncedEstimateRequest.inputs,
        rawInventoryVolume,
      });
    } catch (error) {
      console.error("PDF error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveEstimate = async () => {
    if (!clientName.trim() || !estimate || !estimate.finalVolume) return;
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const result = await saveEstimateAction(
        clientName,
        inputs,
        normalizedRows,
        inventoryMode,
        overrides
      );

      if (result.success) {
        const newItem: EstimateHistoryItem = {
          id: String(result.id),
          client_name: clientName.trim(),
          final_volume: estimate.finalVolume ?? null,
          net_volume: estimate.netVolume ?? null,
          home_size: inputs.homeSize,
          move_type: inputs.moveType,
          created_at: new Date().toISOString(),
        };
        setHistoryItems((prev) => [newItem, ...prev]);
        if (!showHistory) setShowHistory(true);
        setClientName("");
        setSaveStatus("success");
        window.setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        console.error(result.error);
        setSaveStatus("error");
        window.setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error: unknown) {
      console.error(error);
      setSaveStatus("error");
      window.setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] text-gray-900 font-sans p-4 md:p-8 flex flex-col items-center selection:bg-blue-100">
      <DashboardHeader
        activeTab={activeTab}
        clientName={clientName}
        hasUsableEstimate={hasUsableEstimate}
        isSaving={isSaving}
        onClientNameChange={setClientName}
        onLogout={handleLogout}
        onSaveEstimate={handleSaveEstimate}
        onTabChange={setActiveTab}
        onToggleHistory={() => void toggleHistory()}
        saveStatus={saveStatus}
      />

      {estimateError && (
        <div className="w-full max-w-6xl mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
          {estimateError}
        </div>
      )}

      {showHistory && (
        <HistoryPanel
          historyItems={historyItems}
          historyLoading={historyLoading}
          onClose={() => setShowHistory(false)}
          onLoadEstimate={(estimateId) => void handleLoadEstimate(estimateId)}
          onMarkDelete={(estimateId) => setPendingDeletes((prev) => new Set(prev).add(estimateId))}
          onUndoLastDelete={() => {
            const lastDeletedId = Array.from(pendingDeletes).pop();
            if (!lastDeletedId) return;
            setPendingDeletes((prev) => {
              const next = new Set(prev);
              next.delete(lastDeletedId);
              return next;
            });
          }}
          pendingDeletes={pendingDeletes}
        />
      )}

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
        <div className={`w-full md:w-[420px] flex-shrink-0 flex flex-col gap-6 ${activeTab === "config" ? "block" : "hidden md:flex"}`}>
          <ConfigPanel
            inputs={inputs}
            setInputs={setInputs}
            adminMode={access.canUseAdminMode}
            inventoryMode={inventoryMode}
            normalizedRows={normalizedRows}
            setNormalizedRows={setNormalizedRows}
            rowsStatus={rowsStatus}
            inventoryClipped={inventoryClipped}
            setInventoryClipped={setInventoryClipped}
            addRowInput={addRowInput}
            setAddRowInput={setAddRowInput}
            suggestedItems={suggestedItems}
            handleInventoryModeToggle={handleInventoryModeToggle}
            handleRawInventoryChange={handleRawInventoryChange}
            handleAddRow={handleAddRow}
            handleRowQtyChange={handleRowQtyChange}
            estimate={estimate}
          />
        </div>

        <div className={`flex-1 flex flex-col gap-6 ${activeTab === "report" ? "block" : "hidden md:flex"}`}>
          <ReportPanel
            estimate={estimate as EstimateResult}
            inputs={debouncedEstimateRequest.inputs}
            isCalculating={isCalculating}
            adminMode={access.canUseAdminMode}
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
            handleDownloadPdf={handleDownloadPdf}
            isGeneratingPdf={isGeneratingPdf}
          />
        </div>
      </div>
    </div>
  );
}
