import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildEstimate } = require("../../lib/engine.ts");
const { normalizeRowsFromText, parseInventory, summarizeNormalizedRows } = require("../../lib/parser.ts");

const reproInventoryText = `• Living Room: upright piano + bench, sofa, 2 armchairs, heavy concrete coffee table, rug, shoe cabinet, wardrobe/armoire, delicate bar cabinet, small table, lamps, paintings/art, shelving + packed smalls
• Dining Room: dining table, 8 dining chairs (incl. 2 from closet), rug, lamp, books/shelves (packed), wine glasses (packed), chandelier (pre-removed), 2 pictures
• Breakfast Nook: small table, 2 chairs, dishware (packed), bottle display (packed), small ladder/step ladder
• Kitchen: FULL cabinet pack (no fridge/stove/dishwasher), small appliances (coffee machine + grinder boxed), 2 small step ladders, trash can
• Hallway / Laundry / Cleaning: laundry basket, cleaning supplies + shelves contents (packed), extra trash can, misc baskets
• Hallway Office Storage: printer, document boxes/books, linen closet contents (towels/linens), misc drawer contents (packed)
• Bedroom: king mattress ONLY (frame stays), dresser, wall lights (pre-removed), closet contents (packed)
• Office: bookcase, nightstand, desk/table + chair, office chair, typewriter, chair + footrest, pedestal, shelf, 9x12 rug, suitcases, books, kettlebells/weights, lamps (3 total across house)
• Bathrooms: towels + cabinet/drawer contents (packed), 2 stools
• TV Room / Storage Room: large sofa, TV (boxed), TV stand/console, wine fridge, 2 lamps, weight bench, 2× adjustable 80-lb dumbbells + stand, shredder, vacuums, dehumidifier, subwoofer, lots of packed boxes/misc storage

• Exterior / Patio: small patio set (table + 2 chairs), grill, 2 long planters (~6 ft, empty), 3 small pots, bench, 2 plastic cabinets, shelf system, watering can/bucket, flags/poles, misc exercise items, 4 security cameras (pre-removed)

Back House — Music Studio (client pre-packs small items/gear)
• 2nd upright piano (52") + bench
• 10 large keyboard boxes + 2 small keyboard boxes
• Studio desk (legs removed), rolling rack cabinet on wheels, 2 wall cabinets (to be removed), cabinet(s), multiple storage cabinets, side cabinet
• 2 speaker sets + stands (stands broken down), amplifiers/rack units
• 3 mic stands + misc stands, 2 keyboard stands, whiteboard, office chair, 9x12 rug
• Acoustic panels: ~30 total (10 loose + ~20 wall-mounted, pre-removed) — MUST be protected from crushing
• Toolbox, 2 air filters (boxed), dehumidifier`;

test("parseInventory final summaries match final items and keep outdoor pots", () => {
  const parsed = parseInventory(reproInventoryText);
  const sumDetectedQty = parsed.detectedItems.reduce((sum, item) => sum + item.qty, 0);

  assert.equal(parsed.detectedQtyTotal, sumDetectedQty);
  assert.ok(parsed.detectedItems.some((item) => item.name === "plant" && item.qty === 5));
  assert.ok(!parsed.detectedItems.some((item) => /back house|music studio/i.test(item.name)));
});

test("admin mode normalization keeps estimate identical before edits", () => {
  const rows = normalizeRowsFromText(reproInventoryText).rows;
  const parsed = parseInventory(reproInventoryText);
  const summarized = summarizeNormalizedRows(rows, reproInventoryText);
  const inputs = {
    homeSize: "5",
    moveType: "LD",
    distance: "0",
    packingLevel: "Full",
    accessOrigin: "ground",
    accessDest: "ground",
    inventoryText: reproInventoryText,
    inventoryMode: "raw",
    extraStops: [],
  };

  const rawEstimate = buildEstimate(inputs, undefined, {});
  const normalizedEstimate = buildEstimate({ ...inputs, inventoryMode: "normalized" }, rows, {});

  assert.equal(summarized.detectedQtyTotal, parsed.detectedQtyTotal);
  assert.equal(summarized.totalVol, parsed.totalVol);
  assert.deepEqual(
    {
      detectedQtyTotal: normalizedEstimate.detectedQtyTotal,
      netVolume: normalizedEstimate.netVolume,
      finalVolume: normalizedEstimate.finalVolume,
      trucksFinal: normalizedEstimate.trucksFinal,
      crew: normalizedEstimate.crew,
      confidence: normalizedEstimate.confidence,
      materials: normalizedEstimate.materials,
    },
    {
      detectedQtyTotal: rawEstimate.detectedQtyTotal,
      netVolume: rawEstimate.netVolume,
      finalVolume: rawEstimate.finalVolume,
      trucksFinal: rawEstimate.trucksFinal,
      crew: rawEstimate.crew,
      confidence: rawEstimate.confidence,
      materials: rawEstimate.materials,
    }
  );
});

test("cfExact preserves volume until structural edit", () => {
  const row = {
    id: "row_book_box",
    name: "book box",
    qty: 5,
    cfUnit: 2,
    cfExact: 7.5,
    isSynthetic: true,
    raw: "5 book boxes",
    room: "Dining Room",
    flags: { heavy: false, heavyWeight: false },
  };

  const baseSummary = summarizeNormalizedRows([row], "");
  const heavyToggledSummary = summarizeNormalizedRows([{ ...row, flags: { heavy: true, heavyWeight: false } }], "");
  const editedSummary = summarizeNormalizedRows([{ ...row, cfExact: undefined, isSynthetic: false }], "");

  assert.equal(baseSummary.totalVol, 7.5);
  assert.equal(heavyToggledSummary.totalVol, 7.5);
  assert.equal(editedSummary.totalVol, 10);
  assert.equal(baseSummary.detectedItems[0].isSynthetic, true);
  assert.equal(editedSummary.detectedItems[0].isSynthetic, false);
});
