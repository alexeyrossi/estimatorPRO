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
import { getSessionAccess, requireAuthenticatedAccess } from "../../lib/auth/access";
import { buildEstimate } from "../../lib/engine";
import {
  cleanTranscriptToRoomInventory,
  getTranscriptCleanerErrorCode,
  type TranscriptCleanerErrorCode,
} from "../../lib/geminiTranscriptCleaner";
import { applyAliasesRegex, normalizeRowsFromText } from "../../lib/parser";
import { SORTED_KEYS, KEY_REGEX, VOLUME_TABLE, TRUE_HEAVY_ITEMS } from "../../lib/dictionaries";
import { serializeRoomInventoryToText, type RoomInventoryGroup } from "../../lib/roomInventory";
import {
  MAX_INVENTORY_CHARS,
  normalizeLegacyMoveType,
  sanitizeEstimateInputs,
  sanitizeInventoryMode,
  sanitizeNormalizedRows,
  sanitizeOverrides,
} from "../../lib/estimatePolicy";
import { createClient } from "../../lib/supabase/server";

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

type CleanTranscriptActionErrorCode = "unauthorized" | TranscriptCleanerErrorCode;

export type CleanTranscriptActionResult =
  | { success: true; rooms: RoomInventoryGroup[]; inventoryText: string }
  | { success: false; errorCode: CleanTranscriptActionErrorCode; message: string };

function isUnauthorizedError(error: unknown) {
  return error instanceof Error && error.message === "Unauthorized";
}

function getTranscriptActionFailure(error: unknown): {
  errorCode: CleanTranscriptActionErrorCode;
  message: string;
} {
  if (isUnauthorizedError(error)) {
    return {
      errorCode: "unauthorized",
      message: "Your session expired. Please sign in again.",
    };
  }

  const errorCode = getTranscriptCleanerErrorCode(error);

  switch (errorCode) {
    case "env_missing":
      return {
        errorCode,
        message: "AI transcript is not configured on the server. Add the Gemini API key and redeploy.",
      };
    case "timeout":
      return {
        errorCode,
        message: "AI transcript timed out. Please try again.",
      };
    case "upstream_request":
      return {
        errorCode,
        message: "AI transcript service is temporarily unavailable. Please try again.",
      };
    case "malformed_response":
      return {
        errorCode,
        message: "AI transcript returned an invalid response. Please try again.",
      };
    case "unknown":
    default:
      return {
        errorCode: "unknown",
        message: "AI transcript failed. Please try again.",
      };
  }
}

export async function getEstimate(inputs: EstimateInputs, normalizedRows?: NormalizedRow[], overrides?: Record<string, string>): Promise<EstimateResult> {
  await requireAuthenticatedAccess();
  return buildTrustedEstimate(inputs, normalizedRows, overrides).estimate;
}

export async function normalizeInventoryAction(text: string): Promise<NormalizedRow[]> {
  await requireAuthenticatedAccess();
  const result = normalizeRowsFromText(String(text ?? "").slice(0, MAX_INVENTORY_CHARS));
  return result.rows as NormalizedRow[];
}

export async function cleanTranscriptAction(text: string): Promise<CleanTranscriptActionResult> {
  try {
    await requireAuthenticatedAccess();
    const cleanedInventory = await cleanTranscriptToRoomInventory(String(text ?? "").slice(0, MAX_INVENTORY_CHARS));

    return {
      success: true,
      rooms: cleanedInventory.rooms,
      inventoryText: serializeRoomInventoryToText(cleanedInventory.rooms),
    };
  } catch (error) {
    const failure = getTranscriptActionFailure(error);
    console.error("cleanTranscriptAction failed", {
      errorCode: failure.errorCode,
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      errorCode: failure.errorCode,
      message: failure.message,
    };
  }
}

export async function resolveItemAction(name: string): Promise<{ resolvedName: string; cfUnit: number; isHeavy: boolean }> {
  await requireAuthenticatedAccess();
  const alias = applyAliasesRegex((name || "").trim().toLowerCase());
  const volKey = SORTED_KEYS.find(k => KEY_REGEX[k as keyof typeof KEY_REGEX].test(alias)) || null;
  const resolvedName = volKey || `${name} (est)`;
  const cfUnit = volKey ? VOLUME_TABLE[volKey as keyof typeof VOLUME_TABLE] : 25;
  const isHeavy = TRUE_HEAVY_ITEMS.some(h => resolvedName.includes(h));
  return { resolvedName, cfUnit, isHeavy };
}

export async function suggestItemsAction(prefix: string): Promise<string[]> {
  await requireAuthenticatedAccess();
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
    const access = await getSessionAccess();
    if (!access.isAuthenticated || !access.userId) {
      return { success: false, error: "Unauthorized: You must be logged in to save estimates." };
    }
    const supabase = await createClient();

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
      accessOrigin, accessDest,
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
        inventoryText,
        extraStops,
      },
      normalizedRows: safeRows,
      inventoryMode: safeInputs.inventoryMode ?? "raw",
      overrides: safeOverrides,
    };

    const payload = {
      manager_id: access.userId,
      client_name: safeClientName,
      final_volume: estimate.finalVolume ?? null,
      net_volume: estimate.netVolume ?? null,
      truck_space_cf: estimate.truckSpaceCF ?? null,
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
  const access = await getSessionAccess();
  if (!access.isAuthenticated || !access.userId) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('estimates')
    .select('id, client_name, final_volume, net_volume, inputs_state, created_at')
    .eq('manager_id', access.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("fetchHistoryAction error:", error);
    return [];
  }

  return ((data || []) as EstimateHistoryRow[]).map(item => ({
    ...item,
    home_size: item.inputs_state?.inputs?.homeSize || null,
    move_type: item.inputs_state?.inputs?.moveType ? normalizeLegacyMoveType(String(item.inputs_state.inputs.moveType)) : null,
  }));
}

export async function loadEstimateAction(id: string): Promise<SavedEstimateRecord | null> {
  const access = await getSessionAccess();
  if (!access.isAuthenticated || !access.userId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('estimates')
    .select('*')
    .eq('id', id)
    .eq('manager_id', access.userId)
    .single();

  if (error) {
    console.error("loadEstimateAction error:", error);
    return null;
  }
  return (data as SavedEstimateRecord | null);
}

export async function deleteEstimateAction(id: string) {
  const access = await getSessionAccess();
  if (!access.isAuthenticated || !access.userId) return { success: false, error: "Unauthorized" };
  const supabase = await createClient();

  const { error } = await supabase
    .from('estimates')
    .delete()
    .eq('id', id)
    .eq('manager_id', access.userId);

  if (error) {
    console.error("deleteEstimateAction error:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
