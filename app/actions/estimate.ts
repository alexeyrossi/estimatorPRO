"use server";

import { EstimateInputs, EstimateResult, NormalizedRow } from "../../lib/types/estimator";
import { buildEstimate } from "../../lib/engine";
import { normalizeRowsFromText, applyAliasesRegex } from "../../lib/parser";
import { SORTED_KEYS, KEY_REGEX, VOLUME_TABLE, TRUE_HEAVY_ITEMS } from "../../lib/dictionaries";
import { createClient } from "../../lib/supabase/server";

export async function getEstimate(inputs: EstimateInputs, normalizedRows?: NormalizedRow[], overrides?: Record<string, string>): Promise<EstimateResult> {
  try {
    const result = buildEstimate(inputs, normalizedRows, overrides);
    // DEBUG LOG
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbg = result as any;
    console.log("[PARSER DEBUG]", {
      detectedQtyTotal: dbg.detectedQtyTotal,
      totalVol: dbg.netVolume,
      itemCount: dbg.detectedItems?.length,
      firstItems: dbg.detectedItems?.slice(0, 8).map((i: { name: string; qty: number }) => `${i.name} x${i.qty}`),
      unrecognized: dbg.unrecognized?.slice(0, 5)
    });
    if (inputs.moveType === "LD") {
      console.log("[LD DEBUG] billableCF:", result.billableCF, "truckSpaceCF:", result.truckSpaceCF, "netVolume:", result.netVolume);
    }
    return JSON.parse(JSON.stringify(result));
  } catch (err) {
    throw err;
  }
}

export async function normalizeInventoryAction(text: string): Promise<NormalizedRow[]> {
  const result = normalizeRowsFromText(text);
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
  estimate: EstimateResult,
  inputs: EstimateInputs,
  normalizedRows: NormalizedRow[],
  inventoryMode: string,
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

    const {
      homeSize, moveType, distance, packingLevel,
      accessOrigin, accessDest, stairsFlightsOrigin, stairsFlightsDest,
      inventoryText, extraStops
    } = inputs;

    const payload = {
      manager_id: user.id,
      client_name: clientName.trim(),
      final_volume: estimate.finalVolume,
      net_volume: estimate.netVolume || null,
      truck_space_cf: estimate.truckSpaceCF || null,
      inputs_state: {
        inputs: {
          homeSize, moveType, distance, packingLevel,
          accessOrigin, accessDest, stairsFlightsOrigin, stairsFlightsDest,
          inventoryText, extraStops
        },
        normalizedRows,
        inventoryMode,
        overrides
      }
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

export async function fetchHistoryAction() {
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
  return (data || []).map(item => ({
    ...item,
    home_size: item.inputs_state?.inputs?.homeSize || null,
    move_type: item.inputs_state?.inputs?.moveType || null,
  }));
}

export async function loadEstimateAction(id: string) {
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
  return data;
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
