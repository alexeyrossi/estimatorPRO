import type { EstimateInputs, ParsedItem, RiskItem, NormalizedRow } from "../types/estimator";

export interface ParsedInventorySummary {
  detectedItems: ParsedItem[];
  totalVol: number;
  boxCount: number;
  heavyCount: number;
  furnitureCount: number;
  detectedQtyTotal: number;
  noBlanketVol: number;
  irregularCount: number;
  daComplexQty: number;
  daSimpleQty: number;
  unrecognized: string[];
  estimatedItemCount: number;
  hasVague: boolean;
  mentionsGarageOrAttic: boolean;
}

export interface EngineNotes {
  logs: string[];
  risks: RiskItem[];
  auditSummary: string[];
  advice: string[];
  overridesApplied: string[];
}

export interface CommercialSignals {
  hasOfficeFurnitureMix: boolean;
  hasMedicalOps: boolean;
  hasWarehouseOps: boolean;
  hasPalletizedFreight: boolean;
  hasWarehouseStorageMix: boolean;
  hasServerRack: boolean;
  hasConferenceTableOnly: boolean;
  hasOtherTrueHeavySignal: boolean;
  lightOfficeEligible: boolean;
}

export interface EngineContext {
  inputs: EstimateInputs;
  normalizedRows?: NormalizedRow[];
  overrides: Record<string, string>;
  notes: EngineNotes;
  useNormalized: boolean;
  parsed: ParsedInventorySummary;
  items: ParsedItem[];
  countBy: (re: RegExp) => number;
  isCommercial: boolean;
  commercialProfile: "office" | "medical" | "warehouse" | "generic";
  commercialSignals: CommercialSignals;
  isLaborOnly: boolean;
  isLD: boolean;
  bedroomCount: number;
  scopeLabel: string;
  extraStops: EstimateInputs["extraStops"];
  extraStopCount: number;
  extraStopMinutesTotal: number;
  extraStopHours: number;
  hasNonGroundExtraStop: boolean;
  extraStopComplexityScore: number;
  hasHeavyByWeight: boolean;
  manualHeavy: boolean;
  hasHeavy: boolean;
  suppressConferenceTableHeavy: boolean;
  hasMandatoryFourCrewSpecialty: boolean;
  anyHeavySignal: boolean;
  fragileCount: number;
  fragileDensity: number;
  estimatedRatio: number;
  hasGenericCatchall: boolean;
  sizeUnits: number;
  itemDensity: number;
  expectedBoxesBase: number;
  boxCoverage: number;
  smallItemSignals: number;
  storageFurnitureQty: number;
  largeHome: boolean;
  largeInventoryForLD: boolean;
  ldFullPackLargeHome: boolean;
  syntheticBundleItems: ParsedItem[];
  syntheticBundleVolume: number;
  syntheticBundleRatio: number;
  syntheticBundleGroups: number;
  syntheticBundleBoxQty: number;
  estateHeavyPieceQty: number;
  storageHeavyTruckPieceQty: number;
  ldFullPackComplexityScore: number;
  storageContentsHandled: boolean;
  highConfidenceDetailedInventory: boolean;
  microDetailedLocal: boolean;
  inventoryCompleteness: "detailed" | "coarse" | "sparse";
}

export interface VolumePlan {
  inventoryVolume: number;
  hiddenVolume: number;
  missingBoxesCount: number;
  llPct: number;
  llBasePct: number;
  llReasons: string[];
  rawVolume: number;
  billableCF: number;
  truckSpaceCF: number;
  finalVolume: number;
  weight: number;
  coverageContributors: Array<{ label: string; amount: number; detail: string }>;
  safetyBufferCF: number;
  billableRoundingCF: number;
  looseLoadBufferCF: number;
  truckSpaceRoundingCF: number;
}

export interface TruckPlan {
  trucksFinal: number;
  truckSizeLabel: string;
  highCapRisk: boolean;
  softTruckWarning: boolean;
  truckFitNote: string | null;
  truckFeatureLabel: string;
  hasPallets: boolean;
  needsLiftGate: boolean;
  league: number;
  leagueItems: { l1: string[]; l2: string[] };
}

export interface LaborPlan {
  movementManHours: number;
  wrapMinsTotal: number;
  daMins: number;
  totalManHours: number;
  packingAddonMH: number;
  ldFullPackLaborBufferMH: number;
  baseRouteMovementManHours: number;
  accessAdjustmentManHours: number;
  highCapRiskBufferManHours: number;
  ldTierBufferManHours: number;
  baseDurationHours: number;
  accessAdjustmentDurationHours: number;
  highCapRiskBufferDurationHours: number;
  ldTierBufferDurationHours: number;
  wrapDurationHours: number;
  daDurationHours: number;
  packingDurationHours: number;
  ldFullPackPrepDurationHours: number;
  fixedTimeHours: number;
  distanceDurationHours: number;
  coordinationDurationHours: number;
  dockingDurationHours: number;
  truckLogisticsDurationHours: number;
  extraStopDurationHours: number;
  recommendedCrew: number;
  recommendedCalcDuration: number;
  recommendedTimeMin: number;
  recommendedTimeMax: number;
  recommendedRangeLowHours: number;
  recommendedRangeHighHours: number;
  crew: number;
  crewSuggestion: string | null;
  nextMoverTimeSavedHours: number | null;
  nextMoverSavingsLabel: string | null;
  timeMin: number;
  timeMax: number;
  splitRecommended: boolean;
  boxDensity: number;
  calcDuration: number;
  safeDayLimit: number;
}
