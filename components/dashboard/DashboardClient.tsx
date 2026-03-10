"use client";

import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { normalizeInventoryAction, resolveItemAction } from "@/app/actions/estimate";
import { ConfigPanel } from "@/components/ConfigPanel";
import { ReportPanel } from "@/components/ReportPanel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { useDashboardBootstrap } from "@/hooks/useDashboardBootstrap";
import { useDashboardDraft } from "@/hooks/useDashboardDraft";
import { useDashboardSaveAndExport } from "@/hooks/useDashboardSaveAndExport";
import { useEstimateHistory } from "@/hooks/useEstimateHistory";
import { useEstimateRunner } from "@/hooks/useEstimateRunner";
import { useInventorySuggestions } from "@/hooks/useInventorySuggestions";
import { clearDraft } from "@/lib/draftStorage";
import { canReuseNormalizedRows } from "@/lib/estimateDraftReducer";
import { buildRawTextFromRows } from "@/lib/estimatePolicy";
import { createDraftStateFromSavedEstimate } from "@/lib/estimateSavedState";
import { createClient } from "@/lib/supabase/client";
import type {
  EstimateResult,
  NormalizedRow,
  SavedEstimateRecord,
} from "@/lib/types/estimator";

export function DashboardClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "report">("config");
  const [reportView, setReportView] = useState<"summary" | "inventory" | "details">("summary");
  const [clientName, setClientName] = useState("");
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [addRowInput, setAddRowInput] = useState("");
  const [inventoryClipped, setInventoryClipped] = useState(false);

  const {
    clearOverrides,
    dispatchDraft,
    draftState,
    estimateRequest,
    hydrateDraft,
    inputs,
    inventoryMode,
    normalizedRows,
    overrides,
    persistDraftState,
    rowsStatus,
    setInputs,
    setNormalizedRows,
    setOverrides,
  } = useDashboardDraft({ autosaveEnabled: hasMounted });

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

  const markMounted = useCallback(() => {
    setHasMounted(true);
  }, []);

  useDashboardBootstrap({
    hydrateDraft,
    onLoadEstimate: handleLoadEstimate,
    onReady: markMounted,
  });

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
  const detectedItemCount = estimate.parsedItems?.length || 0;
  const isCalculating = isEstimateRunning || isNormalizing;

  const {
    copyStatus,
    handleCopy,
    handleDownloadPdf,
    handleSaveEstimate: handleSaveEstimateBase,
    isGeneratingPdf,
    isSaving,
    saveErrorMessage,
    saveStatus,
  } = useDashboardSaveAndExport({
    clientName,
    debouncedEstimateRequest,
    estimate,
    hasUsableEstimate,
    inputs,
    inventoryMode,
    normalizedRows,
    overrides,
    rawInventoryVolume,
    setHistoryItems,
    setShowHistory,
    showHistory,
  });

  const handleLogout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      clearDraft();
      window.location.assign("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
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

  const handleSaveEstimate = useCallback(async () => {
    const didSave = await handleSaveEstimateBase();
    if (didSave) {
      setClientName("");
    }
  }, [handleSaveEstimateBase]);

  if (!hasMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] text-gray-900 font-sans p-4 md:p-8 flex flex-col items-center selection:bg-blue-100">
      <DashboardHeader
        activeTab={activeTab}
        clientName={clientName}
        hasUsableEstimate={hasUsableEstimate}
        isSaving={isSaving}
        isSigningOut={isSigningOut}
        onClientNameChange={setClientName}
        onLogout={() => void handleLogout()}
        onSaveEstimate={() => void handleSaveEstimate()}
        onTabChange={setActiveTab}
        onToggleHistory={() => void toggleHistory()}
        saveErrorMessage={saveErrorMessage}
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

      <div className="dashboard-safe-pb w-full max-w-6xl flex flex-col gap-8 md:flex-row md:pb-8">
        <div className={`w-full md:w-[420px] flex-shrink-0 flex flex-col gap-6 ${activeTab === "config" ? "block" : "hidden md:flex"}`}>
          <ConfigPanel
            inputs={inputs}
            setInputs={setInputs}
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
            reportView={reportView}
            setReportView={setReportView}
            handleCopy={handleCopy}
            copyStatus={copyStatus}
            clientName={clientName}
            setClientName={setClientName}
            handleSaveEstimate={() => void handleSaveEstimate()}
            isSaving={isSaving}
            saveErrorMessage={saveErrorMessage}
            saveStatus={saveStatus}
            overrides={overrides}
            setOverrides={setOverrides}
            clearOverrides={clearOverrides}
            handleDownloadPdf={handleDownloadPdf}
            isGeneratingPdf={isGeneratingPdf}
            detectedItemCount={detectedItemCount}
            rawInventoryVolume={rawInventoryVolume}
          />
        </div>
      </div>
    </div>
  );
}
