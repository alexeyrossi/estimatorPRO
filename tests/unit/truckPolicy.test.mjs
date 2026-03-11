import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildEstimate } = require("../../lib/engine.ts");

function buildVolumeOverrideEstimate(volume, extraStops = []) {
  const inputs = {
    homeSize: "3",
    moveType: "Local",
    distance: "10",
    packingLevel: "None",
    accessOrigin: "ground",
    accessDest: "ground",
    inventoryText: "Living room: sofa",
    extraStops,
    inventoryMode: "raw",
  };

  return buildEstimate(inputs, undefined, { volume: String(volume) });
}

test("truck policy keeps hard count at one truck below 1650 and uses soft fit note near limit", () => {
  const base1450 = buildVolumeOverrideEstimate(1450);
  const base1625 = buildVolumeOverrideEstimate(1625);
  const base1660 = buildVolumeOverrideEstimate(1660);
  const stop1600 = buildVolumeOverrideEstimate(1600, [
    { label: "Storage", access: "stairs" },
    { label: "Office", access: "elevator" },
  ]);

  assert.equal(base1450.trucksFinal, 1);
  assert.equal(base1450.truckFitNote, null);

  assert.equal(base1625.trucksFinal, 1);
  assert.equal(base1625.truckFitNote, "Near full 26ft load; 2nd truck may be needed if add-ons appear.");

  assert.equal(base1660.trucksFinal, 2);
  assert.equal(base1660.truckFitNote, null);

  assert.equal(stop1600.trucksFinal, 2);
  assert.equal(stop1600.truckFitNote, null);
  assert.deepEqual(stop1600.risks, [
    { text: "Multi-stop routing reduces practical 1-truck capacity: 2 trucks recommended.", level: "caution" },
  ]);
});
