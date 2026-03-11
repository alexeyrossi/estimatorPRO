import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parseInventory } = require("../../lib/parser.ts");

const inventoryText = `Private Office
Desk / table
Office chair
Filing cabinet
Computer monitor (PBO)
Computer (PBO)

Hallway
EKG machine
Floor scale
Wall painting
Misc loose items

Exam Room 1
Exam table
Medical equipment cart
Cabinet contents (packed)
Wall items

Exam Room 2
Exam table
3 chairs
Plants
Cabinet contents (packed)
Wall items

Work / Utility Room
Shared work table
Small refrigerator
Supplies / room contents

Front Office / Reception
Small refrigerator
Microwave
File cabinets
Shred box / shredder
TV
TV stand
Office misc / drawer contents

Lobby / Waiting Area
7 waiting chairs
Wall decor

Bathroom
Wheelchair`;

test("commercial medical room headers stay as room context and avoid estimated fallback", () => {
  const parsed = parseInventory(inventoryText);

  assert.deepEqual(
    [...new Set(parsed.detectedItems.map((item) => item.room).filter(Boolean))],
    [
      "Private Office",
      "Hallway",
      "Exam Room 1",
      "Exam Room 2",
      "Work / Utility Room",
      "Front Office / Reception",
      "Lobby / Waiting Area",
      "Bathroom",
    ]
  );
  assert.deepEqual(parsed.unrecognized, []);
  assert.ok(parsed.detectedItems.some((item) => item.room === "Exam Room 1" && item.raw === "exam table"));
  assert.ok(parsed.detectedItems.some((item) => item.room === "Front Office / Reception" && item.name === "mini fridge"));
  assert.ok(parsed.detectedItems.some((item) => item.room === "Private Office" && item.name === "file cabinet"));
  assert.ok(parsed.detectedItems.some((item) => item.room === "Bathroom" && item.name === "wheelchair"));
  assert.ok(parsed.detectedItems.some((item) => item.raw === "ekg machine" && item.name === "equipment"));
  assert.ok(parsed.detectedItems.some((item) => item.raw === "wall items" && item.name === "artwork"));
  assert.ok(parsed.detectedItems.some((item) => item.raw === "supplies" && item.name === "medium box"));
  assert.ok(!parsed.detectedItems.some((item) => item.raw === "ekg machine" && /\(est\)$/.test(item.name)));
  assert.ok(!parsed.detectedItems.some((item) => item.raw === "wheelchair" && /\(est\)$/.test(item.name)));
  assert.ok(!parsed.detectedItems.some((item) => item.raw === "wall items" && /\(est\)$/.test(item.name)));
  assert.ok(!parsed.detectedItems.some((item) => item.raw === "small refrigerator" && /\(est\)$/.test(item.name)));
  assert.ok(!parsed.detectedItems.some((item) => item.raw === "filing cabinet" && /\(est\)$/.test(item.name)));
});
