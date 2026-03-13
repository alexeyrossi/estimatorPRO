import type { NormalizedRow } from "./types/estimator";

function buildRowKey(row: Pick<NormalizedRow, "name" | "room">) {
  return `${row.name.trim().toLowerCase()}::${(row.room || "").trim().toLowerCase()}`;
}

export function mergeRowsPreservingManualHeavyFlags(
  existingRows: NormalizedRow[],
  nextRows: NormalizedRow[]
) {
  const existingFlagsByKey = new Map(
    existingRows.map((row) => [buildRowKey(row), row.flags] as const)
  );

  return nextRows.map((row) => {
    const existingFlags = existingFlagsByKey.get(buildRowKey(row));
    if (!existingFlags) return row;

    return {
      ...row,
      flags: {
        ...row.flags,
        heavy: existingFlags.heavy,
      },
    };
  });
}
