import {
  DraftState,
  EstimateDraftState,
  EstimateInputs,
  InventoryMode,
  NormalizedRow,
  RowsStatus,
} from "./types/estimator";
import { DEFAULT_ESTIMATE_INPUTS } from "./draftStorage";

export type EstimateDraftAction =
  | { type: "hydrate"; state: EstimateDraftState }
  | { type: "replaceInputs"; inputs: EstimateInputs }
  | { type: "setRawText"; inventoryText: string }
  | { type: "setInventoryMode"; inventoryMode: InventoryMode }
  | { type: "switchToRawFromRows"; inventoryText: string }
  | { type: "setNormalizedRows"; normalizedRows: NormalizedRow[] }
  | { type: "normalizeSuccess"; normalizedRows: NormalizedRow[] }
  | { type: "setOverrides"; overrides: Record<string, string> }
  | { type: "clearOverrides" };

type EstimateDraftRequest = {
  inputs: EstimateInputs;
  normalizedRows?: NormalizedRow[];
  overrides: Record<string, string>;
};

type DraftHydrationState = Omit<DraftState, "rowsStatus"> & { rowsStatus?: RowsStatus };

export function createInitialEstimateDraftState(): EstimateDraftState {
  return {
    inputs: { ...DEFAULT_ESTIMATE_INPUTS },
    inventoryMode: "raw",
    normalizedRows: [],
    rowsStatus: "empty",
    overrides: {},
  };
}

export function buildRawTextFromRows(rows: NormalizedRow[]): string {
  const grouped = rows.reduce((acc, row) => {
    const room = row.room || "General";
    if (!acc.has(room)) acc.set(room, []);
    acc.get(room)!.push(`${row.qty === "" ? 1 : row.qty} ${row.name}`);
    return acc;
  }, new Map<string, string[]>());

  return Array.from(grouped.entries())
    .map(([room, items]) => (room === "General" ? items.join(", ") : `${room}: ${items.join(", ")}`))
    .join("\n");
}

export function deriveRowsStatus(
  inventoryMode: InventoryMode,
  inventoryText: string,
  normalizedRows: NormalizedRow[]
): RowsStatus {
  if (!normalizedRows.length) return "empty";
  if (inventoryMode === "normalized") return "fresh";
  return buildRawTextFromRows(normalizedRows).trim() === inventoryText.trim() ? "fresh" : "stale";
}

export function buildEstimateRequest(state: EstimateDraftState): EstimateDraftRequest {
  return {
    inputs: { ...state.inputs, inventoryMode: state.inventoryMode },
    normalizedRows: state.inventoryMode === "normalized" ? state.normalizedRows : undefined,
    overrides: state.overrides,
  };
}

export function canReuseNormalizedRows(state: Pick<EstimateDraftState, "inputs" | "normalizedRows" | "rowsStatus">): boolean {
  return (
    state.rowsStatus === "fresh" &&
    state.normalizedRows.length > 0 &&
    buildRawTextFromRows(state.normalizedRows).trim() === state.inputs.inventoryText.trim()
  );
}

export function hydrateDraftState(state: DraftHydrationState): EstimateDraftState {
  return {
    inputs: state.inputs,
    inventoryMode: state.inventoryMode,
    normalizedRows: state.normalizedRows,
    rowsStatus: state.rowsStatus ?? deriveRowsStatus(state.inventoryMode, state.inputs.inventoryText, state.normalizedRows),
    overrides: {},
  };
}

export function hydrateSavedEstimate(state: DraftHydrationState): EstimateDraftState {
  return {
    inputs: state.inputs,
    inventoryMode: state.inventoryMode,
    normalizedRows: state.normalizedRows,
    rowsStatus: state.rowsStatus ?? deriveRowsStatus(state.inventoryMode, state.inputs.inventoryText, state.normalizedRows),
    overrides: {},
  };
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
          ? deriveRowsStatus("raw", nextInputs.inventoryText, state.normalizedRows)
          : state.rowsStatus,
      };
    }

    case "setRawText":
      return {
        ...state,
        inputs: { ...state.inputs, inventoryText: action.inventoryText },
        rowsStatus: deriveRowsStatus("raw", action.inventoryText, state.normalizedRows),
      };

    case "setInventoryMode":
      return {
        ...state,
        inventoryMode: action.inventoryMode,
        rowsStatus: deriveRowsStatus(action.inventoryMode, state.inputs.inventoryText, state.normalizedRows),
      };

    case "switchToRawFromRows":
      return {
        ...state,
        inventoryMode: "raw",
        inputs: { ...state.inputs, inventoryText: action.inventoryText },
        rowsStatus: deriveRowsStatus("raw", action.inventoryText, state.normalizedRows),
      };

    case "setNormalizedRows":
      return {
        ...state,
        normalizedRows: action.normalizedRows,
        rowsStatus: deriveRowsStatus(state.inventoryMode, state.inputs.inventoryText, action.normalizedRows),
      };

    case "normalizeSuccess":
      return {
        ...state,
        inventoryMode: "normalized",
        normalizedRows: action.normalizedRows,
        rowsStatus: deriveRowsStatus("normalized", state.inputs.inventoryText, action.normalizedRows),
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
