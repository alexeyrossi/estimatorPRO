export interface ExtraStop {
  access: "ground" | "elevator" | "stairs";
  label: string;
}

export type InventoryMode = "raw" | "normalized";
export type RowsStatus = "empty" | "fresh" | "stale";

export interface EstimateInputs {
  homeSize: string;
  moveType: "Local" | "LD" | "Labor";
  distance: string;
  packingLevel: "None" | "Partial" | "Full";
  accessOrigin: "ground" | "elevator" | "stairs";
  accessDest: "ground" | "elevator" | "stairs";
  inventoryText: string;
  inventoryMode?: InventoryMode;
  normalizedRows?: NormalizedRow[];
  overrides?: Record<string, string>;
  extraStops: ExtraStop[];
}

export interface NormalizedRow {
  id: string;
  name: string;
  qty: number | "";
  cfUnit: number | "";
  cfExact?: number;
  isSynthetic?: boolean;
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
  rawExamples?: string[];
  room: string;
  sourceCount?: number;
  isSynthetic?: boolean;
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
  nextMoverTimeSavedHours: number | null;
  nextMoverSavingsLabel: string | null;
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

export interface SavedEstimateState {
  inputs: Partial<EstimateInputs>;
  normalizedRows: NormalizedRow[];
  inventoryMode: InventoryMode;
  overrides: Record<string, string>;
}

export interface EstimateDraftState {
  inputs: EstimateInputs;
  inventoryMode: InventoryMode;
  normalizedRows: NormalizedRow[];
  rowsStatus: RowsStatus;
  overrides: Record<string, string>;
}

export interface EstimateHistoryItem {
  id: string;
  client_name: string;
  final_volume: number | null;
  net_volume: number | null;
  created_at: string;
  home_size: string | null;
  move_type: EstimateInputs["moveType"] | null;
}

export interface SavedEstimateRecord {
  id: string;
  client_name: string;
  final_volume: number | null;
  net_volume: number | null;
  truck_space_cf: number | null;
  inputs_state: SavedEstimateState;
  created_at: string;
}

export interface DraftEnvelope {
  version: string;
  savedAt: string;
  expiresAt: string;
  inputs: EstimateInputs;
  inventoryMode: InventoryMode;
  normalizedRows: NormalizedRow[];
  rowsStatus: RowsStatus;
}

export interface DraftState {
  inputs: EstimateInputs;
  inventoryMode: InventoryMode;
  normalizedRows: NormalizedRow[];
  rowsStatus: RowsStatus;
}

export interface DraftLoadResult {
  state: DraftState | null;
  status: "loaded" | "missing" | "invalid";
}
