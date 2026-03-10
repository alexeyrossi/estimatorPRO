"use client";

import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { saveDraft } from "@/lib/draftStorage";
import {
  buildEstimateRequest,
  createInitialEstimateDraftState,
  estimateDraftReducer,
} from "@/lib/estimateDraftReducer";
import type {
  EstimateDraftState,
  EstimateInputs,
  NormalizedRow,
} from "@/lib/types/estimator";

type UseDashboardDraftOptions = {
  autosaveEnabled: boolean;
};

export function useDashboardDraft({ autosaveEnabled }: UseDashboardDraftOptions) {
  const [draftState, dispatchDraft] = useReducer(
    estimateDraftReducer,
    undefined,
    createInitialEstimateDraftState
  );
  const { inputs, inventoryMode, normalizedRows, rowsStatus, overrides } = draftState;

  const setInputs: React.Dispatch<React.SetStateAction<EstimateInputs>> = (value) => {
    const nextInputs = typeof value === "function" ? value(inputs) : value;
    dispatchDraft({ type: "replaceInputs", inputs: nextInputs });
  };

  const setNormalizedRows: React.Dispatch<React.SetStateAction<NormalizedRow[]>> = (value) => {
    const nextRows = typeof value === "function" ? value(normalizedRows) : value;
    dispatchDraft({ type: "setNormalizedRows", normalizedRows: nextRows });
  };

  const setOverrides: React.Dispatch<React.SetStateAction<Record<string, string>>> = (value) => {
    const nextOverrides = typeof value === "function" ? value(overrides) : value;
    dispatchDraft({ type: "setOverrides", overrides: nextOverrides });
  };

  const hydrateDraft = useCallback((nextDraft: EstimateDraftState) => {
    dispatchDraft({ type: "hydrate", state: nextDraft });
  }, []);

  const persistDraftState = useCallback((nextDraft: EstimateDraftState) => {
    dispatchDraft({ type: "hydrate", state: nextDraft });
    saveDraft(
      nextDraft.inputs,
      nextDraft.inventoryMode,
      nextDraft.normalizedRows,
      nextDraft.rowsStatus
    );
  }, []);

  const clearOverrides = useCallback(() => {
    dispatchDraft({ type: "clearOverrides" });
  }, []);

  const autosaveDraftState = useMemo(
    () => ({ inputs, inventoryMode, normalizedRows, rowsStatus }),
    [inputs, inventoryMode, normalizedRows, rowsStatus]
  );
  const debouncedDraftState = useDebounce(autosaveDraftState, 900);
  const estimateRequest = useMemo(() => buildEstimateRequest(draftState), [draftState]);

  useEffect(() => {
    if (!autosaveEnabled) return;
    saveDraft(
      debouncedDraftState.inputs,
      debouncedDraftState.inventoryMode,
      debouncedDraftState.normalizedRows,
      debouncedDraftState.rowsStatus
    );
  }, [autosaveEnabled, debouncedDraftState]);

  return {
    clearOverrides,
    debouncedDraftState,
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
  };
}
