import { PROTOCOL } from "../config";
import {
  BLANKET_KEYS,
  BLANKET_REGEX_CACHE,
  BLANKETS_TABLE,
  EFFORT_MULTIPLIER,
  isElectricPianoText,
  STRICT_NO_BLANKET_REGEX_CACHE,
  TRUE_HEAVY_ITEMS,
  matchesAnyRegex,
} from "../dictionaries";
import { matchLongestKey, parseOverrideValue, roundUpTo } from "../parser";
import type { EstimateResult } from "../types/estimator";
import type { EngineContext, LaborPlan, TruckPlan, VolumePlan } from "./types";

function buildConfidenceFactors({
  estimatedRatio,
  hasVague,
  syntheticBundleRatio,
  syntheticBundleGroups,
}: {
  estimatedRatio: number;
  hasVague: boolean;
  syntheticBundleRatio: number;
  syntheticBundleGroups: number;
}) {
  const factors: string[] = [];

  if (estimatedRatio > 0.4) {
    factors.push("Many items were inferred instead of matched directly.");
  } else if (estimatedRatio > 0.05) {
    factors.push("Some items were estimated from unclear or unmatched text.");
  }

  if (hasVague) {
    factors.push("Inventory description is vague.");
  }

  if (syntheticBundleRatio >= 0.1 || syntheticBundleGroups >= 3) {
    factors.push("Packed contents were inferred as box bundles.");
  }

  if (!factors.length) {
    factors.push("Most items were recognized directly from the inventory.");
  }

  return factors;
}

function formatCompactNumber(value: number, maximumFractionDigits = 1) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

function formatSignedAmount(value: number, unit: string, maximumFractionDigits = 1) {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}${formatCompactNumber(Math.abs(value), maximumFractionDigits)} ${unit}`;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatRangeBuffer(lowHours: number, highHours: number) {
  const low = Math.max(0, Math.round(lowHours * 10) / 10);
  const high = Math.max(0, Math.round(highHours * 10) / 10);

  if (low === 0 && high === 0) return "floor / ceiling";
  if (Math.abs(low - high) <= 0.2) return `\u00b1${formatCompactNumber(Math.max(low, high))}h`;
  if (low === 0) return `+${formatCompactNumber(high)}h`;
  return `-${formatCompactNumber(low)} / +${formatCompactNumber(high)}h`;
}

export function buildEstimateResult(
  context: EngineContext,
  volumePlan: VolumePlan,
  truckPlan: TruckPlan,
  laborPlan: LaborPlan
): EstimateResult {
  const { inputs, parsed, notes, countBy, useNormalized, isCommercial, commercialSignals, isLaborOnly, isLD, bedroomCount, scopeLabel, extraStopCount, parsed: { hasVague }, anyHeavySignal, fragileCount, estimatedRatio, syntheticBundleRatio, syntheticBundleGroups, ldFullPackLargeHome, suppressConferenceTableHeavy } = context;
  const { inventoryVolume, hiddenVolume, missingBoxesCount, llPct, llBasePct, llReasons, rawVolume, billableCF, truckSpaceCF, finalVolume, weight, coverageContributors, safetyBufferCF, billableRoundingCF, looseLoadBufferCF, truckSpaceRoundingCF } = volumePlan;
  const { trucksFinal, truckSizeLabel, highCapRisk, truckFitNote, hasPallets, league, leagueItems } = truckPlan;
  const { crew, timeMin, timeMax, splitRecommended, crewSuggestion, nextMoverTimeSavedHours, nextMoverSavingsLabel, totalManHours, daMins, boxDensity, calcDuration, safeDayLimit, baseDurationHours, accessAdjustmentDurationHours, highCapRiskBufferDurationHours, ldTierBufferDurationHours, wrapDurationHours, daDurationHours, packingDurationHours, ldFullPackPrepDurationHours, distanceDurationHours, coordinationDurationHours, dockingDurationHours, truckLogisticsDurationHours, extraStopDurationHours, recommendedCrew, recommendedCalcDuration, recommendedTimeMin, recommendedTimeMax, recommendedRangeLowHours, recommendedRangeHighHours } = laborPlan;

  const baseFloor = isLaborOnly ? 10 : 20;
  const itemFloor = Math.ceil((parsed.furnitureCount || 0) / 2);
  let blankets = 0;
  (parsed.detectedItems || []).forEach((item) => {
    const itemName = (item.name || "").toLowerCase();
    let blanketCount = 0;
    const longestKey = matchLongestKey(itemName, BLANKET_KEYS, BLANKET_REGEX_CACHE);
    if (longestKey) blanketCount = (BLANKETS_TABLE as Record<string, number>)[longestKey];
    else if (!matchesAnyRegex(STRICT_NO_BLANKET_REGEX_CACHE, itemName)) blanketCount = 1;

    const isChairLike = (itemName.includes("chair") || itemName.includes("stool")) && !itemName.includes("chair mat") && !itemName.includes("mat");
    const isArmchair = itemName.includes("arm") || itemName.includes("recliner") || itemName.includes("sofa");
    if (isCommercial && isChairLike && !isArmchair) {
      blankets += Math.ceil(item.qty / PROTOCOL.COMMERCIAL_STACK_FACTOR);
    } else {
      blankets += blanketCount * item.qty;
    }
  });

  const noBlanketCF = (parsed.detectedItems || []).reduce((sum, item) => (
    matchesAnyRegex(STRICT_NO_BLANKET_REGEX_CACHE, (item.name || "").toLowerCase())
      ? sum + (item.cf || 0)
      : sum
  ), 0);
  const noBlanketWithLL = Math.round((noBlanketCF + (missingBoxesCount * 5)) * (1 + llPct));
  const blanketVolume = Math.max(0, finalVolume - noBlanketWithLL);

  blankets = Math.max(blankets, Math.ceil(blanketVolume / PROTOCOL.BLANKET_DIVISOR));
  const blanketCap = Math.min(Math.ceil((parsed.furnitureCount || 0) * PROTOCOL.BLANKET_CAP_MULTIPLIER) + 15, Math.ceil(blanketVolume / 12));
  blankets = roundUpTo(Math.max(Math.min(blankets, blanketCap), Math.max(baseFloor, itemFloor)), 5);

  let confidenceScore = 100;
  const confidenceReasons: string[] = [];
  if (estimatedRatio > 0.05) {
    const penalty = Math.min(30, Math.round(estimatedRatio * 40));
    confidenceScore -= penalty;
    confidenceReasons.push(`Estimated items: ${Math.round(estimatedRatio * 100)}% (-${penalty})`);
  }
  if (estimatedRatio > 0.40) {
    confidenceScore = Math.min(confidenceScore, 50);
    confidenceReasons.push("Too many unrecognized items (Low Confidence).");
  }
  if (hasVague) {
    confidenceScore -= 7;
    confidenceReasons.push("Vague inventory description.");
  }
  if (syntheticBundleRatio >= 0.10) {
    const penalty = Math.min(15, Math.max(5, Math.round(syntheticBundleRatio * 40)));
    confidenceScore -= penalty;
    confidenceReasons.push(`Inferred packed bundles: ${Math.round(syntheticBundleRatio * 100)}% (-${penalty})`);
  } else if (syntheticBundleGroups >= 3) {
    confidenceScore -= 4;
    confidenceReasons.push("Multiple packed-content bundles inferred.");
  }
  confidenceScore = Math.max(40, Math.min(100, confidenceScore));
  const confidenceLabel = confidenceScore >= 80 ? "High" : confidenceScore >= 60 ? "Medium" : "Low";
  const confidenceFactors = buildConfidenceFactors({
    estimatedRatio,
    hasVague,
    syntheticBundleRatio,
    syntheticBundleGroups,
  });

  if (!isCommercial && (inputs.moveType === "Local" || inputs.moveType === "LD")) {
    let volumeDriver = "Volume Driver: Inventory volume was adjusted for safe loading.";
    if (isLD && billableCF && truckSpaceCF) volumeDriver = "Volume Driver: Safety margin and truck-space buffer applied.";
    else if (hasVague) volumeDriver = "Volume Driver: Vague inventory increased handling allowance.";
    else if (missingBoxesCount > 0) volumeDriver = "Volume Driver: Missing box allowance increased the volume baseline.";
    else if (hiddenVolume > 0) volumeDriver = "Volume Driver: Room-size floor increased the baseline volume.";
    else if (llPct > PROTOCOL.LL_STANDARD) volumeDriver = "Volume Driver: Bulky or irregular items increased truck-space needs.";

    let timeDriver = "Time Driver: Loading speed is based on volume, access, and item mix.";
    if (inputs.packingLevel === "Full") timeDriver = "Time Driver: Full packing and prep time are driving the estimate.";
    else if (inputs.packingLevel === "Partial") timeDriver = "Time Driver: Packing prep adds handling time.";
    else if (isLD) timeDriver = "Time Driver: Estimate covers origin labor and prep, not transit time.";
    else if (extraStopCount > 0) timeDriver = "Time Driver: Extra stops added routing, staging, and access time.";
    else if (inputs.accessOrigin === "stairs" || inputs.accessDest === "stairs") timeDriver = "Time Driver: Stair access reduces handling speed.";
    else if (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator") timeDriver = "Time Driver: Elevator coordination reduces handling speed.";
    else if (daMins >= 60) timeDriver = "Time Driver: Assembly/disassembly time is materially affecting the move.";
    else if (highCapRisk || trucksFinal >= 2) timeDriver = "Time Driver: Multi-truck coordination is adding handling time.";

    let crewDriver = "Crew Driver: Crew size is based on volume and expected move duration.";
    if (league === 2 || anyHeavySignal) crewDriver = "Crew Driver: Heavy or oversized items increased crew needs.";
    else if (extraStopCount >= 2 && crew >= 4) crewDriver = "Crew Driver: Multi-stop routing increased coordination needs.";
    else if (trucksFinal >= 2) crewDriver = "Crew Driver: Multi-truck volume requires a larger crew.";
    else if (finalVolume >= 1800) crewDriver = "Crew Driver: Large shipment volume pushed the crew size up.";
    else if (ldFullPackLargeHome && crew >= 7) crewDriver = "Crew Driver: Estate-scale full packing requires a larger crew.";
    else if (inputs.packingLevel === "Full" && crew >= 4) crewDriver = "Crew Driver: Packing workload supports a larger crew.";
    else if (calcDuration > safeDayLimit || (crewSuggestion && crew >= 3)) crewDriver = "Crew Driver: Crew size was increased to keep the move within a workable day.";

    notes.advice.push(volumeDriver, timeDriver, crewDriver);
  }

  const isLightOfficeCommercial = isCommercial && commercialSignals.lightOfficeEligible;
  const isMedicalCommercial = isCommercial && (commercialSignals.hasMedicalOps || commercialSignals.hasServerRack);

  if (isLightOfficeCommercial) {
    if (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator") {
      notes.advice.push("Confirm building move window, freight elevator booking, and COI requirements.");
    } else {
      notes.advice.push("Confirm building access, parking, and loading-zone rules.");
    }
    if (trucksFinal >= 2) notes.advice.push("Reserve loading dock time and truck staging in advance");
    if (inputs.packingLevel !== "None") notes.advice.push("Comm. Packing: Label all boxes by office/room number.");
  } else {
    if (isCommercial && (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator") && isMedicalCommercial) {
      notes.advice.push("Confirm freight elevator access, move window, and cab dimensions.");
    }
    if (isCommercial && trucksFinal >= 2) notes.advice.push("Reserve loading dock time and truck staging in advance");
    if (isCommercial && isMedicalCommercial) notes.advice.push("Pre-measure oversized equipment, cabinets, and appliance paths.");
    if (inputs.packingLevel !== "None" && isCommercial) notes.advice.push("Comm. Packing: Label all boxes by office/room number.");
  }
  if (isCommercial && commercialSignals.hasPalletizedFreight) {
    notes.advice.push("Confirm dock door access, pallet counts, and receiving window before dispatch.");
  }
  if (extraStopCount > 0) notes.advice.push("Confirm stop order, parking, and access for each stop before dispatch");
  if (finalVolume > 1800 && trucksFinal === 1) notes.advice.push("High Volume: Ensure parking spot is 40ft+ for large truck maneuvering.");

  const uniqueAdvice: string[] = [];
  const seenAdvice = new Set<string>();
  notes.advice.forEach((adviceLine) => {
    if (splitRecommended && adviceLine.includes("2-Day Split")) return;
    if (!seenAdvice.has(adviceLine)) {
      seenAdvice.add(adviceLine);
      uniqueAdvice.push(adviceLine);
    }
  });

  // 1. Узнаем количество коробок (missingBoxesCount = физический дефицит, который нужно привезти)
  const minBoxesBySize = !isCommercial ? volumePlan.effectiveMinBoxes : 20;

  let boxesBring = 0;

  if (inputs.packingLevel === "Full") {
    // Везем ТОЛЬКО пустые коробки для неупакованных вещей (дефицит) + дежурный буфер
    const buffer = 10 + (Math.max(1, trucksFinal) * 5);
    boxesBring = volumePlan.missingBoxesCount + buffer;
  } else if (inputs.packingLevel === "Partial") {
    // Частичная упаковка: 35% от норматива, но ограничено реальным дефицитом + небольшой буфер
    const safeFloor = Math.ceil(minBoxesBySize * 0.35);
    const partialBase = isCommercial ? 25 : Math.max(15, safeFloor);
    boxesBring = Math.min(partialBase, volumePlan.missingBoxesCount) + 10;
  } else {
    // No packing: never supply boxes except for a strict safety buffer (ignoring missingBoxesCount AND clientBoxes)
    boxesBring = isCommercial ? 15 : 10;
  }

  // 3. Risk modifiers
  if (fragileCount > 5) boxesBring += 5;
  if (hasVague) boxesBring += 5;

  // 4. Global physical cap from REAL volume (parsed.totalVol)
  // Protects against extreme outliers even if deficit is miscalculated
  const absoluteCap = inputs.packingLevel === "Full" 
    ? Math.max(15, Math.ceil(parsed.totalVol / 12 + 20)) 
    : Math.max(10, Math.ceil(parsed.totalVol / 20 + 10));

  boxesBring = Math.min(boxesBring, absoluteCap);

  // 5. Sharper rounding to 5 (instead of 10)
  boxesBring = roundUpTo(boxesBring, 5);
  let wardrobes = roundUpTo(!isCommercial ? (bedroomCount * 4) : 0, 5);

  if (context.overrides.blankets !== undefined && context.overrides.blankets !== null) {
    const overriddenBlankets = parseOverrideValue(context.overrides.blankets, 0, 500);
    if (overriddenBlankets !== null) {
      blankets = overriddenBlankets;
      notes.overridesApplied.push("blankets");
      notes.auditSummary.push(`Manager Override: Blankets = ${blankets}`);
    }
  }
  if (context.overrides.boxes !== undefined && context.overrides.boxes !== null) {
    const overriddenBoxes = parseOverrideValue(context.overrides.boxes, 0, 500);
    if (overriddenBoxes !== null) {
      boxesBring = overriddenBoxes;
      notes.overridesApplied.push("boxes");
      notes.auditSummary.push(`Manager Override: Boxes = ${boxesBring}`);
    }
  }
  if (context.overrides.wardrobes !== undefined && context.overrides.wardrobes !== null) {
    const overriddenWardrobes = parseOverrideValue(context.overrides.wardrobes, 0, 200);
    if (overriddenWardrobes !== null) {
      wardrobes = overriddenWardrobes;
      notes.overridesApplied.push("wardrobes");
      notes.auditSummary.push(`Manager Override: Wardrobes = ${wardrobes}`);
    }
  }

  const smartEquipment: string[] = [];
  if (hasPallets) smartEquipment.push("Pallet Jack");
  if ((parsed.detectedItems || []).some((item) => {
    const nameLower = (item.name || "").toLowerCase();
    const rawLower = (item.raw || "").toLowerCase();
    return /piano/i.test(nameLower) && !isElectricPianoText(nameLower, rawLower);
  })) smartEquipment.push("Piano Board");
  if (countBy(/fridge|washer|dryer|safe/i) > 0) smartEquipment.push("Appliance Dolly");
  if (fragileCount > 2) smartEquipment.push("Protective Wrap");

  const heavyMap = new Map<string, number>();
  (parsed.detectedItems || []).forEach((item) => {
    const itemName = (item.name || "").toLowerCase();
    if (useNormalized) {
      if (!item.isManualHeavy) return;
    } else {
      if (isElectricPianoText(itemName, (item.raw || "").toLowerCase())) return;
      if (suppressConferenceTableHeavy && itemName === "conference table") return;
      const isTrueHeavy = TRUE_HEAVY_ITEMS.some((label) => itemName.includes(label));
      if (!isTrueHeavy && !item.isWeightHeavy) return;
    }

    const label = item.isWeightHeavy ? `${item.name} (>300lb)` : item.name;
    heavyMap.set(label, (heavyMap.get(label) || 0) + (item.qty || 1));
  });

  let effortScore = 0;
  (parsed.detectedItems || []).forEach((item) => {
    const itemName = (item.name || "").toLowerCase();
    const multiplier = Object.entries(EFFORT_MULTIPLIER).find(([label]) => itemName.includes(label));
    effortScore += (item.cf || 0) * (multiplier ? multiplier[1] : 1.0);
  });

  const distVal = parseInt(inputs.distance, 10) || 0;
  const effectiveDist = (inputs.moveType === "LD" || isLaborOnly) ? 0 : distVal;
  const overridesAppliedSet = new Set(notes.overridesApplied);

  const volumeAdjustmentDetails = coverageContributors.map((contributor) => (
    `${formatSignedAmount(contributor.amount, "cu ft")} ${contributor.label}: ${contributor.detail}`
  ));
  if (safetyBufferCF > 0) {
    volumeAdjustmentDetails.push(`${formatSignedAmount(safetyBufferCF, "cu ft")} Broker safety allowance (+5%).`);
  }
  if (billableRoundingCF !== 0) {
    volumeAdjustmentDetails.push(`${formatSignedAmount(billableRoundingCF, "cu ft")} Rounded to the nearest 25 cu ft.`);
  }
  if (!volumeAdjustmentDetails.length) {
    volumeAdjustmentDetails.push("No baseline coverage or safety adjustments were required.");
  }

  const looseLoadDetails = [
    `${formatPercent(llBasePct)} loose-load base allowance.`,
  ];
  if (llPct > llBasePct) {
    looseLoadDetails.push(`${formatPercent(llPct - llBasePct)} extra loose-load allowance for ${llReasons.join(", ")}.`);
  }
  if (looseLoadBufferCF > 0) {
    looseLoadDetails.push(`${formatSignedAmount(looseLoadBufferCF, "cu ft")} Applied as loose-load and stacking buffer.`);
  }
  if (truckSpaceRoundingCF !== 0) {
    looseLoadDetails.push(`${formatSignedAmount(truckSpaceRoundingCF, "cu ft")} Rounded to the nearest 25 cu ft.`);
  }
  if (llReasons.length > 0) {
    looseLoadDetails.push(`Reasons: ${llReasons.join(", ")}.`);
  }

  const accessContext: string[] = [];
  if (inputs.accessOrigin !== "ground") accessContext.push(`pickup ${inputs.accessOrigin}`);
  if (!isLaborOnly && inputs.moveType !== "LD" && inputs.accessDest !== "ground") accessContext.push(`drop-off ${inputs.accessDest}`);
  const accessHandlingDetails: string[] = [];
  if (accessAdjustmentDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(accessAdjustmentDurationHours, "h")} Access slowdown${accessContext.length ? ` from ${accessContext.join(" and ")}.` : "."}`);
  }
  if (highCapRiskBufferDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(highCapRiskBufferDurationHours, "h")} Multi-truck high-capacity buffer.`);
  }
  if (ldTierBufferDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(ldTierBufferDurationHours, "h")} LD origin tier buffer.`);
  }
  if (wrapDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(wrapDurationHours, "h")} Furniture wrapping and pad prep.`);
  }
  if (daDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(daDurationHours, "h")} Disassembly and reassembly work.`);
  }
  if (packingDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(packingDurationHours, "h")} Packing add-on labor.`);
  }
  if (ldFullPackPrepDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(ldFullPackPrepDurationHours, "h")} Estate full-pack prep buffer.`);
  }
  if (distanceDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(distanceDurationHours, "h")} Distance and route travel time.`);
  }
  if (coordinationDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(coordinationDurationHours, "h")} Dispatch coordination time.`);
  }
  if (dockingDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(dockingDurationHours, "h")} Docking time across ${trucksFinal} truck${trucksFinal === 1 ? "" : "s"}.`);
  }
  if (truckLogisticsDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(truckLogisticsDurationHours, "h")} Multi-truck staging and logistics.`);
  }
  if (extraStopDurationHours > 0) {
    accessHandlingDetails.push(`${formatSignedAmount(extraStopDurationHours, "h")} Extra-stop routing and staging.`);
  }
  if (!accessHandlingDetails.length) {
    accessHandlingDetails.push("No access, handling, or routing adders were required.");
  }

  const rangeBufferDetails: string[] = [];
  if (recommendedTimeMin === 3 && recommendedCalcDuration < 3) {
    rangeBufferDetails.push("Low end floored to the 3h minimum dispatch block.");
  } else {
    rangeBufferDetails.push(`Low end rounded to ${recommendedTimeMin}h from ${formatCompactNumber(recommendedCalcDuration)}h.`);
  }
  rangeBufferDetails.push(`High end padded to ${recommendedTimeMax}h using the standard 10% top-end buffer.`);

  const overrideBadges: EstimateResult["calculationPath"]["overrideBadges"] = [];
  if (overridesAppliedSet.has("trucks")) {
    overrideBadges.push({ key: "trucks", label: "Trucks", value: `${trucksFinal} truck${trucksFinal === 1 ? "" : "s"}`, tone: "amber" });
  }
  if (overridesAppliedSet.has("boxes")) {
    overrideBadges.push({ key: "boxes", label: "Boxes", value: `${boxesBring}`, tone: "amber" });
  }
  if (overridesAppliedSet.has("blankets")) {
    overrideBadges.push({ key: "blankets", label: "Blankets", value: `${blankets}`, tone: "amber" });
  }
  if (overridesAppliedSet.has("wardrobes")) {
    overrideBadges.push({ key: "wardrobes", label: "Wardrobes", value: `${wardrobes}`, tone: "amber" });
  }

  const calculationPath: EstimateResult["calculationPath"] = {
    overrideBadges,
    volume: {
      label: "Volume Path",
      tone: "blue",
      items: [
        {
          kind: "node",
          label: "Inventory Volume",
          value: inventoryVolume,
          unit: "cu ft",
          tone: "blue",
          caption: "Parsed inventory",
        },
        {
          kind: "modifier",
          label: "Coverage / Safety",
          displayValue: formatSignedAmount(billableCF - inventoryVolume, "cu ft"),
          tone: "blue",
          summary: "Coverage, packing, and safety math.",
          details: volumeAdjustmentDetails,
        },
        {
          kind: "node",
          label: "Adjusted Volume",
          value: billableCF,
          unit: "cu ft",
          tone: "blue",
          caption: "Billable volume",
        },
        {
          kind: "modifier",
          label: "Loose-Load / Stacking",
          displayValue: formatSignedAmount(truckSpaceCF - billableCF, "cu ft"),
          tone: "orange",
          summary: "Truck-space buffer for stacking and load gaps.",
          details: looseLoadDetails,
        },
        {
          kind: "node",
          label: "Truck Space",
          value: truckSpaceCF,
          unit: "cu ft",
          tone: "orange",
          caption: "Truck footprint",
        },
      ],
    },
    labor: {
      label: "Labor Path",
      tone: "purple",
      items: [
        {
          kind: "node",
          label: "Base Time",
          value: Math.round(baseDurationHours * 10) / 10,
          unit: "h",
          tone: "purple",
          caption: `Crew ${recommendedCrew}`,
        },
        {
          kind: "modifier",
          label: "Access & Handling",
          displayValue: formatSignedAmount(recommendedCalcDuration - baseDurationHours, "h"),
          tone: "purple",
          summary: "Access, handling, and routing adders.",
          details: accessHandlingDetails,
        },
        {
          kind: "node",
          label: "Work Time",
          value: Math.round(recommendedCalcDuration * 10) / 10,
          unit: "h",
          tone: "purple",
          caption: `Crew ${recommendedCrew}`,
        },
        {
          kind: "modifier",
          label: "Range Buffer",
          displayValue: formatRangeBuffer(recommendedRangeLowHours, recommendedRangeHighHours),
          tone: "purple",
          summary: "Dispatch floor, ceiling, and top-end buffer.",
          details: rangeBufferDetails,
        },
        {
          kind: "node",
          label: "Est. Range",
          value: `${recommendedTimeMin}\u2013${recommendedTimeMax}`,
          unit: "h",
          tone: "purple",
          caption: `Crew ${recommendedCrew}`,
        },
      ],
    },
  };

  if (overridesAppliedSet.has("volume")) {
    calculationPath.volume.items.push(
      {
        kind: "modifier",
        label: "Manual Override",
        displayValue: `Set ${formatCompactNumber(finalVolume)} cu ft`,
        tone: "amber",
        summary: "Dispatcher replaced the auto volume result.",
        details: [
          `Auto truck-space result: ${formatCompactNumber(truckSpaceCF)} cu ft.`,
          `Manual final volume: ${formatCompactNumber(finalVolume)} cu ft.`,
        ],
      },
      {
        kind: "node",
        label: "Final Volume",
        value: finalVolume,
        unit: "cu ft",
        tone: "amber",
        caption: "Manual result",
      }
    );
  }

  if (overridesAppliedSet.has("crew")) {
    calculationPath.labor.items.push(
      {
        kind: "modifier",
        label: "Manual Override",
        displayValue: `Crew ${crew}`,
        tone: "amber",
        summary: "Dispatcher replaced the recommended crew.",
        details: [
          `Recommended crew: ${recommendedCrew}.`,
          `Manual crew: ${crew}.`,
          `Recomputed range: ${timeMin}\u2013${timeMax}h.`,
        ],
      },
      {
        kind: "node",
        label: "Final Range",
        value: `${timeMin}\u2013${timeMax}`,
        unit: "h",
        tone: "amber",
        caption: `Manual crew ${crew}`,
      }
    );
  }

  return {
    finalVolume,
    weight,
    trucksFinal,
    truckSizeLabel,
    crew,
    timeMin,
    timeMax,
    logs: notes.logs,
    risks: notes.risks,
    splitRecommended,
    crewSuggestion,
    nextMoverTimeSavedHours,
    nextMoverSavingsLabel,
    parsedItems: parsed.detectedItems,
    detectedQtyTotal: parsed.detectedQtyTotal,
    unrecognized: parsed.unrecognized,
    materials: { blankets, boxes: boxesBring, wardrobes },
    smartEquipment,
    homeLabel: scopeLabel,
    confidence: { score: confidenceScore, label: confidenceLabel, reasons: confidenceReasons, factors: confidenceFactors },
    auditSummary: notes.auditSummary,
    advice: uniqueAdvice,
    overridesApplied: notes.overridesApplied,
    unrecognizedDetails: parsed.unrecognized.slice(0, 10),
    effortScore: Math.round(effortScore),
    deadheadMiles: effectiveDist,
    isDDT: inputs.moveType === "Local" && distVal > 10,
    totalManHours: Math.round(totalManHours * 10) / 10,
    daMins: Math.round(daMins),
    anyHeavySignal,
    heavyItemNames: [...heavyMap.entries()].map(([name, qty]) => qty > 1 ? `${name} x${qty}` : name),
    league,
    leagueItems,
    boxDensity,
    truckFitNote,
    netVolume: rawVolume,
    billableCF,
    truckSpaceCF,
    extraStopCount,
    calculationPath,
  };
}
