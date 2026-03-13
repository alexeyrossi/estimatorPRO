import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildEstimate } = require("../../lib/engine.ts");

function getModifier(lane, label) {
  const item = lane.items.find((entry) => entry.kind === "modifier" && entry.label === label);
  assert.ok(item, `Expected modifier ${label}`);
  return item;
}

function getNode(lane, label) {
  const item = lane.items.find((entry) => entry.kind === "node" && entry.label === label);
  assert.ok(item, `Expected node ${label}`);
  return item;
}

test("basic local estimate exposes coverage and loose-load details in calculation path", () => {
  const estimate = buildEstimate({
    homeSize: "2",
    moveType: "Local",
    distance: "15",
    packingLevel: "None",
    accessOrigin: "ground",
    accessDest: "ground",
    inventoryText: "sofa, dresser",
    extraStops: [],
  });

  assert.deepEqual(
    estimate.calculationPath.volume.items.map((item) => item.label),
    ["Inventory Volume", "Coverage / Safety", "Adjusted Volume", "Loose-Load / Stacking", "Truck Space"]
  );

  const coverageModifier = getModifier(estimate.calculationPath.volume, "Coverage / Safety");
  const looseLoadModifier = getModifier(estimate.calculationPath.volume, "Loose-Load / Stacking");
  assert.match(coverageModifier.details.join(" | "), /Broker safety allowance/);
  assert.match(looseLoadModifier.details.join(" | "), /loose-load base allowance/);
});

test("sparse inventory volume path shows hidden volume floor and box coverage", () => {
  const estimate = buildEstimate({
    homeSize: "3",
    moveType: "Local",
    distance: "15",
    packingLevel: "Partial",
    accessOrigin: "ground",
    accessDest: "ground",
    inventoryText: "sofa, dresser",
    extraStops: [],
  });

  const coverageModifier = getModifier(estimate.calculationPath.volume, "Coverage / Safety");
  const details = coverageModifier.details.join(" | ");
  assert.match(details, /Hidden Volume Floor/);
  assert.match(details, /Box Coverage/);
});

test("labor path shows access slowdown for stairs and elevator handling", () => {
  const estimate = buildEstimate({
    homeSize: "2",
    moveType: "Local",
    distance: "15",
    packingLevel: "None",
    accessOrigin: "stairs",
    accessDest: "elevator",
    inventoryText: "sofa, dresser, queen bed",
    extraStops: [],
  });

  const accessModifier = getModifier(estimate.calculationPath.labor, "Access & Handling");
  assert.match(accessModifier.details.join(" | "), /pickup stairs and drop-off elevator/);
});

test("labor path includes routing detail for extra stops", () => {
  const estimate = buildEstimate({
    homeSize: "2",
    moveType: "Local",
    distance: "15",
    packingLevel: "None",
    accessOrigin: "ground",
    accessDest: "ground",
    inventoryText: "sofa, dresser, queen bed",
    extraStops: [{ label: "Storage", access: "stairs" }],
  });

  const accessModifier = getModifier(estimate.calculationPath.labor, "Access & Handling");
  assert.match(accessModifier.details.join(" | "), /Extra-stop routing and staging/);
});

test("volume override preserves auto path and appends a manual final volume step", () => {
  const estimate = buildEstimate({
    homeSize: "2",
    moveType: "Local",
    distance: "15",
    packingLevel: "None",
    accessOrigin: "ground",
    accessDest: "ground",
    inventoryText: "sofa, dresser",
    extraStops: [],
  }, undefined, { volume: "1300" });

  assert.deepEqual(
    estimate.calculationPath.volume.items.map((item) => item.label),
    [
      "Inventory Volume",
      "Coverage / Safety",
      "Adjusted Volume",
      "Loose-Load / Stacking",
      "Truck Space",
      "Manual Override",
      "Final Volume",
    ]
  );
  const truckSpaceNode = getNode(estimate.calculationPath.volume, "Truck Space");
  const finalVolumeNode = getNode(estimate.calculationPath.volume, "Final Volume");
  assert.equal(truckSpaceNode.tone, "orange");
  assert.equal(finalVolumeNode.tone, "amber");
});

test("crew override preserves recommended labor path and appends a manual final range", () => {
  const estimate = buildEstimate({
    homeSize: "2",
    moveType: "Local",
    distance: "15",
    packingLevel: "None",
    accessOrigin: "ground",
    accessDest: "ground",
    inventoryText: "sofa, dresser",
    extraStops: [],
  }, undefined, { crew: "5" });

  assert.deepEqual(
    estimate.calculationPath.labor.items.map((item) => item.label),
    [
      "Base Time",
      "Access & Handling",
      "Work Time",
      "Range Buffer",
      "Est. Range",
      "Manual Override",
      "Final Range",
    ]
  );

  const autoRangeNode = getNode(estimate.calculationPath.labor, "Est. Range");
  const finalRangeNode = getNode(estimate.calculationPath.labor, "Final Range");
  const overrideModifier = getModifier(estimate.calculationPath.labor, "Manual Override");

  assert.equal(autoRangeNode.tone, "purple");
  assert.equal(finalRangeNode.tone, "amber");
  assert.match(overrideModifier.details.join(" | "), /Recommended crew: 2\./);
  assert.match(overrideModifier.details.join(" | "), /Manual crew: 5\./);
});
