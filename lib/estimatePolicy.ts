import type {
  DraftState,
  EstimateDraftState,
  EstimateInputs,
  InventoryMode,
  NormalizedRow,
  RowsStatus,
} from "@/lib/types/estimator";
import { buildRoomInventoryGroupsFromRows, serializeRoomInventoryToText } from "./roomInventory";

export const HOME_SIZE_OPTIONS = ["1", "2", "3", "4", "5", "Commercial"] as const;
export const MOVE_TYPE_OPTIONS = ["Local", "LD", "Labor"] as const;
export const PACKING_LEVEL_OPTIONS = ["None", "Partial", "Full"] as const;
export const ACCESS_OPTIONS = ["ground", "elevator", "stairs"] as const;
export const OVERRIDE_KEYS = ["volume", "trucks", "crew", "blankets", "boxes", "wardrobes"] as const;

export const MAX_INVENTORY_CHARS = 12000;
export const MAX_EXTRA_STOPS = 4;
export const MAX_ROWS = 500;

const HOME_SIZE_SET = new Set<string>(HOME_SIZE_OPTIONS);
const MOVE_TYPE_SET = new Set<string>(MOVE_TYPE_OPTIONS);
const PACKING_LEVEL_SET = new Set<string>(PACKING_LEVEL_OPTIONS);
const ACCESS_SET = new Set<string>(ACCESS_OPTIONS);
const OVERRIDE_SET = new Set<string>(OVERRIDE_KEYS);

export const DEFAULT_ESTIMATE_INPUTS: EstimateInputs = {
  homeSize: "3",
  moveType: "Local",
  distance: "15",
  packingLevel: "None",
  accessOrigin: "ground",
  accessDest: "ground",
  inventoryText: "",
  extraStops: [],
};

type SanitizeNormalizedRowsOptions = {
  allowEmptyNumericFields?: boolean;
  maxRows?: number;
};

export type DraftHydrationState = Omit<DraftState, "rowsStatus"> & { rowsStatus?: RowsStatus };

function clampInt(value: number | string | null | undefined, min = 0, max = 999) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.max(min, Math.min(max, Math.round(numeric)));
}

export function sanitizeInventoryMode(mode: unknown): InventoryMode {
  return mode === "normalized" ? "normalized" : "raw";
}

export function sanitizeRowsStatus(rowsStatus: unknown): RowsStatus {
  return rowsStatus === "fresh" || rowsStatus === "stale" ? rowsStatus : "empty";
}

export function normalizeLegacyHomeSize(homeSize?: string) {
  return homeSize === "0" ? "1" : homeSize;
}

export function normalizeLegacyMoveType(moveType?: string): EstimateInputs["moveType"] {
  return moveType === "LD" || moveType === "Labor" ? moveType : "Local";
}

export function sanitizeAccess(access: unknown): EstimateInputs["accessOrigin"] {
  return ACCESS_SET.has(String(access)) ? (access as EstimateInputs["accessOrigin"]) : "ground";
}

export function sanitizeExtraStops(extraStops: unknown): EstimateInputs["extraStops"] {
  if (!Array.isArray(extraStops)) return [];

  return extraStops
    .slice(0, MAX_EXTRA_STOPS)
    .map((stop) => ({
      label: String(stop?.label ?? "").trim().slice(0, 30),
      access: sanitizeAccess(stop?.access),
    }));
}

export function buildRawTextFromRows(rows: NormalizedRow[]) {
  return serializeRoomInventoryToText(buildRoomInventoryGroupsFromRows(rows));
}

export function normalizeComparableInventoryText(value: string | null | undefined) {
  return String(value ?? "").replace(/\r\n?/g, "\n").trim();
}

export function sanitizeRowsSourceText(rowsSourceText: unknown) {
  if (typeof rowsSourceText !== "string") return undefined;

  const safeRowsSourceText = rowsSourceText.slice(0, MAX_INVENTORY_CHARS);
  return safeRowsSourceText.length > 0 ? safeRowsSourceText : undefined;
}

export function hasFreshNormalizedRows(
  inventoryText: string,
  normalizedRows: NormalizedRow[],
  rowsSourceText?: string
) {
  if (!normalizedRows.length) return false;

  const comparableInventoryText = normalizeComparableInventoryText(inventoryText);
  if (sanitizeRowsSourceText(rowsSourceText) != null) {
    return normalizeComparableInventoryText(rowsSourceText) === comparableInventoryText;
  }

  return normalizeComparableInventoryText(buildRawTextFromRows(normalizedRows)) === comparableInventoryText;
}

export function deriveRowsStatus(
  inventoryMode: InventoryMode,
  inventoryText: string,
  normalizedRows: NormalizedRow[],
  rowsSourceText?: string,
  requestedStatus?: RowsStatus
): RowsStatus {
  if (!normalizedRows.length) return "empty";
  if (inventoryMode === "normalized") return "fresh";
  if (hasFreshNormalizedRows(inventoryText, normalizedRows, rowsSourceText)) return "fresh";
  return requestedStatus === "stale" ? "stale" : "stale";
}

export function sanitizeNormalizedRows(rows: unknown, options: SanitizeNormalizedRowsOptions = {}): NormalizedRow[] {
  if (!Array.isArray(rows)) return [];

  const { allowEmptyNumericFields = false, maxRows = MAX_ROWS } = options;
  const sanitizeNumericField = (value: unknown): number | "" => {
    if (allowEmptyNumericFields && value === "") return "";
    return clampInt(String(value ?? 1), 1, 500);
  };
  const sanitizeExactVolume = (value: unknown): number | undefined => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };

  return rows
    .slice(0, maxRows)
    .map((row, index) => ({
      id: String(row?.id ?? `row_${index}`).slice(0, 120),
      name: String(row?.name ?? "").trim().slice(0, 120),
      qty: sanitizeNumericField(row?.qty),
      cfUnit: sanitizeNumericField(row?.cfUnit),
      cfExact: sanitizeExactVolume(row?.cfExact),
      isSynthetic: !!row?.isSynthetic,
      raw: String(row?.raw ?? "").slice(0, 240),
      room: String(row?.room ?? "").trim().slice(0, 80),
      flags: {
        heavy: !!row?.flags?.heavy,
        heavyWeight: !!row?.flags?.heavyWeight,
      },
    }))
    .filter((row) => row.name.length > 0);
}

export function sanitizeOverrides(overrides: Record<string, string> | undefined) {
  if (!overrides) return {};

  return Object.fromEntries(
    Object.entries(overrides)
      .filter(([key]) => OVERRIDE_SET.has(key))
      .map(([key, value]) => [key, String(value ?? "").trim().slice(0, 8)])
      .filter(([, value]) => value.length > 0)
  );
}

export function normalizeDraftInputs(inputs?: Partial<EstimateInputs>): EstimateInputs {
  const moveType = normalizeLegacyMoveType(inputs?.moveType);
  const homeSize = normalizeLegacyHomeSize(inputs?.homeSize);

  return {
    ...DEFAULT_ESTIMATE_INPUTS,
    ...inputs,
    homeSize: HOME_SIZE_SET.has(homeSize ?? "") ? homeSize! : DEFAULT_ESTIMATE_INPUTS.homeSize,
    moveType,
    distance: typeof inputs?.distance === "string" ? inputs.distance : DEFAULT_ESTIMATE_INPUTS.distance,
    packingLevel: PACKING_LEVEL_SET.has(inputs?.packingLevel ?? "")
      ? inputs!.packingLevel as EstimateInputs["packingLevel"]
      : DEFAULT_ESTIMATE_INPUTS.packingLevel,
    accessOrigin: sanitizeAccess(inputs?.accessOrigin),
    accessDest: moveType === "Local" ? sanitizeAccess(inputs?.accessDest) : "ground",
    inventoryText: String(inputs?.inventoryText ?? DEFAULT_ESTIMATE_INPUTS.inventoryText),
    inventoryMode: undefined,
    normalizedRows: undefined,
    overrides: undefined,
    extraStops: sanitizeExtraStops(inputs?.extraStops),
  };
}

export function sanitizeEstimateInputs(inputs: EstimateInputs, inventoryMode?: InventoryMode): EstimateInputs {
  const requestedMoveType = String(inputs.moveType ?? "");
  const safeMoveType = MOVE_TYPE_SET.has(requestedMoveType) ? requestedMoveType : normalizeLegacyMoveType(requestedMoveType);
  const safeInventoryMode = inventoryMode ?? sanitizeInventoryMode(inputs.inventoryMode);
  const normalizedHomeSize = normalizeLegacyHomeSize(inputs.homeSize);
  const safeAccessOrigin = sanitizeAccess(inputs.accessOrigin);
  const safeAccessDest = safeMoveType === "Local" ? sanitizeAccess(inputs.accessDest) : "ground";

  return {
    homeSize: HOME_SIZE_SET.has(normalizedHomeSize ?? "") ? normalizedHomeSize! : DEFAULT_ESTIMATE_INPUTS.homeSize,
    moveType: safeMoveType as EstimateInputs["moveType"],
    distance: String(clampInt(inputs.distance, 0, 10000)),
    packingLevel: PACKING_LEVEL_SET.has(inputs.packingLevel) ? inputs.packingLevel : DEFAULT_ESTIMATE_INPUTS.packingLevel,
    accessOrigin: safeAccessOrigin,
    accessDest: safeAccessDest,
    inventoryText: String(inputs.inventoryText ?? "").slice(0, MAX_INVENTORY_CHARS),
    inventoryMode: safeInventoryMode,
    normalizedRows: undefined,
    overrides: undefined,
    extraStops: sanitizeExtraStops(inputs.extraStops),
  };
}

export function buildDraftState(
  inputs: Partial<EstimateInputs>,
  inventoryMode: unknown,
  normalizedRows: unknown,
  rowsStatus?: unknown,
  rowsSourceText?: unknown
): DraftState {
  const safeInventoryMode = sanitizeInventoryMode(inventoryMode);
  const safeInputs = normalizeDraftInputs(inputs);
  const safeRows = sanitizeNormalizedRows(normalizedRows, { allowEmptyNumericFields: true });
  const safeRowsSourceText = sanitizeRowsSourceText(rowsSourceText);
  const safeRowsStatus = deriveRowsStatus(
    safeInventoryMode,
    safeInputs.inventoryText,
    safeRows,
    safeRowsSourceText,
    sanitizeRowsStatus(rowsStatus)
  );

  return {
    inputs: safeInputs,
    inventoryMode: safeInventoryMode,
    normalizedRows: safeRowsStatus === "empty" ? [] : safeRows,
    rowsSourceText: safeRowsStatus === "empty" ? undefined : safeRowsSourceText,
    rowsStatus: safeRowsStatus,
  };
}

export function hydrateEstimateDraftState(
  state: DraftHydrationState,
  overrides: Record<string, string> = {}
): EstimateDraftState {
  return {
    inputs: state.inputs,
    inventoryMode: state.inventoryMode,
    normalizedRows: state.normalizedRows,
    rowsSourceText: state.rowsSourceText,
    rowsStatus: state.rowsStatus ?? deriveRowsStatus(
      state.inventoryMode,
      state.inputs.inventoryText,
      state.normalizedRows,
      state.rowsSourceText
    ),
    overrides,
  };
}
