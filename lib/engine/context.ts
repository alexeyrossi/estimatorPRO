import { PROTOCOL } from "../config";
import {
  FRAGILE_REGEX_CACHE,
  isElectricPianoText,
  isMandatoryFourCrewSpecialtyText,
  TRUE_HEAVY_REGEX_CACHE,
  matchesAnyRegex,
  matchesAnyRegexAcross,
} from "../dictionaries";
import { parseInventory, summarizeNormalizedRows } from "../parser";
import type { EstimateInputs, NormalizedRow } from "../types/estimator";
import type { CommercialSignals, EngineContext, EngineNotes, ParsedInventorySummary } from "./types";

const OFFICE_DESK_REGEX = /\b(desk|workstation|cubicle)\b/i;
const OFFICE_SEATING_REGEX = /\b(office chair|conference chair|task chair)\b/i;
const OFFICE_STORAGE_REGEX = /\b(file cabinet|bookshelf|credenza)\b/i;
const OFFICE_EQUIPMENT_REGEX = /\b(printer|copier|monitor|computer monitor|whiteboard|glass board)\b/i;
const OFFICE_CONFERENCE_REGEX = /\bconference table\b/i;
const OFFICE_ROOM_REGEX = /\b(open office|office|conference|reception|executive|break room)\b/i;
const MEDICAL_SIGNAL_REGEX = /\b(exam|medical|clinic|patient|treatment|waiting room|gurney|lab|medical supply)\b/i;
const MEDICAL_ROOM_REGEX = /\b(exam|clinic|patient|treatment|lab|medical)\b/i;
const SERVER_RACK_REGEX = /\bserver rack\b/i;
const WAREHOUSE_PALLET_REGEX = /\b(pallet|skid)\b/i;
const WAREHOUSE_RACK_REGEX = /\b(rack|shelving)\b/i;
const WAREHOUSE_BIN_REGEX = /\b(bin|crate)\b/i;
const WAREHOUSE_TOOL_REGEX = /\b(tool|work bench|tool chest|rolling toolbox)\b/i;
const WAREHOUSE_ROOM_REGEX = /\b(warehouse|equipment|receiving|loading dock)\b/i;
const CONFERENCE_TABLE_ONLY_REGEX = /\bconference table\b/i;

export function buildEngineContext(
  inputs: EstimateInputs,
  normalizedRows: NormalizedRow[] | undefined,
  overrides: Record<string, string>,
  notes: EngineNotes
): EngineContext {
  const isCommercial = inputs.homeSize === "Commercial";
  const isLaborOnly = inputs.moveType === "Labor";
  const isLD = inputs.moveType === "LD";
  const bedroomCount = isCommercial ? 0 : (parseInt(inputs.homeSize, 10) || 0);
  const scopeLabel = isCommercial ? "Commercial" : bedroomCount === 1 ? "1 BDR / Less" : `${bedroomCount} BDR`;
  const extraStops = !isLaborOnly && Array.isArray(inputs.extraStops) ? inputs.extraStops : [];
  const extraStopCount = extraStops.length;

  const useNormalized = inputs.inventoryMode === "normalized"
    && ((normalizedRows && normalizedRows.length > 0) || (Array.isArray(inputs.normalizedRows) && inputs.normalizedRows.length > 0));

  const parsed = (useNormalized
    ? summarizeNormalizedRows(normalizedRows || inputs.normalizedRows || [], inputs.inventoryText)
    : parseInventory(inputs.inventoryText)) as ParsedInventorySummary;

  if (!useNormalized) {
    parsed.detectedItems = parsed.detectedItems.map((item) => {
      const nameLower = item.name.toLowerCase();
      const isTrueHeavy = item.isWeightHeavy || matchesAnyRegex(TRUE_HEAVY_REGEX_CACHE, nameLower);
      let finalHeavy = isTrueHeavy;

      if (normalizedRows && normalizedRows.length > 0) {
        const existingRow = normalizedRows.find(
          (row) => row.name.toLowerCase() === nameLower && (row.room || "").toLowerCase() === (item.room || "").toLowerCase()
        );
        if (existingRow?.flags) {
          finalHeavy = isTrueHeavy ? !!existingRow.flags.heavy : false;
          return { ...item, isManualHeavy: finalHeavy, flags: { ...item.flags, ...existingRow.flags, heavy: finalHeavy } };
        }
      }

      return { ...item, isManualHeavy: finalHeavy, flags: { ...item.flags, heavy: finalHeavy } };
    });
  }

  const items = parsed.detectedItems || [];
  const commercialText = inputs.inventoryText.toLowerCase();
  const officeCategories = new Set<string>();
  const medicalCategories = new Set<string>();
  const warehouseCategories = new Set<string>();
  let officeSignalQty = 0;
  let medicalSignalQty = 0;
  let warehouseSignalQty = 0;
  let hasServerRack = false;
  let hasPalletizedFreight = false;

  items.forEach((item) => {
    const nameLower = (item.name || "").toLowerCase();
    const rawLower = (item.raw || "").toLowerCase();
    const roomLower = (item.room || "").toLowerCase();
    const combined = `${roomLower} ${nameLower} ${rawLower}`;

    if (SERVER_RACK_REGEX.test(combined)) hasServerRack = true;

    let officeMatch = false;
    if (OFFICE_DESK_REGEX.test(nameLower)) {
      officeCategories.add("desk");
      officeMatch = true;
    }
    if (OFFICE_SEATING_REGEX.test(nameLower)) {
      officeCategories.add("seating");
      officeMatch = true;
    }
    if (OFFICE_STORAGE_REGEX.test(nameLower)) {
      officeCategories.add("storage");
      officeMatch = true;
    }
    if (OFFICE_EQUIPMENT_REGEX.test(nameLower)) {
      officeCategories.add("equipment");
      officeMatch = true;
    }
    if (OFFICE_CONFERENCE_REGEX.test(nameLower)) {
      officeCategories.add("conference");
      officeMatch = true;
    }
    if (OFFICE_ROOM_REGEX.test(roomLower)) {
      officeCategories.add("room");
      officeMatch = true;
    }
    if (officeMatch) officeSignalQty += item.qty;

    let medicalMatch = false;
    if (MEDICAL_SIGNAL_REGEX.test(combined) || MEDICAL_ROOM_REGEX.test(roomLower)) {
      medicalMatch = true;
      if (/\bexam\b/i.test(combined)) medicalCategories.add("exam");
      if (/\bmedical supply\b/i.test(combined)) medicalCategories.add("supply");
      if (/\b(patient|treatment|gurney|clinic)\b/i.test(combined)) medicalCategories.add("ops");
      if (/\b(waiting room|reception)\b/i.test(combined)) medicalCategories.add("front");
      if (/\blab\b/i.test(combined)) medicalCategories.add("lab");
    }
    if (medicalMatch) medicalSignalQty += item.qty;

    let warehouseMatch = false;
    if (WAREHOUSE_PALLET_REGEX.test(combined)) {
      hasPalletizedFreight = true;
      warehouseCategories.add("pallet");
      warehouseMatch = true;
    }
    if (WAREHOUSE_RACK_REGEX.test(combined)) {
      warehouseCategories.add("rack");
      warehouseMatch = true;
    }
    if (WAREHOUSE_BIN_REGEX.test(combined)) {
      warehouseCategories.add("bin");
      warehouseMatch = true;
    }
    if (WAREHOUSE_TOOL_REGEX.test(combined)) {
      warehouseCategories.add("tool");
      warehouseMatch = true;
    }
    if (WAREHOUSE_ROOM_REGEX.test(roomLower)) {
      warehouseCategories.add("room");
      warehouseMatch = true;
    }
    if (warehouseMatch) warehouseSignalQty += item.qty;
  });

  if (OFFICE_ROOM_REGEX.test(commercialText)) officeCategories.add("room");
  if (MEDICAL_SIGNAL_REGEX.test(commercialText)) medicalCategories.add("text");
  if (WAREHOUSE_ROOM_REGEX.test(commercialText)) warehouseCategories.add("room");
  if (WAREHOUSE_PALLET_REGEX.test(commercialText)) {
    hasPalletizedFreight = true;
    warehouseCategories.add("pallet");
  }

  const hasOfficeFurnitureMix =
    officeCategories.size >= 2
    && officeSignalQty >= Math.max(8, Math.ceil(parsed.detectedQtyTotal * 0.35));
  const hasMedicalOps =
    medicalSignalQty >= 2
    || medicalCategories.size >= 2
    || (medicalCategories.has("text") && medicalSignalQty > 0);
  const hasWarehouseStorageMix =
    warehouseCategories.has("rack")
    || warehouseCategories.has("bin")
    || warehouseCategories.has("tool");
  const hasWarehouseOps =
    hasPalletizedFreight
    || warehouseCategories.size >= 2
    || (warehouseCategories.has("room") && warehouseSignalQty > 0);
  const lightOfficeEligible =
    hasOfficeFurnitureMix
    && !hasMedicalOps
    && !hasWarehouseOps
    && !hasPalletizedFreight
    && !hasServerRack;
  const commercialSignals: CommercialSignals = {
    hasOfficeFurnitureMix,
    hasMedicalOps,
    hasWarehouseOps,
    hasPalletizedFreight,
    hasWarehouseStorageMix,
    hasServerRack,
    hasConferenceTableOnly: false,
    hasOtherTrueHeavySignal: false,
    lightOfficeEligible,
  };
  const commercialProfile: EngineContext["commercialProfile"] = !isCommercial
    ? "generic"
    : commercialSignals.lightOfficeEligible
      ? "office"
      : commercialSignals.hasMedicalOps
        ? "medical"
        : (commercialSignals.hasWarehouseOps || commercialSignals.hasPalletizedFreight)
          ? "warehouse"
          : "generic";
  const countBy = (re: RegExp) => items.reduce((sum, item) => (re.test((item.name || "").toLowerCase()) ? sum + item.qty : sum), 0);
  const hasHeavyByWeight = items.some((item) => item.isWeightHeavy);
  const manualHeavy = items.some((item) => item.flags?.heavy);
  const rawHasHeavy = useNormalized
    ? manualHeavy
    : items.some((item) => {
      const nameLower = (item.name || "").toLowerCase();
      const rawLower = (item.raw || "").toLowerCase();
      if (isElectricPianoText(nameLower, rawLower)) return false;
      return matchesAnyRegexAcross(TRUE_HEAVY_REGEX_CACHE, nameLower, rawLower);
    });
  const conferenceTableQty = items.reduce((sum, item) => (
    CONFERENCE_TABLE_ONLY_REGEX.test((item.name || "").toLowerCase()) ? sum + item.qty : sum
  ), 0);
  const electricPianoQty = items.reduce((sum, item) => (
    isElectricPianoText((item.name || "").toLowerCase(), (item.raw || "").toLowerCase()) ? sum + item.qty : sum
  ), 0);
  const otherTrueHeavyQty = items.reduce((sum, item) => {
    const nameLower = (item.name || "").toLowerCase();
    const rawLower = (item.raw || "").toLowerCase();
    if (isElectricPianoText(nameLower, rawLower)) return sum;
    if (CONFERENCE_TABLE_ONLY_REGEX.test(nameLower)) return sum;
    return matchesAnyRegexAcross(TRUE_HEAVY_REGEX_CACHE, nameLower, rawLower) ? sum + item.qty : sum;
  }, 0);
  commercialSignals.hasConferenceTableOnly = conferenceTableQty > 0 && otherTrueHeavyQty === 0;
  commercialSignals.hasOtherTrueHeavySignal = otherTrueHeavyQty > 0;
  const suppressConferenceTableHeavy =
    commercialSignals.lightOfficeEligible
    && commercialSignals.hasConferenceTableOnly
    && !commercialSignals.hasServerRack
    && !commercialSignals.hasOtherTrueHeavySignal
    && !(useNormalized && manualHeavy)
    && !hasHeavyByWeight;
  const hasHeavy = suppressConferenceTableHeavy ? false : rawHasHeavy;
  const effectiveHeavyCount = Math.max(0, parsed.heavyCount - electricPianoQty - (suppressConferenceTableHeavy ? conferenceTableQty : 0));
  const hasMandatoryFourCrewSpecialty = items.some((item) => isMandatoryFourCrewSpecialtyText(
    (item.name || "").toLowerCase(),
    (item.raw || "").toLowerCase()
  ));
  const anyHeavySignal = effectiveHeavyCount > 0 || hasHeavy || (useNormalized && manualHeavy) || hasHeavyByWeight;

  const extraStopMinutesTotal = extraStops.reduce((sum, stop) => {
    const accessMinutes =
      stop.access === "stairs" ? PROTOCOL.MINS_EXTRA_STOP_STAIRS
        : stop.access === "elevator" ? PROTOCOL.MINS_EXTRA_STOP_ELEVATOR
          : PROTOCOL.MINS_EXTRA_STOP_GROUND;
    return sum + PROTOCOL.MINS_EXTRA_STOP_BASE + accessMinutes;
  }, 0);
  const extraStopHours = extraStopMinutesTotal / 60;
  const hasNonGroundExtraStop = extraStops.some((stop) => stop.access !== "ground");
  const extraStopComplexityScore = extraStops.reduce((sum, stop) => (
    sum + (stop.access === "stairs" ? 3 : stop.access === "elevator" ? 2 : 1)
  ), 0);

  notes.logs.push(`Config: ${inputs.moveType}, ${scopeLabel}`);
  notes.logs.push(`Inventory: ${parsed.detectedQtyTotal} items. Vol: ${parsed.totalVol} cf.`);
  if (extraStopCount > 0) {
    notes.logs.push(`Route: ${extraStopCount} extra stop${extraStopCount > 1 ? "s" : ""}. +${extraStopMinutesTotal} min route complexity.`);
  }

  let fragileCount = 0;
  parsed.detectedItems.forEach((item) => {
    const itemName = item.name.toLowerCase();
    if (/\btv\b/.test(itemName) && /\btv stand\b|\bmedia console\b|\bentertainment center\b/.test(itemName)) return;
    if (FRAGILE_REGEX_CACHE.some((re) => re.test(itemName))) fragileCount += item.qty;
  });
  const fragileDensity = parsed.detectedQtyTotal > 0 ? (fragileCount / parsed.detectedQtyTotal) : 0;
  const estimatedRatio = (parsed.estimatedItemCount || 0) / Math.max(1, parsed.detectedQtyTotal);
  const hasGenericCatchall = items.some((item) => /\bitem\b/i.test(item.name || ""));
  const sizeUnits = isCommercial ? 4 : Math.max(1, bedroomCount);
  const itemDensity = parsed.detectedQtyTotal / Math.max(1, sizeUnits);
  const expectedBoxesBase = isCommercial ? 20 : (PROTOCOL.MIN_BOXES[Math.min(bedroomCount, 5) as keyof typeof PROTOCOL.MIN_BOXES] || 10);
  const boxCoverage = parsed.boxCount / Math.max(1, expectedBoxesBase);
  const smallItemSignals = countBy(/\blamp|nightstand|end table|coffee table|shelf|bin|box|chair|stool|mirror|wall decor|vacuum|bag\b/i);
  const storageFurnitureQty = countBy(/\bdresser(?:es)?|chest(?:s)?|cabinet(?:s)?|armoire(?:s)?|wardrobe(?:s)?|credenza(?:s)?|buffet(?:s)?|file cabinet(?:s)?\b/i);
  const largeHome = !isCommercial && bedroomCount >= 4;
  const largeInventoryForLD =
    parsed.detectedQtyTotal >= (largeHome ? 45 : 40)
    || parsed.totalVol >= (bedroomCount >= 4 ? 900 : 700);
  const ldFullPackLargeHome = isLD && inputs.packingLevel === "Full" && bedroomCount >= 4 && largeInventoryForLD;
  const syntheticBundleItems = items.filter((item) => item.isSynthetic);
  const syntheticBundleVolume = syntheticBundleItems.reduce((sum, item) => sum + (item.cf || 0), 0);
  const syntheticBundleRatio = parsed.totalVol > 0 ? (syntheticBundleVolume / parsed.totalVol) : 0;
  const syntheticBundleGroups = syntheticBundleItems.length;
  const syntheticBundleBoxQty = syntheticBundleItems.reduce(
    (sum, item) => (/\b(box|barrel|carton|bin|tote)\b/i.test(item.name || "") ? sum + item.qty : sum),
    0
  );
  const estateHeavyPieceQty = countBy(/\bpiano|safe|pool table|server rack|commercial fridge|marble table|stone table\b/i);
  const storageHeavyTruckPieceQty = countBy(/\b(?:piano|safe|gun safe|large safe|pool table|server rack|hot tub|jacuzzi|treadmill|elliptical|multi gym|squat rack|tool chest|rolling toolbox|marble table|stone table)\b/i);
  const ldFullPackComplexityScore = ldFullPackLargeHome
    ? (bedroomCount >= 5 ? 1 : 0)
      + (parsed.detectedQtyTotal >= 80 ? 1 : 0)
      + (storageFurnitureQty >= 8 ? 1 : 0)
      + (syntheticBundleGroups >= 4 ? 1 : 0)
      + (syntheticBundleBoxQty >= 20 ? 1 : 0)
      + (estateHeavyPieceQty >= 2 ? 1 : 0)
    : 0;
  const storageContentsHandled = /\b(empty cabinets?|empty drawers?|drawers empty|cabinet contents packed|dresser contents packed|contents already packed|contents packed|packed separately)\b/i.test(inputs.inventoryText || "");
  const highConfidenceDetailedInventory =
    estimatedRatio <= 0.02
    && !parsed.hasVague
    && parsed.detectedQtyTotal >= (largeHome ? 50 : 25)
    && parsed.boxCount >= (largeHome ? 35 : 20)
    && (!largeHome || smallItemSignals >= 10);
  const microDetailedLocal =
    inputs.moveType === "Local"
    && !isCommercial
    && !isLaborOnly
    && bedroomCount <= 1
    && inputs.packingLevel === "None"
    && parsed.totalVol <= 120
    && parsed.detectedQtyTotal <= 6
    && parsed.boxCount <= 5
    && estimatedRatio === 0
    && !parsed.hasVague
    && !parsed.mentionsGarageOrAttic
    && !anyHeavySignal
    && parsed.irregularCount === 0
    && !hasGenericCatchall;
  const inventoryCompleteness: "detailed" | "coarse" | "sparse" =
    (highConfidenceDetailedInventory || microDetailedLocal || (
      estimatedRatio <= 0.05
      && !parsed.hasVague
      && itemDensity >= (largeHome ? 20 : 18)
      && boxCoverage >= (largeHome ? 0.45 : 0.35)
      && smallItemSignals >= (largeHome ? 10 : 8)
    )) ? "detailed"
      : (
        estimatedRatio > 0.15
        || parsed.hasVague
        || itemDensity < 8
        || boxCoverage < 0.10
        || (parsed.mentionsGarageOrAttic && smallItemSignals < 4)
      ) ? "sparse"
        : "coarse";

  return {
    inputs,
    normalizedRows,
    overrides,
    notes,
    useNormalized,
    parsed,
    items,
    countBy,
    isCommercial,
    commercialProfile,
    commercialSignals,
    isLaborOnly,
    isLD,
    bedroomCount,
    scopeLabel,
    extraStops,
    extraStopCount,
    extraStopMinutesTotal,
    extraStopHours,
    hasNonGroundExtraStop,
    extraStopComplexityScore,
    hasHeavyByWeight,
    manualHeavy,
    hasHeavy,
    suppressConferenceTableHeavy,
    hasMandatoryFourCrewSpecialty,
    anyHeavySignal,
    fragileCount,
    fragileDensity,
    estimatedRatio,
    hasGenericCatchall,
    sizeUnits,
    itemDensity,
    expectedBoxesBase,
    boxCoverage,
    smallItemSignals,
    storageFurnitureQty,
    largeHome,
    largeInventoryForLD,
    ldFullPackLargeHome,
    syntheticBundleItems,
    syntheticBundleVolume,
    syntheticBundleRatio,
    syntheticBundleGroups,
    syntheticBundleBoxQty,
    estateHeavyPieceQty,
    storageHeavyTruckPieceQty,
    ldFullPackComplexityScore,
    storageContentsHandled,
    highConfidenceDetailedInventory,
    microDetailedLocal,
    inventoryCompleteness,
  };
}
