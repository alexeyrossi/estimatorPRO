import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  normalizeRoomInventoryResponse,
  serializeRoomInventoryToText,
} = require("../../lib/roomInventory.ts");
const { normalizeRowsFromText } = require("../../lib/parser.ts");

test("normalizeRoomInventoryResponse trims content and drops empty items and rooms", () => {
  const normalized = normalizeRoomInventoryResponse({
    rooms: [
      {
        room_name: " Entry / Hall ",
        items: ["1 console table  ", "   ", "\t1 mirror"],
      },
      {
        room_name: "   ",
        items: ["1 TV box"],
      },
      {
        room_name: "Garage",
        items: [],
      },
    ],
  });

  assert.deepEqual(normalized, {
    rooms: [
      {
        room_name: "Entry / Hall",
        items: ["1 console table", "1 mirror"],
      },
      {
        room_name: "General",
        items: ["1 TV box"],
      },
    ],
  });
});

test("serializeRoomInventoryToText renders grouped rooms and leaves General as plain lines", () => {
  const serialized = serializeRoomInventoryToText([
    {
      room_name: "Entry / Hall",
      items: ["1 console table", "1 mirror"],
    },
    {
      room_name: "General",
      items: ["1 misc item"],
    },
  ]);

  assert.equal(
    serialized,
    "Entry / Hall:\n1 console table\n1 mirror\n\n1 misc item"
  );
});

test("serializeRoomInventoryToText preserves room context through parser normalization", () => {
  const serialized = serializeRoomInventoryToText([
    {
      room_name: "Entry / Hall",
      items: ["1 mirror", "1 console table"],
    },
    {
      room_name: "Master Bedroom",
      items: ["1 mirror", "2 nightstands"],
    },
  ]);

  const rows = normalizeRowsFromText(serialized).rows;
  const mirrors = rows.filter((row) => row.name === "mirror");

  assert.equal(mirrors.length, 2);
  assert.deepEqual(
    mirrors.map((row) => row.room),
    ["Entry / Hall", "Master Bedroom"]
  );
});

test("serializeRoomInventoryToText keeps rough labels intact at the helper layer", () => {
  const serialized = serializeRoomInventoryToText([
    {
      room_name: "Garage",
      items: ["1 TV box", "1 misc garage items"],
    },
  ]);

  assert.match(serialized, /1 TV box/);
  assert.match(serialized, /1 misc garage items/);
});
