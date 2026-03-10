import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const { DEFAULT_ESTIMATE_INPUTS } = require("../../lib/estimatePolicy.ts");
const { buildEstimate } = require("../../lib/engine.ts");
const { buildReportSummaryNotes } = require("../../lib/reportNotes.ts");

test("buildReportSummaryNotes hides boilerplate driver tips for bare estimate", () => {
  const estimate = buildEstimate(DEFAULT_ESTIMATE_INPUTS, [], {});
  const { compactAuditSummary, actionableAdvice } = buildReportSummaryNotes(
    estimate.auditSummary,
    estimate.advice,
  );

  assert.deepEqual(compactAuditSummary, [
    "Added +500 cf (low volume for 3BDR).",
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
    "Added 40 boxes (coverage gap).",
    "Added +250 cf (+150 zones mentioned; +25 LD cabinet contents risk; +75 LD full-pack prep).",
    "Loose load +10% (irregular items).",
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
      "Reserve loading dock time and truck staging in advance.",
    ],
  );

  assert.deepEqual(actionableAdvice, [
    "Confirm building access, parking, and loading-zone rules.",
    "Reserve loading dock time and truck staging in advance.",
  ]);
});
