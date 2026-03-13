"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { cleanTranscriptAction, normalizeInventoryAction, resolveItemAction } from "@/app/actions/estimate";
import { ConfigPanel } from "@/components/ConfigPanel";
import { ReportPanel } from "@/components/ReportPanel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { useDashboardBootstrap } from "@/hooks/useDashboardBootstrap";
import { useDebounce } from "@/hooks/useDebounce";
import { useDashboardDraft } from "@/hooks/useDashboardDraft";
import { useDashboardSaveAndExport } from "@/hooks/useDashboardSaveAndExport";
import { useEstimateHistory } from "@/hooks/useEstimateHistory";
import { useEstimateRunner } from "@/hooks/useEstimateRunner";
import { useInventorySuggestions } from "@/hooks/useInventorySuggestions";
import { clearDraft } from "@/lib/draftStorage";
import { canReuseNormalizedRows } from "@/lib/estimateDraftReducer";
import { mergeRowsPreservingManualHeavyFlags } from "@/lib/inventorySync";
import { buildRawTextFromRows, normalizeComparableInventoryText } from "@/lib/estimatePolicy";
import { createDraftStateFromSavedEstimate } from "@/lib/estimateSavedState";
import { createClient } from "@/lib/supabase/client";
import type {
  EstimateResult,
  NormalizedRow,
  SavedEstimateRecord,
} from "@/lib/types/estimator";

type HistoryPresencePhase = "collapsed" | "entering" | "idle" | "leaving";
type InventorySyncMode = "background" | "openItems";
type InventorySyncResult = "synced" | "superseded" | "error";

const measureElementHeight = (node: HTMLDivElement | null) => {
  if (!node) return null;
  return Math.ceil(node.getBoundingClientRect().height);
};

export function DashboardClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "report">("config");
  const [reportView, setReportView] = useState<"summary" | "inventory" | "details">("summary");
  const [clientName, setClientName] = useState("");
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isInventorySyncing, setIsInventorySyncing] = useState(false);
  const [isCleaningTranscript, setIsCleaningTranscript] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [addRowInput, setAddRowInput] = useState("");
  const [inventoryClipped, setInventoryClipped] = useState(false);
  const [historyMounted, setHistoryMounted] = useState(false);
  const [historyPresencePhase, setHistoryPresencePhase] = useState<HistoryPresencePhase>("collapsed");
  const [historyPanelHeight, setHistoryPanelHeight] = useState<number | null>(null);
  const [historyPanelNode, setHistoryPanelNode] = useState<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const historyMountedRef = useRef(historyMounted);
  const historyMountFrameRef = useRef<number | null>(null);
  const historyEnterFrameRef = useRef<number | null>(null);
  const historySettleFrameRef = useRef<number | null>(null);
  const historyUnmountTimerRef = useRef<number | null>(null);
  const historyResizeFrameRef = useRef<number | null>(null);
  const inventorySyncRequestVersionRef = useRef(0);
  const inventorySyncPromiseRef = useRef<Promise<InventorySyncResult> | null>(null);
  const pendingInventorySyncTextRef = useRef<string | null>(null);

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
    rowsSourceText,
    setInputs,
    setNormalizedRows,
    setOverrides,
    syncRawRows,
  } = useDashboardDraft({ autosaveEnabled: hasMounted });
  const debouncedRawInventoryText = useDebounce(inputs.inventoryText, 900);
  const draftStateRef = useRef(draftState);
  const normalizedRowsRef = useRef(normalizedRows);

  const applySavedRecord = useCallback((record: SavedEstimateRecord) => {
    setClientName(record.client_name || "");
    persistDraftState(createDraftStateFromSavedEstimate(record.inputs_state));
  }, [persistDraftState]);

  useEffect(() => {
    draftStateRef.current = draftState;
  }, [draftState]);

  useEffect(() => {
    normalizedRowsRef.current = normalizedRows;
  }, [normalizedRows]);

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
    rowsSourceText,
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

  const syncInventoryRows = useCallback(async (
    sourceText: string,
    mode: InventorySyncMode
  ): Promise<InventorySyncResult> => {
    const requestVersion = inventorySyncRequestVersionRef.current + 1;
    inventorySyncRequestVersionRef.current = requestVersion;
    pendingInventorySyncTextRef.current = sourceText;
    inventorySyncPromiseRef.current = null;
    setIsInventorySyncing(true);

    if (mode === "openItems") {
      setIsNormalizing(true);
    }

    const syncPromise = (async () => {
      try {
        const rows = await normalizeInventoryAction(sourceText);

        if (requestVersion !== inventorySyncRequestVersionRef.current) {
          return "superseded";
        }

        const mergedRows = mergeRowsPreservingManualHeavyFlags(normalizedRowsRef.current, rows);
        if (mode === "openItems") {
          dispatchDraft({
            type: "normalizeSuccess",
            normalizedRows: mergedRows,
            rowsSourceText: sourceText,
          });
        } else {
          syncRawRows(mergedRows, sourceText);
        }

        return "synced";
      } catch (error: unknown) {
        if (requestVersion !== inventorySyncRequestVersionRef.current) {
          return "superseded";
        }

        console.error(error);
        if (mode === "openItems") {
          toast.error("Failed to parse inventory. Please try again.");
        }
        return "error";
      } finally {
        if (requestVersion === inventorySyncRequestVersionRef.current) {
          pendingInventorySyncTextRef.current = null;
          inventorySyncPromiseRef.current = null;
          setIsInventorySyncing(false);
          if (mode === "openItems") {
            setIsNormalizing(false);
          }
        }
      }
    })();

    inventorySyncPromiseRef.current = syncPromise;
    return syncPromise;
  }, [dispatchDraft, syncRawRows]);

  const handleCleanTranscript = async () => {
    const rawText = inputs.inventoryText;
    if (!rawText.trim()) return;

    setIsCleaningTranscript(true);
    try {
      const cleanedResult = await cleanTranscriptAction(rawText);
      if (!cleanedResult.success) {
        toast.error(cleanedResult.message);
        return;
      }

      setInventoryClipped(false);
      dispatchDraft({ type: "setRawText", inventoryText: cleanedResult.inventoryText });
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to clean transcript. Please try again.");
    } finally {
      setIsCleaningTranscript(false);
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

    if (inventorySyncPromiseRef.current) {
      await inventorySyncPromiseRef.current;

      if (canReuseNormalizedRows(draftStateRef.current)) {
        dispatchDraft({ type: "setInventoryMode", inventoryMode: "normalized" });
        return;
      }
    }

    await syncInventoryRows(inputs.inventoryText, "openItems");
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

  useEffect(() => {
    if (!hasMounted || inventoryMode !== "raw") return;

    const comparableInventoryText = normalizeComparableInventoryText(debouncedRawInventoryText);
    const comparableLiveInventoryText = normalizeComparableInventoryText(inputs.inventoryText);
    const pendingComparableText = normalizeComparableInventoryText(pendingInventorySyncTextRef.current);

    if (comparableInventoryText !== comparableLiveInventoryText) return;

    if (!comparableInventoryText) {
      if (normalizedRows.length > 0 || rowsSourceText) {
        syncRawRows([], undefined);
      }
      return;
    }

    if (canReuseNormalizedRows(draftStateRef.current)) return;
    if (pendingComparableText === comparableInventoryText) return;

    void syncInventoryRows(debouncedRawInventoryText, "background");
  }, [
    debouncedRawInventoryText,
    hasMounted,
    inventoryMode,
    inputs.inventoryText,
    normalizedRows.length,
    rowsSourceText,
    syncInventoryRows,
    syncRawRows,
  ]);

  const clearHistoryPresenceTimers = useCallback(() => {
    if (historyMountFrameRef.current !== null) {
      window.cancelAnimationFrame(historyMountFrameRef.current);
      historyMountFrameRef.current = null;
    }
    if (historyEnterFrameRef.current !== null) {
      window.cancelAnimationFrame(historyEnterFrameRef.current);
      historyEnterFrameRef.current = null;
    }
    if (historySettleFrameRef.current !== null) {
      window.cancelAnimationFrame(historySettleFrameRef.current);
      historySettleFrameRef.current = null;
    }
    if (historyUnmountTimerRef.current !== null) {
      window.clearTimeout(historyUnmountTimerRef.current);
      historyUnmountTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    historyMountedRef.current = historyMounted;
  }, [historyMounted]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncPreference);
      return () => mediaQuery.removeEventListener("change", syncPreference);
    }

    mediaQuery.addListener(syncPreference);
    return () => mediaQuery.removeListener(syncPreference);
  }, []);

  useEffect(() => {
    clearHistoryPresenceTimers();

    if (showHistory) {
      if (prefersReducedMotion) {
        historyMountFrameRef.current = window.requestAnimationFrame(() => {
          setHistoryMounted(true);
          setHistoryPresencePhase("idle");
          historyMountFrameRef.current = null;
        });
        return () => clearHistoryPresenceTimers();
      }

      if (historyMountedRef.current) {
        historyMountFrameRef.current = window.requestAnimationFrame(() => {
          setHistoryPresencePhase("entering");
          historyMountFrameRef.current = null;
          historyEnterFrameRef.current = window.requestAnimationFrame(() => {
            setHistoryPresencePhase("idle");
            historyEnterFrameRef.current = null;
          });
        });
        return () => clearHistoryPresenceTimers();
      }

      historyMountFrameRef.current = window.requestAnimationFrame(() => {
        setHistoryMounted(true);
        setHistoryPresencePhase("collapsed");
        historyMountFrameRef.current = null;
        historyEnterFrameRef.current = window.requestAnimationFrame(() => {
          setHistoryPresencePhase("entering");
          historyEnterFrameRef.current = null;
          historySettleFrameRef.current = window.requestAnimationFrame(() => {
            setHistoryPresencePhase("idle");
            historySettleFrameRef.current = null;
          });
        });
      });
      return () => clearHistoryPresenceTimers();
    }

    if (!historyMountedRef.current) {
      return () => clearHistoryPresenceTimers();
    }

    if (prefersReducedMotion) {
      historyMountFrameRef.current = window.requestAnimationFrame(() => {
        setHistoryPresencePhase("collapsed");
        setHistoryMounted(false);
        historyMountFrameRef.current = null;
      });
      return () => clearHistoryPresenceTimers();
    }

    historyMountFrameRef.current = window.requestAnimationFrame(() => {
      setHistoryPresencePhase("leaving");
      historyMountFrameRef.current = null;
      historyUnmountTimerRef.current = window.setTimeout(() => {
        setHistoryMounted(false);
        setHistoryPresencePhase("collapsed");
        historyUnmountTimerRef.current = null;
      }, 220);
    });

    return () => clearHistoryPresenceTimers();
  }, [clearHistoryPresenceTimers, prefersReducedMotion, showHistory]);

  useEffect(() => {
    if (!historyPanelNode) return;

    const syncHeight = () => {
      const nextHeight = measureElementHeight(historyPanelNode);
      if (nextHeight != null) {
        setHistoryPanelHeight((current) => current === nextHeight ? current : nextHeight);
      }
    };

    historyResizeFrameRef.current = window.requestAnimationFrame(() => {
      syncHeight();
      historyResizeFrameRef.current = null;
    });

    if (typeof ResizeObserver === "undefined") {
      return () => {
        if (historyResizeFrameRef.current !== null) {
          window.cancelAnimationFrame(historyResizeFrameRef.current);
          historyResizeFrameRef.current = null;
        }
      };
    }

    const observer = new ResizeObserver(() => {
      if (historyResizeFrameRef.current !== null) {
        window.cancelAnimationFrame(historyResizeFrameRef.current);
      }

      historyResizeFrameRef.current = window.requestAnimationFrame(() => {
        syncHeight();
        historyResizeFrameRef.current = null;
      });
    });

    observer.observe(historyPanelNode);

    return () => {
      observer.disconnect();
      if (historyResizeFrameRef.current !== null) {
        window.cancelAnimationFrame(historyResizeFrameRef.current);
        historyResizeFrameRef.current = null;
      }
    };
  }, [historyPanelNode]);

  useEffect(() => {
    return () => {
      clearHistoryPresenceTimers();
      if (historyResizeFrameRef.current !== null) {
        window.cancelAnimationFrame(historyResizeFrameRef.current);
        historyResizeFrameRef.current = null;
      }
    };
  }, [clearHistoryPresenceTimers]);

  if (!hasMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  const isHistoryExpanded = historyPresencePhase === "entering" || historyPresencePhase === "idle";
  const historyPresenceStyle: React.CSSProperties = {
    height: isHistoryExpanded
      ? prefersReducedMotion
        ? historyPanelHeight != null ? `${historyPanelHeight}px` : "auto"
        : `${historyPanelHeight ?? 0}px`
      : "0px",
    opacity: isHistoryExpanded ? 1 : 0,
    marginBottom: isHistoryExpanded ? "24px" : "0px",
    transition: "height 220ms ease-out, opacity 180ms ease-out, margin-bottom 220ms ease-out",
  };
  const historyMotionStyle: React.CSSProperties = prefersReducedMotion
    ? {
      opacity: isHistoryExpanded ? 1 : 0,
      transform: "translateY(0px)",
    }
    : historyPresencePhase === "leaving"
      ? {
        opacity: 0,
        transform: "translateY(-4px)",
      }
      : historyPresencePhase === "collapsed" || historyPresencePhase === "entering"
        ? {
          opacity: 0,
          transform: "translateY(6px)",
        }
        : {
          opacity: 1,
          transform: "translateY(0px)",
        };

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

      {historyMounted && (
        <div className="history-presence-shell w-full max-w-6xl overflow-hidden" style={historyPresenceStyle}>
          <div
            ref={setHistoryPanelNode}
            className="history-panel-motion w-full transition-[opacity,transform] duration-[180ms] ease-out"
            style={historyMotionStyle}
          >
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
          </div>
        </div>
      )}

      <div className="dashboard-safe-pb w-full max-w-6xl flex flex-col gap-8 md:flex-row md:pb-8">
        <div className={`w-full md:w-[420px] flex-shrink-0 flex flex-col gap-6 ${activeTab === "config" ? "block" : "hidden md:flex"}`}>
          <ConfigPanel
            inputs={inputs}
            setInputs={setInputs}
            isConfigTabActive={activeTab === "config"}
            inventoryMode={inventoryMode}
            normalizedRows={normalizedRows}
            rowsSourceText={rowsSourceText}
            setNormalizedRows={setNormalizedRows}
            syncRawRows={syncRawRows}
            inventoryClipped={inventoryClipped}
            setInventoryClipped={setInventoryClipped}
            addRowInput={addRowInput}
            setAddRowInput={setAddRowInput}
            suggestedItems={suggestedItems}
            handleCleanTranscript={handleCleanTranscript}
            handleInventoryModeToggle={handleInventoryModeToggle}
            handleRawInventoryChange={handleRawInventoryChange}
            handleAddRow={handleAddRow}
            handleRowQtyChange={handleRowQtyChange}
            isCleaningTranscript={isCleaningTranscript}
            isInventorySyncing={isInventorySyncing}
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
