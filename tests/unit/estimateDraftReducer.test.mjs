import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  buildEstimateRequest,
  buildRawTextFromRows,
  canReuseNormalizedRows,
  createInitialEstimateDraftState,
  estimateDraftReducer,
  hydrateDraftState,
  hydrateSavedEstimate,
} = require("../../lib/estimateDraftReducer.ts");

const sampleRows = [
  {
    id: "row_1",
    name: "sofa",
    qty: 1,
    cfUnit: 45,
    raw: "sofa",
    room: "Living Room",
    flags: { heavy: false, heavyWeight: false },
  },
  {
    id: "row_2",
    name: "dresser",
    qty: 1,
    cfUnit: 25,
    raw: "dresser",
    room: "Bedroom",
    flags: { heavy: true, heavyWeight: false },
  },
];

test("raw edit marks rows stale", () => {
  const rawText = buildRawTextFromRows(sampleRows);
  const state = hydrateDraftState({
    inputs: {
      homeSize: "2",
      moveType: "Local",
      distance: "15",
      packingLevel: "None",
      accessOrigin: "ground",
      accessDest: "ground",
      inventoryText: rawText,
      extraStops: [],
    },
    inventoryMode: "raw",
    normalizedRows: sampleRows,
    rowsStatus: "fresh",
  });

  const next = estimateDraftReducer(state, {
    type: "setRawText",
    inventoryText: `${rawText}, lamp`,
  });

  assert.equal(next.rowsStatus, "stale");
  assert.equal(next.inventoryMode, "raw");
});

test("buildEstimateRequest omits rows in raw mode", () => {
  const state = hydrateDraftState({
    inputs: {
      homeSize: "2",
      moveType: "Local",
      distance: "15",
      packingLevel: "None",
      accessOrigin: "ground",
      accessDest: "ground",
      inventoryText: buildRawTextFromRows(sampleRows),
      extraStops: [],
    },
    inventoryMode: "raw",
    normalizedRows: sampleRows,
    rowsStatus: "fresh",
  });

  const request = buildEstimateRequest(state);
  assert.equal(request.inputs.inventoryMode, "raw");
  assert.equal(request.normalizedRows, undefined);
});

test("normalize success switches to normalized fresh rows", () => {
  const state = createInitialEstimateDraftState();
  const next = estimateDraftReducer(state, {
    type: "normalizeSuccess",
    normalizedRows: sampleRows,
  });

  assert.equal(next.inventoryMode, "normalized");
  assert.equal(next.rowsStatus, "fresh");
  assert.deepEqual(next.normalizedRows, sampleRows);
});

test("normalized to raw uses generated text from rows", () => {
  const normalizedState = estimateDraftReducer(createInitialEstimateDraftState(), {
    type: "normalizeSuccess",
    normalizedRows: sampleRows,
  });
  const rawText = buildRawTextFromRows(sampleRows);

  const next = estimateDraftReducer(normalizedState, {
    type: "switchToRawFromRows",
    inventoryText: rawText,
  });

  assert.equal(next.inventoryMode, "raw");
  assert.equal(next.inputs.inventoryText, rawText);
  assert.equal(next.rowsStatus, "fresh");
});

test("stale raw state never qualifies for normalized row reuse", () => {
  const rawText = buildRawTextFromRows(sampleRows);
  const state = hydrateDraftState({
    inputs: {
      homeSize: "2",
      moveType: "Local",
      distance: "15",
      packingLevel: "None",
      accessOrigin: "ground",
      accessDest: "ground",
      inventoryText: `${rawText}, lamp`,
      extraStops: [],
    },
    inventoryMode: "raw",
    normalizedRows: sampleRows,
    rowsStatus: "stale",
  });

  assert.equal(canReuseNormalizedRows(state), false);
});

test("saved estimate hydration clears overrides", () => {
  const hydrated = hydrateSavedEstimate({
    inputs: {
      homeSize: "2",
      moveType: "Local",
      distance: "15",
      packingLevel: "None",
      accessOrigin: "ground",
      accessDest: "ground",
      inventoryText: buildRawTextFromRows(sampleRows),
      extraStops: [],
    },
    inventoryMode: "normalized",
    normalizedRows: sampleRows,
    rowsStatus: "fresh",
  });

  assert.deepEqual(hydrated.overrides, {});
});

test("legacy raw draft rows hydrate as stale", () => {
  const hydrated = hydrateDraftState({
    inputs: {
      homeSize: "2",
      moveType: "Local",
      distance: "15",
      packingLevel: "None",
      accessOrigin: "ground",
      accessDest: "ground",
      inventoryText: "living room: sofa",
      extraStops: [],
    },
    inventoryMode: "raw",
    normalizedRows: sampleRows,
    rowsStatus: "stale",
  });

  assert.equal(hydrated.rowsStatus, "stale");
});
