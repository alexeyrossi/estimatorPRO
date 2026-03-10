const DRIVER_PREFIXES = ["Volume Driver:", "Time Driver:", "Crew Driver:"];
const ADDED_CF_RE = /^Added \+(\d+) cf \((.+)\)\.$/;

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

export function buildReportSummaryNotes(auditSummary: string[] = [], advice: string[] = []) {
  const actionableAdvice = dedupeStrings(
    advice.filter((line) => !DRIVER_PREFIXES.some((prefix) => line.startsWith(prefix)))
  );

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
      compactAuditSummary: auditSummary,
      actionableAdvice,
    };
  }

  const firstCfIndex = cfMatches[0].index;
  const cfIndexes = new Set(cfMatches.map(({ index }) => index));
  const mergedCfLine = `Added +${cfMatches.reduce((sum, { amount }) => sum + amount, 0)} cf (${cfMatches.map(({ amount, reason }) => `+${amount} ${reason}`).join("; ")}).`;

  const compactAuditSummary = auditSummary.flatMap((line, index) => {
    if (!cfIndexes.has(index)) return [line];
    return index === firstCfIndex ? [mergedCfLine] : [];
  });

  return {
    compactAuditSummary,
    actionableAdvice,
  };
}
