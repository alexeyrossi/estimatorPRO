import { PROTOCOL } from "../config";
import {
  isElectricPianoText,
  LEAGUE_1_REGEX_CACHE,
  LEAGUE_2_REGEX_CACHE,
  LIFT_GATE_REGEX_CACHE,
  matchesAnyRegex,
  matchesAnyRegexAcross,
} from "../dictionaries";
import { parseOverrideValue } from "../parser";
import type { EngineContext, TruckPlan, VolumePlan } from "./types";

export function computeTruckPlan(context: EngineContext, volumePlan: VolumePlan): TruckPlan {
  const { inputs, parsed, overrides, notes, items, useNormalized, manualHeavy, hasHeavy, hasHeavyByWeight, isLaborOnly, suppressConferenceTableHeavy } = context;
  const { finalVolume, weight } = volumePlan;

  let trucksFinal = 0;
  let truckSizeLabel = "N/A";
  let highCapRisk = false;
  let softTruckWarning = false;
  let truckFitNote: string | null = null;

  const hasPallets = (parsed.detectedItems || []).some((item) => {
    const nameLower = (item.name || "").toLowerCase();
    const rawLower = (item.raw || "").toLowerCase();
    return nameLower.includes("pallet") || nameLower.includes("skid") || rawLower.includes("pallet") || rawLower.includes("skid");
  });

  let truckFeatureLabel = "";
  const needsLiftGate = useNormalized
    ? manualHeavy || (parsed.detectedItems || []).some((item) => {
      const nameLower = (item.name || "").toLowerCase();
      const rawLower = (item.raw || "").toLowerCase();
      if (isElectricPianoText(nameLower, rawLower)) return false;
      if (suppressConferenceTableHeavy && nameLower === "conference table") return false;
      return matchesAnyRegex(LIFT_GATE_REGEX_CACHE, nameLower);
    })
    : (parsed.detectedItems || []).some((item) => {
      const nameLower = (item.name || "").toLowerCase();
      const rawLower = (item.raw || "").toLowerCase();
      if (isElectricPianoText(nameLower, rawLower)) return false;
      if (suppressConferenceTableHeavy && nameLower === "conference table") return false;
      return matchesAnyRegex(LIFT_GATE_REGEX_CACHE, nameLower);
    });

  if (hasHeavy || hasPallets || hasHeavyByWeight || needsLiftGate) {
    truckFeatureLabel = " + Lift-gate";
    if (hasPallets) notes.advice.push("Commercial: Palletjack & Lift-gate required for skids.");
    if (hasHeavyByWeight) notes.advice.push("Item >300lb detected: Heavy lifting gear needed.");
  }

  if (!isLaborOnly) {
    const hardCapacity = PROTOCOL.TRUCK_MAX_THEORETICAL;
    const extraStopTruckThresholdReduction = context.extraStopCount > 0
      ? Math.min(
        PROTOCOL.EXTRA_STOP_TRUCK_MAX_THRESHOLD_REDUCTION,
        (context.extraStopCount * PROTOCOL.EXTRA_STOP_TRUCK_THRESHOLD_REDUCTION_PER_STOP)
        + (context.hasNonGroundExtraStop ? PROTOCOL.EXTRA_STOP_TRUCK_NON_GROUND_BONUS : 0)
      )
      : 0;
    const adjustedHardCap = Math.floor(hardCapacity * (1 - extraStopTruckThresholdReduction));

    trucksFinal = Math.max(1, Math.ceil(finalVolume / hardCapacity));
    if (trucksFinal === 1) {
      if (extraStopTruckThresholdReduction > 0 && finalVolume >= adjustedHardCap) {
        trucksFinal = 2;
        highCapRisk = true;
        notes.risks.push({ text: "Multi-stop routing reduces practical 1-truck capacity: 2 trucks recommended.", level: "caution" });
        notes.auditSummary.push("Extra truck added (multi-stop routing).");
      } else if (finalVolume >= PROTOCOL.TRUCK_SOFT_TIP_FLOOR && finalVolume <= hardCapacity) {
        softTruckWarning = true;
        truckFitNote = "Near full 26ft load; 2nd truck may be needed if add-ons appear.";
        notes.auditSummary.push("Near full 26ft load: 2nd truck may be needed if scope grows.");
      }
    }

    if (trucksFinal >= 2) truckSizeLabel = "26ft Truck";
    else if (finalVolume < 800) truckSizeLabel = "18ft Truck";
    else if (finalVolume < 1300) truckSizeLabel = "24ft Truck";
    else truckSizeLabel = "26ft Truck";
    truckSizeLabel += truckFeatureLabel;

    if (inputs.moveType === "LD") {
      const weightTrucks = Math.ceil(weight / PROTOCOL.LD_WEIGHT_LIMIT);
      if (weightTrucks > trucksFinal) {
        if (trucksFinal === 1) {
          notes.risks.push({ text: "Estimated shipment weight exceeds single-truck payload: additional truck required.", level: "caution" });
        }
        trucksFinal = weightTrucks;
        softTruckWarning = false;
        truckFitNote = null;
        notes.auditSummary.push("Extra truck added (weight limit).");
      }
    }
  }

  if (!isLaborOnly && overrides.trucks !== undefined && overrides.trucks !== null) {
    const overriddenTrucks = parseOverrideValue(overrides.trucks, 1, 20);
    if (overriddenTrucks !== null) {
      trucksFinal = overriddenTrucks;
      highCapRisk = false;
      softTruckWarning = false;
      truckFitNote = null;
      const label = trucksFinal >= 2 ? "26ft Truck" : finalVolume < 800 ? "18ft Truck" : finalVolume < 1300 ? "24ft Truck" : "26ft Truck";
      truckSizeLabel = label + truckFeatureLabel;
      notes.overridesApplied.push("trucks");
      notes.auditSummary.push(`Manager Override: Trucks = ${trucksFinal}`);
    }
  }

  let league = 0;
  const leagueItems: { l1: string[]; l2: string[] } = { l1: [], l2: [] };
  items.forEach((item) => {
    const nameLower = (item.name || "").toLowerCase();
    const rawLower = (item.raw || "").toLowerCase();
    if (isElectricPianoText(nameLower, rawLower)) return;
    if (matchesAnyRegexAcross(LEAGUE_2_REGEX_CACHE, nameLower, rawLower)) {
      league = 2;
      leagueItems.l2.push(item.name);
    } else if (matchesAnyRegexAcross(LEAGUE_1_REGEX_CACHE, nameLower, rawLower)) {
      if (league < 1) league = 1;
      leagueItems.l1.push(item.name);
    }
  });

  return {
    trucksFinal,
    truckSizeLabel,
    highCapRisk,
    softTruckWarning,
    truckFitNote,
    truckFeatureLabel,
    hasPallets,
    needsLiftGate,
    league,
    leagueItems,
  };
}
