import fs from 'fs';
import path from 'path';

const srcPath = path.join(__dirname, 'estimator_monolith.tsx');
const lines = fs.readFileSync(srcPath, 'utf-8').split('\n');

function getLines(start, end) {
    return lines.slice(start - 1, end).map(line => line);
}

function exportBlock(start, end) {
    const block = getLines(start, end);
    if (block[0].startsWith('const ')) {
        block[0] = 'export ' + block[0];
    } else if (block[0].startsWith('function ')) {
        block[0] = 'export ' + block[0];
    }
    return block.join('\n');
}

// 1. types/estimator.ts
const typesContent = [
    'export interface ExtraStop {',
    '  access: "ground" | "elevator" | "stairs";',
    '  stairsFlights: number;',
    '  label: string;',
    '}',
    '',
    'export interface EstimateInputs {',
    '  homeSize: string;',
    '  moveType: "Local" | "LD" | "Labor" | "Storage";',
    '  distance: string;',
    '  packingLevel: "None" | "Partial" | "Full";',
    '  accessOrigin: "ground" | "elevator" | "stairs";',
    '  accessDest: "ground" | "elevator" | "stairs";',
    '  stairsFlightsOrigin: number;',
    '  stairsFlightsDest: number;',
    '  inventoryText: string;',
    '  inventoryMode: "raw" | "normalized";',
    '  normalizedRows: NormalizedRow[];',
    '  overrides: Record<string, string>;',
    '  extraStops: ExtraStop[];',
    '}',
    '',
    'export interface NormalizedRow {',
    '  id: string;',
    '  name: string;',
    '  qty: number | "";',
    '  cfUnit: number | "";',
    '  raw: string;',
    '  room: string;',
    '  flags: { heavy: boolean; heavyWeight: boolean };',
    '}',
    '',
    'export interface RiskItem {',
    '  text: string;',
    '  level: "caution" | "critical";',
    '}',
    '',
    'export interface ParsedItem {',
    '  name: string;',
    '  qty: number;',
    '  cf: number;',
    '  raw: string;',
    '  room: string;',
    '  isWeightHeavy: boolean;',
    '  isManualHeavy: boolean;',
    '  wLbs: number | null;',
    '}',
    '',
    'export interface EstimateResult {',
    '  finalVolume: number;',
    '  weight: number;',
    '  trucksFinal: number;',
    '  truckSizeLabel: string;',
    '  truckFitNote: string | null;',
    '  netVolume: number | null;',
    '  billableCF: number | null;',
    '  truckSpaceCF: number | null;',
    '  crew: number;',
    '  timeMin: number;',
    '  timeMax: number;',
    '  logs: string[];',
    '  risks: RiskItem[];',
    '  splitRecommended: boolean;',
    '  crewSuggestion: string | null;',
    '  parsedItems: ParsedItem[];',
    '  detectedQtyTotal: number;',
    '  unrecognized: string[];',
    '  materials: { blankets: number; boxes: number; wardrobes: number };',
    '  smartEquipment: string[];',
    '  homeLabel: string;',
    '  confidence: { score: number; label: string; reasons: string[] };',
    '  auditSummary: string[];',
    '  advice: string[];',
    '  overridesApplied: string[];',
    '  unrecognizedDetails: string[];',
    '  effortScore: number;',
    '  deadheadMiles: number;',
    '  isDDT: boolean;',
    '  totalManHours: number;',
    '  daMins: number;',
    '  anyHeavySignal: boolean;',
    '  heavyItemNames: string[];',
    '  league: number;',
    '  leagueItems: { l1: string[]; l2: string[] };',
    '  boxDensity: number;',
    '  extraStopCount: number;',
    '}',
    ''].join('\\n');

fs.mkdirSync(path.join(__dirname, 'lib', 'types'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'lib', 'types', 'estimator.ts'), typesContent);

// 2. dictionaries.ts
const dictBlocks = [
    exportBlock(82, 97),
    exportBlock(99, 113),
    exportBlock(115, 121),
    exportBlock(132, 132),
    exportBlock(134, 146),
    exportBlock(148, 155),
    exportBlock(156, 163),
    exportBlock(169, 281),
    exportBlock(283, 294),
    exportBlock(296, 307),
    exportBlock(309, 324),
    exportBlock(326, 446),
    exportBlock(452, 452),
    exportBlock(454, 454),
    exportBlock(455, 455),
    exportBlock(456, 456),
    exportBlock(458, 468),
    exportBlock(471, 471),
    exportBlock(472, 472),
    exportBlock(473, 473),
    exportBlock(474, 474),
    exportBlock(476, 482),
    exportBlock(483, 486),
    exportBlock(495, 502),
    exportBlock(504, 504),
    exportBlock(505, 505),
    exportBlock(506, 506),
    exportBlock(508, 511)
];
fs.writeFileSync(path.join(__dirname, 'lib', 'dictionaries.ts'), dictBlocks.join('\\n\\n'));

// 3. config.ts
const configBlocks = [
    exportBlock(25, 80),
    exportBlock(123, 130),
    'export const CLIENT_CONFIG = { MAX_EXTRA_STOPS: 4 };'
];
fs.writeFileSync(path.join(__dirname, 'lib', 'config.ts'), configBlocks.join('\\n\\n'));

// 4. parser.ts
const parserHeader =
    'import {\\n' +
    '  NUMBERS_REGEX_CACHE,\\n' +
    '  ALIAS_RULES,\\n' +
    '  INVERSIONS,\\n' +
    '  ABBREVIATIONS,\\n' +
    '  SORTED_KEYS,\\n' +
    '  KEY_REGEX,\\n' +
    '  LIFT_GATE_ITEMS,\\n' +
    '  VOLUME_TABLE,\\n' +
    '  IRREGULAR_SIGNALS,\\n' +
    '  VAGUE_SIGNALS,\\n' +
    '  DA_COMPLEX,\\n' +
    '  DA_SIMPLE,\\n' +
    '  SIZE_UNIT_PATTERNS,\\n' +
    '  STRICT_NO_BLANKET_ITEMS\\n' +
    '} from "./dictionaries";\\n' +
    'import { PROTOCOL } from "./config";\\n' +
    'import { EstimateInputs, NormalizedRow } from "./types/estimator";\\n\\n';

const parserBlocks = [
    exportBlock(488, 493),
    exportBlock(513, 537),
    exportBlock(539, 546),
    exportBlock(548, 552),
    exportBlock(554, 554),
    exportBlock(556, 560),
    exportBlock(562, 568),
    exportBlock(570, 576),
    exportBlock(578, 586),
    exportBlock(588, 606),
    exportBlock(608, 614),
    exportBlock(616, 634),
    exportBlock(636, 649),
    exportBlock(651, 695),
    exportBlock(697, 814)
];
fs.writeFileSync(path.join(__dirname, 'lib', 'parser.ts'), parserHeader + parserBlocks.join('\\n\\n'));

// 5. engine.ts
let engineBlock = exportBlock(816, 1172);
engineBlock = engineBlock.replace('export function buildEstimate(inputs)', 'export function buildEstimate(inputs: EstimateInputs): EstimateResult');

const engineHeader =
    'import { EstimateInputs, EstimateResult } from "./types/estimator";\\n' +
    'import {\\n' +
    '  FRAGILE_REGEX_CACHE,\\n' +
    '  LIFT_GATE_ITEMS,\\n' +
    '  LEAGUE_1_ITEMS,\\n' +
    '  LEAGUE_2_ITEMS,\\n' +
    '  BLANKET_KEYS,\\n' +
    '  BLANKET_REGEX_CACHE,\\n' +
    '  BLANKETS_TABLE,\\n' +
    '  STRICT_NO_BLANKET_ITEMS,\\n' +
    '  DA_KEYS,\\n' +
    '  DA_REGEX_CACHE,\\n' +
    '  DA_TIME_TABLE,\\n' +
    '  DA_COMPLEX,\\n' +
    '  DA_SIMPLE,\\n' +
    '  EFFORT_MULTIPLIER\\n' +
    '} from "./dictionaries";\\n' +
    'import { PROTOCOL, HV_TABLE } from "./config";\\n' +
    'import { parseOverrideValue, roundUpTo, matchLongestKey, summarizeNormalizedRows, parseInventory } from "./parser";\\n\\n';

fs.writeFileSync(path.join(__dirname, 'lib', 'engine.ts'), engineHeader + engineBlock);

// 6. actions/estimate.ts
const actionContent =
    '"use server";\\n\\n' +
    'import { EstimateInputs, EstimateResult, NormalizedRow } from "../../lib/types/estimator";\\n' +
    'import { buildEstimate } from "../../lib/engine";\\n' +
    'import { normalizeRowsFromText, applyAliasesRegex } from "../../lib/parser";\\n' +
    'import { SORTED_KEYS, KEY_REGEX, VOLUME_TABLE, LIFT_GATE_ITEMS } from "../../lib/dictionaries";\\n\\n' +
    'export async function getEstimate(inputs: EstimateInputs): Promise<EstimateResult> {\\n' +
    '  try {\\n' +
    '    return buildEstimate(inputs);\\n' +
    '  } catch (err) {\\n' +
    '    throw err;\\n' +
    '  }\\n' +
    '}\\n\\n' +
    'export async function normalizeInventoryAction(text: string): Promise<NormalizedRow[]> {\\n' +
    '  const result = normalizeRowsFromText(text);\\n' +
    '  return result.rows as NormalizedRow[];\\n' +
    '}\\n\\n' +
    'export async function resolveItemAction(name: string): Promise<{ resolvedName: string; cfUnit: number; isHeavy: boolean }> {\\n' +
    '  const alias = applyAliasesRegex((name || "").trim().toLowerCase());\\n' +
    '  const volKey = SORTED_KEYS.find(k => KEY_REGEX[k as keyof typeof KEY_REGEX].test(alias)) || null;\\n' +
    '  const resolvedName = volKey || `${name} (est)`;\\n' +
    '  const cfUnit = volKey ? VOLUME_TABLE[volKey as keyof typeof VOLUME_TABLE] : 25;\\n' +
    '  const isHeavy = LIFT_GATE_ITEMS.some(lg => resolvedName.includes(lg));\\n' +
    '  return { resolvedName, cfUnit, isHeavy };\\n' +
    '}\\n\\n' +
    'export async function suggestItemsAction(prefix: string): Promise<string[]> {\\n' +
    '  const p = (prefix || "").trim().toLowerCase();\\n' +
    '  if (p.length < 2) return [];\\n' +
    '  return SORTED_KEYS.filter(k => k.includes(p)).slice(0, 20);\\n' +
    '}\\n';

fs.mkdirSync(path.join(__dirname, 'app', 'actions'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'app', 'actions', 'estimate.ts'), actionContent);

console.log('Successfully completed extraction!');
