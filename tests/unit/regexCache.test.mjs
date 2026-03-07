import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  BOX_LIKE_REGEX,
  GARAGE_ATTIC_REGEX,
  buildLiteralRegexCache,
  matchesAnyRegex,
  matchesAnyRegexAcross,
} = require("../../lib/dictionaries.ts");

test("buildLiteralRegexCache matches escaped literal labels", () => {
  const cache = buildLiteralRegexCache(["2-door fridge", "c++ stand"]);

  assert.equal(matchesAnyRegex(cache, "moving a 2-door fridge today"), true);
  assert.equal(matchesAnyRegex(cache, "setup c++ stand in office"), true);
  assert.equal(matchesAnyRegex(cache, "plain fridge"), false);
});

test("matchesAnyRegexAcross works across multiple strings", () => {
  const cache = buildLiteralRegexCache(["server rack"]);

  assert.equal(matchesAnyRegexAcross(cache, "desk", "server rack"), true);
  assert.equal(matchesAnyRegexAcross(cache, "desk", "chair"), false);
});

test("shared box-like and garage-attic regexes keep expected behavior", () => {
  assert.equal(BOX_LIKE_REGEX.test("medium box"), true);
  assert.equal(BOX_LIKE_REGEX.test("plastic tote"), true);
  assert.equal(BOX_LIKE_REGEX.test("dresser"), false);

  assert.equal(GARAGE_ATTIC_REGEX.test("garage tools and attic decor"), true);
  assert.equal(GARAGE_ATTIC_REGEX.test("living room"), false);
});
