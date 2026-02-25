export interface ExtraStop {
  access: "ground" | "elevator" | "stairs";
  stairsFlights: number;
  label: string;
}

export interface EstimateInputs {
  homeSize: string;
  moveType: "Local" | "LD" | "Labor" | "Storage";
  distance: string;
  packingLevel: "None" | "Partial" | "Full";
  accessOrigin: "ground" | "elevator" | "stairs";
  accessDest: "ground" | "elevator" | "stairs";
  stairsFlightsOrigin: number;
  stairsFlightsDest: number;
  inventoryText: string;
  inventoryMode?: "raw" | "normalized";
  normalizedRows?: NormalizedRow[];
  overrides?: Record<string, string>;
  extraStops: ExtraStop[];
}

export interface NormalizedRow {
  id: string;
  name: string;
  qty: number | "";
  cfUnit: number | "";
  raw: string;
  room: string;
  flags: { heavy: boolean; heavyWeight: boolean };
}

export interface RiskItem {
  text: string;
  level: "caution" | "critical";
}

export interface ParsedItem {
  name: string;
  qty: number;
  cf: number;
  raw: string;
  room: string;
  isWeightHeavy: boolean;
  isManualHeavy: boolean;
  wLbs: number | null;
  flags?: { heavy?: boolean; heavyWeight?: boolean };
}

export interface EstimateResult {
  finalVolume: number;
  weight: number;
  trucksFinal: number;
  truckSizeLabel: string;
  truckFitNote: string | null;
  netVolume: number | null;
  billableCF: number | null;
  truckSpaceCF: number | null;
  crew: number;
  timeMin: number;
  timeMax: number;
  logs: string[];
  risks: RiskItem[];
  splitRecommended: boolean;
  crewSuggestion: string | null;
  parsedItems: ParsedItem[];
  detectedQtyTotal: number;
  unrecognized: string[];
  materials: { blankets: number; boxes: number; wardrobes: number };
  smartEquipment: string[];
  homeLabel: string;
  confidence: { score: number; label: string; reasons: string[] };
  auditSummary: string[];
  advice: string[];
  overridesApplied: string[];
  unrecognizedDetails: string[];
  effortScore: number;
  deadheadMiles: number;
  isDDT: boolean;
  totalManHours: number;
  daMins: number;
  anyHeavySignal: boolean;
  heavyItemNames: string[];
  league: number;
  leagueItems: { l1: string[]; l2: string[] };
  boxDensity: number;
  extraStopCount: number;
}
