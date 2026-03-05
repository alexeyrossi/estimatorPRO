"use server";

import {
  EstimateHistoryItem,
  EstimateInputs,
  EstimateResult,
  InventoryMode,
  NormalizedRow,
  SavedEstimateRecord,
  SavedEstimateState,
} from "../../lib/types/estimator";
import { buildEstimate } from "../../lib/engine";
import { applyAliasesRegex, clampInt, normalizeRowsFromText } from "../../lib/parser";
import { SORTED_KEYS, KEY_REGEX, VOLUME_TABLE, TRUE_HEAVY_ITEMS } from "../../lib/dictionaries";
import { createClient } from "../../lib/supabase/server";

const HOME_SIZE_OPTIONS = new Set(["0", "1", "2", "3", "4", "5", "Commercial"]);
const MOVE_TYPE_OPTIONS = new Set(["Local", "LD", "Labor", "Storage"]);
const PACKING_LEVEL_OPTIONS = new Set(["None", "Partial", "Full"]);
const ACCESS_OPTIONS = new Set(["ground", "elevator", "stairs"]);
const OVERRIDE_KEYS = new Set(["volume", "trucks", "crew", "timeMin", "timeMax", "blankets", "boxes"]);
const MAX_INVENTORY_CHARS = 12000;
const MAX_EXTRA_STOPS = 4;
const MAX_ROWS = 500;

function sanitizeInventoryMode(mode: string | undefined): InventoryMode {
  return mode === "normalized" ? "normalized" : "raw";
}

function sanitizeEstimateInputs(inputs: EstimateInputs, inventoryMode?: InventoryMode): EstimateInputs {
  const safeMoveType = MOVE_TYPE_OPTIONS.has(inputs.moveType) ? inputs.moveType : "Local";
  const safeInventoryMode = inventoryMode ?? sanitizeInventoryMode(inputs.inventoryMode);
  const safeAccessOrigin = ACCESS_OPTIONS.has(inputs.accessOrigin) ? inputs.accessOrigin : "ground";
  const safeAccessDest = safeMoveType === "Local" && ACCESS_OPTIONS.has(inputs.accessDest) ? inputs.accessDest : "ground";
  const extraStops = Array.isArray(inputs.extraStops)
    ? inputs.extraStops.slice(0, MAX_EXTRA_STOPS).map((stop) => ({
      label: String(stop?.label ?? "").trim().slice(0, 30),
      access: ACCESS_OPTIONS.has(stop?.access) ? stop.access : "ground",
      stairsFlights: clampInt(stop?.stairsFlights ?? 1, 1, 6),
    }))
    : [];

  return {
    homeSize: HOME_SIZE_OPTIONS.has(inputs.homeSize) ? inputs.homeSize : "3",
    moveType: safeMoveType as EstimateInputs["moveType"],
    distance: String(clampInt(inputs.distance, 0, 10000)),
    packingLevel: PACKING_LEVEL_OPTIONS.has(inputs.packingLevel) ? inputs.packingLevel : "None",
    accessOrigin: safeAccessOrigin as EstimateInputs["accessOrigin"],
    accessDest: safeAccessDest as EstimateInputs["accessDest"],
    stairsFlightsOrigin: clampInt(inputs.stairsFlightsOrigin, 1, 6),
    stairsFlightsDest: clampInt(inputs.stairsFlightsDest, 1, 6),
    inventoryText: String(inputs.inventoryText ?? "").slice(0, MAX_INVENTORY_CHARS),
    inventoryMode: safeInventoryMode,
    normalizedRows: undefined,
    overrides: undefined,
    extraStops,
  };
}

function sanitizeNormalizedRows(rows: NormalizedRow[] | undefined): NormalizedRow[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .slice(0, MAX_ROWS)
    .map((row, index) => ({
      id: String(row?.id ?? `row_${index}`).slice(0, 120),
      name: String(row?.name ?? "").trim().slice(0, 120),
      qty: clampInt(row?.qty ?? 1, 1, 500),
      cfUnit: clampInt(row?.cfUnit ?? 1, 1, 500),
      raw: String(row?.raw ?? "").slice(0, 240),
      room: String(row?.room ?? "").trim().slice(0, 80),
      flags: {
        heavy: !!row?.flags?.heavy,
        heavyWeight: !!row?.flags?.heavyWeight,
      },
    }))
    .filter((row) => row.name.length > 0);
}

function sanitizeOverrides(overrides: Record<string, string> | undefined): Record<string, string> {
  if (!overrides) return {};

  return Object.fromEntries(
    Object.entries(overrides)
      .filter(([key]) => OVERRIDE_KEYS.has(key))
      .map(([key, value]) => [key, String(value ?? "").trim().slice(0, 8)])
      .filter(([, value]) => value.length > 0)
  );
}

function buildTrustedEstimate(
  inputs: EstimateInputs,
  normalizedRows?: NormalizedRow[],
  overrides?: Record<string, string>
): { estimate: EstimateResult; inputs: EstimateInputs; normalizedRows: NormalizedRow[]; overrides: Record<string, string> } {
  const safeInventoryMode = sanitizeInventoryMode(inputs.inventoryMode);
  const safeInputs = sanitizeEstimateInputs(inputs, safeInventoryMode);
  const safeRows = sanitizeNormalizedRows(normalizedRows);
  const safeOverrides = sanitizeOverrides(overrides);
  const estimate = buildEstimate(
    { ...safeInputs, inventoryMode: safeInventoryMode },
    safeInventoryMode === "normalized" ? safeRows : undefined,
    safeOverrides
  );

  return { estimate, inputs: safeInputs, normalizedRows: safeRows, overrides: safeOverrides };
}

export async function getEstimate(inputs: EstimateInputs, normalizedRows?: NormalizedRow[], overrides?: Record<string, string>): Promise<EstimateResult> {
  return buildTrustedEstimate(inputs, normalizedRows, overrides).estimate;
}

export async function normalizeInventoryAction(text: string): Promise<NormalizedRow[]> {
  const result = normalizeRowsFromText(String(text ?? "").slice(0, MAX_INVENTORY_CHARS));
  return result.rows as NormalizedRow[];
}

export async function resolveItemAction(name: string): Promise<{ resolvedName: string; cfUnit: number; isHeavy: boolean }> {
  const alias = applyAliasesRegex((name || "").trim().toLowerCase());
  const volKey = SORTED_KEYS.find(k => KEY_REGEX[k as keyof typeof KEY_REGEX].test(alias)) || null;
  const resolvedName = volKey || `${name} (est)`;
  const cfUnit = volKey ? VOLUME_TABLE[volKey as keyof typeof VOLUME_TABLE] : 25;
  const isHeavy = TRUE_HEAVY_ITEMS.some(h => resolvedName.includes(h));
  return { resolvedName, cfUnit, isHeavy };
}

export async function suggestItemsAction(prefix: string): Promise<string[]> {
  const p = (prefix || "").trim().toLowerCase();
  if (p.length < 2) return [];
  return SORTED_KEYS.filter(k => k.includes(p)).slice(0, 20);
}

export async function saveEstimateAction(
  clientName: string,
  inputs: EstimateInputs,
  normalizedRows: NormalizedRow[],
  inventoryMode: InventoryMode,
  overrides: Record<string, string>
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized: You must be logged in to save estimates." };
    }

    if (!clientName || !clientName.trim()) {
      return { success: false, error: "Client Name is required." };
    }

    const safeClientName = clientName.trim().slice(0, 120);
    const {
      estimate,
      inputs: safeInputs,
      normalizedRows: safeRows,
      overrides: safeOverrides,
    } = buildTrustedEstimate({ ...inputs, inventoryMode }, normalizedRows, overrides);
    const {
      homeSize, moveType, distance, packingLevel,
      accessOrigin, accessDest, stairsFlightsOrigin, stairsFlightsDest,
      inventoryText, extraStops
    } = safeInputs;
    const inputsState: SavedEstimateState = {
      inputs: {
        homeSize,
        moveType,
        distance,
        packingLevel,
        accessOrigin,
        accessDest,
        stairsFlightsOrigin,
        stairsFlightsDest,
        inventoryText,
        extraStops,
      },
      normalizedRows: safeRows,
      inventoryMode: safeInputs.inventoryMode ?? "raw",
      overrides: safeOverrides,
    };

    const payload = {
      manager_id: user.id,
      client_name: safeClientName,
      final_volume: estimate.finalVolume,
      net_volume: estimate.netVolume || null,
      truck_space_cf: estimate.truckSpaceCF || null,
      inputs_state: inputsState,
    };

    const { data, error } = await supabase
      .from('estimates')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (err: unknown) {
    console.error("Save estimate action error:", err);
    return { success: false, error: err instanceof Error ? err.message : "An unexpected error occurred." };
  }
}

type EstimateHistoryRow = {
  id: string;
  client_name: string;
  final_volume: number | null;
  net_volume: number | null;
  inputs_state: SavedEstimateState | null;
  created_at: string;
};

export async function fetchHistoryAction(): Promise<EstimateHistoryItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('estimates')
    .select('id, client_name, final_volume, net_volume, inputs_state, created_at')
    .eq('manager_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error("fetchHistoryAction error:", error);
    return [];
  }

  return ((data || []) as EstimateHistoryRow[]).map(item => ({
    ...item,
    home_size: item.inputs_state?.inputs?.homeSize || null,
    move_type: item.inputs_state?.inputs?.moveType || null,
  }));
}

export async function loadEstimateAction(id: string): Promise<SavedEstimateRecord | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('estimates')
    .select('*')
    .eq('id', id)
    .eq('manager_id', user.id)
    .single();

  if (error) {
    console.error("loadEstimateAction error:", error);
    return null;
  }
  return (data as SavedEstimateRecord | null);
}

export async function deleteEstimateAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from('estimates')
    .delete()
    .eq('id', id)
    .eq('manager_id', user.id);

  if (error) {
    console.error("deleteEstimateAction error:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
