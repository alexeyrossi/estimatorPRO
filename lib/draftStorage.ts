import {
  DraftEnvelope,
  DraftLoadResult,
  DraftState,
  EstimateInputs,
  InventoryMode,
  NormalizedRow,
  RowsStatus,
} from "./types/estimator";

const DRAFT_VERSION = "v12";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const DRAFT_STORAGE_KEY = "estimator_draft_v12";
const LEGACY_CONFIG_KEY = "estimator_fixed_v11_58_config";
const LEGACY_TEXT_KEY = "estimator_fixed_v11_58_text";
const LEGACY_MANAGER_KEY = "estimator_fixed_v11_58_manager";

const HOME_SIZE_OPTIONS = new Set(["1", "2", "3", "4", "5", "Commercial"]);
const PACKING_LEVEL_OPTIONS = new Set(["None", "Partial", "Full"]);
const ACCESS_OPTIONS = new Set(["ground", "elevator", "stairs"]);

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

export function normalizeLegacyHomeSize(homeSize?: string) {
  return homeSize === "0" ? "1" : homeSize;
}

export function normalizeLegacyMoveType(moveType?: string): EstimateInputs["moveType"] {
  return moveType === "LD" || moveType === "Labor" ? moveType : "Local";
}

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeInventoryMode(mode: unknown): InventoryMode {
  return mode === "normalized" ? "normalized" : "raw";
}

function sanitizeRowsStatus(rowsStatus: unknown): RowsStatus {
  return rowsStatus === "fresh" || rowsStatus === "stale" ? rowsStatus : "empty";
}

function sanitizeAccess(access: unknown): EstimateInputs["accessOrigin"] {
  return ACCESS_OPTIONS.has(access as string) ? (access as EstimateInputs["accessOrigin"]) : "ground";
}

function sanitizeExtraStops(extraStops: unknown): EstimateInputs["extraStops"] {
  if (!Array.isArray(extraStops)) return [];

  return extraStops
    .slice(0, 4)
    .map((stop) => ({
      label: String(stop?.label ?? "").trim().slice(0, 30),
      access: sanitizeAccess(stop?.access),
    }));
}

function sanitizeNormalizedRows(rows: unknown): NormalizedRow[] {
  if (!Array.isArray(rows)) return [];

  const sanitizeNumericField = (value: unknown): number | "" => (
    value === "" ? "" : Math.max(1, Number.parseInt(String(value ?? 1), 10) || 1)
  );
  const sanitizeExactVolume = (value: unknown): number | undefined => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };

  return rows
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

function normalizeInputs(inputs?: Partial<EstimateInputs>): EstimateInputs {
  const moveType = normalizeLegacyMoveType(inputs?.moveType);
  const homeSize = normalizeLegacyHomeSize(inputs?.homeSize);

  return {
    ...DEFAULT_ESTIMATE_INPUTS,
    ...inputs,
    homeSize: HOME_SIZE_OPTIONS.has(homeSize ?? "") ? homeSize! : DEFAULT_ESTIMATE_INPUTS.homeSize,
    moveType,
    distance: typeof inputs?.distance === "string" ? inputs.distance : DEFAULT_ESTIMATE_INPUTS.distance,
    packingLevel: PACKING_LEVEL_OPTIONS.has(inputs?.packingLevel ?? "")
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

function clearLegacyDraft() {
  if (!hasStorage()) return;
  window.localStorage.removeItem(LEGACY_CONFIG_KEY);
  window.localStorage.removeItem(LEGACY_TEXT_KEY);
  window.localStorage.removeItem(LEGACY_MANAGER_KEY);
}

function deriveRowsStatus(
  inventoryMode: InventoryMode,
  inventoryText: string,
  normalizedRows: NormalizedRow[],
  requestedStatus?: RowsStatus
): RowsStatus {
  if (!normalizedRows.length) return "empty";
  if (inventoryMode === "normalized") return "fresh";
  if (requestedStatus === "stale") return "stale";

  const generatedText = normalizedRows
    .reduce((acc, row) => {
      const room = row.room || "General";
      if (!acc.has(room)) acc.set(room, []);
      acc.get(room)!.push(`${row.qty === "" ? 1 : row.qty} ${row.name}`);
      return acc;
    }, new Map<string, string[]>());

  const rawText = Array.from(generatedText.entries())
    .map(([room, items]) => (room === "General" ? items.join(", ") : `${room}: ${items.join(", ")}`))
    .join("\n");

  return rawText.trim() === inventoryText.trim() ? "fresh" : "stale";
}

function buildDraftState(
  inputs: Partial<EstimateInputs>,
  inventoryMode: unknown,
  normalizedRows: unknown,
  rowsStatus?: unknown
): DraftState {
  const safeInventoryMode = sanitizeInventoryMode(inventoryMode);
  const safeInputs = normalizeInputs(inputs);
  const safeRows = sanitizeNormalizedRows(normalizedRows);
  const safeRowsStatus = deriveRowsStatus(
    safeInventoryMode,
    safeInputs.inventoryText,
    safeRows,
    sanitizeRowsStatus(rowsStatus)
  );

  return {
    inputs: safeInputs,
    inventoryMode: safeInventoryMode,
    normalizedRows: safeRowsStatus === "empty" ? [] : safeRows,
    rowsStatus: safeRowsStatus,
  };
}

export function saveDraft(
  inputs: Partial<EstimateInputs>,
  inventoryMode: unknown,
  normalizedRows: unknown,
  rowsStatus?: unknown
) {
  if (!hasStorage()) return;

  const state = buildDraftState(inputs, inventoryMode, normalizedRows, rowsStatus);
  const savedAt = new Date().toISOString();
  const envelope: DraftEnvelope = {
    version: DRAFT_VERSION,
    savedAt,
    expiresAt: new Date(Date.now() + DRAFT_TTL_MS).toISOString(),
    inputs: state.inputs,
    inventoryMode: state.inventoryMode,
    normalizedRows: state.normalizedRows,
    rowsStatus: state.rowsStatus,
  };

  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(envelope));
  clearLegacyDraft();
}

export function clearDraft() {
  if (!hasStorage()) return;
  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  clearLegacyDraft();
}

export function loadDraft(): DraftLoadResult {
  if (!hasStorage()) {
    return { state: null, status: "missing" };
  }

  const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!rawDraft) {
    return { state: null, status: "missing" };
  }

  try {
    const envelope = JSON.parse(rawDraft) as DraftEnvelope;
    if (!envelope || envelope.version !== DRAFT_VERSION) {
      clearDraft();
      return { state: null, status: "invalid" };
    }

    const expiresAt = Date.parse(String(envelope.expiresAt ?? ""));
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      clearDraft();
      return { state: null, status: "invalid" };
    }

    return {
      state: buildDraftState(envelope.inputs, envelope.inventoryMode, envelope.normalizedRows, envelope.rowsStatus),
      status: "loaded",
    };
  } catch {
    clearDraft();
    return { state: null, status: "invalid" };
  }
}

export function migrateLegacyDraft(): DraftState | null {
  if (!hasStorage()) return null;

  const legacyConfig = window.localStorage.getItem(LEGACY_CONFIG_KEY);
  const legacyText = window.localStorage.getItem(LEGACY_TEXT_KEY);
  const legacyManager = window.localStorage.getItem(LEGACY_MANAGER_KEY);

  if (!legacyConfig && !legacyText && !legacyManager) {
    return null;
  }

  try {
    const parsedConfig = legacyConfig ? JSON.parse(legacyConfig) : {};
    const parsedManager = legacyManager ? JSON.parse(legacyManager) : {};
    const legacyRows = sanitizeNormalizedRows(parsedManager?.normalizedRows);
    const legacyInventoryMode = sanitizeInventoryMode(parsedManager?.inventoryMode);
    const state = buildDraftState(
      {
        ...parsedConfig,
        inventoryText: legacyText ?? parsedConfig?.inventoryText ?? "",
      },
      legacyInventoryMode,
      legacyRows,
      legacyInventoryMode === "raw" && legacyRows.length > 0 ? "stale" : parsedManager?.rowsStatus
    );
    saveDraft(state.inputs, state.inventoryMode, state.normalizedRows, state.rowsStatus);
    return state;
  } catch {
    clearDraft();
    return null;
  }
}
