import "server-only";

import {
  NUMBERS_REGEX_CACHE,
  ALIAS_RULES,
  INVERSIONS,
  ABBREVIATIONS,
  SORTED_KEYS,
  KEY_REGEX,
  LIFT_GATE_ITEMS,
  TRUE_HEAVY_ITEMS,
  VOLUME_TABLE,
  IRREGULAR_SIGNALS,
  VAGUE_SIGNALS,
  DA_COMPLEX,
  DA_SIMPLE,
  SIZE_UNIT_PATTERNS,
  STRICT_NO_BLANKET_ITEMS
} from "./dictionaries";
import { PROTOCOL } from "./config";
import { NormalizedRow, ParsedItem } from "./types/estimator";

export function matchLongestKey(nameLower: string, keys: string[], cache: Record<string, RegExp>): string | null {
  for (const k of keys) {
    if (cache[k].test(nameLower)) return k;
  }
  return null;
}

export function looksLikeSizeNotQty(rawTok: string = "", cleanTok: string = ""): boolean {
  const s = (rawTok || "").toLowerCase();
  if (/\b(monitor|screen)s?\b/.test(cleanTok)) {
    if (SIZE_UNIT_PATTERNS.some(re => re.test(s))) return true;
    return false;
  }
  if (/\b(tv|television)s?\b/.test(cleanTok)) {
    const m = s.match(/[:=]?\s*(\d{2,3})\b/);
    if (m) { const val = parseInt(m[1], 10); if (val >= 30 && val <= 100) return true; }
    return false;
  }
  if (/[:=]\s*\d+/.test(s)) return false;
  if (/\b(\~|≈|approx|approximately|total|qty|count|pcs|items|ea)\b/i.test(s)) return false;
  if (/\b\d+\s*[-–]\s*\d+\b/.test(s)) return false;
  if (/\b(?:qty|count|pcs)\s*[:=]?\s*\d+\b/i.test(s)) return false;
  if (/\b(?:x\s*\d+|\d+\s*x)\b/i.test(s)) return false;
  if (SIZE_UNIT_PATTERNS.some(re => re.test(s))) return true;
  if (/\b\d+\s*'\b/.test(s)) return true;
  if (/\b\d+\s*x\s*\d+(\s*x\s*\d+)?\b/i.test(s)) return true;
  if (/\b(rug|carpet|mat|mirror)s?\b/.test(cleanTok)) {
    const m = s.match(/\b(\d{2,3})\b\s*$/);
    if (m) { const n = parseInt(m[1], 10); if (n >= 20) return true; }
  }
  return false;
}

export function extractWeightLbs(rawTok: string = ""): number | null {
  const s = (rawTok || "").toLowerCase();
  let m = s.match(/(\d{1,4})\s*(?:lb|lbs|pound|pounds)\b/);
  if (m) return parseInt(m[1], 10);
  m = s.match(/(\d{1,4})\s*(?:kg|kgs)\b/);
  if (m) return Math.round(parseInt(m[1], 10) * 2.20462);
  return null;
}

export function roundUpTo(n: number | string, step: number | string): number {
  const x = Number(n); const s = Number(step);
  if (!Number.isFinite(x) || !Number.isFinite(s) || s <= 0) return Number(n);
  return Math.ceil(x / s) * s;
}

export function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export function clampInt(n: number | string, min = 0, max = 999): number {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, Math.round(x)));
}

export function parseOverrideValue(val: string | number | null | undefined, min = 0, max = 9999): number | null {
  const str = String(val || "").trim();
  if (str === "") return null;
  const num = Number(str);
  if (!Number.isFinite(num)) return null;
  return Math.max(min, Math.min(max, Math.round(num)));
}

export function normalizeTextNumbers(text: string): string {
  let s = (text || "").toLowerCase();
  NUMBERS_REGEX_CACHE.forEach(({ re, val }) => {
    s = s.replace(re, String(val));
  });
  return s;
}

export function scrubNoise(s: string): string {
  return (s || "")
    .replace(/\b\d+(\.\d+)?\s*(lb|lbs|pound|pounds|kg|kgs|in|inch|inches|ft|feet|foot|cm|mm)\b/gi, " ")
    .replace(/\b\d+(\.\d+)?\s*['′](?=\s|$)/g, " ")
    .replace(/\b\d+(\.\d+)?\s*["″](?=\s|$)/g, " ")
    .replace(/['′"″]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractQty(text: string): number {
  const s = (text || "").toLowerCase().trim().replace(/^[-*•>]\s*/, "").trim();  // strip leading bullet
  const safeParse = (str: string) => { const val = parseInt(str, 10); return Math.min(500, Math.max(1, val)); };
  let m = s.match(/\(\s*(?:qty|count|pcs|#|x)?\s*(\d+)\s*x?\s*\)\s*$/i); if (m) return safeParse(m[1]);
  m = s.match(/\bx\s*(\d+)\b/i); if (m) return safeParse(m[1]);
  m = s.match(/\b(\d+)\s*x\b/i); if (m) return safeParse(m[1]);
  if (/\b\d+\s*x\s*\d+(\s*x\s*\d+)?\b/.test(s)) return 1;
  m = s.match(/\bset\s+of\s+(\d+)\b/); if (m) return safeParse(m[1]);
  m = s.match(/\bpair\s+of\b/); if (m) return 2;
  m = s.match(/(?:[:=\s]*[~≈-]+\s*|\s+)(\d+)(?:\s*[-–]\s*(\d+))?\s*(?:total|pcs|items|ea|est|approx)?\s*$/i);
  if (m) return Math.max(safeParse(m[1]), m[2] ? safeParse(m[2]) : 0);
  m = s.match(/\b(\d+)\s*dozen\b/); if (m) return Math.min(500, safeParse(m[1]) * 12);
  m = s.match(/^(\d+)\s*[-–—]\s*(\d+)\b/); if (m) return safeParse(m[2]);
  m = s.match(/^(\d+)\b/); if (m) return safeParse(m[1]);
  m = s.match(/:\s*(\d+)\s*$/); if (m) return safeParse(m[1]);
  m = s.match(/\b(qty|count|pcs)\s*(\d+)\s*$/); if (m) return safeParse(m[2]);
  m = s.match(/\bx(\d+)\b/i); if (m) return safeParse(m[1]);
  return 1;
}

export function applyAliasesRegex(t: string): string {
  const s = (t || "").toLowerCase();
  for (const rule of ALIAS_RULES) {
    if (rule.re.test(s)) return rule.to;
  }
  return t;
}

type SyntheticBundleItem = {
  name: keyof typeof VOLUME_TABLE;
  qty: number;
};

function getSyntheticBundleItems(rawTok: string): SyntheticBundleItem[] | null {
  const s = (rawTok || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!s) return null;

  if (/\bsmall\s*patio\s*set\b/.test(s)) return [{ name: "outdoor table", qty: 1 }, { name: "outdoor chair", qty: 2 }];
  if (/\bfull\s*cabinet\s*pack\b/.test(s)) return [{ name: "medium box", qty: 12 }];
  if (/\bcabinet\s*pack\b/.test(s)) return [{ name: "medium box", qty: 8 }];
  if (/\bpacked\s*smalls?\b/.test(s)) return [{ name: "medium box", qty: 6 }];
  if (/\blots?\s+of\b.*\b(?:packed\s+)?boxes?\b.*\bmisc\s*storage\b/.test(s)) return [{ name: "medium box", qty: 12 }];
  if (/\bdocument\s*boxes?\s*books?\b/.test(s)) return [{ name: "book box", qty: 8 }];
  if (/\bbooks?\s+shelves?\b/.test(s)) return [{ name: "bookcase", qty: 1 }, { name: "book box", qty: 5 }];
  if (/\blinen\s*closet\s*contents\b/.test(s)) return [{ name: "medium box", qty: 4 }];
  if (/\bcloset\s*contents\b/.test(s)) return [{ name: "wardrobe box", qty: 3 }];
  if (/\bcabinet\s*(?:\/|\s+)?drawer\s*contents\b/.test(s) || /\bdrawer\s*contents\b/.test(s)) return [{ name: "medium box", qty: 3 }];
  if (/\bcabinet\s*contents\b/.test(s)) return [{ name: "medium box", qty: 4 }];
  if (/\bshelves?\s*contents\b/.test(s)) return [{ name: "medium box", qty: 3 }];
  if (/\bcleaning\s*supplies\b/.test(s)) return [{ name: "medium box", qty: 2 }];

  return null;
}

export function preProcessLine(line: string): string {
  let s = line;

  // 1. Convert dash-separated rooms into standard colon-separated rooms so the engine catches them automatically
  s = s.replace(/^(patio|attic|playroom|garage|gar|gym|back-house music studio)\s*[-—–]\s*/gi, "$1: ");

  // 2. Strip fused broker room prefixes at the start of a line to isolate the actual items (e.g., "gar 2 bks" -> "2 bks")
  s = s.replace(/^(gar|att|gst\s*bdrm|mstr\s*bdrm|gym|plyrm|ent|lvg\s*rm)\s+(?=\d|[a-z])/gi, "");

  // 3. Fix special multiplication signs
  s = s.replace(/×/g, "x");

  // 2. Fix commas inside numbers (e.g., "1,000" -> "1000")
  s = s.replace(/(\d),(\d)/g, "$1$2");

  // 3. SMART PARENTHESES STRIPPER (Protects quantities!)
  // Removes noise like "(glass top)", but KEEPS "(4)", "(x4)", "(qty 2)", "(4x)"
  s = s.replace(/\((?!\s*(?:x|qty|#)?\s*\d+\s*x?\s*\))[^)]+\)/gi, " ");

  // 4. Strip broker jargon without destroying surrounding text
  s = s.replace(/\b(pre-removed|removed|empty|frame stays|PBO|CP|KD|TBD)\b/gi, "");

  // 5. SPLIT MULTI-ITEMS: "w/d" means Washer AND Dryer. 
  // We replace with a comma so the tokenizer splits them into TWO items.
  s = s.replace(/\bw\/d\b/gi, "washer, dryer");

  // 6. SAFE SLASH HANDLING: "wardrobe/armoire" -> "wardrobe armoire"
  s = s.replace(/([a-zA-Z])\/([a-zA-Z])/g, "$1 $2");

  // Remove specific instructional noise that the dash-splitter turns into items
  s = s.replace(/[-—–]*\s*must be protected from crushing/gi, "");

  INVERSIONS.forEach(inv => { s = s.replace(inv.src, inv.dest); });
  s = s.replace(/\bt\.v\./gi, "tv");
  s = s.replace(/\bflat\s+screen\b/gi, "");

  const tokens = s.split(/([\s,]+)/);
  const processed = tokens.map(tok => {
    const lower = tok.toLowerCase().replace(/\.$/, "");
    // SAFE object call
    if (Object.prototype.hasOwnProperty.call(ABBREVIATIONS, lower)) {
      return (ABBREVIATIONS as Record<string, string>)[lower];
    }
    return tok;
  });
  s = processed.join("");
  s = s.replace(/\s+(w\/|with|plus)\s+/gi, " & ");
  return s;
}

export function normalizeRowsFromText(text: string) {
  const parsed = parseInventory(text);
  const rows = (parsed.detectedItems || []).map(it => {
    const cfUnit = Math.max(1, Math.round((it.cf || 0) / Math.max(1, it.qty || 1)));
    const nameLower = (it.name || "").toLowerCase();
    const rawLower = (it.raw || "").toLowerCase();
    const isHeavy = it.isWeightHeavy || TRUE_HEAVY_ITEMS.some(h => new RegExp(`\\b${h}\\b`, 'i').test(nameLower) || new RegExp(`\\b${h}\\b`, 'i').test(rawLower));
    return {
      id: uid(), name: it.name, qty: clampInt(it.qty, 1, 500), cfUnit,
      raw: it.raw || "", room: it.room || "", flags: { heavy: !!isHeavy, heavyWeight: !!it.isWeightHeavy }
    };
  });
  return { rows, unmapped: 0 };
}

export function summarizeNormalizedRows(rows: NormalizedRow[], rawTextForSignals = "") {
  // SAFE fallbacks for empty inputs during edit
  const validRows = (rows || []).filter(r => {
    const q = parseInt(String(r.qty), 10) || 0;
    return q > 0;
  });
  const detectedItems: ParsedItem[] = validRows.map(r => ({
    name: r.name,
    qty: clampInt(r.qty, 1, 500),
    cf: Math.max(1, Math.round((r.cfUnit || 1) * clampInt(r.qty, 1, 500))),
    raw: r.raw || "",
    rawExamples: r.raw ? [r.raw] : [],
    room: r.room || "",
    sourceCount: 1,
    isSynthetic: false,
    isWeightHeavy: !!r.flags?.heavyWeight,
    isManualHeavy: !!r.flags?.heavy,
    wLbs: null,
    flags: r.flags
  }));
  const totalVol = (detectedItems || []).reduce((a, it) => a + (it.cf || 0), 0);
  const detectedQtyTotal = (detectedItems || []).reduce((a, it) => a + (it.qty || 0), 0);
  const boxCount = detectedItems.reduce((a, it) => {
    const n = (it.name || "").toLowerCase();
    return new RegExp(`\\b(box|bin|tote)s?\\b`, 'i').test(n) ? a + it.qty : a;
  }, 0);
  const heavyCount = validRows.reduce((a, r) => a + (r.flags?.heavy ? clampInt(r.qty, 1, 500) : 0), 0);

  let daComplexQty = 0, daSimpleQty = 0;
  detectedItems.forEach(it => {
    const n = (it.name || "").toLowerCase();
    // SAFE Bed Unit Check
    const isBedUnit = n.includes("bed") && !n.includes("frame") && !n.includes("mattress") && !n.includes("boxspring") && !n.includes("slat");
    if (isBedUnit) daComplexQty += it.qty;
    else if (DA_COMPLEX.some(s => new RegExp(`\\b${s}\\b`, 'i').test(n))) daComplexQty += it.qty;
    else if (DA_SIMPLE.some(s => new RegExp(`\\b${s}\\b`, 'i').test(n))) daSimpleQty += it.qty;
  });

  let furnitureCount = 0, noBlanketVol = 0;
  detectedItems.forEach(it => {
    const n = (it.name || "").toLowerCase();
    if (STRICT_NO_BLANKET_ITEMS.some(nb => new RegExp(`\\b${nb}\\b`, 'i').test(n))) noBlanketVol += it.cf;
    else furnitureCount += it.qty;
  });
  const irregularCount = detectedItems.reduce((a, it) => IRREGULAR_SIGNALS.some(s => new RegExp(`\\b${s}\\b`, 'i').test((it.name || "").toLowerCase())) ? a + it.qty : a, 0);
  const rawLower = (rawTextForSignals || "").toLowerCase();

  return {
    detectedItems, totalVol, boxCount, heavyCount, furnitureCount, detectedQtyTotal, noBlanketVol,
    irregularCount, daComplexQty, daSimpleQty, unrecognized: [],
    estimatedItemCount: validRows.reduce((a, r) => a + (/\(est\)$/.test((r.name || "").toLowerCase()) ? clampInt(r.qty, 1, 500) : 0), 0),
    hasVague: VAGUE_SIGNALS.some(s => new RegExp(`\\b${s}\\b`).test(rawLower)),
    mentionsGarageOrAttic: /\bgarage\b|\bpatio\b|\bchristmas\b|\battic\b|\bshed\b/i.test(rawLower)
  };
}

export function parseInventory(text: string) {
  const rawNormalized = normalizeTextNumbers(text);
  const ROOM_ALIAS_REGEX_BASE = "main house|living|dining|kitchen|master|bedroom|bath|garage|patio|study|office|basement|attic|nursery|guest|closet|laundry|den|foyer|hallway|mudroom|sunroom|bonus|master bedroom|master bdr|mbr|primary bedroom|primary bed|main bedroom|owner suite|home office|library|man cave|gym|home gym|fitness room|workout room|deck|backyard|storage|storage unit|shed|playroom|kids room|open office|conference|cafeteria|executive|equipment|reception|break room|server room|warehouse|breakfast nook|exterior|back house|music studio|studio|tv room|storage room";
  const inlineRoomBreak = new RegExp(`\\.\\s+(?=(?:${ROOM_ALIAS_REGEX_BASE})(?:\\s+room|\\s+area|\\s+rooms|\\s+offices)?\\s*:)`, "gi");
  const rawLines = rawNormalized
    .replace(/\r/g, "")
    .replace(inlineRoomBreak, ".\n")
    .split("\n")
    .filter(l => l?.trim()?.length > 0);

  let totalVol = 0, boxCount = 0, heavyCount = 0, detectedQtyTotal = 0, noBlanketVol = 0;
  let daComplexQty = 0, daSimpleQty = 0, furnitureCount = 0;
  let irregularCount = 0, estimatedItemCount = 0;

  const detectedItems: ParsedItem[] = [];
  const unrecognized: string[] = [];
  const tokens: { text: string; room: string }[] = [];
  let currentRoom = "";
  const EXACT_ROOM_HEADERS = new Map<string, string>([
    ["front door", "Front Entry/Porch"],
    ["front porch", "Front Entry/Porch"],
    ["front door / front porch", "Front Entry/Porch"],
    ["boxes and bins", "Boxes/Bins"],
    ["boxes & bins", "Boxes/Bins"],
    ["storage closet", "Storage/Outdoor"],
    ["bathroom", "Bathroom"]
  ]);
  const getExactRoomHeader = (line: string) => {
    const key = (line || "")
      .toLowerCase()
      .replace(/:$/, "")
      .replace(/\s*&\s*/g, " and ")
      .replace(/\s*\/\s*/g, " / ")
      .replace(/\s+/g, " ")
      .trim();
    return EXACT_ROOM_HEADERS.get(key) || null;
  };

  for (const line of rawLines) {
    if (!/[a-zA-Z]/.test(line)) { continue; }
    const processedLine = preProcessLine(line);
    let clean = processedLine.trim().replace(/^[-*•>:]+\s*/, "");
    const isProtectedItem = /^(room divider|roomba|dining table|office chair|kitchen island|patio heater)\b/i.test(clean);
    const ROOM_ONLY = new RegExp(`^(${ROOM_ALIAS_REGEX_BASE})(\\s+room|\\s+area|\\s+rooms|\\s+offices|\\s+area)?(\\s*\/[\\w\\s\\-&]+)?\\s*:?$`, "i");
    const ROOM_PREFIX = new RegExp(`^(${ROOM_ALIAS_REGEX_BASE})\\b`, "i");
    // Generic section header: any text-only line ending in ':' with no digits (e.g. "Open Office Area:", "Cafeteria:")
    const GENERIC_SECTION_HEADER = /^[a-zA-Z][a-zA-Z\s\/\-]+:$/.test(clean.trim()) && !/\d/.test(clean);

    const normalizeRoomData = (room: string) => {
      const lower = room.toLowerCase();
      if (/^(master bedroom|master bdr|mbr|primary bedroom|primary bed|main bedroom|owner suite|master)$/.test(lower)) return "Master Bedroom";
      if (/^(home office|study|den|library|man cave|office|executive offices?|executive)$/.test(lower)) return "Office";
      if (/^(gym|home gym|fitness room|workout room)$/.test(lower)) return "Gym";
      if (/^(studio|music studio|back house|back house music studio)$/.test(lower)) return "Studio";
      if (/^(garage|patio|deck|backyard|storage unit|attic|shed|storage)$/.test(lower)) return "Storage/Outdoor";
      if (/^(playroom|nursery|kids room)$/.test(lower)) return "Kids/Family";
      if (/^(open office|open office area)$/.test(lower)) return "Open Office";
      if (/^(conference rooms?|conference)$/.test(lower)) return "Conference Room";
      if (/^(cafeteria)$/.test(lower)) return "Cafeteria";
      if (/^(equipment|server room|reception|break room|warehouse)$/.test(lower)) return lower.charAt(0).toUpperCase() + lower.slice(1);

      return room.charAt(0).toUpperCase() + room.slice(1);
    };

    const exactRoomHeader = getExactRoomHeader(clean);
    if (!isProtectedItem && exactRoomHeader) {
      currentRoom = exactRoomHeader;
      clean = "";
    } else if (!isProtectedItem) {
      if ((ROOM_ONLY.test(clean) || GENERIC_SECTION_HEADER) && !/[0-9]/.test(clean)) {
        currentRoom = normalizeRoomData(clean.replace(/:$/, "").split("/")[0].trim()); clean = "";
      } else {
        const colonHdr = clean.match(/^(.+?)\s*:\s*(.*)$/);
        if (colonHdr && ROOM_PREFIX.test(colonHdr[1])) { currentRoom = normalizeRoomData(colonHdr[1].trim()); clean = colonHdr[2] || ""; }
        else if (/^(master|bedroom|bath)\s*\d+$/i.test(clean)) { currentRoom = normalizeRoomData(clean.trim()); clean = ""; }
      }
    }
    if (!clean?.trim()) continue;
    clean = clean.replace(/\s+(w\/|with|plus|\+|and|&)\s+/gi, " & ");
    const lineTokens = clean.split(/[,;•+]+|\s+[\/—–]+\s+|&/gi).map(x => x?.trim()).filter(Boolean);
    lineTokens.forEach(tok => tokens.push({ text: tok, room: currentRoom }));
  }

  const registerMatchedItem = (name: keyof typeof VOLUME_TABLE, qty: number, raw: string, room: string, wLbs: number | null, isWeightHeavy: boolean, isSynthetic = false) => {
    const cf = VOLUME_TABLE[name] * qty;
    totalVol += cf;
    detectedQtyTotal += qty;
    detectedItems.push({
      name,
      qty,
      cf,
      raw,
      rawExamples: [raw],
      room,
      sourceCount: 1,
      isSynthetic,
      wLbs,
      isWeightHeavy,
      isManualHeavy: false,
      flags: { heavy: isWeightHeavy, heavyWeight: isWeightHeavy }
    });
    if (new RegExp(`\\b(box|bin|tote)s?\\b`, "i").test(name)) boxCount += qty;
    if (LIFT_GATE_ITEMS.some(h => new RegExp(`\\b${h}\\b`, "i").test(name)) || isWeightHeavy) heavyCount += qty;
    if (IRREGULAR_SIGNALS.some(s => new RegExp(`\\b${s}\\b`, "i").test(name))) irregularCount += qty;

    const isBedUnit = name.includes("bed") && !name.includes("frame") && !name.includes("mattress") && !name.includes("boxspring") && !name.includes("slat");
    if (isBedUnit) daComplexQty += qty;
    else if (DA_COMPLEX.some(s => new RegExp(`\\b${s}\\b`, "i").test(name))) daComplexQty += qty;
    else if (DA_SIMPLE.some(s => new RegExp(`\\b${s}\\b`, "i").test(name))) daSimpleQty += qty;

    if (!STRICT_NO_BLANKET_ITEMS.some(nb => new RegExp(`\\b${nb}\\b`, "i").test(name))) furnitureCount += qty;
    else noBlanketVol += cf;
  };

  tokens.forEach(({ text: tok, room }) => {
    const rawTok = (tok || "").trim();
    let t = scrubNoise(rawTok.toLowerCase());
    if (!t) return;

    // Strip parenthetical notes that aren't quantities
    t = t.replace(/\s*\([^)]*(?:estimated|approx|ratio|mounted|commercial|light|heavy|uncertain|included|client)[^)]*\)\s*/gi, " ").trim();
    t = t.replace(/\s+/g, " ").trim();

    let qty = 1;
    const colonMatch = rawTok.match(/[:=]\s*(\d+)/);
    if (colonMatch) {
      const hasQtyWord = /\b(qty|count|pcs|items|ea)\b/i.test(rawTok);
      const sizeLike = looksLikeSizeNotQty(rawTok, t);
      qty = (sizeLike && !hasQtyWord) ? 1 : Math.min(500, Math.max(1, parseInt(colonMatch[1], 10)));
    } else {
      qty = looksLikeSizeNotQty(rawTok, t) ? 1 : extractQty(t);
    }

    const wLbs = extractWeightLbs(rawTok);
    const isWeightHeavy = !!(wLbs && wLbs >= 300);
    const syntheticBundleItems = getSyntheticBundleItems(rawTok);
    if (syntheticBundleItems) {
      syntheticBundleItems.forEach(item => registerMatchedItem(item.name, item.qty, rawTok, room, wLbs, isWeightHeavy, true));
      return;
    }

    t = t.replace(/\b(boxed|packed)\b/gi, " ").replace(/\s+/g, " ").trim();
    const aliasFromRaw = applyAliasesRegex(rawTok.toLowerCase());

    if (aliasFromRaw !== rawTok.toLowerCase() && aliasFromRaw !== t) t = aliasFromRaw;

    const tClean = t
      .replace(/^\s*x\s*\d+\s*/i, "")
      .replace(/^\s*\d+\s*x\s*/i, "")
      .replace(/\s*x\s*\d+\s*$/i, "")
      .replace(/\s*\(\s*\d+\s*\)\s*$/i, "")
      .trim();

    let cleanName = tClean
      .replace(new RegExp(`^\\d+\\s*[-–—]?\\s*\\d*\\s*`, "i"), "")
      .replace(new RegExp(`[:\\s]+${qty}\\s*$`, "i"), "")
      .replace(/\b(qty|count|pcs|items|ea|est|approx)\b/gi, "")
      .replace(/\s+/g, " ").trim();

    cleanName = applyAliasesRegex(cleanName);

    const findMatchedKey = (candidate: string) => {
      for (const key of SORTED_KEYS) {
        if (KEY_REGEX[key].test(candidate)) return key;
      }
      return null;
    };
    const rescuedName = cleanName
      .replace(/\$\s*\d+(?:\.\d+)?/g, " ")
      .replace(/\b\d+\s*-\s*\d+\s*gallons?\b/gi, " ")
      .replace(/\b(?:bulk fee|fee|pkg|package|pbo|cp|reg|regular|std|standard)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    const matchedKey = findMatchedKey(cleanName) || (rescuedName !== cleanName ? findMatchedKey(rescuedName) : null);
    let matchedAny = false;
    if (matchedKey) {
      matchedAny = true;
      registerMatchedItem(matchedKey as keyof typeof VOLUME_TABLE, qty, rawTok, room, wLbs, isWeightHeavy);
    }

    if (!matchedAny) {
      const fallbackName = rescuedName || cleanName;
      if (/^(?:front door|front porch|boxes and bins|boxes & bins|storage closet|bathroom|queen|king|full|double|single|twin|jewelry|small|medium|large|sm|med|lg|lrg|reg|std|floor(?:\s+lrg)?)$/i.test(fallbackName)) return;
      let estVol = PROTOCOL.VOL_EST_MEDIUM;
      const lowerName = fallbackName.toLowerCase();
      let isBoxLike = false;
      if (/box|bin|tote|bag|pack|basket|shoe|lamp|small|mini/i.test(lowerName)) { estVol = PROTOCOL.VOL_EST_SMALL; isBoxLike = true; }
      else if (/table|desk|cabinet|shelf|rack|stand|unit|dresser/i.test(lowerName)) { estVol = PROTOCOL.VOL_EST_LARGE; }

      estVol = estVol * qty;
      totalVol += estVol; detectedQtyTotal += qty;
      if (!isBoxLike) furnitureCount += qty;
      estimatedItemCount += qty;
      detectedItems.push({
        name: `${fallbackName} (est)`,
        qty,
        cf: estVol,
        raw: rawTok,
        rawExamples: [rawTok],
        room,
        sourceCount: 1,
        isSynthetic: false,
        wLbs,
        isWeightHeavy: !!isWeightHeavy,
        isManualHeavy: false,
        flags: { heavy: !!isWeightHeavy, heavyWeight: !!isWeightHeavy }
      });
      if (fallbackName?.length > 2 && !/^(item|qty|pcs|total|set|of)$/i.test(fallbackName)) unrecognized.push(fallbackName);
    }
  });

  const consolidationMap = new Map<string, ParsedItem>();
  for (const item of detectedItems) {
    if (item.name === "ignore_item") continue;

    const key = `${item.name}::${item.room}`;
    const existing = consolidationMap.get(key);

    if (existing) {
      existing.qty += item.qty;
      existing.cf += item.cf;
      existing.sourceCount = (existing.sourceCount || 1) + (item.sourceCount || 1);
      existing.isSynthetic = !!(existing.isSynthetic || item.isSynthetic);
      const mergedExamples = [...(existing.rawExamples || [existing.raw]), ...(item.rawExamples || [item.raw])];
      existing.rawExamples = Array.from(new Set(mergedExamples.filter(Boolean))).slice(0, 4);
    } else {
      consolidationMap.set(key, { ...item });
    }
  }
  const consolidatedItems = Array.from(consolidationMap.values());

  const rawLower = (text || "").toLowerCase();
  return {
    detectedItems: consolidatedItems, totalVol, boxCount, heavyCount, furnitureCount, detectedQtyTotal, noBlanketVol,
    irregularCount, daComplexQty, daSimpleQty, unrecognized, estimatedItemCount,
    hasVague: VAGUE_SIGNALS.some(s => new RegExp(`\\b${s}\\b`).test(rawLower)),
    mentionsGarageOrAttic: /\bgarage\b|\bpatio\b|\bchristmas\b|\battic\b|\bshed\b/i.test(rawLower)
  };
}
