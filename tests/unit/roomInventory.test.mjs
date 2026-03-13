import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  buildRoomInventoryGroupsFromRows,
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

test("buildRoomInventoryGroupsFromRows preserves room order, sorts items, and keeps General last", () => {
  const groups = buildRoomInventoryGroupsFromRows([
    {
      id: "row_1",
      name: "lamp",
      qty: 2,
      cfUnit: 5,
      raw: "lamp",
      room: "Living Room",
      flags: { heavy: false, heavyWeight: false },
    },
    {
      id: "row_2",
      name: "box",
      qty: 10,
      cfUnit: 3,
      raw: "box",
      room: "",
      flags: { heavy: false, heavyWeight: false },
    },
    {
      id: "row_3",
      name: "armchair",
      qty: 1,
      cfUnit: 20,
      raw: "armchair",
      room: "Living Room",
      flags: { heavy: false, heavyWeight: false },
    },
    {
      id: "row_4",
      name: "bed",
      qty: 1,
      cfUnit: 40,
      raw: "bed",
      room: "Bedroom",
      flags: { heavy: false, heavyWeight: false },
    },
  ]);

  assert.deepEqual(groups, [
    {
      room_name: "Living Room",
      items: ["1 armchair", "2 lamp"],
    },
    {
      room_name: "Bedroom",
      items: ["1 bed"],
    },
    {
      room_name: "General",
      items: ["10 box"],
    },
  ]);
});

test("buildRoomInventoryGroupsFromRows does not merge duplicate lines", () => {
  const groups = buildRoomInventoryGroupsFromRows([
    {
      id: "row_1",
      name: "chair",
      qty: 1,
      cfUnit: 10,
      raw: "chair",
      room: "Office",
      flags: { heavy: false, heavyWeight: false },
    },
    {
      id: "row_2",
      name: "chair",
      qty: 1,
      cfUnit: 10,
      raw: "chair",
      room: "Office",
      flags: { heavy: false, heavyWeight: false },
    },
  ]);

  assert.deepEqual(groups, [
    {
      room_name: "Office",
      items: ["1 chair", "1 chair"],
    },
  ]);
});
