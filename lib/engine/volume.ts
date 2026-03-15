import { HV_TABLE, PROTOCOL } from "../config";
import { parseOverrideValue, roundUpTo } from "../parser";
import type { EngineContext, VolumePlan } from "./types";

// ── Hybrid HV Experiment ───────────────────────────────────────
const ENABLE_HYBRID_HV = true;

function round25(value: number) {
  return Math.round(value / 25) * 25;
}

function getHybridHiddenVolume(params: {
  deficit: number;
  parsedTotalVol: number;
  hvRowMin: number;
}) {
  const { deficit, parsedTotalVol, hvRowMin } = params;
  if (parsedTotalVol <= 0 || hvRowMin <= 0) return { ratio: 0, hiddenVolume: 0 };
  const ratio = Math.min(parsedTotalVol / hvRowMin, 1);
  return {
    ratio,
    hiddenVolume: Math.max(25, round25(deficit * ratio)),
  };
}

export function computeVolumePlan(context: EngineContext): VolumePlan {
  const {
    inputs,
    overrides,
    notes,
    parsed,
    isCommercial,
    commercialSignals,
    isLD,
    bedroomCount,
    inventoryCompleteness,
    microDetailedLocal,
    largeInventoryForLD,
    ldFullPackLargeHome,
    ldFullPackComplexityScore,
    storageFurnitureQty,
    storageContentsHandled,
    boxCoverage,
    highConfidenceDetailedInventory,
    parsed: { hasVague },
    storageHeavyTruckPieceQty,
  } = context;

  let hiddenVolume = 0;
  let missingBoxesCount = 0;
  let baseHomeHiddenVolume = 0;
  let effectiveMinBoxes = PROTOCOL.MIN_BOXES[Math.min(bedroomCount, 5) as keyof typeof PROTOCOL.MIN_BOXES] || 10;
  const coverageContributors: Array<{ label: string; amount: number; detail: string }> = [];
  const isTinyScope = bedroomCount === 0 && parsed.totalVol < 120;

  // ── Shared hybrid signals (used by both HV and box scaling) ──
  const hvRow = !isCommercial ? HV_TABLE[Math.min(bedroomCount, 5)] : null;
  const volumeRatio = hvRow && hvRow.min > 0 ? Math.min(parsed.totalVol / hvRow.min, 1) : 1;
  const shouldUseHybridScaling =
    ENABLE_HYBRID_HV
    && !isCommercial
    && context.useNormalized
    && inputs.moveType === "Local"
    && inventoryCompleteness === "detailed"
    && !microDetailedLocal
    && !parsed.mentionsGarageOrAttic
    && !context.anyHeavySignal
    && parsed.totalVol > 0
    && overrides.volume == null;

  if (!isCommercial) {
    if (!isTinyScope && !isLD && hvRow) {
      if (parsed.totalVol < hvRow.min) {
        const deficit = Math.max(0, hvRow.min - parsed.totalVol);
        const hvFactor = microDetailedLocal ? 0 : inventoryCompleteness === "detailed" ? 0.25 : inventoryCompleteness === "coarse" ? 0.45 : 0.65;
        const computedHvAdd = Math.max(25, roundUpTo(deficit * hvFactor, 25));
        const localHvMinimum =
          inputs.moveType !== "Local" || inventoryCompleteness === "detailed" ? 0
            : bedroomCount === 2 ? 150
              : bedroomCount === 3 ? 200
                : bedroomCount === 4 ? 250
                  : bedroomCount >= 5 ? 350
                    : 0;

        const standardHvAdd = microDetailedLocal ? 100 : Math.max(computedHvAdd, localHvMinimum);

        const hybrid = shouldUseHybridScaling
          ? getHybridHiddenVolume({ deficit, parsedTotalVol: parsed.totalVol, hvRowMin: hvRow.min })
          : null;

        const hvAdd = shouldUseHybridScaling ? hybrid!.hiddenVolume : standardHvAdd;

        const usedLocalMinimum =
          !shouldUseHybridScaling
          && !microDetailedLocal
          && localHvMinimum > 0
          && hvAdd === localHvMinimum
          && localHvMinimum > computedHvAdd;

        const hvNotes = shouldUseHybridScaling
          ? [
              "hybrid detailed normalized floor",
              `ratio ${hybrid!.ratio.toFixed(2)}`,
              `standard ${standardHvAdd} cf`,
            ]
          : microDetailedLocal
            ? ["micro local reduced floor"]
            : [
                ...(inventoryCompleteness === "sparse" ? [] : [`${inventoryCompleteness} inventory`]),
                ...(usedLocalMinimum ? ["local minimum floor"] : []),
              ];

        baseHomeHiddenVolume += hvAdd;
        hiddenVolume += hvAdd;
        coverageContributors.push({
          label: "Hidden Volume Floor",
          amount: hvAdd,
          detail: `Low volume for ${hvRow.label}${hvNotes.length ? `, ${hvNotes.join(", ")}` : ""}.`,
        });
        notes.logs.push(`Volume Check: +${hvAdd} cf added.`);
        notes.auditSummary.push(
          `Added +${hvAdd} cf (low volume for ${hvRow.label}${hvNotes.length ? `, ${hvNotes.join(", ")}` : ""}).`
        );
      }
    }
    // ── Box baseline: hybrid scaling + physical volume cap ──
    const rawMinBoxes = effectiveMinBoxes;
    if (shouldUseHybridScaling) {
      const scaledMinBoxes = Math.max(10, Math.round(rawMinBoxes * volumeRatio));
      const maxPhysicalBoxes = Math.max(10, Math.ceil((parsed.totalVol * 0.40) / 5));
      effectiveMinBoxes = Math.min(scaledMinBoxes, maxPhysicalBoxes);
      if (effectiveMinBoxes < rawMinBoxes) {
        notes.auditSummary.push(
          `Box baseline scaled: ${rawMinBoxes} → ${effectiveMinBoxes} (ratio ${volumeRatio.toFixed(2)}, physCap ${maxPhysicalBoxes}).`
        );
      }
    }
    if (inputs.packingLevel !== "None" && !isTinyScope) {
      const boxDeficit = Math.max(0, effectiveMinBoxes - parsed.boxCount);
      if (boxDeficit > 0) {
        const boxFactor = inventoryCompleteness === "detailed" ? 0.20 : inventoryCompleteness === "coarse" ? 0.40 : 0.60;
        const boxCap = bedroomCount <= 1 ? 15 : bedroomCount === 2 ? 20 : bedroomCount === 3 ? 30 : bedroomCount === 4 ? 40 : 50;
        missingBoxesCount = Math.min(boxCap, Math.ceil(boxDeficit * boxFactor));
        if (inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.5);
        else if (hiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.6);
        if (missingBoxesCount > 0) {
          missingBoxesCount = roundUpTo(missingBoxesCount, 5);
          hiddenVolume += missingBoxesCount * 5;
          coverageContributors.push({
            label: "Box Coverage",
            amount: missingBoxesCount * 5,
            detail: `${missingBoxesCount} auto-added boxes for ${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}.`,
          });
          notes.auditSummary.push(`Added ${missingBoxesCount} boxes (${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}).`);
        }
      }
    } else if (!isTinyScope && !microDetailedLocal) {
      const softCap = Math.min(effectiveMinBoxes, parsed.boxCount + 10);
      const softDeficit = Math.max(0, softCap - parsed.boxCount);
      if (softDeficit > 0) {
        const softBoxFactor = inventoryCompleteness === "detailed" ? 0.10 : inventoryCompleteness === "coarse" ? 0.20 : 0.35;
        const softBoxCap = bedroomCount <= 1 ? 5 : bedroomCount === 2 ? 10 : bedroomCount === 3 ? 15 : 20;
        missingBoxesCount = Math.min(softBoxCap, Math.ceil(softDeficit * softBoxFactor));
        if (inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.5);
        else if (hiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.6);
        if (missingBoxesCount > 0) {
          missingBoxesCount = roundUpTo(missingBoxesCount, 5);
          hiddenVolume += missingBoxesCount * 5;
          coverageContributors.push({
            label: "Soft Box Top-Up",
            amount: missingBoxesCount * 5,
            detail: `${missingBoxesCount} soft top-up boxes for ${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}.`,
          });
          notes.auditSummary.push(`Soft top-up +${missingBoxesCount} boxes (${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}).`);
        }
      }
    }
  } else if (parsed.totalVol > 0) {
    if (inventoryCompleteness === "sparse" || commercialSignals.lightOfficeEligible) {
      const commercialBaseline = commercialSignals.lightOfficeEligible
        ? (inventoryCompleteness === "detailed" ? 0 : inventoryCompleteness === "coarse" ? 75 : 125)
        : 200;
      hiddenVolume += commercialBaseline;
      if (commercialBaseline > 0) {
        coverageContributors.push({
          label: "Commercial Coverage",
          amount: commercialBaseline,
          detail: commercialSignals.lightOfficeEligible
            ? `${inventoryCompleteness} office inventory baseline.`
            : "Sparse commercial inventory baseline.",
        });
        notes.auditSummary.push(`Added +${commercialBaseline} cf (${commercialSignals.lightOfficeEligible ? `${inventoryCompleteness} office inventory` : "sparse commercial inventory"}).`);
      }
    }
    const shouldAddCommercialBoxTopUp =
      parsed.boxCount === 0
      && parsed.totalVol > 500
      && !(commercialSignals.lightOfficeEligible && inputs.packingLevel === "None")
      && !(commercialSignals.hasWarehouseOps && (commercialSignals.hasPalletizedFreight || commercialSignals.hasWarehouseStorageMix));
    if (shouldAddCommercialBoxTopUp) {
      const commercialBoxFactor = inventoryCompleteness === "detailed" ? 0.25 : inventoryCompleteness === "coarse" ? 0.50 : 0.75;
      missingBoxesCount = Math.ceil((parsed.totalVol * PROTOCOL.COMMERCIAL_BOX_RATIO / 5) * commercialBoxFactor);
      if (missingBoxesCount > 0) missingBoxesCount = roundUpTo(missingBoxesCount, 5);
      hiddenVolume += missingBoxesCount * 5;
      if (missingBoxesCount > 0) {
        coverageContributors.push({
          label: "Commercial Box Coverage",
          amount: missingBoxesCount * 5,
          detail: `${missingBoxesCount} auto-added boxes for ${inventoryCompleteness} commercial coverage.`,
        });
        notes.auditSummary.push(`Added ${missingBoxesCount} boxes (${inventoryCompleteness} commercial coverage).`);
      }
    }
  }

  if (parsed.mentionsGarageOrAttic) {
    const baseZoneHiddenVolume = inventoryCompleteness === "detailed" ? 50 : inventoryCompleteness === "coarse" ? 100 : PROTOCOL.HIDDEN_VOL_GARAGE;
    const zoneHiddenVolume =
      inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0
        ? Math.max(50, roundUpTo(baseZoneHiddenVolume * 0.5, 25))
        : baseZoneHiddenVolume;
    hiddenVolume += zoneHiddenVolume;
    coverageContributors.push({
      label: "Zone Allowance",
      amount: zoneHiddenVolume,
      detail: inventoryCompleteness === "sparse" ? "Garage/attic zones mentioned." : `Garage/attic zones mentioned with ${inventoryCompleteness} inventory.`,
    });
    notes.auditSummary.push(`Added +${zoneHiddenVolume} cf (${inventoryCompleteness === "sparse" ? "zones mentioned" : `zones mentioned, ${inventoryCompleteness} inventory`}).`);
  }

  if (
    !isLD
    && !isCommercial
    && bedroomCount >= 4
    && parsed.mentionsGarageOrAttic
    && storageHeavyTruckPieceQty >= PROTOCOL.STORAGE_HEAVY_TRUCK_MIN_PIECES
  ) {
    const storageHeavyMixHV =
      inventoryCompleteness === "detailed" ? 125
        : inventoryCompleteness === "coarse" ? 200
          : 250;
    hiddenVolume += storageHeavyMixHV;
    coverageContributors.push({
      label: "Storage Mix Allowance",
      amount: storageHeavyMixHV,
      detail: "Heavy garage, gym, or storage mix increased the baseline.",
    });
    notes.auditSummary.push(`Added +${storageHeavyMixHV} cf (heavy garage/gym/storage mix).`);
  }

  if (
    isLD
    && bedroomCount >= 3
    && largeInventoryForLD
    && storageFurnitureQty >= 4
    && !storageContentsHandled
    && parsed.boxCount < Math.max(20, storageFurnitureQty * 2)
    && boxCoverage < 0.65
  ) {
    const cabinetContentsHV = roundUpTo(Math.min(75, storageFurnitureQty * 5), 25);
    hiddenVolume += cabinetContentsHV;
    coverageContributors.push({
      label: "Cabinet Contents Risk",
      amount: cabinetContentsHV,
      detail: "LD cabinet contents risk increased the baseline.",
    });
    notes.auditSummary.push(`Added +${cabinetContentsHV} cf (LD cabinet contents risk).`);
  }

  if (ldFullPackLargeHome) {
    let ldFullPackPrepHV = bedroomCount >= 5 ? 100 : 75;
    if (ldFullPackComplexityScore >= 3) ldFullPackPrepHV += 25;
    if (ldFullPackComplexityScore >= 5) ldFullPackPrepHV += 25;
    hiddenVolume += ldFullPackPrepHV;
    coverageContributors.push({
      label: "LD Full-Pack Prep",
      amount: ldFullPackPrepHV,
      detail: "Large LD full-pack prep increased the baseline.",
    });
    notes.auditSummary.push(`Added +${ldFullPackPrepHV} cf (LD full-pack prep).`);
  }

  let llPct = isLD ? PROTOCOL.LL_LD : PROTOCOL.LL_STANDARD;
  if (highConfidenceDetailedInventory) {
    llPct = isLD ? 0.02 : 0.10;
    notes.auditSummary.push(`Loose load base reduced (${isLD ? "detailed LD inventory" : "detailed local inventory"}).`);
  } else if (microDetailedLocal) {
    llPct = 0.05;
    notes.auditSummary.push("Loose load base reduced (micro local inventory).");
  }

  const llBasePct = llPct;
  const irregularRatio = parsed.detectedQtyTotal > 0 ? (parsed.irregularCount / parsed.detectedQtyTotal) : 0;
  const vagueHandledByHV = inventoryCompleteness === "sparse" && (baseHomeHiddenVolume > 0 || missingBoxesCount > 0 || parsed.mentionsGarageOrAttic);
  const llReasons: string[] = [];
  if (hasVague && !vagueHandledByHV) {
    llPct += PROTOCOL.LL_VAGUE;
    llReasons.push("vague inventory");
  }
  if (irregularRatio > 0.15) {
    llPct += PROTOCOL.LL_IRREGULAR;
    llReasons.push("bulky items");
  } else if (parsed.irregularCount > 0) {
    const shouldAddSmallIrregularUplift = !highConfidenceDetailedInventory || parsed.irregularCount >= 3 || irregularRatio >= 0.05;
    if (shouldAddSmallIrregularUplift) {
      const irregularUplift = isLD && bedroomCount < 3 ? 0.05 : 0.10;
      llPct += irregularUplift;
      llReasons.push("irregular items");
    }
  }
  llPct = Math.min(PROTOCOL.LL_CAP, llPct);
  const appliedLLDelta = Math.max(0, llPct - llBasePct);
  if (appliedLLDelta > 0 && llReasons.length > 0) {
    notes.auditSummary.push(`Loose load +${Math.round(appliedLLDelta * 100)}% (${llReasons.join(", ")}).`);
  }


  const rawVolume = parsed.totalVol + hiddenVolume;
  const preRoundedBillable = rawVolume * 1.05;
  const billableCF = round25(preRoundedBillable);
  const preRoundedTruckSpace = billableCF * (1 + llPct);
  const truckSpaceCF = round25(preRoundedTruckSpace);

  let finalVolume = truckSpaceCF;
  let volumeOverridden = false;
  if (overrides.volume !== undefined && overrides.volume !== null) {
    const overriddenVolume = parseOverrideValue(overrides.volume, 1, 10000);
    if (overriddenVolume !== null) {
      finalVolume = overriddenVolume;
      notes.overridesApplied.push("volume");
      notes.auditSummary.push(`Manager Override: Volume = ${finalVolume} cf`);
      volumeOverridden = true;
    }
  }
  if (!volumeOverridden) finalVolume = roundUpTo(finalVolume, 25);

  const safetyBufferCF = Math.max(0, preRoundedBillable - rawVolume);
  const billableRoundingCF = billableCF - preRoundedBillable;
  const looseLoadBufferCF = Math.max(0, preRoundedTruckSpace - billableCF);
  const truckSpaceRoundingCF = truckSpaceCF - preRoundedTruckSpace;
  const weight = Math.round(finalVolume * PROTOCOL.WEIGHT_STD);
  notes.logs.push(`Raw Inventory: ${rawVolume} cf.`);
  notes.logs.push(`Net Total (+5% broker safety, rounded to 25): ${billableCF} cf.`);
  notes.logs.push(`Actual Space (+LL gaps, rounded to 25): ${truckSpaceCF} cf.`);

  return {
    inventoryVolume: parsed.totalVol,
    hiddenVolume,
    missingBoxesCount,
    effectiveMinBoxes,
    llPct,
    llBasePct,
    llReasons,
    rawVolume,
    billableCF,
    truckSpaceCF,
    finalVolume,
    weight,
    coverageContributors,
    safetyBufferCF,
    billableRoundingCF,
    looseLoadBufferCF,
    truckSpaceRoundingCF,
  };
}
