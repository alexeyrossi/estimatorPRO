import {
  EstimateDraftState,
  EstimateInputs,
  InventoryMode,
  NormalizedRow,
} from "./types/estimator";
import {
  DEFAULT_ESTIMATE_INPUTS,
  deriveRowsStatus,
  DraftHydrationState,
  hasFreshNormalizedRows,
  hydrateEstimateDraftState,
} from "./estimatePolicy";

export { buildRawTextFromRows, deriveRowsStatus } from "./estimatePolicy";

export type EstimateDraftAction =
  | { type: "hydrate"; state: EstimateDraftState }
  | { type: "replaceInputs"; inputs: EstimateInputs }
  | { type: "setRawText"; inventoryText: string }
  | { type: "setInventoryMode"; inventoryMode: InventoryMode }
  | { type: "switchToRawFromRows"; inventoryText: string }
  | { type: "syncRawRows"; normalizedRows: NormalizedRow[]; rowsSourceText?: string }
  | { type: "setNormalizedRows"; normalizedRows: NormalizedRow[] }
  | { type: "normalizeSuccess"; normalizedRows: NormalizedRow[]; rowsSourceText?: string }
  | { type: "setOverrides"; overrides: Record<string, string> }
  | { type: "clearOverrides" };

type EstimateDraftRequest = {
  inputs: EstimateInputs;
  normalizedRows?: NormalizedRow[];
  overrides: Record<string, string>;
};

export function createInitialEstimateDraftState(): EstimateDraftState {
  return {
    inputs: { ...DEFAULT_ESTIMATE_INPUTS },
    inventoryMode: "raw",
    normalizedRows: [],
    rowsSourceText: undefined,
    rowsStatus: "empty",
    overrides: {},
  };
}

export function buildEstimateRequest(state: EstimateDraftState): EstimateDraftRequest {
  return {
    inputs: { ...state.inputs, inventoryMode: state.inventoryMode },
    normalizedRows: state.inventoryMode === "normalized" ? state.normalizedRows : undefined,
    overrides: state.overrides,
  };
}

export function canReuseNormalizedRows(
  state: Pick<EstimateDraftState, "inputs" | "normalizedRows" | "rowsSourceText" | "rowsStatus">
): boolean {
  return (
    state.rowsStatus === "fresh" &&
    state.normalizedRows.length > 0 &&
    hasFreshNormalizedRows(state.inputs.inventoryText, state.normalizedRows, state.rowsSourceText)
  );
}

export function hydrateDraftState(state: DraftHydrationState): EstimateDraftState {
  return hydrateEstimateDraftState(state);
}

export function hydrateSavedEstimate(state: DraftHydrationState): EstimateDraftState {
  return hydrateEstimateDraftState(state);
}

export function estimateDraftReducer(state: EstimateDraftState, action: EstimateDraftAction): EstimateDraftState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "replaceInputs": {
      const nextInputs = action.inputs;
      const inventoryTextChanged = nextInputs.inventoryText !== state.inputs.inventoryText;
      return {
        ...state,
        inputs: nextInputs,
        rowsStatus: inventoryTextChanged && state.inventoryMode === "raw"
          ? deriveRowsStatus("raw", nextInputs.inventoryText, state.normalizedRows, state.rowsSourceText)
          : state.rowsStatus,
      };
    }

    case "setRawText":
      return {
        ...state,
        inputs: { ...state.inputs, inventoryText: action.inventoryText },
        rowsStatus: deriveRowsStatus("raw", action.inventoryText, state.normalizedRows, state.rowsSourceText),
      };

    case "setInventoryMode":
      return {
        ...state,
        inventoryMode: action.inventoryMode,
        rowsStatus: deriveRowsStatus(
          action.inventoryMode,
          state.inputs.inventoryText,
          state.normalizedRows,
          state.rowsSourceText
        ),
      };

    case "switchToRawFromRows":
      return {
        ...state,
        inventoryMode: "raw",
        inputs: { ...state.inputs, inventoryText: action.inventoryText },
        rowsSourceText: action.inventoryText,
        rowsStatus: deriveRowsStatus("raw", action.inventoryText, state.normalizedRows, action.inventoryText),
      };

    case "syncRawRows":
      return {
        ...state,
        normalizedRows: action.normalizedRows,
        rowsSourceText: action.normalizedRows.length > 0 ? action.rowsSourceText : undefined,
        rowsStatus: deriveRowsStatus(
          state.inventoryMode,
          state.inputs.inventoryText,
          action.normalizedRows,
          action.rowsSourceText
        ),
      };

    case "setNormalizedRows": {
      const nextRowsSourceText = action.normalizedRows.length > 0 ? state.rowsSourceText : undefined;
      return {
        ...state,
        normalizedRows: action.normalizedRows,
        rowsSourceText: nextRowsSourceText,
        rowsStatus: deriveRowsStatus(
          state.inventoryMode,
          state.inputs.inventoryText,
          action.normalizedRows,
          nextRowsSourceText
        ),
      };
    }

    case "normalizeSuccess":
      return {
        ...state,
        inventoryMode: "normalized",
        normalizedRows: action.normalizedRows,
        rowsSourceText: action.normalizedRows.length > 0 ? action.rowsSourceText : undefined,
        rowsStatus: deriveRowsStatus(
          "normalized",
          state.inputs.inventoryText,
          action.normalizedRows,
          action.rowsSourceText
        ),
      };

    case "setOverrides":
      return {
        ...state,
        overrides: action.overrides,
      };

    case "clearOverrides":
      return {
        ...state,
        overrides: {},
      };

    default:
      return state;
  }
}
