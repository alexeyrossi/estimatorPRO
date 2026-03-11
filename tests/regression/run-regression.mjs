#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import "./register-ts.mjs";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { buildEstimate } = require(path.resolve(__dirname, "../../lib/engine.ts"));
const { parseInventory } = require(path.resolve(__dirname, "../../lib/parser.ts"));

const CASES_FILE = path.resolve(__dirname, "./cases.json");
const CASES_DIR = path.resolve(__dirname, "./cases");

function parseArgs(argv) {
  const args = { caseId: null, update: false, tier: null, allowGoldUpdate: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--update") {
      args.update = true;
      continue;
    }
    if (arg === "--case") {
      args.caseId = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (arg === "--tier") {
      args.tier = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (arg === "--gold") {
      args.tier = "gold";
      continue;
    }
    if (arg === "--allow-gold-update") {
      args.allowGoldUpdate = true;
    }
  }

  return args;
}

function attachSourceMetadata(testCase, source) {
  return {
    ...testCase,
    __source: source,
  };
}

function readInlineCases() {
  if (!fs.existsSync(CASES_FILE)) {
    return [];
  }

  const inlineCases = JSON.parse(fs.readFileSync(CASES_FILE, "utf8"));
  if (!Array.isArray(inlineCases)) {
    throw new Error(`${CASES_FILE} must contain an array of regression cases.`);
  }

  return inlineCases.map((testCase) => attachSourceMetadata(testCase, { kind: "array", path: CASES_FILE }));
}

function readDirectoryCases() {
  if (!fs.existsSync(CASES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CASES_DIR)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      const filePath = path.join(CASES_DIR, fileName);
      const testCase = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!testCase || Array.isArray(testCase)) {
        throw new Error(`${filePath} must contain a single regression case object.`);
      }
      return attachSourceMetadata(testCase, { kind: "file", path: filePath });
    });
}

function assertUniqueIds(cases) {
  const seen = new Map();

  for (const testCase of cases) {
    const existing = seen.get(testCase.id);
    if (existing) {
      throw new Error(`Duplicate regression case id "${testCase.id}" in ${existing} and ${testCase.__source.path}.`);
    }
    seen.set(testCase.id, testCase.__source.path);
  }
}

function readCases() {
  const cases = [...readInlineCases(), ...readDirectoryCases()];
  assertUniqueIds(cases);
  return cases;
}

function stripInternalFields(testCase) {
  return Object.fromEntries(Object.entries(testCase).filter(([key]) => key !== "__source"));
}

function writeCases(cases) {
  const groupedBySource = new Map();

  for (const testCase of cases) {
    const source = testCase.__source;
    const key = `${source.kind}:${source.path}`;
    const existing = groupedBySource.get(key) || { source, cases: [] };
    existing.cases.push(testCase);
    groupedBySource.set(key, existing);
  }

  for (const { source, cases: sourceCases } of groupedBySource.values()) {
    if (source.kind === "array") {
      fs.writeFileSync(source.path, `${JSON.stringify(sourceCases.map(stripInternalFields), null, 2)}\n`);
      continue;
    }

    if (source.kind === "file") {
      if (sourceCases.length !== 1) {
        throw new Error(`Expected exactly one regression case in ${source.path}.`);
      }
      fs.writeFileSync(source.path, `${JSON.stringify(stripInternalFields(sourceCases[0]), null, 2)}\n`);
      continue;
    }

    throw new Error(`Unknown case source kind: ${source.kind}`);
  }
}

function sortStrings(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function getCaseTier(testCase) {
  return testCase.tier === "gold" ? "gold" : "breadth";
}

function snapshotEngine(result) {
  const snapshot = {
    finalVolume: result.finalVolume,
    netVolume: result.netVolume,
    billableCF: result.billableCF,
    truckSpaceCF: result.truckSpaceCF,
    trucksFinal: result.trucksFinal,
    truckSizeLabel: result.truckSizeLabel,
    crew: result.crew,
    timeMin: result.timeMin,
    timeMax: result.timeMax,
    splitRecommended: result.splitRecommended,
    confidence: {
      score: result.confidence?.score ?? null,
      label: result.confidence?.label ?? null,
    },
    materials: result.materials,
    smartEquipment: sortStrings(result.smartEquipment || []),
    anyHeavySignal: result.anyHeavySignal,
    heavyItemNames: sortStrings(result.heavyItemNames || []),
    detectedQtyTotal: result.detectedQtyTotal,
    totalManHours: result.totalManHours,
    daMins: result.daMins,
    league: result.league,
    boxDensity: result.boxDensity,
    extraStopCount: result.extraStopCount,
    risks: [...(result.risks || [])].sort((a, b) => `${a.level}:${a.text}`.localeCompare(`${b.level}:${b.text}`)),
    overridesApplied: sortStrings(result.overridesApplied || []),
  };

  if (result.truckFitNote) snapshot.truckFitNote = result.truckFitNote;
  return snapshot;
}

function snapshotParser(result) {
  return {
    totalVol: result.totalVol,
    boxCount: result.boxCount,
    heavyCount: result.heavyCount,
    furnitureCount: result.furnitureCount,
    detectedQtyTotal: result.detectedQtyTotal,
    irregularCount: result.irregularCount,
    estimatedItemCount: result.estimatedItemCount,
    hasVague: result.hasVague,
    mentionsGarageOrAttic: result.mentionsGarageOrAttic,
    unrecognized: sortStrings(result.unrecognized || []),
    detectedItems: [...(result.detectedItems || [])]
      .map((item) => ({
        name: item.name,
        qty: item.qty,
        room: item.room,
        cf: item.cf,
        isSynthetic: !!item.isSynthetic,
        isWeightHeavy: !!item.isWeightHeavy,
      }))
      .sort((a, b) => `${a.room}|${a.name}|${a.qty}`.localeCompare(`${b.room}|${b.name}|${b.qty}`)),
  };
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function runCase(testCase) {
  if (testCase.kind === "engine") {
    const result = buildEstimate(testCase.input, testCase.normalizedRows, testCase.overrides);
    const snapshot = {
      expect: snapshotEngine(result),
    };

    if (hasOwn(testCase, "parserExpect")) {
      snapshot.parserExpect = snapshotParser(parseInventory(testCase.input.inventoryText));
    }

    if (hasOwn(testCase, "adviceExpect")) {
      snapshot.adviceExpect = sortStrings(result.advice || []);
    }

    return snapshot;
  }

  if (testCase.kind === "parser") {
    const result = parseInventory(testCase.input.inventoryText);
    return {
      expect: snapshotParser(result),
    };
  }

  throw new Error(`Unknown regression case kind: ${testCase.kind}`);
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cases = readCases();
  const selectedCases = cases.filter((testCase) => {
    if (args.caseId && testCase.id !== args.caseId) return false;
    if (args.tier && getCaseTier(testCase) !== args.tier) return false;
    return true;
  });

  if (selectedCases.length === 0) {
    console.error(args.caseId ? `No regression case found for id "${args.caseId}".` : "No regression cases found.");
    process.exit(1);
  }

  if (args.update && selectedCases.some((testCase) => getCaseTier(testCase) === "gold") && !args.allowGoldUpdate) {
    console.error("Gold regression baselines require --allow-gold-update.");
    process.exit(1);
  }

  let passCount = 0;
  const failures = [];

  for (const testCase of selectedCases) {
    try {
      const snapshot = runCase(testCase);

      if (args.update) {
        testCase.expect = snapshot.expect;
        if (hasOwn(snapshot, "parserExpect")) testCase.parserExpect = snapshot.parserExpect;
        if (hasOwn(snapshot, "adviceExpect")) testCase.adviceExpect = snapshot.adviceExpect;
        console.log(`UPDATED ${testCase.id}`);
        passCount += 1;
        continue;
      }

      assert.deepStrictEqual(snapshot.expect, testCase.expect);
      if (hasOwn(testCase, "parserExpect")) {
        assert.deepStrictEqual(snapshot.parserExpect, testCase.parserExpect);
      }
      if (hasOwn(testCase, "adviceExpect")) {
        assert.deepStrictEqual(snapshot.adviceExpect, testCase.adviceExpect);
      }
      console.log(`PASS ${testCase.id}`);
      passCount += 1;
    } catch (error) {
      failures.push({ testCase, error });
      console.error(`FAIL ${testCase.id}`);
      if (error && error.actual !== undefined && error.expected !== undefined) {
        console.error("Expected:");
        console.error(formatJson(error.expected));
        console.error("Received:");
        console.error(formatJson(error.actual));
      } else {
        console.error(error instanceof Error ? error.stack : String(error));
      }
      console.error("");
    }
  }

  if (args.update) {
    writeCases(cases);
    console.log(`Updated ${passCount} regression case${passCount === 1 ? "" : "s"}.`);
    return;
  }

  if (failures.length > 0) {
    console.error(`${failures.length} regression case${failures.length === 1 ? "" : "s"} failed.`);
    process.exit(1);
  }

  console.log(`${passCount} regression case${passCount === 1 ? "" : "s"} passed.`);
}

main();
