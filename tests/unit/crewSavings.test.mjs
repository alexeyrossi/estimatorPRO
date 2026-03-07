import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { formatNextMoverSavingsLabel } = require("../../lib/engine/labor.ts");

test("savings under half hour stay hidden", () => {
  assert.equal(formatNextMoverSavingsLabel(0.49), null);
});

test("savings under one and a half hours show as one hour", () => {
  assert.equal(formatNextMoverSavingsLabel(0.71), "+1 mover saves ~1h");
  assert.equal(formatNextMoverSavingsLabel(1.01), "+1 mover saves ~1h");
});

test("savings above one and a half hours round to nearest half hour", () => {
  assert.equal(formatNextMoverSavingsLabel(1.51), "+1 mover saves ~1.5h");
  assert.equal(formatNextMoverSavingsLabel(2.26), "+1 mover saves ~2.5h");
  assert.equal(formatNextMoverSavingsLabel(2.24), "+1 mover saves ~2h");
});
