const DRIVER_PREFIXES = ["Volume Driver:", "Time Driver:", "Crew Driver:"];
const ADDED_CF_RE = /^Added \+(\d+) cf \((.+)\)\.$/;
const ADDED_BOXES_RE = /^Added (\d+) boxes \((.+)\)\.$/;
const LOOSE_LOAD_RE = /^Loose load \+(\d+)% \((.+)\)\.$/;
const ADDED_MIN_RE = /^Added \+(\d+) min \((.+)\)\.$/;
const LARGE_MOVE_NOTE = "Large move — plan as a 2-day job";
const HEAVY_GEAR_PREFIX = "Item >300lb detected:";
const PALLETJACK_NOTE = "Commercial: Palletjack & Lift-gate required for skids.";
const PREMEASURE_PREFIX = "Pre-measure oversized equipment";
const STOP_ORDER_PREFIX = "Confirm stop order, parking, and access for each stop before dispatch";
const DOCK_DOOR_PREFIX = "Confirm dock door access, pallet counts, and receiving window before dispatch.";
const LOADING_DOCK_PREFIX = "Reserve loading dock time and truck staging in advance";
const BUILDING_ACCESS_PREFIX = "Confirm building access, parking, and loading-zone rules.";
const BUILDING_WINDOW_PREFIX = "Confirm building move window, freight elevator booking, and COI requirements.";
const FREIGHT_ELEVATOR_PREFIX = "Confirm freight elevator access, move window, and cab dimensions.";
const LARGE_TRUCK_PARKING_PREFIX = "High Volume: Ensure parking spot is 40ft+ for large truck maneuvering.";
const COMM_PACKING_PREFIX = "Comm. Packing:";

function normalizeReason(reason: string) {
  if (reason === "sparse commercial coverage") return "commercial item coverage";
  return reason.replace(/ commercial coverage$/, " commercial item coverage");
}

function formatAuditSummaryLine(line: string) {
  const cfMatch = line.match(ADDED_CF_RE);
  if (cfMatch) {
    return `+${cfMatch[1]} cu ft for ${normalizeReason(cfMatch[2])}`;
  }

  const boxesMatch = line.match(ADDED_BOXES_RE);
  if (boxesMatch) {
    return `+${boxesMatch[1]} boxes for ${normalizeReason(boxesMatch[2])}`;
  }

  const looseLoadMatch = line.match(LOOSE_LOAD_RE);
  if (looseLoadMatch) {
    return `+${looseLoadMatch[1]}% loose-load allowance for ${normalizeReason(looseLoadMatch[2])}`;
  }

  const addedMinMatch = line.match(ADDED_MIN_RE);
  if (addedMinMatch) {
    return `+${addedMinMatch[1]} min for ${normalizeReason(addedMinMatch[2])}`;
  }

  return line;
}

function dedupeStrings(values: string[]) {
  const seen = new Set<string>();
  const deduped: string[] = [];

  values.forEach((value) => {
    if (!value || seen.has(value)) return;
    seen.add(value);
    deduped.push(value);
  });

  return deduped;
}

function getAdvicePriority(line: string, truckFitNote: string | null) {
  if (truckFitNote && line === truckFitNote) return 0;
  if (line === LARGE_MOVE_NOTE) return 1;
  if (line.startsWith(HEAVY_GEAR_PREFIX)) return 10;
  if (line === PALLETJACK_NOTE) return 11;
  if (line.startsWith(PREMEASURE_PREFIX)) return 12;
  if (line === STOP_ORDER_PREFIX) return 20;
  if (line === DOCK_DOOR_PREFIX) return 21;
  if (line === LOADING_DOCK_PREFIX) return 22;
  if (line === BUILDING_ACCESS_PREFIX) return 23;
  if (line === BUILDING_WINDOW_PREFIX) return 24;
  if (line === FREIGHT_ELEVATOR_PREFIX) return 25;
  if (line === LARGE_TRUCK_PARKING_PREFIX) return 26;
  if (line.startsWith(COMM_PACKING_PREFIX)) return 40;
  return 30;
}

export function buildPrioritizedActionableAdvice(advice: string[] = [], truckFitNote: string | null = null) {
  const actionableAdvice = dedupeStrings([
    ...(truckFitNote ? [truckFitNote] : []),
    ...advice.filter((line) => !DRIVER_PREFIXES.some((prefix) => line.startsWith(prefix))),
  ]);

  return actionableAdvice
    .map((line, index) => ({
      line,
      index,
      priority: getAdvicePriority(line, truckFitNote),
    }))
    .sort((left, right) => {
      if (left.priority !== right.priority) return left.priority - right.priority;
      return left.index - right.index;
    })
    .map(({ line }) => line);
}

export function buildReportSummaryNotes(auditSummary: string[] = [], advice: string[] = [], truckFitNote: string | null = null) {
  const actionableAdvice = buildPrioritizedActionableAdvice(advice, truckFitNote);

  const cfMatches = auditSummary
    .map((line, index) => {
      const match = line.match(ADDED_CF_RE);
      if (!match) return null;

      return {
        index,
        amount: Number(match[1]),
        reason: match[2],
      };
    })
    .filter((value): value is { index: number; amount: number; reason: string } => value !== null);

  if (cfMatches.length <= 1) {
    return {
      compactAuditSummary: auditSummary.map(formatAuditSummaryLine),
      actionableAdvice,
    };
  }

  const firstCfIndex = cfMatches[0].index;
  const cfIndexes = new Set(cfMatches.map(({ index }) => index));
  const mergedCfLine = `+${cfMatches.reduce((sum, { amount }) => sum + amount, 0)} cu ft for volume adjustments: ${cfMatches.map(({ amount, reason }) => `+${amount} ${normalizeReason(reason)}`).join("; ")}`;

  const compactAuditSummary = auditSummary.flatMap((line, index) => {
    if (!cfIndexes.has(index)) return [line];
    return index === firstCfIndex ? [mergedCfLine] : [];
  });

  return {
    compactAuditSummary: compactAuditSummary.map(formatAuditSummaryLine),
    actionableAdvice,
  };
}
