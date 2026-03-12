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
      truckFitNote: null,
      advice: [
        "Comm. Packing: Label all boxes by office/room number.",
        "Reserve loading dock time and truck staging in advance",
      ],
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
      confidence: { label: "High", score: 92, reasons: [], factors: [] },
    }
  );

  assert.match(text, /3 BDR \/ Local Move/);
  assert.match(text, /Heavy items: upright piano/);
  assert.match(text, /Stop 1: elevator \[Storage\]/);
  assert.match(text, /Piano Board/);
  assert.match(text, /Confidence: High \(92%\)/);
  assert.ok(
    text.indexOf("Reserve loading dock time and truck staging in advance")
    < text.indexOf("Comm. Packing: Label all boxes by office/room number."),
  );
});

test("formatEstimateReportText includes truck fit note when present", () => {
  const text = formatEstimateReportText(
    {
      homeSize: "Commercial",
      moveType: "Local",
      distance: "6",
      packingLevel: "None",
      accessOrigin: "ground",
      accessDest: "ground",
      inventoryText: "desks",
      extraStops: [],
    },
    {
      homeLabel: "Commercial",
      trucksFinal: 1,
      truckSizeLabel: "26ft Truck",
      truckFitNote: "Near full 26ft load; 2nd truck may be needed if add-ons appear.",
      advice: [
        "Comm. Packing: Label all boxes by office/room number.",
        "Reserve loading dock time and truck staging in advance",
      ],
      splitRecommended: false,
      materials: { blankets: 20, wardrobes: 0, boxes: 20 },
      smartEquipment: [],
      isDDT: false,
      heavyItemNames: [],
      billableCF: 1500,
      truckSpaceCF: 1625,
      finalVolume: 1625,
      crew: 4,
      timeMin: 6,
      timeMax: 7,
      risks: [],
      daMins: 0,
      confidence: { label: "High", score: 95, reasons: [], factors: [] },
    }
  );

  assert.match(text, /Near full 26ft load; 2nd truck may be needed if add-ons appear\./);
  assert.ok(
    text.indexOf("Near full 26ft load; 2nd truck may be needed if add-ons appear.")
    < text.indexOf("Reserve loading dock time and truck staging in advance"),
  );
});
