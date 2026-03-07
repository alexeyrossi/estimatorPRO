import {
  DraftEnvelope,
  DraftLoadResult,
  DraftState,
  EstimateInputs,
} from "./types/estimator";
import {
  buildDraftState,
  sanitizeInventoryMode,
  sanitizeNormalizedRows,
} from "./estimatePolicy";

export { DEFAULT_ESTIMATE_INPUTS, normalizeLegacyHomeSize, normalizeLegacyMoveType } from "./estimatePolicy";

const DRAFT_VERSION = "v12";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;
const DRAFT_STORAGE_KEY = "estimator_draft_v12";
const LEGACY_CONFIG_KEY = "estimator_fixed_v11_58_config";
const LEGACY_TEXT_KEY = "estimator_fixed_v11_58_text";
const LEGACY_MANAGER_KEY = "estimator_fixed_v11_58_manager";

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function clearLegacyDraft() {
  if (!hasStorage()) return;
  window.localStorage.removeItem(LEGACY_CONFIG_KEY);
  window.localStorage.removeItem(LEGACY_TEXT_KEY);
  window.localStorage.removeItem(LEGACY_MANAGER_KEY);
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
    const legacyRows = sanitizeNormalizedRows(parsedManager?.normalizedRows, { allowEmptyNumericFields: true });
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
