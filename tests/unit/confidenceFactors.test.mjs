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
  extraStops: [],
};

test("clean inventory gets a positive confidence factor", () => {
  const estimate = buildEstimate({
    ...sampleInputs,
    inventoryText: "sofa, dresser",
  });

  assert.deepEqual(estimate.confidence.factors, [
    "Most items were recognized directly from the inventory.",
  ]);
});

test("vague or unrecognized inventory gets recognition-gap confidence factors", () => {
  const estimate = buildEstimate({
    ...sampleInputs,
    inventoryText: "misc boxes, stuff, bags",
  });

  assert.ok(
    estimate.confidence.factors.includes("Some items were estimated from unclear or unmatched text."),
  );
  assert.ok(
    estimate.confidence.factors.includes("Inventory description is vague."),
  );
});

test("synthetic bundle inference gets a packed-bundle confidence factor", () => {
  const estimate = buildEstimate({
    ...sampleInputs,
    inventoryText: "closet contents, cabinet contents, shelves contents",
  });

  assert.ok(
    estimate.confidence.factors.includes("Packed contents were inferred as box bundles."),
  );
});
