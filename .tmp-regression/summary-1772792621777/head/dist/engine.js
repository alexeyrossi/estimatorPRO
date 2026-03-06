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
        const scopeLabel = isCommercial ? "Commercial" : inputs.homeSize === "0" ? "Studio / Less" : `${bedroomCount} BDR`;
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
        const highConfidenceDetailedInventory = estimatedRatio <= 0.02 &&
            !parsed.hasVague &&
            parsed.detectedQtyTotal >= 25 &&
            parsed.boxCount >= 20;
        const hasGenericCatchall = items.some(it => /\bitem\b/i.test(it.name || ""));
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
        let hiddenVolume = 0;
        let missingBoxesCount = 0;
        const isTinyScope = bedroomCount === 0 && (parsed.totalVol < 120);
        if (!isCommercial) {
            if (!isTinyScope && !isLD) {
                const hvRow = config_1.HV_TABLE[Math.min(bedroomCount, 5)];
                if (parsed.totalVol < hvRow.min) {
                    const hvAdd = microDetailedLocal ? 100 : hvRow.add;
                    hiddenVolume += hvAdd;
                    logs.push(`Volume Check: +${hvAdd} cf added.`);
                    auditSummary.push(`Added +${hvAdd} cf (low volume for ${hvRow.label}${microDetailedLocal ? ", micro local reduced floor" : ""}).`);
                }
            }
            const minBoxes = config_1.PROTOCOL.MIN_BOXES[Math.min(bedroomCount, 5)] || 10;
            if (inputs.packingLevel !== "None" && !isTinyScope) {
                if (parsed.boxCount < minBoxes) {
                    missingBoxesCount = minBoxes - parsed.boxCount;
                    hiddenVolume += missingBoxesCount * 5;
                    auditSummary.push(`Added ${missingBoxesCount} boxes (min expected).`);
                }
            }
            else if (!isTinyScope && !microDetailedLocal) {
                const softCap = Math.min(minBoxes, parsed.boxCount + 10);
                if (parsed.boxCount < softCap) {
                    missingBoxesCount = softCap - parsed.boxCount;
                    hiddenVolume += missingBoxesCount * 5;
                    auditSummary.push(`Soft top-up +${missingBoxesCount} boxes.`);
                }
            }
        }
        else {
            if (parsed.boxCount === 0 && parsed.totalVol > 500) {
                missingBoxesCount = Math.ceil(parsed.totalVol * config_1.PROTOCOL.COMMERCIAL_BOX_RATIO / 5);
                hiddenVolume += missingBoxesCount * 5;
            }
        }
        if (parsed.mentionsGarageOrAttic) {
            const zoneHiddenVolume = highConfidenceDetailedInventory ? Math.round(config_1.PROTOCOL.HIDDEN_VOL_GARAGE / 3) : config_1.PROTOCOL.HIDDEN_VOL_GARAGE;
            hiddenVolume += zoneHiddenVolume;
            auditSummary.push(`Added +${zoneHiddenVolume} cf (zones mentioned${highConfidenceDetailedInventory ? ", reduced for detailed inventory" : ""}).`);
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
        const irregularRatio = parsed.detectedQtyTotal > 0 ? (parsed.irregularCount / parsed.detectedQtyTotal) : 0;
        if (parsed.hasVague) {
            llPct += config_1.PROTOCOL.LL_VAGUE;
            auditSummary.push("Loose load increased (vague).");
        }
        if (irregularRatio > 0.15) {
            llPct += config_1.PROTOCOL.LL_IRREGULAR;
            auditSummary.push("Loose load +20% (bulky items).");
        }
        else if (parsed.irregularCount > 0) {
            const shouldAddSmallIrregularUplift = !highConfidenceDetailedInventory || parsed.irregularCount >= 3 || irregularRatio >= 0.05;
            if (shouldAddSmallIrregularUplift) {
                llPct += 0.05;
                auditSummary.push("Loose load +5% (irregular items).");
            }
        }
        llPct = Math.min(config_1.PROTOCOL.LL_CAP, llPct);
        const round25 = (num) => Math.round(num / 25) * 25;
        const volumeBeforeLL = parsed.totalVol + hiddenVolume;
        const rawVolume = volumeBeforeLL;
        // B. Broker Safety Padding
        const BROKER_PADDING_MULTIPLIER = 1.05;
        const billableCF = round25(rawVolume * BROKER_PADDING_MULTIPLIER);
        // C. Actual Truck Space
        const truckSpaceCF = round25(billableCF * (1 + llPct));
        let finalVolume = truckSpaceCF;
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
            if (trucksFinal >= 2)
                truckSizeLabel = "26ft Truck";
            else if (finalVolume < 800)
                truckSizeLabel = "18ft Truck";
            else if (finalVolume < 1300)
                truckSizeLabel = "24ft Truck";
            else
                truckSizeLabel = "26ft Truck";
            truckSizeLabel += truckFeatureLabel;
            if (finalVolume > 4000)
                advice.push("Large Move: Recommend splitting into 2 days OR 6+ movers.");
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
                speedOrigin = Math.round(config_1.PROTOCOL.SPEED_STAIRS * Math.max(0.5, 1 - ((Math.min(6, Math.max(1, parseInt(String(inputs.stairsFlightsOrigin)) || 1)) - 1) * config_1.PROTOCOL.STAIRS_FLIGHT_PENALTY)));
            if (inputs.accessDest === "elevator")
                speedDest = config_1.PROTOCOL.SPEED_ELEVATOR;
            else if (inputs.accessDest === "stairs")
                speedDest = Math.round(config_1.PROTOCOL.SPEED_STAIRS * Math.max(0.5, 1 - ((Math.min(6, Math.max(1, parseInt(String(inputs.stairsFlightsDest)) || 1)) - 1) * config_1.PROTOCOL.STAIRS_FLIGHT_PENALTY)));
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
            advice.push(`Tip: Pre-packing loose items saves time.`);
        }
        else if (inputs.packingLevel === "Partial")
            packingAddonMH = 2.0 + (Math.min(totalBoxes, Math.max(10, Math.ceil(totalBoxes * 0.25))) * 0.08);
        const totalManHours = movementManHours + (daMins / 60) + (wrapMinsTotal / 60) + packingAddonMH;
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
        const crewHardCap = Math.min(spaceCap, (isCommercial ? config_1.PROTOCOL.MAX_CREW_SIZE : finalVolume < 2600 ? 6 : finalVolume < 3400 ? 7 : config_1.PROTOCOL.MAX_CREW_SIZE));
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
            advice.push("Space Constraint: Duration is high. 2-Day Split HIGHLY Recommended.");
            splitRecommended = true;
        }
        else if (timeMax >= config_1.PROTOCOL.SPLIT_RISK_THRESHOLD && crew === config_1.PROTOCOL.MAX_CREW_SIZE) {
            advice.push("Extremely long duration. 2-Day Split Recommended.");
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
        confidenceScore = Math.max(40, Math.min(100, confidenceScore));
        const confidenceLabel = confidenceScore >= 80 ? "High" : confidenceScore >= 60 ? "Medium" : "Low";
        const uniqueAdvice = [];
        const seenAdvice = new Set();
        if (inputs.packingLevel !== "None")
            advice.push(isCommercial ? "Comm. Packing: Label all boxes by office/room number." : "Packing: Personal valuables & documents must be moved by client.");
        if (finalVolume > 1800 && trucksFinal === 1)
            advice.push("High Volume: Ensure parking spot is 40ft+ for large truck maneuvering.");
        advice.forEach(a => { if (splitRecommended && a.includes("Large Move"))
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
