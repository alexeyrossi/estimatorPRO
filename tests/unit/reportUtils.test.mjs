import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { formatEstimateReportText } = require("../../lib/estimateReport.ts");

test("formatEstimateReportText keeps current quote summary structure", () => {
  const text = formatEstimateReportText(
    {
      homeSize: "3",
      moveType: "Local",
      distance: "25",
      packingLevel: "Full",
      accessOrigin: "stairs",
      accessDest: "ground",
      inventoryText: "sofa",
      extraStops: [{ label: "Storage", access: "elevator" }],
    },
    {
      homeLabel: "3 BDR",
      trucksFinal: 2,
      truckSizeLabel: "26ft Truck",
      splitRecommended: false,
      materials: { blankets: 20, wardrobes: 10, boxes: 40 },
      smartEquipment: ["Piano Board"],
      isDDT: true,
      heavyItemNames: ["upright piano"],
      billableCF: null,
      truckSpaceCF: 900,
      finalVolume: 850,
      crew: 4,
      timeMin: 6,
      timeMax: 8,
      risks: [{ text: "Tight stairs", level: "critical" }],
      daMins: 30,
      confidence: { label: "High", score: 92, reasons: [] },
    }
  );

  assert.match(text, /3 BDR \/ Local Move/);
  assert.match(text, /Heavy items: upright piano/);
  assert.match(text, /Stop 1: elevator \[Storage\]/);
  assert.match(text, /Piano Board/);
  assert.match(text, /Confidence: High \(92%\)/);
});
