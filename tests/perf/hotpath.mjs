import "../regression/register-ts.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const { buildEstimate } = require("../../lib/engine.ts");
const { parseInventory } = require("../../lib/parser.ts");

const loadCase = (name) => JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "regression", "cases", name), "utf8")
);

const rawEngineCase = loadCase("gold-local-5br-estate-split-risk.json");
const normalizedEngineCase = loadCase("gold-ld-2br-normalized-heavy-reviewed.json");
const parserCase = loadCase("parser-garage-vague-heavy.json");

const bench = (label, fn, iterations = 400) => {
  for (let i = 0; i < 25; i += 1) fn();
  const start = performance.now();
  for (let i = 0; i < iterations; i += 1) fn();
  const totalMs = performance.now() - start;
  console.log(`${label}: ${totalMs.toFixed(1)}ms total / ${(totalMs / iterations).toFixed(3)}ms avg`);
};

bench("parseInventory(raw)", () => {
  parseInventory(parserCase.input.inventoryText);
});

bench("buildEstimate(raw)", () => {
  buildEstimate(rawEngineCase.input);
});

bench("buildEstimate(normalized)", () => {
  buildEstimate(normalizedEngineCase.input, normalizedEngineCase.normalizedRows);
});
