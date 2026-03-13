import {
  DEFAULT_ESTIMATE_INPUTS,
  hydrateEstimateDraftState,
  normalizeLegacyHomeSize,
  normalizeLegacyMoveType,
} from "./estimatePolicy";
import type { EstimateDraftState, SavedEstimateState } from "./types/estimator";

export function createDraftStateFromSavedEstimate(savedState?: SavedEstimateState | null): EstimateDraftState {
  if (!savedState?.inputs) {
    return hydrateEstimateDraftState({
      inputs: { ...DEFAULT_ESTIMATE_INPUTS },
      inventoryMode: "raw",
      normalizedRows: [],
      rowsStatus: "empty",
    });
  }

  const inventoryMode = savedState.inventoryMode === "normalized" ? "normalized" : "raw";
  const normalizedRows = savedState.normalizedRows || [];

  return hydrateEstimateDraftState({
    inputs: {
      ...DEFAULT_ESTIMATE_INPUTS,
      ...savedState.inputs,
      homeSize: normalizeLegacyHomeSize(savedState.inputs.homeSize) || DEFAULT_ESTIMATE_INPUTS.homeSize,
      moveType: normalizeLegacyMoveType(savedState.inputs.moveType),
      inventoryText: savedState.inputs.inventoryText || "",
    },
    inventoryMode,
    normalizedRows,
    rowsSourceText: savedState.rowsSourceText,
  });
}
