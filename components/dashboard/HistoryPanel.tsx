"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ClipboardList, MapPin, Package, Undo2, X } from "lucide-react";
import type { EstimateHistoryItem } from "@/lib/types/estimator";

type HistoryPanelProps = {
  historyItems: EstimateHistoryItem[];
  historyLoading: boolean;
  onClose: () => void;
  onLoadEstimate: (estimateId: string) => void;
  onMarkDelete: (estimateId: string) => void;
  onUndoLastDelete: () => void;
  pendingDeletes: Set<string>;
};

type HistoryContentState = "loading" | "empty" | "list";

const getHistoryContentState = (historyLoading: boolean, itemCount: number): HistoryContentState => {
  if (historyLoading) return "loading";
  return itemCount === 0 ? "empty" : "list";
};

const addIdsToSet = (current: Set<string>, ids: string[]) => {
  const next = new Set(current);
  ids.forEach((id) => next.add(id));
  return next;
};

const removeIdsFromSet = (current: Set<string>, ids: string[]) => {
  const next = new Set(current);
  ids.forEach((id) => next.delete(id));
  return next;
};

export function HistoryPanel({
  historyItems,
  historyLoading,
  onClose,
  onLoadEstimate,
  onMarkDelete,
  onUndoLastDelete,
  pendingDeletes,
}: HistoryPanelProps) {
  const visibleHistoryItems = useMemo(
    () => historyItems.filter((item) => !pendingDeletes.has(item.id)),
    [historyItems, pendingDeletes]
  );
  const targetContentState = getHistoryContentState(historyLoading, visibleHistoryItems.length);
  const [displayedContentState, setDisplayedContentState] = useState<HistoryContentState>(targetContentState);
  const [contentPhase, setContentPhase] = useState<"idle" | "leaving" | "entering">("idle");
  const [exitingItemIds, setExitingItemIds] = useState<Set<string>>(new Set());
  const [enteringItemIds, setEnteringItemIds] = useState<Set<string>>(new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const contentSwapTimerRef = useRef<number | null>(null);
  const contentEnterFrameRef = useRef<number | null>(null);
  const itemEnterStartFrameRef = useRef<number | null>(null);
  const itemEnterSettleFrameRef = useRef<number | null>(null);
  const deleteTimerRef = useRef<Map<string, number>>(new Map());
  const previousPendingDeletesRef = useRef<Set<string>>(new Set(pendingDeletes));

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
    if (targetContentState === displayedContentState) return;

    if (contentSwapTimerRef.current !== null) {
      window.clearTimeout(contentSwapTimerRef.current);
      contentSwapTimerRef.current = null;
    }
    if (contentEnterFrameRef.current !== null) {
      window.cancelAnimationFrame(contentEnterFrameRef.current);
      contentEnterFrameRef.current = null;
    }

    if (prefersReducedMotion) {
      contentEnterFrameRef.current = window.requestAnimationFrame(() => {
        setDisplayedContentState(targetContentState);
        setContentPhase("idle");
        contentEnterFrameRef.current = null;
      });
      return () => {
        if (contentEnterFrameRef.current !== null) {
          window.cancelAnimationFrame(contentEnterFrameRef.current);
          contentEnterFrameRef.current = null;
        }
      };
    }

    contentEnterFrameRef.current = window.requestAnimationFrame(() => {
      setContentPhase("leaving");
      contentEnterFrameRef.current = null;
      contentSwapTimerRef.current = window.setTimeout(() => {
        setDisplayedContentState(targetContentState);
        setContentPhase("entering");
        contentSwapTimerRef.current = null;
      }, 120);
    });

    return () => {
      if (contentSwapTimerRef.current !== null) {
        window.clearTimeout(contentSwapTimerRef.current);
        contentSwapTimerRef.current = null;
      }
      if (contentEnterFrameRef.current !== null) {
        window.cancelAnimationFrame(contentEnterFrameRef.current);
        contentEnterFrameRef.current = null;
      }
    };
  }, [displayedContentState, prefersReducedMotion, targetContentState]);

  useEffect(() => {
    if (contentPhase !== "entering" || prefersReducedMotion) return;

    contentEnterFrameRef.current = window.requestAnimationFrame(() => {
      setContentPhase("idle");
      contentEnterFrameRef.current = null;
    });

    return () => {
      if (contentEnterFrameRef.current !== null) {
        window.cancelAnimationFrame(contentEnterFrameRef.current);
        contentEnterFrameRef.current = null;
      }
    };
  }, [contentPhase, prefersReducedMotion]);

  useEffect(() => {
    const previousPendingDeletes = previousPendingDeletesRef.current;
    const returnedIds = Array.from(previousPendingDeletes).filter(
      (id) => !pendingDeletes.has(id) && historyItems.some((item) => item.id === id)
    );
    previousPendingDeletesRef.current = new Set(pendingDeletes);

    if (returnedIds.length === 0 || prefersReducedMotion) return;

    itemEnterStartFrameRef.current = window.requestAnimationFrame(() => {
      setEnteringItemIds((current) => addIdsToSet(current, returnedIds));
      itemEnterStartFrameRef.current = null;
      itemEnterSettleFrameRef.current = window.requestAnimationFrame(() => {
        setEnteringItemIds((current) => removeIdsFromSet(current, returnedIds));
        itemEnterSettleFrameRef.current = null;
      });
    });

    return () => {
      if (itemEnterStartFrameRef.current !== null) {
        window.cancelAnimationFrame(itemEnterStartFrameRef.current);
        itemEnterStartFrameRef.current = null;
      }
      if (itemEnterSettleFrameRef.current !== null) {
        window.cancelAnimationFrame(itemEnterSettleFrameRef.current);
        itemEnterSettleFrameRef.current = null;
      }
    };
  }, [historyItems, pendingDeletes, prefersReducedMotion]);

  useEffect(() => {
    const deleteTimers = deleteTimerRef.current;

    return () => {
      deleteTimers.forEach((timerId) => window.clearTimeout(timerId));
      if (contentSwapTimerRef.current !== null) {
        window.clearTimeout(contentSwapTimerRef.current);
      }
      if (contentEnterFrameRef.current !== null) {
        window.cancelAnimationFrame(contentEnterFrameRef.current);
      }
      if (itemEnterStartFrameRef.current !== null) {
        window.cancelAnimationFrame(itemEnterStartFrameRef.current);
      }
      if (itemEnterSettleFrameRef.current !== null) {
        window.cancelAnimationFrame(itemEnterSettleFrameRef.current);
      }
    };
  }, []);

  const handleDelete = (estimateId: string) => {
    if (pendingDeletes.has(estimateId) || deleteTimerRef.current.has(estimateId)) return;

    if (prefersReducedMotion) {
      onMarkDelete(estimateId);
      return;
    }

    setEnteringItemIds((current) => removeIdsFromSet(current, [estimateId]));
    setExitingItemIds((current) => addIdsToSet(current, [estimateId]));

    const timerId = window.setTimeout(() => {
      deleteTimerRef.current.delete(estimateId);
      setExitingItemIds((current) => removeIdsFromSet(current, [estimateId]));
      onMarkDelete(estimateId);
    }, 160);

    deleteTimerRef.current.set(estimateId, timerId);
  };

  const contentMotionStyle: React.CSSProperties = prefersReducedMotion
    ? {
      opacity: 1,
      transform: "translateY(0px)",
    }
    : contentPhase === "leaving"
      ? {
        opacity: 0,
        transform: "translateY(-4px)",
      }
      : contentPhase === "entering"
        ? {
          opacity: 0,
          transform: "translateY(6px)",
        }
        : {
          opacity: 1,
          transform: "translateY(0px)",
        };

  const renderedContent = displayedContentState === "loading"
    ? (
      <div className="flex min-h-[96px] items-center justify-center py-8 text-center text-[11px] font-semibold text-gray-400">
        Loading...
      </div>
    )
    : displayedContentState === "empty"
      ? (
        <div className="flex min-h-[96px] items-center justify-center py-8 text-center text-[11px] font-semibold text-gray-400">
          No saved estimates yet
        </div>
      )
      : (
        <div className="mb-2 flex max-h-[260px] flex-wrap gap-3 overflow-y-auto pr-1">
          {visibleHistoryItems.map((item) => {
            const isExiting = exitingItemIds.has(item.id);
            const isEntering = enteringItemIds.has(item.id);
            const itemMotionStyle: React.CSSProperties = prefersReducedMotion
              ? {
                opacity: 1,
                transform: "translateY(0px) scale(1)",
              }
              : isExiting
                ? {
                  opacity: 0,
                  transform: "translateY(-4px) scale(0.985)",
                }
                : isEntering
                  ? {
                    opacity: 0,
                    transform: "translateY(6px) scale(0.992)",
                  }
                  : {
                    opacity: 1,
                    transform: "translateY(0px) scale(1)",
                  };

            return (
              <div
                key={item.id}
                className="history-item-motion relative group transition-[opacity,transform] duration-[180ms] ease-out"
                style={itemMotionStyle}
              >
                <button
                  onClick={() => onLoadEstimate(item.id)}
                  disabled={isExiting}
                  className="block min-h-[66px] w-full cursor-pointer overflow-hidden rounded-xl border-[1.5px] border-dashed border-gray-200 bg-white px-3.5 py-3 text-left transition-all duration-200 hover:border-gray-400 hover:bg-gray-50/50 disabled:cursor-default disabled:opacity-70"
                >
                  <div className="truncate pr-5 text-[11px] font-bold text-gray-800">{item.client_name}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-gray-600">
                    <Package className="h-3 w-3 text-gray-400" strokeWidth={2} />
                    <span className="tabular-nums">{(item.net_volume || item.final_volume)?.toLocaleString()} cf</span>
                    <span className="text-gray-300">·</span>
                    <MapPin className="h-3 w-3 text-gray-400" strokeWidth={2} />
                    <span>
                      {!item.home_size ? "" : item.home_size === "Commercial" ? "Comm." : item.home_size === "1" ? "1BR/Less" : `${item.home_size}BR`}/{item.move_type === "LD" ? "LD" : item.move_type === "Labor" ? "Labor" : "Local"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-gray-400">
                    <Calendar className="h-3 w-3" strokeWidth={2} />
                    {new Date(item.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(item.id);
                  }}
                  disabled={isExiting}
                  className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-md text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-default disabled:opacity-40 md:text-gray-300 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Delete estimate"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      );

  return (
    <div className="w-full">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Saved Estimates</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            {pendingDeletes.size > 0 && (
              <button
                onClick={onUndoLastDelete}
                className="transition-colors hover:text-gray-900"
                title="Undo last delete"
                aria-label="Undo last delete"
              >
                <Undo2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={onClose} className="transition-colors hover:text-gray-900" aria-label="Close history">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className="history-content-motion transition-[opacity,transform] duration-[180ms] ease-out"
          style={contentMotionStyle}
        >
          {renderedContent}
        </div>
      </div>
    </div>
  );
}
