import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildEstimate } = require("../../lib/engine.ts");

const sampleInputs = {
  homeSize: "2",
  moveType: "Local",
  distance: "15",
  packingLevel: "None",
  accessOrigin: "ground",
  accessDest: "ground",
  inventoryText: "sofa, dresser",
  extraStops: [],
};

test("wardrobes override only changes materials output", () => {
  const base = buildEstimate(sampleInputs);
  const overridden = buildEstimate(sampleInputs, undefined, { wardrobes: "25" });

  assert.equal(overridden.materials.wardrobes, 25);
  assert.equal(overridden.finalVolume, base.finalVolume);
  assert.equal(overridden.trucksFinal, base.trucksFinal);
  assert.equal(overridden.crew, base.crew);
  assert.equal(overridden.timeMin, base.timeMin);
  assert.equal(overridden.timeMax, base.timeMax);
  assert.match(overridden.auditSummary.join(" | "), /Wardrobes = 25/);
  assert.ok(overridden.overridesApplied.includes("wardrobes"));
  assert.deepEqual(
    overridden.calculationPath.overrideBadges.map((badge) => badge.key),
    ["wardrobes"]
  );
  assert.deepEqual(
    overridden.calculationPath.volume.items.map((item) => item.label),
    base.calculationPath.volume.items.map((item) => item.label)
  );
  assert.deepEqual(
    overridden.calculationPath.labor.items.map((item) => item.label),
    base.calculationPath.labor.items.map((item) => item.label)
  );
});
