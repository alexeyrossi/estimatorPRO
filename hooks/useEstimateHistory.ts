"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteEstimateAction,
  fetchHistoryAction,
  loadEstimateAction,
} from "@/app/actions/estimate";
import type { EstimateHistoryItem, SavedEstimateRecord } from "@/lib/types/estimator";

type UseEstimateHistoryOptions = {
  onLoadRecord: (record: SavedEstimateRecord) => void;
};

export function useEstimateHistory({ onLoadRecord }: UseEstimateHistoryOptions) {
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<EstimateHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (showHistory || pendingDeletes.size === 0) return;

    const idsToDelete = Array.from(pendingDeletes);
    setHistoryItems((prev) => prev.filter((item) => !pendingDeletes.has(item.id)));
    setPendingDeletes(new Set());

    idsToDelete.forEach((id) => {
      void deleteEstimateAction(id).then((result) => {
        if (!result?.success) {
          toast.error("Failed to delete saved estimate.");
        }
      }).catch((error) => {
        console.error("Delete estimate failed", error);
        toast.error("Failed to delete saved estimate.");
      });
    });
  }, [pendingDeletes, showHistory]);

  const toggleHistory = useCallback(async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }

    setHistoryLoading(true);
    setShowHistory(true);
    try {
      const items = await fetchHistoryAction();
      setHistoryItems(items);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to load history. Please try again.");
    } finally {
      setHistoryLoading(false);
    }
  }, [showHistory]);

  const handleLoadEstimate = useCallback(async (estimateId: string) => {
    const data = await loadEstimateAction(estimateId);
    if (!data) return null;
    onLoadRecord(data);
    setShowHistory(false);
    return data;
  }, [onLoadRecord]);

  return {
    historyItems,
    historyLoading,
    pendingDeletes,
    setHistoryItems,
    setPendingDeletes,
    showHistory,
    setShowHistory,
    toggleHistory,
    handleLoadEstimate,
  };
}
