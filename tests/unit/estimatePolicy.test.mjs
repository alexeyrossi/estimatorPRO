import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  MAX_EXTRA_STOPS,
  MAX_INVENTORY_CHARS,
  OVERRIDE_KEYS,
  buildDraftState,
  buildRawTextFromRows,
  sanitizeEstimateInputs,
  sanitizeOverrides,
} = require("../../lib/estimatePolicy.ts");

test("sanitizeEstimateInputs normalizes unsafe boundary values", () => {
  const unsafeInventory = "x".repeat(MAX_INVENTORY_CHARS + 50);
  const sanitized = sanitizeEstimateInputs({
    homeSize: "0",
    moveType: "nope",
    distance: "12345",
    packingLevel: "weird",
    accessOrigin: "roof",
    accessDest: "stairs",
    inventoryText: unsafeInventory,
    inventoryMode: "normalized",
    extraStops: Array.from({ length: MAX_EXTRA_STOPS + 2 }, (_, index) => ({
      label: `stop-${index}`.repeat(10),
      access: index % 2 === 0 ? "stairs" : "roof",
    })),
  }, "normalized");

  assert.equal(sanitized.homeSize, "1");
  assert.equal(sanitized.moveType, "Local");
  assert.equal(sanitized.distance, "10000");
  assert.equal(sanitized.packingLevel, "None");
  assert.equal(sanitized.accessOrigin, "ground");
  assert.equal(sanitized.accessDest, "stairs");
  assert.equal(sanitized.inventoryText.length, MAX_INVENTORY_CHARS);
  assert.equal(sanitized.extraStops.length, MAX_EXTRA_STOPS);
  assert.equal(sanitized.extraStops[1].access, "ground");
});

test("buildDraftState preserves editable blank numeric fields and stale state", () => {
  const rows = [
    {
      id: "row_1",
      name: "sofa",
      qty: "",
      cfUnit: "",
      raw: "sofa",
      room: "Living Room",
      flags: { heavy: false, heavyWeight: false },
    },
  ];

  const state = buildDraftState(
    {
      homeSize: "2",
      moveType: "Local",
      distance: "15",
      packingLevel: "None",
      accessOrigin: "ground",
      accessDest: "ground",
      inventoryText: "different raw text",
      extraStops: [],
    },
    "raw",
    rows,
    "stale"
  );

  assert.equal(state.rowsStatus, "stale");
  assert.equal(state.normalizedRows[0].qty, "");
  assert.equal(state.normalizedRows[0].cfUnit, "");
  assert.equal(buildRawTextFromRows(state.normalizedRows), "Living Room:\n1 sofa");
});

test("buildRawTextFromRows formats named rooms first and General last", () => {
  const formatted = buildRawTextFromRows([
    {
      id: "row_1",
      name: "lamp",
      qty: 2,
      cfUnit: 5,
      raw: "lamp",
      room: "Living Room",
      flags: { heavy: false, heavyWeight: false },
    },
    {
      id: "row_2",
      name: "box",
      qty: 10,
      cfUnit: 3,
      raw: "box",
      room: "",
      flags: { heavy: false, heavyWeight: false },
    },
    {
      id: "row_3",
      name: "armchair",
      qty: 1,
      cfUnit: 20,
      raw: "armchair",
      room: "Living Room",
      flags: { heavy: false, heavyWeight: false },
    },
    {
      id: "row_4",
      name: "bed",
      qty: 1,
      cfUnit: 40,
      raw: "bed",
      room: "Bedroom",
      flags: { heavy: false, heavyWeight: false },
    },
  ]);

  assert.equal(
    formatted,
    "Living Room:\n1 armchair\n2 lamp\n\nBedroom:\n1 bed\n\n10 box"
  );
});

test("override contract keeps product-approved keys only", () => {
  assert.deepEqual(OVERRIDE_KEYS, ["volume", "trucks", "crew", "blankets", "boxes", "wardrobes"]);
  assert.deepEqual(sanitizeOverrides({
    volume: "1200",
    crew: "4",
    timeMin: "5",
    timeMax: "7",
    wardrobes: "15",
  }), {
    volume: "1200",
    crew: "4",
    wardrobes: "15",
  });
});
