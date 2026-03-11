import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const { DEFAULT_ESTIMATE_INPUTS } = require("../../lib/estimatePolicy.ts");
const { buildEstimate } = require("../../lib/engine.ts");
const { buildPrioritizedActionableAdvice, buildReportSummaryNotes } = require("../../lib/reportNotes.ts");

test("buildReportSummaryNotes hides boilerplate driver tips for bare estimate", () => {
  const estimate = buildEstimate(DEFAULT_ESTIMATE_INPUTS, [], {});
  const { compactAuditSummary, actionableAdvice } = buildReportSummaryNotes(
    estimate.auditSummary,
    estimate.advice,
  );

  assert.deepEqual(compactAuditSummary, [
    "+500 cu ft for low volume for 3BDR",
    "Soft top-up +5 boxes (coverage gap).",
  ]);
  assert.deepEqual(actionableAdvice, []);
});

test("buildReportSummaryNotes merges repeated cf additions into one line", () => {
  const { compactAuditSummary } = buildReportSummaryNotes(
    [
      "Added 40 boxes (coverage gap).",
      "Added +150 cf (zones mentioned).",
      "Added +25 cf (LD cabinet contents risk).",
      "Added +75 cf (LD full-pack prep).",
      "Loose load +10% (irregular items).",
    ],
    [],
  );

  assert.deepEqual(compactAuditSummary, [
    "+40 boxes for coverage gap",
    "+250 cu ft for volume adjustments: +150 zones mentioned; +25 LD cabinet contents risk; +75 LD full-pack prep",
    "+10% loose-load allowance for irregular items",
  ]);
});

test("buildReportSummaryNotes keeps actionable advice and removes driver boilerplate", () => {
  const { actionableAdvice } = buildReportSummaryNotes(
    [],
    [
      "Volume Driver: Missing box allowance increased the volume baseline.",
      "Time Driver: Loading speed is based on volume, access, and item mix.",
      "Crew Driver: Crew size is based on volume and expected move duration.",
      "Confirm building access, parking, and loading-zone rules.",
      "Confirm building access, parking, and loading-zone rules.",
      "Reserve loading dock time and truck staging in advance",
    ],
  );

  assert.deepEqual(actionableAdvice, [
    "Reserve loading dock time and truck staging in advance",
    "Confirm building access, parking, and loading-zone rules.",
  ]);
});

test("buildReportSummaryNotes normalizes boxes and extra-stop minute reasoning", () => {
  const { compactAuditSummary } = buildReportSummaryNotes(
    [
      "Added 30 boxes (sparse commercial coverage).",
      "Added +35 min (1 extra stop).",
    ],
    [],
  );

  assert.deepEqual(compactAuditSummary, [
    "+30 boxes for commercial item coverage",
    "+35 min for 1 extra stop",
  ]);
});

test("buildPrioritizedActionableAdvice sorts dispatch notes by importance", () => {
  const actionableAdvice = buildPrioritizedActionableAdvice(
    [
      "Comm. Packing: Label all boxes by office/room number.",
      "Confirm building access, parking, and loading-zone rules.",
      "Large move — plan as a 2-day job",
      "Reserve loading dock time and truck staging in advance",
      "Item >300lb detected: Heavy lifting gear needed.",
      "Custom reminder for estimator follow-up.",
      "Confirm stop order, parking, and access for each stop before dispatch",
    ],
    "Near full 26ft load; 2nd truck may be needed if add-ons appear.",
  );

  assert.deepEqual(actionableAdvice, [
    "Near full 26ft load; 2nd truck may be needed if add-ons appear.",
    "Large move — plan as a 2-day job",
    "Item >300lb detected: Heavy lifting gear needed.",
    "Confirm stop order, parking, and access for each stop before dispatch",
    "Reserve loading dock time and truck staging in advance",
    "Confirm building access, parking, and loading-zone rules.",
    "Custom reminder for estimator follow-up.",
    "Comm. Packing: Label all boxes by office/room number.",
  ]);
});

test("buildPrioritizedActionableAdvice preserves fallback order for unknown notes", () => {
  const actionableAdvice = buildPrioritizedActionableAdvice([
    "Custom note A",
    "Custom note B",
    "Comm. Packing: Label all boxes by office/room number.",
  ]);

  assert.deepEqual(actionableAdvice, [
    "Custom note A",
    "Custom note B",
    "Comm. Packing: Label all boxes by office/room number.",
  ]);
});
