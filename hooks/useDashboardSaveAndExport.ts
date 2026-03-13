"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { saveEstimateAction } from "@/app/actions/estimate";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatEstimateReportText } from "@/lib/estimateReport";
import { generateEstimatePdf } from "@/lib/estimatePdf";
import type {
  EstimateHistoryItem,
  EstimateInputs,
  EstimateResult,
  InventoryMode,
  NormalizedRow,
} from "@/lib/types/estimator";

type EstimateRequest = {
  inputs: EstimateInputs;
  normalizedRows?: NormalizedRow[];
  overrides: Record<string, string>;
};

type UseDashboardSaveAndExportOptions = {
  clientName: string;
  debouncedEstimateRequest: EstimateRequest;
  estimate: EstimateResult | Partial<EstimateResult>;
  hasUsableEstimate: boolean;
  inputs: EstimateInputs;
  inventoryMode: InventoryMode;
  normalizedRows: NormalizedRow[];
  overrides: Record<string, string>;
  rowsSourceText?: string;
  rawInventoryVolume: number;
  setHistoryItems: React.Dispatch<React.SetStateAction<EstimateHistoryItem[]>>;
  setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
  showHistory: boolean;
};

export function useDashboardSaveAndExport({
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
}: UseDashboardSaveAndExportOptions) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success">("idle");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  const handleCopy = useCallback(async () => {
    if (!hasUsableEstimate) return;
    try {
      await copyTextToClipboard(
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
  }, [debouncedEstimateRequest.inputs, estimate, hasUsableEstimate]);

  const handleDownloadPdf = useCallback(async () => {
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
  }, [clientName, debouncedEstimateRequest.inputs, estimate, hasUsableEstimate, rawInventoryVolume]);

  const handleSaveEstimate = useCallback(async () => {
    if (!clientName.trim() || !estimate || !estimate.finalVolume) return;
    setIsSaving(true);
    setSaveStatus("idle");
    setSaveErrorMessage(null);

    try {
      const result = await saveEstimateAction(
        clientName,
        inputs,
        normalizedRows,
        inventoryMode,
        overrides,
        rowsSourceText
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
        setSaveStatus("success");
        setSaveErrorMessage(null);
        window.setTimeout(() => setSaveStatus("idle"), 2000);
        return true;
      }

      const message = result.error || "Save failed. Please try again.";
      console.error(message);
      setSaveStatus("error");
      setSaveErrorMessage(message);
      toast.error(message);
      window.setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Save failed. Please try again.";
      console.error(error);
      setSaveStatus("error");
      setSaveErrorMessage(message);
      toast.error(message);
      window.setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }

    return false;
  }, [
    clientName,
    estimate,
    inputs,
    inventoryMode,
    normalizedRows,
    overrides,
    rowsSourceText,
    setHistoryItems,
    setShowHistory,
    showHistory,
  ]);

  return {
    copyStatus,
    handleCopy,
    handleDownloadPdf,
    handleSaveEstimate,
    isGeneratingPdf,
    isSaving,
    saveErrorMessage,
    saveStatus,
  };
}
