"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEstimate = buildEstimate;
require("server-only");
const dictionaries_1 = require("./dictionaries");
const config_1 = require("./config");
const parser_1 = require("./parser");
function buildEstimate(inputs, normalizedRows, overridesObj) {
    try {
        const logs = [], risks = [], auditSummary = [], advice = [];
        const o = overridesObj || inputs?.overrides || {};
        const overridesApplied = [];
        const isCommercial = inputs.homeSize === "Commercial";
        const isLaborOnly = inputs.moveType === "Labor";
        const isLD = inputs.moveType === "LD";
        const bedroomCount = isCommercial ? 0 : (parseInt(inputs.homeSize) || 0);
        const scopeLabel = isCommercial ? "Commercial" : bedroomCount === 1 ? "1 BDR / Less" : `${bedroomCount} BDR`;
        const useNormalized = inputs.inventoryMode === "normalized" && ((normalizedRows && normalizedRows.length > 0) || (Array.isArray(inputs.normalizedRows) && inputs.normalizedRows.length > 0));
        const parsed = useNormalized
            ? (0, parser_1.summarizeNormalizedRows)(normalizedRows || inputs.normalizedRows || [], inputs.inventoryText)
            : (0, parser_1.parseInventory)(inputs.inventoryText);
        // Deep merge flags from previous normalizedRows if available (preserving Client View manual flags)
        if (!useNormalized) {
            parsed.detectedItems = parsed.detectedItems.map(item => {
                const n = item.name.toLowerCase();
                const isTrueHeavy = item.isWeightHeavy || dictionaries_1.TRUE_HEAVY_ITEMS.some(h => new RegExp(`\\b${h}\\b`, 'i').test(n));
                let finalHeavy = isTrueHeavy;
                if (normalizedRows && normalizedRows.length > 0) {
                    const existingRow = normalizedRows.find(r => r.name.toLowerCase() === n && (r.room || "").toLowerCase() === (item.room || "").toLowerCase());
                    if (existingRow && existingRow.flags) {
                        // Only trust the stored heavy flag if the item is actually a TRUE_HEAVY_ITEM or has heavy weight.
                        // This prevents stale flags from old saves (e.g. workbench) from persisting incorrectly.
                        finalHeavy = isTrueHeavy ? !!existingRow.flags.heavy : false;
                        return { ...item, isManualHeavy: finalHeavy, flags: { ...item.flags, ...existingRow.flags, heavy: finalHeavy } };
                    }
                }
                return { ...item, isManualHeavy: finalHeavy, flags: { ...item.flags, heavy: finalHeavy } };
            });
        }
        const items = (parsed.detectedItems || []);
        const countBy = (re) => items.reduce((a, it) => a + (re.test((it.name || "").toLowerCase()) ? it.qty : 0), 0);
        const norm = (s) => (s || "").toLowerCase();
        const hasHeavyByWeight = items.some(it => it.isWeightHeavy);
        const manualHeavy = items.some(r => r.flags?.heavy);
        const hasHeavy = useNormalized
            ? manualHeavy
            : items.some(it => {
                const n = norm(it.name);
                const r = norm(it.raw);
                return dictionaries_1.TRUE_HEAVY_ITEMS.some(lg => new RegExp(`\\b${lg}\\b`, 'i').test(n) || new RegExp(`\\b${lg}\\b`, 'i').test(r));
            });
        const anyHeavySignal = parsed.heavyCount > 0 || hasHeavy || manualHeavy || hasHeavyByWeight;
        logs.push(`Config: ${inputs.moveType}, ${scopeLabel}`);
        logs.push(`Inventory: ${parsed.detectedQtyTotal} items. Vol: ${parsed.totalVol} cf.`);
        let fragileCount = 0;
        (parsed.detectedItems || []).forEach(it => {
            const n = it.name.toLowerCase();
            if (/\btv\b/.test(n) && /\btv stand\b|\bmedia console\b|\bentertainment center\b/.test(n))
                return;
            if (dictionaries_1.FRAGILE_REGEX_CACHE.some(re => re.test(n)))
                fragileCount += it.qty;
        });
        const fragileDensity = parsed.detectedQtyTotal > 0 ? (fragileCount / parsed.detectedQtyTotal) : 0;
        const estimatedRatio = (parsed.estimatedItemCount || 0) / Math.max(1, parsed.detectedQtyTotal);
        const hasGenericCatchall = items.some(it => /\bitem\b/i.test(it.name || ""));
        const sizeUnits = isCommercial ? 4 : Math.max(1, bedroomCount);
        const itemDensity = parsed.detectedQtyTotal / Math.max(1, sizeUnits);
        const expectedBoxesBase = isCommercial ? 20 : (config_1.PROTOCOL.MIN_BOXES[Math.min(bedroomCount, 5)] || 10);
        const boxCoverage = parsed.boxCount / Math.max(1, expectedBoxesBase);
        const smallItemSignals = countBy(/\blamp|nightstand|end table|coffee table|shelf|bin|box|chair|stool|mirror|wall decor|vacuum|bag\b/i);
        const storageFurnitureQty = countBy(/\bdresser(?:es)?|chest(?:s)?|cabinet(?:s)?|armoire(?:s)?|wardrobe(?:s)?|credenza(?:s)?|buffet(?:s)?|file cabinet(?:s)?\b/i);
        const largeHome = !isCommercial && bedroomCount >= 4;
        const largeInventoryForLD = parsed.detectedQtyTotal >= (largeHome ? 45 : 40) ||
            parsed.totalVol >= (bedroomCount >= 4 ? 900 : 700);
        const ldFullPackLargeHome = isLD && inputs.packingLevel === "Full" && bedroomCount >= 4 && largeInventoryForLD;
        const syntheticBundleItems = items.filter(it => it.isSynthetic);
        const syntheticBundleVolume = syntheticBundleItems.reduce((sum, it) => sum + (it.cf || 0), 0);
        const syntheticBundleRatio = parsed.totalVol > 0 ? (syntheticBundleVolume / parsed.totalVol) : 0;
        const syntheticBundleGroups = syntheticBundleItems.length;
        const syntheticBundleBoxQty = syntheticBundleItems.reduce((sum, it) => /\b(box|barrel|carton|bin|tote)\b/i.test(it.name || "") ? sum + it.qty : sum, 0);
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
        const highConfidenceDetailedInventory = estimatedRatio <= 0.02 &&
            !parsed.hasVague &&
            parsed.detectedQtyTotal >= (largeHome ? 50 : 25) &&
            parsed.boxCount >= (largeHome ? 35 : 20) &&
            (!largeHome || smallItemSignals >= 10);
        const microDetailedLocal = inputs.moveType === "Local" &&
            !isCommercial &&
            !isLaborOnly &&
            bedroomCount <= 1 &&
            inputs.packingLevel === "None" &&
            parsed.totalVol <= 120 &&
            parsed.detectedQtyTotal <= 6 &&
            parsed.boxCount <= 5 &&
            estimatedRatio === 0 &&
            !parsed.hasVague &&
            !parsed.mentionsGarageOrAttic &&
            !anyHeavySignal &&
            parsed.irregularCount === 0 &&
            !hasGenericCatchall;
        const inventoryCompleteness = (highConfidenceDetailedInventory || microDetailedLocal || (estimatedRatio <= 0.05 &&
            !parsed.hasVague &&
            itemDensity >= (largeHome ? 20 : 18) &&
            boxCoverage >= (largeHome ? 0.45 : 0.35) &&
            smallItemSignals >= (largeHome ? 10 : 8))) ? "detailed" :
            (estimatedRatio > 0.15 ||
                parsed.hasVague ||
                itemDensity < 8 ||
                boxCoverage < 0.10 ||
                (parsed.mentionsGarageOrAttic && smallItemSignals < 4)) ? "sparse" :
                "coarse";
        let hiddenVolume = 0;
        let missingBoxesCount = 0;
        let baseHomeHiddenVolume = 0;
        const isTinyScope = bedroomCount === 0 && (parsed.totalVol < 120);
        if (!isCommercial) {
            if (!isTinyScope && !isLD) {
                const hvRow = config_1.HV_TABLE[Math.min(bedroomCount, 5)];
                if (parsed.totalVol < hvRow.min) {
                    const deficit = Math.max(0, hvRow.min - parsed.totalVol);
                    const hvFactor = microDetailedLocal ? 0 : inventoryCompleteness === "detailed" ? 0.25 : inventoryCompleteness === "coarse" ? 0.45 : 0.65;
                    const computedHvAdd = Math.max(25, (0, parser_1.roundUpTo)(deficit * hvFactor, 25));
                    const localHvMinimum = inputs.moveType !== "Local" || inventoryCompleteness === "detailed" ? 0 :
                        bedroomCount === 2 ? 150 :
                            bedroomCount === 3 ? 200 :
                                bedroomCount === 4 ? 250 :
                                    bedroomCount >= 5 ? 350 :
                                        0;
                    const hvAdd = microDetailedLocal ? 100 : Math.max(computedHvAdd, localHvMinimum);
                    const usedLocalMinimum = !microDetailedLocal && localHvMinimum > 0 && hvAdd === localHvMinimum && localHvMinimum > computedHvAdd;
                    const hvNotes = microDetailedLocal
                        ? ["micro local reduced floor"]
                        : [
                            ...(inventoryCompleteness === "sparse" ? [] : [`${inventoryCompleteness} inventory`]),
                            ...(usedLocalMinimum ? ["local minimum floor"] : [])
                        ];
                    baseHomeHiddenVolume += hvAdd;
                    hiddenVolume += hvAdd;
                    logs.push(`Volume Check: +${hvAdd} cf added.`);
                    auditSummary.push(`Added +${hvAdd} cf (low volume for ${hvRow.label}${hvNotes.length ? `, ${hvNotes.join(", ")}` : ""}).`);
                }
            }
            const minBoxes = config_1.PROTOCOL.MIN_BOXES[Math.min(bedroomCount, 5)] || 10;
            if (inputs.packingLevel !== "None" && !isTinyScope) {
                const boxDeficit = Math.max(0, minBoxes - parsed.boxCount);
                if (boxDeficit > 0) {
                    const boxFactor = inventoryCompleteness === "detailed" ? 0.20 : inventoryCompleteness === "coarse" ? 0.40 : 0.60;
                    const boxCap = bedroomCount <= 1 ? 15 : bedroomCount === 2 ? 20 : bedroomCount === 3 ? 30 : bedroomCount === 4 ? 40 : 50;
                    missingBoxesCount = Math.min(boxCap, Math.ceil(boxDeficit * boxFactor));
                    if (inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0)
                        missingBoxesCount = Math.ceil(missingBoxesCount * 0.5);
                    else if (hiddenVolume > 0)
                        missingBoxesCount = Math.ceil(missingBoxesCount * 0.6);
                    if (missingBoxesCount > 0) {
                        missingBoxesCount = (0, parser_1.roundUpTo)(missingBoxesCount, 5);
                        hiddenVolume += missingBoxesCount * 5;
                        auditSummary.push(`Added ${missingBoxesCount} boxes (${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}).`);
                    }
                }
            }
            else if (!isTinyScope && !microDetailedLocal) {
                const softCap = Math.min(minBoxes, parsed.boxCount + 10);
                const softDeficit = Math.max(0, softCap - parsed.boxCount);
                if (softDeficit > 0) {
                    const softBoxFactor = inventoryCompleteness === "detailed" ? 0.10 : inventoryCompleteness === "coarse" ? 0.20 : 0.35;
                    const softBoxCap = bedroomCount <= 1 ? 5 : bedroomCount === 2 ? 10 : bedroomCount === 3 ? 15 : 20;
                    missingBoxesCount = Math.min(softBoxCap, Math.ceil(softDeficit * softBoxFactor));
                    if (inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0)
                        missingBoxesCount = Math.ceil(missingBoxesCount * 0.5);
                    else if (hiddenVolume > 0)
                        missingBoxesCount = Math.ceil(missingBoxesCount * 0.6);
                    if (missingBoxesCount > 0) {
                        missingBoxesCount = (0, parser_1.roundUpTo)(missingBoxesCount, 5);
                        hiddenVolume += missingBoxesCount * 5;
                        auditSummary.push(`Soft top-up +${missingBoxesCount} boxes (${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}).`);
                    }
                }
            }
        }
        else {
            if (parsed.totalVol > 0) {
                if (inventoryCompleteness === "sparse") {
                    const commercialBaseline = 200;
                    hiddenVolume += commercialBaseline;
                    auditSummary.push(`Added +${commercialBaseline} cf (sparse commercial inventory).`);
                }
                if (parsed.boxCount === 0 && parsed.totalVol > 500) {
                    const commercialBoxFactor = inventoryCompleteness === "detailed" ? 0.25 : inventoryCompleteness === "coarse" ? 0.50 : 0.75;
                    missingBoxesCount = Math.ceil((parsed.totalVol * config_1.PROTOCOL.COMMERCIAL_BOX_RATIO / 5) * commercialBoxFactor);
                    if (missingBoxesCount > 0)
                        missingBoxesCount = (0, parser_1.roundUpTo)(missingBoxesCount, 5);
                    hiddenVolume += missingBoxesCount * 5;
                    if (missingBoxesCount > 0)
                        auditSummary.push(`Added ${missingBoxesCount} boxes (${inventoryCompleteness} commercial coverage).`);
                }
            }
        }
        if (parsed.mentionsGarageOrAttic) {
            const baseZoneHiddenVolume = inventoryCompleteness === "detailed" ? 50 : inventoryCompleteness === "coarse" ? 100 : config_1.PROTOCOL.HIDDEN_VOL_GARAGE;
            const zoneHiddenVolume = inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0
                ? Math.max(50, (0, parser_1.roundUpTo)(baseZoneHiddenVolume * 0.5, 25))
                : baseZoneHiddenVolume;
            hiddenVolume += zoneHiddenVolume;
            auditSummary.push(`Added +${zoneHiddenVolume} cf (${inventoryCompleteness === "sparse" ? "zones mentioned" : `zones mentioned, ${inventoryCompleteness} inventory`}).`);
        }
        if (isLD &&
            bedroomCount >= 3 &&
            largeInventoryForLD &&
            storageFurnitureQty >= 4 &&
            !storageContentsHandled &&
            parsed.boxCount < Math.max(20, storageFurnitureQty * 2) &&
            boxCoverage < 0.65) {
            const cabinetContentsHV = (0, parser_1.roundUpTo)(Math.min(75, storageFurnitureQty * 5), 25);
            hiddenVolume += cabinetContentsHV;
            auditSummary.push(`Added +${cabinetContentsHV} cf (LD cabinet contents risk).`);
        }
        if (ldFullPackLargeHome) {
            let ldFullPackPrepHV = bedroomCount >= 5 ? 100 : 75;
            if (ldFullPackComplexityScore >= 3)
                ldFullPackPrepHV += 25;
            if (ldFullPackComplexityScore >= 5)
                ldFullPackPrepHV += 25;
            hiddenVolume += ldFullPackPrepHV;
            auditSummary.push(`Added +${ldFullPackPrepHV} cf (LD full-pack prep).`);
        }
        let llPct = isLD ? config_1.PROTOCOL.LL_LD : config_1.PROTOCOL.LL_STANDARD;
        if (highConfidenceDetailedInventory) {
            llPct = isLD ? 0.02 : 0.10;
            auditSummary.push(`Loose load base reduced (${isLD ? "detailed LD inventory" : "detailed local inventory"}).`);
        }
        else if (microDetailedLocal) {
            llPct = 0.05;
            auditSummary.push("Loose load base reduced (micro local inventory).");
        }
        const llBasePct = llPct;
        const irregularRatio = parsed.detectedQtyTotal > 0 ? (parsed.irregularCount / parsed.detectedQtyTotal) : 0;
        const vagueHandledByHV = inventoryCompleteness === "sparse" && (baseHomeHiddenVolume > 0 || missingBoxesCount > 0 || parsed.mentionsGarageOrAttic);
        const llReasons = [];
        if (parsed.hasVague && !vagueHandledByHV) {
            llPct += config_1.PROTOCOL.LL_VAGUE;
            llReasons.push("vague inventory");
        }
        if (irregularRatio > 0.15) {
            llPct += config_1.PROTOCOL.LL_IRREGULAR;
            llReasons.push("bulky items");
        }
        else if (parsed.irregularCount > 0) {
            const shouldAddSmallIrregularUplift = !highConfidenceDetailedInventory || parsed.irregularCount >= 3 || irregularRatio >= 0.05;
            if (shouldAddSmallIrregularUplift) {
                const irregularUplift = isLD && bedroomCount < 3 ? 0.05 : 0.10;
                llPct += irregularUplift;
                llReasons.push("irregular items");
            }
        }
        llPct = Math.min(config_1.PROTOCOL.LL_CAP, llPct);
        const appliedLLDelta = Math.max(0, llPct - llBasePct);
        if (appliedLLDelta > 0 && llReasons.length > 0) {
            auditSummary.push(`Loose load +${Math.round(appliedLLDelta * 100)}% (${llReasons.join(", ")}).`);
        }
        const round25 = (num) => Math.round(num / 25) * 25;
        const volumeBeforeLL = parsed.totalVol + hiddenVolume;
        const rawVolume = volumeBeforeLL;
        // B. Broker Safety Padding
        const BROKER_PADDING_MULTIPLIER = 1.05;
        const billableCF = round25(rawVolume * BROKER_PADDING_MULTIPLIER);
        // C. Actual Truck Space
        const truckSpaceCF = round25(billableCF * (1 + llPct));
        let finalVolume = truckSpaceCF;
        const needsStorageHeavyTruckFloor = inputs.moveType === "Storage" &&
            !isCommercial &&
            bedroomCount >= 4 &&
            parsed.mentionsGarageOrAttic &&
            storageHeavyTruckPieceQty >= config_1.PROTOCOL.STORAGE_HEAVY_TRUCK_MIN_PIECES &&
            finalVolume >= Math.floor(config_1.PROTOCOL.TRUCK_CAPACITY_SAFE * config_1.PROTOCOL.STORAGE_HEAVY_TRUCK_FLOOR_RATIO);
        let volumeOverridden = false;
        if (o.volume !== undefined && o.volume !== null) {
            const v = (0, parser_1.parseOverrideValue)(o.volume, 1, 10000);
            if (v !== null) {
                finalVolume = v;
                overridesApplied.push("volume");
                auditSummary.push(`Manager Override: Volume = ${finalVolume} cf`);
                volumeOverridden = true;
            }
        }
        if (!volumeOverridden)
            finalVolume = (0, parser_1.roundUpTo)(finalVolume, 25);
        const weight = Math.round(finalVolume * config_1.PROTOCOL.WEIGHT_STD);
        logs.push(`Raw Inventory: ${rawVolume} cf.`);
        logs.push(`Net Total (+5% broker safety, rounded to 25): ${billableCF} cf.`);
        logs.push(`Actual Space (+LL gaps, rounded to 25): ${truckSpaceCF} cf.`);
        let effortScore = 0;
        (parsed.detectedItems || []).forEach(it => {
            const n = (it.name || "").toLowerCase();
            const mult = Object.entries(dictionaries_1.EFFORT_MULTIPLIER).find(([k]) => n.includes(k));
            effortScore += (it.cf || 0) * (mult ? mult[1] : 1.0);
        });
        let trucksFinal = 0;
        let truckSizeLabel = "N/A";
        let highCapRisk = false;
        const hasPallets = (parsed.detectedItems || []).some(it => { const n = norm(it.name); const r = norm(it.raw); return n.includes("pallet") || n.includes("skid") || r.includes("pallet") || r.includes("skid"); });
        let truckFeatureLabel = "";
        // Lift-gate: in normalized mode, only trigger if user checked heavy OR item is bulky by name
        const needsLiftGate = useNormalized
            ? manualHeavy || (parsed.detectedItems || []).some(it => { const n = norm(it.name); return dictionaries_1.LIFT_GATE_ITEMS.some(lg => new RegExp(`\\b${lg}\\b`, 'i').test(n)); })
            : (parsed.detectedItems || []).some(it => { const n = norm(it.name); return dictionaries_1.LIFT_GATE_ITEMS.some(lg => new RegExp(`\\b${lg}\\b`, 'i').test(n)); });
        if (hasHeavy || hasPallets || hasHeavyByWeight || needsLiftGate) {
            truckFeatureLabel = " + Lift-gate";
            if (hasPallets)
                advice.push("Commercial: Palletjack & Lift-gate required for skids.");
            if (hasHeavyByWeight)
                advice.push("Item >300lb detected: Heavy lifting gear needed.");
        }
        if (!isLaborOnly) {
            const safeCapacity = config_1.PROTOCOL.TRUCK_CAPACITY_SAFE;
            trucksFinal = Math.max(1, Math.ceil(finalVolume / safeCapacity));
            if (trucksFinal === 1 && finalVolume >= Math.floor(safeCapacity * config_1.PROTOCOL.BORDERLINE_TRUCK_THRESHOLD)) {
                trucksFinal = 2;
                highCapRisk = true;
                risks.push({ text: "Borderline capacity: 2 trucks recommended.", level: "caution" });
            }
            if (needsStorageHeavyTruckFloor && trucksFinal === 1) {
                trucksFinal = 2;
                highCapRisk = true;
                risks.push({ text: "Heavy storage mix: 2 trucks recommended.", level: "caution" });
                auditSummary.push("Extra truck added (storage heavy mix).");
            }
            if (trucksFinal >= 2)
                truckSizeLabel = "26ft Truck";
            else if (finalVolume < 800)
                truckSizeLabel = "18ft Truck";
            else if (finalVolume < 1300)
                truckSizeLabel = "24ft Truck";
            else
                truckSizeLabel = "26ft Truck";
            truckSizeLabel += truckFeatureLabel;
            if (inputs.moveType === "LD") {
                const wTrucks = Math.ceil(weight / config_1.PROTOCOL.LD_WEIGHT_LIMIT);
                if (wTrucks > trucksFinal) {
                    trucksFinal = wTrucks;
                    auditSummary.push("Extra truck added (weight limit).");
                }
            }
        }
        if (!isLaborOnly && o.trucks !== undefined && o.trucks !== null) {
            const t = (0, parser_1.parseOverrideValue)(o.trucks, 1, 20);
            if (t !== null) {
                trucksFinal = t;
                highCapRisk = false;
                const label = trucksFinal >= 2 ? "26ft Truck" : finalVolume < 800 ? "18ft Truck" : finalVolume < 1300 ? "24ft Truck" : "26ft Truck";
                truckSizeLabel = label + truckFeatureLabel;
                overridesApplied.push("trucks");
                auditSummary.push(`Manager Override: Trucks = ${trucksFinal}`);
            }
        }
        const baseFloor = isLaborOnly ? 10 : 20;
        const itemFloor = Math.ceil((parsed.furnitureCount || 0) / 2);
        let blankets = 0;
        (parsed.detectedItems || []).forEach(it => {
            const n = (it.name || "").toLowerCase();
            let b = 0;
            const k = (0, parser_1.matchLongestKey)(n, dictionaries_1.BLANKET_KEYS, dictionaries_1.BLANKET_REGEX_CACHE);
            if (k)
                b = dictionaries_1.BLANKETS_TABLE[k];
            else if (!dictionaries_1.STRICT_NO_BLANKET_ITEMS.some(nb => new RegExp(`\\b${nb}\\b`, 'i').test(n)))
                b = 1;
            const isChairLike = (n.includes("chair") || n.includes("stool")) && !n.includes("chair mat") && !n.includes("mat");
            const isArmchair = n.includes("arm") || n.includes("recliner") || n.includes("sofa");
            if (isCommercial && isChairLike && !isArmchair)
                blankets += Math.ceil(it.qty / config_1.PROTOCOL.COMMERCIAL_STACK_FACTOR);
            else
                blankets += b * it.qty;
        });
        const noBlanketCF = (parsed.detectedItems || []).reduce((a, it) => dictionaries_1.STRICT_NO_BLANKET_ITEMS.some(nb => new RegExp(`\\b${nb}\\b`, 'i').test((it.name || "").toLowerCase())) ? a + (it.cf || 0) : a, 0);
        const noBlanketWithLL = Math.round((noBlanketCF + (missingBoxesCount * 5)) * (1 + llPct));
        const blanketVolume = Math.max(0, finalVolume - noBlanketWithLL);
        blankets = Math.max(blankets, Math.ceil(blanketVolume / config_1.PROTOCOL.BLANKET_DIVISOR));
        const cap = Math.min(Math.ceil((parsed.furnitureCount || 0) * config_1.PROTOCOL.BLANKET_CAP_MULTIPLIER) + 15, Math.ceil(blanketVolume / 12));
        blankets = (0, parser_1.roundUpTo)(Math.max(Math.min(blankets, cap), Math.max(baseFloor, itemFloor)), 5);
        let speedOrigin = isCommercial ? config_1.PROTOCOL.SPEED_COMMERCIAL : config_1.PROTOCOL.SPEED_GROUND;
        let speedDest = isCommercial ? config_1.PROTOCOL.SPEED_COMMERCIAL : config_1.PROTOCOL.SPEED_GROUND;
        if (!isCommercial) {
            if (inputs.accessOrigin === "elevator")
                speedOrigin = config_1.PROTOCOL.SPEED_ELEVATOR;
            else if (inputs.accessOrigin === "stairs")
                speedOrigin = config_1.PROTOCOL.SPEED_STAIRS;
            if (inputs.accessDest === "elevator")
                speedDest = config_1.PROTOCOL.SPEED_ELEVATOR;
            else if (inputs.accessDest === "stairs")
                speedDest = config_1.PROTOCOL.SPEED_STAIRS;
        }
        if (isLaborOnly && inputs.accessOrigin === "stairs")
            speedOrigin = Math.round(speedOrigin * 0.85);
        if (inputs.moveType === "LD" && finalVolume * config_1.PROTOCOL.WEIGHT_SAFETY > 10000)
            speedOrigin *= config_1.PROTOCOL.HEAVY_PAYLOAD_SPEED_MULT;
        let movementManHours = isLaborOnly || inputs.moveType === "LD" ? (finalVolume / speedOrigin) : (finalVolume / speedOrigin) + (finalVolume / speedDest);
        if (highCapRisk)
            movementManHours *= config_1.PROTOCOL.MULTI_TRUCK_TIME_BUFFER;
        if (inputs.moveType === "LD")
            movementManHours *= config_1.PROTOCOL.LD_TIER_BUFFER;
        const isChairLikeFn = (name) => /chair|stool|bench|seat/i.test(name) && !/arm|reclin|sofa|couch/i.test(name);
        const isWrapExcluded = (name) => /\b(box|bin|tote|bag|carton|dish barrel|picture box|tv box|wardrobe box|plastic bin|lamp|clock|scale|walker|vacuum|canister|stool)\b/i.test(name);
        let wrapMinsTotal = (parsed.detectedItems || []).reduce((acc, it) => {
            const n = (it.name || "").toLowerCase();
            if (isWrapExcluded(n))
                return acc;
            const cfUnit = it.cf / Math.max(1, it.qty);
            let mins = cfUnit > 15 ? 10 : 5;
            if (isCommercial && isChairLikeFn(it.name))
                mins = 1.0;
            return acc + (mins * it.qty);
        }, 0);
        if (fragileDensity > config_1.PROTOCOL.FRAGILE_DENSITY_THRESHOLD)
            wrapMinsTotal = Math.round(wrapMinsTotal * config_1.PROTOCOL.FRAGILE_WRAP_MULT);
        let daMins = 0;
        (parsed.detectedItems || []).forEach(it => {
            const n = (it.name || "").toLowerCase();
            const k = (0, parser_1.matchLongestKey)(n, dictionaries_1.DA_KEYS, dictionaries_1.DA_REGEX_CACHE);
            if (k)
                daMins += dictionaries_1.DA_TIME_TABLE[k] * it.qty;
            else {
                // SAFE Bed Unit Check
                const isBedUnit = n.includes("bed") && !n.includes("frame") && !n.includes("mattress") && !n.includes("boxspring") && !n.includes("slat");
                if (isBedUnit)
                    daMins += (isCommercial ? 20 : config_1.PROTOCOL.MINS_DA_COMPLEX) * it.qty;
                else if (dictionaries_1.DA_COMPLEX.some(s => new RegExp(`\\b${s}\\b`, 'i').test(n)))
                    daMins += (isCommercial ? 20 : config_1.PROTOCOL.MINS_DA_COMPLEX) * it.qty;
                else if (dictionaries_1.DA_SIMPLE.some(s => new RegExp(`\\b${s}\\b`, 'i').test(n)))
                    daMins += (isCommercial ? 5 : config_1.PROTOCOL.MINS_DA_SIMPLE) * it.qty;
            }
        });
        const totalBoxes = parsed.boxCount + missingBoxesCount;
        let packingAddonMH = 0;
        if (inputs.packingLevel === "Full") {
            packingAddonMH = (totalBoxes * config_1.PROTOCOL.MINS_PACK_BOX) / 60;
        }
        else if (inputs.packingLevel === "Partial")
            packingAddonMH = 2.0 + (Math.min(totalBoxes, Math.max(10, Math.ceil(totalBoxes * 0.25))) * 0.08);
        const ldFullPackLaborBufferMH = ldFullPackLargeHome
            ? ldFullPackComplexityScore >= 5 ? 2.5 : ldFullPackComplexityScore >= 3 ? 1.5 : 1.0
            : 0;
        const totalManHours = movementManHours + (daMins / 60) + (wrapMinsTotal / 60) + packingAddonMH + ldFullPackLaborBufferMH;
        let crew = Math.max(2, Math.ceil(Math.sqrt(finalVolume / 100)));
        if (finalVolume >= 800 || trucksFinal > 1 || bedroomCount >= 3)
            crew = Math.max(3, crew);
        if (bedroomCount >= 4)
            crew = Math.max(4, crew);
        if (bedroomCount >= 5)
            crew = Math.max(5, crew);
        if (anyHeavySignal)
            crew = Math.max(crew, 3);
        let league = 0;
        const leagueItems = { l1: [], l2: [] };
        (parsed.detectedItems || []).forEach(it => {
            const n = (it.name || "").toLowerCase(), r = (it.raw || "").toLowerCase();
            if (dictionaries_1.LEAGUE_2_ITEMS.some(lg => new RegExp(`\\b${lg}\\b`, 'i').test(n) || new RegExp(`\\b${lg}\\b`, 'i').test(r))) {
                league = 2;
                leagueItems.l2.push(it.name);
            }
            else if (dictionaries_1.LEAGUE_1_ITEMS.some(lg => new RegExp(`\\b${lg}\\b`, 'i').test(n) || new RegExp(`\\b${lg}\\b`, 'i').test(r))) {
                if (league < 1)
                    league = 1;
                leagueItems.l1.push(it.name);
            }
        });
        if (league === 2)
            crew = Math.max(crew, 4);
        if (finalVolume > 3000)
            crew = Math.max(crew, 6);
        if (finalVolume > 4000)
            crew = Math.max(crew, 7);
        if (inputs.packingLevel === "Full" && bedroomCount >= 3)
            crew = Math.max(crew, 4);
        if (ldFullPackLargeHome) {
            const ldFullPackCrewFloor = ldFullPackComplexityScore >= 5 ? 8 : 7;
            crew = Math.max(crew, ldFullPackCrewFloor);
        }
        if (!isLaborOnly && trucksFinal >= 2)
            crew = Math.max(crew, 5);
        if (crew > config_1.PROTOCOL.MAX_CREW_SIZE)
            crew = config_1.PROTOCOL.MAX_CREW_SIZE;
        const distVal = parseInt(inputs.distance, 10) || 0;
        const effectiveDist = (inputs.moveType === "LD" || isLaborOnly) ? 0 : distVal;
        const dockingHours = !isLaborOnly && !(isLD && trucksFinal === 1) ? (trucksFinal * config_1.PROTOCOL.MINS_DOCKING_PER_TRUCK) / 60 : 0;
        const truckLogisticsHours = (!isLaborOnly && trucksFinal >= 2) ? (trucksFinal * config_1.PROTOCOL.MINS_TRUCK_LOGISTICS) / 60 : 0;
        const fixedTime = (effectiveDist > 0 ? (effectiveDist / 30) + 0.6 : 0) + config_1.PROTOCOL.COORDINATION_HRS + dockingHours + truckLogisticsHours;
        // SAFE spaceCap Logic (Option 2 applied)
        const isSmallHome = !isCommercial && bedroomCount <= 2;
        let spaceCap = config_1.PROTOCOL.MAX_CREW_SIZE;
        if (isSmallHome) {
            if (finalVolume > 2000) {
                spaceCap = 6;
            }
            else if (anyHeavySignal || finalVolume > 1500) {
                spaceCap = 5;
            }
            else {
                spaceCap = 4;
            }
            if (crew > spaceCap)
                crew = spaceCap;
        }
        let crewHardCap = Math.min(spaceCap, (isCommercial ? config_1.PROTOCOL.MAX_CREW_SIZE : finalVolume < 2600 ? 6 : finalVolume < 3400 ? 7 : config_1.PROTOCOL.MAX_CREW_SIZE));
        if (ldFullPackLargeHome && ldFullPackComplexityScore >= 5) {
            crewHardCap = Math.min(spaceCap, config_1.PROTOCOL.MAX_CREW_SIZE);
        }
        else if (ldFullPackLargeHome && ldFullPackComplexityScore >= 3) {
            crewHardCap = Math.min(spaceCap, Math.max(crewHardCap, 7));
        }
        crewHardCap = Math.max(crewHardCap, Math.min(config_1.PROTOCOL.MAX_CREW_SIZE, crew));
        const computeDuration = (crewVal) => ((totalManHours / (crewVal * (crewVal > 6 ? config_1.PROTOCOL.CREW_EFFICIENCY_LOW : crewVal > 4 ? config_1.PROTOCOL.CREW_EFFICIENCY_HIGH : 1.0))) * (finalVolume > config_1.PROTOCOL.VOLUME_DRAG_THRESHOLD ? config_1.PROTOCOL.LARGE_VOLUME_DRAG : 1.0)) + fixedTime;
        let calcDuration = computeDuration(crew);
        const SAFE_DAY_LIMIT = (inputs.moveType === "Local" || inputs.moveType === "Storage") && inputs.packingLevel === "Full" ? 11.5 : 10.5;
        while (crew < crewHardCap) {
            const nextDuration = computeDuration(crew + 1);
            const timeSaved = calcDuration - nextDuration;
            if (calcDuration <= SAFE_DAY_LIMIT && timeSaved < 1.0)
                break;
            if (Math.ceil(calcDuration * 1.1) < config_1.PROTOCOL.SPLIT_RISK_THRESHOLD && timeSaved < 0.5)
                break;
            crew++;
            calcDuration = nextDuration;
        }
        let crewSuggestion = (calcDuration > 8.0 && crew < crewHardCap && (calcDuration - computeDuration(crew + 1)) >= 0.5) ? `+1 Mover saves ~${(calcDuration - computeDuration(crew + 1)).toFixed(1)}h` : null;
        const boxDensity = parsed.detectedQtyTotal > 0 ? (parsed.boxCount || 0) / parsed.detectedQtyTotal : 0;
        if (boxDensity > 0.60 && inputs.accessOrigin === "ground" && (inputs.moveType !== "Local" || inputs.accessDest === "ground") && finalVolume < 1200 && league < 2 && !overridesApplied.includes("crew") && crew > 3) {
            crew = 3;
            calcDuration = computeDuration(crew);
        }
        if (!isLaborOnly && trucksFinal === 1 && /^18ft|^16ft/.test(truckSizeLabel) && league < 2 && !overridesApplied.includes("crew") && crew > 3) {
            crew = 3;
            calcDuration = computeDuration(crew);
        }
        let timeMin = Math.max(3, Math.floor(calcDuration));
        let timeMax = Math.max(timeMin + 1, Math.ceil(calcDuration * 1.1));
        let splitRecommended = false;
        if (isSmallHome && timeMax > 12.0 && crew === spaceCap) {
            splitRecommended = true;
        }
        else if (timeMax >= config_1.PROTOCOL.SPLIT_RISK_THRESHOLD && crew === config_1.PROTOCOL.MAX_CREW_SIZE) {
            splitRecommended = true;
        }
        if (o.crew !== undefined && o.crew !== null) {
            const c = (0, parser_1.parseOverrideValue)(o.crew, 2, 20);
            if (c !== null) {
                crew = c;
                crewSuggestion = null;
                overridesApplied.push("crew");
            }
        }
        if (!((o.timeMin !== undefined && o.timeMin !== null) || (o.timeMax !== undefined && o.timeMax !== null)) && overridesApplied.includes("crew")) {
            const d = computeDuration(crew);
            timeMin = Math.max(3, Math.floor(d));
            timeMax = Math.max(timeMin + 1, Math.ceil(d * 1.1));
        }
        if (o.timeMin !== undefined && o.timeMin !== null) {
            const tm = (0, parser_1.parseOverrideValue)(o.timeMin, 1, 99);
            if (tm !== null) {
                timeMin = tm;
                overridesApplied.push("timeMin");
            }
        }
        if (o.timeMax !== undefined && o.timeMax !== null) {
            const tx = (0, parser_1.parseOverrideValue)(o.timeMax, 1, 99);
            if (tx !== null) {
                timeMax = tx;
                overridesApplied.push("timeMax");
            }
        }
        if (timeMax >= 13)
            splitRecommended = true;
        if (finalVolume > 4000) {
            const additionalCrewAvailable = crew < crewHardCap && crew < config_1.PROTOCOL.MAX_CREW_SIZE;
            if (additionalCrewAvailable)
                advice.push(`Large Move: Recommend splitting into 2 days OR ${Math.max(6, crew + 1)}+ movers.`);
            else
                advice.push("Large Move: Recommend splitting into 2 days.");
        }
        let confidenceScore = 100;
        const reasons = [];
        if (estimatedRatio > 0.05) {
            const penalty = Math.min(30, Math.round(estimatedRatio * 40));
            confidenceScore -= penalty;
            reasons.push(`Estimated items: ${Math.round(estimatedRatio * 100)}% (-${penalty})`);
        }
        if (estimatedRatio > 0.40) {
            confidenceScore = Math.min(confidenceScore, 50);
            reasons.push("Too many unrecognized items (Low Confidence).");
        }
        if (parsed.hasVague) {
            confidenceScore -= 7;
            reasons.push("Vague inventory description.");
        }
        if (syntheticBundleRatio >= 0.10) {
            const penalty = Math.min(15, Math.max(5, Math.round(syntheticBundleRatio * 40)));
            confidenceScore -= penalty;
            reasons.push(`Inferred packed bundles: ${Math.round(syntheticBundleRatio * 100)}% (-${penalty})`);
        }
        else if (syntheticBundleGroups >= 3) {
            confidenceScore -= 4;
            reasons.push("Multiple packed-content bundles inferred.");
        }
        confidenceScore = Math.max(40, Math.min(100, confidenceScore));
        const confidenceLabel = confidenceScore >= 80 ? "High" : confidenceScore >= 60 ? "Medium" : "Low";
        const uniqueAdvice = [];
        const seenAdvice = new Set();
        if (!isCommercial && (inputs.moveType === "Local" || inputs.moveType === "LD")) {
            let volumeDriver = "Volume Driver: Inventory volume was adjusted for safe loading.";
            if (isLD && billableCF && truckSpaceCF)
                volumeDriver = "Volume Driver: Safety margin and truck-space buffer applied.";
            else if (parsed.hasVague)
                volumeDriver = "Volume Driver: Vague inventory increased handling allowance.";
            else if (missingBoxesCount > 0)
                volumeDriver = "Volume Driver: Missing box allowance increased the volume baseline.";
            else if (hiddenVolume > 0)
                volumeDriver = "Volume Driver: Room-size floor increased the baseline volume.";
            else if (llPct > config_1.PROTOCOL.LL_STANDARD)
                volumeDriver = "Volume Driver: Bulky or irregular items increased truck-space needs.";
            let timeDriver = "Time Driver: Loading speed is based on volume, access, and item mix.";
            if (inputs.packingLevel === "Full")
                timeDriver = "Time Driver: Full packing and prep time are driving the estimate.";
            else if (inputs.packingLevel === "Partial")
                timeDriver = "Time Driver: Packing prep adds handling time.";
            else if (isLD)
                timeDriver = "Time Driver: Estimate covers origin labor and prep, not transit time.";
            else if (inputs.accessOrigin === "stairs" || inputs.accessDest === "stairs")
                timeDriver = "Time Driver: Stair access reduces handling speed.";
            else if (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator")
                timeDriver = "Time Driver: Elevator coordination reduces handling speed.";
            else if (daMins >= 60)
                timeDriver = "Time Driver: Assembly/disassembly time is materially affecting the move.";
            else if (highCapRisk || trucksFinal >= 2)
                timeDriver = "Time Driver: Multi-truck coordination is adding handling time.";
            let crewDriver = "Crew Driver: Crew size is based on volume and expected move duration.";
            if (league === 2 || anyHeavySignal)
                crewDriver = "Crew Driver: Heavy or oversized items increased crew needs.";
            else if (trucksFinal >= 2)
                crewDriver = "Crew Driver: Multi-truck volume requires a larger crew.";
            else if (finalVolume >= 1800)
                crewDriver = "Crew Driver: Large shipment volume pushed the crew size up.";
            else if (ldFullPackLargeHome && crew >= 7)
                crewDriver = "Crew Driver: Estate-scale full packing requires a larger crew.";
            else if (inputs.packingLevel === "Full" && crew >= 4)
                crewDriver = "Crew Driver: Packing workload supports a larger crew.";
            else if (calcDuration > SAFE_DAY_LIMIT || (crewSuggestion && crew >= 3))
                crewDriver = "Crew Driver: Crew size was increased to keep the move within a workable day.";
            advice.push(volumeDriver, timeDriver, crewDriver);
        }
        if (isCommercial && (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator")) {
            advice.push("Confirm freight elevator access, move window, and cab dimensions.");
        }
        if (isCommercial && trucksFinal >= 2)
            advice.push("Reserve loading dock time and truck staging in advance.");
        if (isCommercial && anyHeavySignal)
            advice.push("Pre-measure oversized equipment, cabinets, and appliance paths.");
        if (inputs.packingLevel !== "None" && isCommercial)
            advice.push("Comm. Packing: Label all boxes by office/room number.");
        if (finalVolume > 1800 && trucksFinal === 1)
            advice.push("High Volume: Ensure parking spot is 40ft+ for large truck maneuvering.");
        advice.forEach(a => { if (splitRecommended && a.includes("2-Day Split"))
            return; if (!seenAdvice.has(a)) {
            seenAdvice.add(a);
            uniqueAdvice.push(a);
        } });
        let boxesBring = parsed.boxCount || 0;
        const minBoxesBySize = !isCommercial ? (config_1.PROTOCOL.MIN_BOXES[Math.min(bedroomCount, 5)] || 10) : 20;
        if (inputs.packingLevel === "Full")
            boxesBring = Math.max(boxesBring, minBoxesBySize) + 10 + (Math.max(1, trucksFinal) * 5);
        else if (inputs.packingLevel === "Partial")
            boxesBring = Math.max(boxesBring, isCommercial ? 25 : Math.max(25, Math.ceil(minBoxesBySize * 0.35)));
        else
            boxesBring = Math.max(boxesBring, isCommercial ? 15 : 10);
        if (fragileCount > 5)
            boxesBring += 5;
        if (parsed.hasVague)
            boxesBring += 5;
        boxesBring = (0, parser_1.roundUpTo)(Math.ceil(Math.min(boxesBring, inputs.packingLevel === "Full" ? Math.ceil(finalVolume / 12 + 40) : Math.ceil(finalVolume / 20 + 20))), 10);
        const wardrobes = (0, parser_1.roundUpTo)(!isCommercial ? (bedroomCount * 4) : 0, 5);
        if (o.blankets !== undefined && o.blankets !== null) {
            const b = (0, parser_1.parseOverrideValue)(o.blankets, 0, 500);
            if (b !== null) {
                blankets = b;
                overridesApplied.push("blankets");
                auditSummary.push(`Manager Override: Blankets = ${blankets}`);
            }
        }
        if (o.boxes !== undefined && o.boxes !== null) {
            const bx = (0, parser_1.parseOverrideValue)(o.boxes, 0, 500);
            if (bx !== null) {
                boxesBring = bx;
                overridesApplied.push("boxes");
                auditSummary.push(`Manager Override: Boxes = ${boxesBring}`);
            }
        }
        const smartEquipment = [];
        if (hasPallets)
            smartEquipment.push("Pallet Jack");
        if (countBy(/piano/i) > 0)
            smartEquipment.push("Piano Board");
        if (countBy(/fridge|washer|dryer|safe/i) > 0)
            smartEquipment.push("Appliance Dolly");
        if (fragileCount > 2)
            smartEquipment.push("Protective Wrap");
        const heavyMap = new Map();
        (parsed.detectedItems || []).forEach(it => {
            const n = (it.name || "").toLowerCase();
            // In normalized (manager) mode, user's checkbox is the ONLY authority
            if (useNormalized) {
                if (!it.isManualHeavy)
                    return;
            }
            else {
                // In raw text mode, use automatic detection via TRUE_HEAVY_ITEMS
                const isTrueHeavy = dictionaries_1.TRUE_HEAVY_ITEMS.some(h => n.includes(h));
                if (!isTrueHeavy && !it.isWeightHeavy)
                    return;
            }
            const label = it.isWeightHeavy ? `${it.name} (>300lb)` : it.name;
            heavyMap.set(label, (heavyMap.get(label) || 0) + (it.qty || 1));
        });
        return {
            finalVolume, weight, trucksFinal, truckSizeLabel, crew, timeMin, timeMax,
            logs, risks, splitRecommended, crewSuggestion, parsedItems: parsed.detectedItems,
            detectedQtyTotal: parsed.detectedQtyTotal, unrecognized: parsed.unrecognized,
            materials: { blankets, boxes: boxesBring, wardrobes }, smartEquipment, homeLabel: scopeLabel,
            confidence: { score: confidenceScore, label: confidenceLabel, reasons }, auditSummary, advice: uniqueAdvice, overridesApplied,
            unrecognizedDetails: parsed.unrecognized.slice(0, 10), effortScore: Math.round(effortScore),
            deadheadMiles: effectiveDist, isDDT: inputs.moveType === "Local" && distVal > 10,
            totalManHours: Math.round(totalManHours * 10) / 10, daMins: Math.round(daMins),
            anyHeavySignal, heavyItemNames: [...heavyMap.entries()].map(([name, qty]) => qty > 1 ? `${name} x${qty}` : name),
            league, leagueItems, boxDensity: Math.round(boxDensity * 100),
            truckFitNote: null, netVolume: rawVolume, billableCF: billableCF, truckSpaceCF: truckSpaceCF, extraStopCount: 0
        };
    }
    catch (err) {
        console.error("Engine Crash:", err);
        return {
            finalVolume: 0, weight: 0, trucksFinal: 0, truckSizeLabel: "Error", crew: 0, timeMin: 0, timeMax: 0,
            logs: ["Critical Engine Error"], risks: [{ text: "System Error. Reset config.", level: "critical" }],
            splitRecommended: false, crewSuggestion: null, parsedItems: [], detectedQtyTotal: 0, unrecognized: [],
            materials: { blankets: 0, boxes: 0, wardrobes: 0 }, smartEquipment: [], homeLabel: "Error",
            confidence: { score: 0, label: "Error", reasons: [] }, auditSummary: [], advice: [], overridesApplied: [], unrecognizedDetails: [], anyHeavySignal: false, heavyItemNames: [],
            league: 0, leagueItems: { l1: [], l2: [] }, boxDensity: 0, truckFitNote: null, netVolume: null, billableCF: null, truckSpaceCF: null, extraStopCount: 0,
            effortScore: 0, deadheadMiles: 0, isDDT: false, totalManHours: 0, daMins: 0
        };
    }
}
