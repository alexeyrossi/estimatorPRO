import "server-only";

import { buildEngineContext } from "./engine/context";
import { buildEstimateResult } from "./engine/finalize";
import { computeLaborPlan } from "./engine/labor";
import { computeTruckPlan } from "./engine/trucks";
import type { EngineNotes } from "./engine/types";
import { computeVolumePlan } from "./engine/volume";
import type { EstimateInputs, EstimateResult, NormalizedRow } from "./types/estimator";

function createEngineNotes(): EngineNotes {
  return {
    logs: [],
    risks: [],
    auditSummary: [],
    advice: [],
    overridesApplied: [],
  };
}

export function buildEstimate(
  inputs: EstimateInputs,
  normalizedRows?: NormalizedRow[],
  overridesObj?: Record<string, string>
): EstimateResult {
  try {
    const notes = createEngineNotes();
    const overrides = overridesObj || inputs?.overrides || {};
    const context = buildEngineContext(inputs, normalizedRows, overrides, notes);
    const volumePlan = computeVolumePlan(context);
    const truckPlan = computeTruckPlan(context, volumePlan);
    const laborPlan = computeLaborPlan(context, volumePlan, truckPlan);
    return buildEstimateResult(context, volumePlan, truckPlan, laborPlan);
  } catch (err) {
    console.error("Engine Crash:", err);
    throw err instanceof Error ? err : new Error("Unknown engine crash");
  }
}
