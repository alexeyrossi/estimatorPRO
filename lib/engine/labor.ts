import { PROTOCOL } from "../config";
import {
  DA_COMPLEX_REGEX_CACHE,
  DA_KEYS,
  DA_REGEX_CACHE,
  DA_SIMPLE_REGEX_CACHE,
  DA_TIME_TABLE,
  matchesAnyRegex,
} from "../dictionaries";
import { matchLongestKey, parseOverrideValue } from "../parser";
import type { EngineContext, LaborPlan, TruckPlan, VolumePlan } from "./types";

export function formatNextMoverSavingsLabel(hoursSaved: number): string | null {
  if (!Number.isFinite(hoursSaved) || hoursSaved < 0.5) return null;
  if (hoursSaved < 1.5) return "+1 mover saves ~1h";

  const roundedHalfHours = Math.round(hoursSaved * 2) / 2;
  const formattedHours = Number.isInteger(roundedHalfHours)
    ? `${roundedHalfHours.toFixed(0)}`
    : `${roundedHalfHours.toFixed(1)}`;

  return `+1 mover saves ~${formattedHours}h`;
}

export function computeLaborPlan(context: EngineContext, volumePlan: VolumePlan, truckPlan: TruckPlan): LaborPlan {
  const { inputs, parsed, overrides, notes, isCommercial, commercialSignals, isLaborOnly, isLD, bedroomCount, anyHeavySignal, hasMandatoryFourCrewSpecialty, fragileDensity, extraStopCount, extraStopComplexityScore, extraStopHours, extraStopMinutesTotal, hasNonGroundExtraStop, ldFullPackLargeHome, ldFullPackComplexityScore } = context;
  const { finalVolume } = volumePlan;
  const { trucksFinal, truckSizeLabel, highCapRisk, league } = truckPlan;
  const isLocalResidential = inputs.moveType === "Local" && !isCommercial && !isLaborOnly;
  const isLDResidential = isLD && !isCommercial;
  const isLaborSimple = isLaborOnly && !isCommercial;
  const isOfficeLightCommercial = isCommercial && commercialSignals.lightOfficeEligible;
  const isWarehouseCommercial = isCommercial && (commercialSignals.hasWarehouseOps || commercialSignals.hasPalletizedFreight);

  let speedOrigin = isCommercial ? PROTOCOL.SPEED_COMMERCIAL : PROTOCOL.SPEED_GROUND;
  let speedDest = isCommercial ? PROTOCOL.SPEED_COMMERCIAL : PROTOCOL.SPEED_GROUND;

  if (!isCommercial) {
    if (inputs.accessOrigin === "elevator") speedOrigin = PROTOCOL.SPEED_ELEVATOR;
    else if (inputs.accessOrigin === "stairs") speedOrigin = PROTOCOL.SPEED_STAIRS;

    if (inputs.accessDest === "elevator") speedDest = PROTOCOL.SPEED_ELEVATOR;
    else if (inputs.accessDest === "stairs") speedDest = PROTOCOL.SPEED_STAIRS;
  }
  if (isLaborOnly && inputs.accessOrigin === "stairs") speedOrigin = Math.round(speedOrigin * 0.85);
  if (inputs.moveType === "LD" && finalVolume * PROTOCOL.WEIGHT_SAFETY > 10000) speedOrigin *= PROTOCOL.HEAVY_PAYLOAD_SPEED_MULT;

  let movementManHours = isLaborOnly || inputs.moveType === "LD"
    ? (finalVolume / speedOrigin)
    : (finalVolume / speedOrigin) + (finalVolume / speedDest);
  if (highCapRisk) movementManHours *= PROTOCOL.MULTI_TRUCK_TIME_BUFFER;
  if (inputs.moveType === "LD") movementManHours *= PROTOCOL.LD_TIER_BUFFER;

  const isWrapExcluded = (name: string) => /\b(box|bin|tote|bag|carton|dish barrel|picture box|tv box|wardrobe box|plastic bin|lamp|clock|scale|walker|vacuum|canister|stool)\b/i.test(name);
  const isChairLike = (name: string) => /chair|stool|bench|seat/i.test(name) && !/arm|reclin|sofa|couch/i.test(name);

  let wrapMinsTotal = (parsed.detectedItems || []).reduce((sum, item) => {
    const itemName = (item.name || "").toLowerCase();
    if (isWrapExcluded(itemName)) return sum;
    const cfUnit = item.cf / Math.max(1, item.qty);
    let mins = cfUnit > 15 ? 10 : 5;
    if (isCommercial && isChairLike(item.name)) mins = 1.0;
    return sum + (mins * item.qty);
  }, 0);

  if (fragileDensity > PROTOCOL.FRAGILE_DENSITY_THRESHOLD) {
    wrapMinsTotal = Math.round(wrapMinsTotal * PROTOCOL.FRAGILE_WRAP_MULT);
  }

  let daMins = 0;
  (parsed.detectedItems || []).forEach((item) => {
    const itemName = (item.name || "").toLowerCase();
    const longestKey = matchLongestKey(itemName, DA_KEYS, DA_REGEX_CACHE);
    if (longestKey) {
      daMins += (DA_TIME_TABLE as Record<string, number>)[longestKey] * item.qty;
    } else {
      const isBedUnit = itemName.includes("bed") && !itemName.includes("frame") && !itemName.includes("mattress") && !itemName.includes("boxspring") && !itemName.includes("slat");
      if (isBedUnit) daMins += (isCommercial ? 20 : PROTOCOL.MINS_DA_COMPLEX) * item.qty;
      else if (matchesAnyRegex(DA_COMPLEX_REGEX_CACHE, itemName)) daMins += (isCommercial ? 20 : PROTOCOL.MINS_DA_COMPLEX) * item.qty;
      else if (matchesAnyRegex(DA_SIMPLE_REGEX_CACHE, itemName)) daMins += (isCommercial ? 5 : PROTOCOL.MINS_DA_SIMPLE) * item.qty;
    }
  });

  const totalBoxes = parsed.boxCount + volumePlan.missingBoxesCount;
  let packingAddonMH = 0;
  if (inputs.packingLevel === "Full") {
    packingAddonMH = (totalBoxes * PROTOCOL.MINS_PACK_BOX) / 60;
  } else if (inputs.packingLevel === "Partial") {
    packingAddonMH = 2.0 + (Math.min(totalBoxes, Math.max(10, Math.ceil(totalBoxes * 0.25))) * 0.08);
  }
  const ldFullPackLaborBufferMH = ldFullPackLargeHome
    ? ldFullPackComplexityScore >= 5 ? 2.5 : ldFullPackComplexityScore >= 3 ? 1.5 : 1.0
    : 0;

  const totalManHours = movementManHours + (daMins / 60) + (wrapMinsTotal / 60) + packingAddonMH + ldFullPackLaborBufferMH;

  let crew = isLocalResidential
    ? finalVolume <= 650 ? 2
      : finalVolume <= 900 ? 3
        : finalVolume <= 1600 ? 4
          : finalVolume <= 2500 ? 5
            : finalVolume <= 3600 ? 6
              : 7
    : isLDResidential
      ? finalVolume <= 900 ? 3
        : finalVolume <= 1800 ? 4
          : finalVolume <= 2800 ? 5
            : finalVolume <= 3800 ? 6
              : 7
      : isOfficeLightCommercial
        ? finalVolume <= 900 ? 3
          : finalVolume <= 1800 ? 4
            : finalVolume <= 2800 ? 5
              : 6
      : isLaborSimple
        ? finalVolume <= 900 ? 2
          : finalVolume <= 1800 ? 3
            : finalVolume <= 3000 ? 4
              : 5
        : Math.max(2, Math.ceil(Math.sqrt(finalVolume / 100)));
  if (!isLocalResidential && !isLDResidential && !isLaborSimple && (finalVolume >= 800 || trucksFinal > 1 || bedroomCount >= 3)) crew = Math.max(3, crew);
  if (bedroomCount >= 4) crew = Math.max(4, crew);

  if (anyHeavySignal) crew = Math.max(crew, 3);
  if (hasMandatoryFourCrewSpecialty) crew = Math.max(crew, 4);
  if (league === 2) crew = Math.max(crew, 4);
  if (finalVolume > 3000) crew = Math.max(crew, 6);
  if (finalVolume > 4000) crew = Math.max(crew, 7);
  if (inputs.packingLevel === "Full" && bedroomCount >= 3) crew = Math.max(crew, 4);
  if (isWarehouseCommercial && (commercialSignals.hasPalletizedFreight || trucksFinal >= 2)) crew = Math.max(crew, 4);
  if (!isLaborOnly && extraStopCount >= 2 && finalVolume >= PROTOCOL.EXTRA_STOP_CREW_FLOOR_VOLUME) crew = Math.max(crew, 4);
  if (!isLaborOnly && extraStopComplexityScore >= PROTOCOL.EXTRA_STOP_CREW_COMPLEXITY_HIGH && finalVolume >= PROTOCOL.EXTRA_STOP_CREW_COMPLEX_VOLUME) crew = Math.max(crew, 5);
  if (ldFullPackLargeHome) {
    const ldFullPackCrewFloor = ldFullPackComplexityScore >= 5 ? 8 : 7;
    crew = Math.max(crew, ldFullPackCrewFloor);
  }
  if (!isLaborOnly && trucksFinal >= 2) crew = Math.max(crew, 5);
  if (crew > PROTOCOL.MAX_CREW_SIZE) crew = PROTOCOL.MAX_CREW_SIZE;

  const distVal = parseInt(inputs.distance, 10) || 0;
  const effectiveDist = (inputs.moveType === "LD" || isLaborOnly) ? 0 : distVal;
  const dockingHours = !isLaborOnly && !(isLD && trucksFinal === 1) ? (trucksFinal * PROTOCOL.MINS_DOCKING_PER_TRUCK) / 60 : 0;
  const truckLogisticsHours = (!isLaborOnly && trucksFinal >= 2) ? (trucksFinal * PROTOCOL.MINS_TRUCK_LOGISTICS) / 60 : 0;
  const fixedTime = (effectiveDist > 0 ? (effectiveDist / 30) + 0.6 : 0) + PROTOCOL.COORDINATION_HRS + dockingHours + truckLogisticsHours + extraStopHours;
  if (extraStopCount > 0) {
    notes.auditSummary.push(`Added +${extraStopMinutesTotal} min (${extraStopCount} extra stop${extraStopCount > 1 ? "s" : ""}${hasNonGroundExtraStop ? ", mixed access" : ""}).`);
  }

  const isSmallHome = !isCommercial && bedroomCount <= 2;
  let spaceCap = PROTOCOL.MAX_CREW_SIZE;
  if (isSmallHome) {
    if (finalVolume > 2000) spaceCap = 6;
    else if (anyHeavySignal || finalVolume > 1500) spaceCap = 5;
    else spaceCap = 4;
    if (crew > spaceCap) crew = spaceCap;
  }

  let crewHardCap = Math.min(spaceCap, (isCommercial ? PROTOCOL.MAX_CREW_SIZE : finalVolume < 2600 ? 6 : finalVolume < 3400 ? 7 : PROTOCOL.MAX_CREW_SIZE));
  if (ldFullPackLargeHome && ldFullPackComplexityScore >= 5) {
    crewHardCap = Math.min(spaceCap, PROTOCOL.MAX_CREW_SIZE);
  } else if (ldFullPackLargeHome && ldFullPackComplexityScore >= 3) {
    crewHardCap = Math.min(spaceCap, Math.max(crewHardCap, 7));
  }
  crewHardCap = Math.max(crewHardCap, Math.min(PROTOCOL.MAX_CREW_SIZE, crew));

  const computeDuration = (crewValue: number) => (
    (totalManHours / (crewValue * (crewValue > 6 ? PROTOCOL.CREW_EFFICIENCY_LOW : crewValue > 4 ? PROTOCOL.CREW_EFFICIENCY_HIGH : 1.0)))
    * (finalVolume > PROTOCOL.VOLUME_DRAG_THRESHOLD ? PROTOCOL.LARGE_VOLUME_DRAG : 1.0)
  ) + fixedTime;

  const estateFiveCrewEligible =
    isLocalResidential
    && bedroomCount >= 5
    && (
      finalVolume > 1600
      || trucksFinal > 1
      || inputs.packingLevel !== "None"
      || anyHeavySignal
      || extraStopCount > 0
      || inputs.accessOrigin === "stairs"
      || inputs.accessDest === "stairs"
      || computeDuration(4) > 6.5
    );
  if (estateFiveCrewEligible) crew = Math.max(5, crew);

  let calcDuration = computeDuration(crew);
  const safeDayLimit = inputs.moveType === "Local" && inputs.packingLevel === "Full" ? 11.5 : 10.5;
  const smallLocalTwoCrewEligible =
    isLocalResidential
    && bedroomCount <= 1
    && trucksFinal === 1
    && finalVolume <= 650
    && inputs.packingLevel === "None"
    && extraStopCount === 0
    && league === 0
    && !anyHeavySignal
    && inputs.accessOrigin !== "stairs"
    && inputs.accessDest !== "stairs";
  const smallLdThreeCrewEligible =
    isLDResidential
    && trucksFinal === 1
    && finalVolume <= 900
    && bedroomCount <= 2
    && inputs.packingLevel !== "Full"
    && extraStopCount === 0
    && league < 2
    && !anyHeavySignal
    && computeDuration(3) <= 6.5;
  const officeLightThreeCrewEligible =
    isOfficeLightCommercial
    && trucksFinal === 1
    && finalVolume <= 900
    && extraStopCount === 0
    && league < 2
    && !anyHeavySignal
    && computeDuration(3) <= 6.5;
  const smallLaborTwoCrewEligible =
    isLaborSimple
    && finalVolume <= 900
    && bedroomCount <= 2
    && inputs.packingLevel === "None"
    && league === 0
    && !anyHeavySignal
    && computeDuration(2) <= 6.5;
  const midLaborThreeCrewCapEligible =
    isLaborSimple
    && finalVolume <= 1800
    && bedroomCount <= 3
    && inputs.packingLevel !== "Full"
    && league < 2
    && !anyHeavySignal;
  const officeLightFiveCrewCapEligible =
    isOfficeLightCommercial
    && trucksFinal <= 2
    && finalVolume <= 2400
    && league < 2
    && !anyHeavySignal
    && inputs.packingLevel !== "Full";
  const preserveTwoCrewCorridor = crew === 2 && (smallLocalTwoCrewEligible || smallLaborTwoCrewEligible);
  const preserveThreeCrewCorridor = crew === 3 && (smallLdThreeCrewEligible || officeLightThreeCrewEligible);

  if (!preserveTwoCrewCorridor && !preserveThreeCrewCorridor) {
    while (crew < crewHardCap) {
      const nextDuration = computeDuration(crew + 1);
      const timeSaved = calcDuration - nextDuration;
      if (calcDuration <= safeDayLimit && timeSaved < 1.0) break;
      if (Math.ceil(calcDuration * 1.1) < PROTOCOL.SPLIT_RISK_THRESHOLD && timeSaved < 0.5) break;
      crew += 1;
      calcDuration = nextDuration;
    }
  }
  if (midLaborThreeCrewCapEligible && crew > 3) {
    crew = 3;
    calcDuration = computeDuration(crew);
  }
  if (officeLightFiveCrewCapEligible && crew > 5) {
    crew = 5;
    calcDuration = computeDuration(crew);
  }

  let nextMoverTimeSavedHours = crew < crewHardCap ? Math.max(0, calcDuration - computeDuration(crew + 1)) : null;
  let nextMoverSavingsLabel = nextMoverTimeSavedHours !== null ? formatNextMoverSavingsLabel(nextMoverTimeSavedHours) : null;
  let crewSuggestion = (calcDuration > 8.0 && crew < crewHardCap && (calcDuration - computeDuration(crew + 1)) >= 0.5)
    ? `+1 Mover saves ~${(calcDuration - computeDuration(crew + 1)).toFixed(1)}h`
    : null;

  const boxDensity = parsed.detectedQtyTotal > 0 ? (parsed.boxCount || 0) / parsed.detectedQtyTotal : 0;
  if (boxDensity > 0.60 && inputs.accessOrigin === "ground" && (inputs.moveType !== "Local" || inputs.accessDest === "ground") && finalVolume < 1200 && league < 2 && !notes.overridesApplied.includes("crew") && crew > 3) {
    crew = 3;
    calcDuration = computeDuration(crew);
  }
  if (!isLaborOnly && !isWarehouseCommercial && trucksFinal === 1 && /^18ft|^16ft/.test(truckSizeLabel) && league < 2 && !notes.overridesApplied.includes("crew") && crew > 3) {
    crew = 3;
    calcDuration = computeDuration(crew);
  }
  nextMoverTimeSavedHours = crew < crewHardCap ? Math.max(0, calcDuration - computeDuration(crew + 1)) : null;
  nextMoverSavingsLabel = nextMoverTimeSavedHours !== null ? formatNextMoverSavingsLabel(nextMoverTimeSavedHours) : null;

  let timeMin = Math.max(3, Math.floor(calcDuration));
  let timeMax = Math.max(timeMin + 1, Math.ceil(calcDuration * 1.1));
  let splitRecommended = false;
  const deriveSplitRecommendation = (nextTimeMax: number, nextCrew: number) => (
    (isSmallHome && nextTimeMax > 12.0 && nextCrew === spaceCap)
    || (nextTimeMax >= PROTOCOL.SPLIT_RISK_THRESHOLD && nextCrew === PROTOCOL.MAX_CREW_SIZE)
  );

  splitRecommended = deriveSplitRecommendation(timeMax, crew);

  if (overrides.crew !== undefined && overrides.crew !== null) {
    const overriddenCrew = parseOverrideValue(overrides.crew, 2, 20);
    if (overriddenCrew !== null) {
      crew = overriddenCrew;
      crewSuggestion = null;
      nextMoverTimeSavedHours = null;
      nextMoverSavingsLabel = null;
      notes.overridesApplied.push("crew");
    }
  }
  if (notes.overridesApplied.includes("crew")) {
    const duration = computeDuration(crew);
    calcDuration = duration;
    timeMin = Math.max(3, Math.floor(duration));
    timeMax = Math.max(timeMin + 1, Math.ceil(duration * 1.1));
    splitRecommended = deriveSplitRecommendation(timeMax, crew);
  }
  if (timeMax >= 13) splitRecommended = true;

  if (finalVolume > 4000) {
    const additionalCrewAvailable = crew < crewHardCap && crew < PROTOCOL.MAX_CREW_SIZE;
    if (additionalCrewAvailable) notes.advice.push(`Large Move: Recommend splitting into 2 days OR ${Math.max(6, crew + 1)}+ movers.`);
    else notes.advice.push("Large Move: Recommend splitting into 2 days.");
  }

  return {
    movementManHours,
    wrapMinsTotal,
    daMins,
    totalManHours,
    crew,
    crewSuggestion,
    nextMoverTimeSavedHours,
    nextMoverSavingsLabel,
    timeMin,
    timeMax,
    splitRecommended,
    boxDensity: Math.round(boxDensity * 100),
    calcDuration,
    safeDayLimit,
  };
}
