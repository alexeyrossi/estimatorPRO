import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { mergeRowsPreservingManualHeavyFlags } = require("../../lib/inventorySync.ts");

test("mergeRowsPreservingManualHeavyFlags carries over reviewed heavy flags only", () => {
  const merged = mergeRowsPreservingManualHeavyFlags(
    [
      {
        id: "existing_1",
        name: "sofa",
        qty: 1,
        cfUnit: 45,
        raw: "sofa",
        room: "Living Room",
        flags: { heavy: true, heavyWeight: false },
      },
    ],
    [
      {
        id: "next_1",
        name: "sofa",
        qty: 1,
        cfUnit: 50,
        raw: "1 sofa",
        room: "Living Room",
        flags: { heavy: false, heavyWeight: true },
      },
      {
        id: "next_2",
        name: "lamp",
        qty: 2,
        cfUnit: 5,
        raw: "2 lamps",
        room: "Bedroom",
        flags: { heavy: false, heavyWeight: false },
      },
    ]
  );

  assert.deepEqual(merged[0].flags, { heavy: true, heavyWeight: true });
  assert.deepEqual(merged[1].flags, { heavy: false, heavyWeight: false });
  assert.equal(merged[0].cfUnit, 50);
});
