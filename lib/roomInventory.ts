import type { NormalizedRow } from "./types/estimator";

export type RoomInventoryGroup = {
  room_name: string;
  items: string[];
};

export type RoomInventoryDraft = {
  rooms: RoomInventoryGroup[];
};

const GENERAL_ROOM_NAME = "General";

function normalizeInlineText(value: string) {
  return value.replace(/\r\n?/g, "\n").split("\n").map((part) => part.trim()).filter(Boolean).join(" ");
}

function compareInventoryLines(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export function normalizeRoomInventoryResponse(payload: unknown): RoomInventoryDraft {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Gemini transcript cleaner returned malformed JSON.");
  }

  const rooms = (payload as { rooms?: unknown }).rooms;
  if (!Array.isArray(rooms)) {
    throw new Error("Gemini transcript cleaner response missing rooms.");
  }

  return {
    rooms: rooms
      .map((room) => {
        if (!room || typeof room !== "object" || Array.isArray(room)) {
          throw new Error("Gemini transcript cleaner returned malformed room inventory.");
        }

        const roomName = (room as { room_name?: unknown }).room_name;
        const items = (room as { items?: unknown }).items;

        if (typeof roomName !== "string" || !Array.isArray(items)) {
          throw new Error("Gemini transcript cleaner returned malformed room inventory.");
        }

        return {
          room_name: normalizeInlineText(roomName) || GENERAL_ROOM_NAME,
          items: items
            .map((item) => (typeof item === "string" ? normalizeInlineText(item) : ""))
            .filter(Boolean),
        };
      })
      .filter((room) => room.items.length > 0),
  };
}

export function serializeRoomInventoryToText(rooms: RoomInventoryGroup[]) {
  return rooms
    .map((room) => {
      const roomName = normalizeInlineText(room.room_name);
      const items = room.items.map((item) => normalizeInlineText(item)).filter(Boolean);

      if (!items.length) return "";
      if (!roomName || roomName === GENERAL_ROOM_NAME) {
        return items.join("\n");
      }

      return `${roomName}:\n${items.join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function buildRoomInventoryGroupsFromRows(rows: NormalizedRow[]) {
  const rooms = new Map<string, string[]>();
  const roomOrder: string[] = [];
  const generalItems: string[] = [];

  rows.forEach((row) => {
    const itemLine = normalizeInlineText(`${row.qty === "" ? 1 : row.qty} ${row.name}`);
    if (!itemLine) return;

    const roomName = normalizeInlineText(row.room || "");
    const isGeneralRoom = !roomName || roomName.localeCompare(GENERAL_ROOM_NAME, undefined, { sensitivity: "base" }) === 0;

    if (isGeneralRoom) {
      generalItems.push(itemLine);
      return;
    }

    if (!rooms.has(roomName)) {
      rooms.set(roomName, []);
      roomOrder.push(roomName);
    }

    rooms.get(roomName)!.push(itemLine);
  });

  const namedRooms = roomOrder.map((roomName) => ({
    room_name: roomName,
    items: [...(rooms.get(roomName) || [])].sort(compareInventoryLines),
  }));

  if (generalItems.length > 0) {
    namedRooms.push({
      room_name: GENERAL_ROOM_NAME,
      items: [...generalItems].sort(compareInventoryLines),
    });
  }

  return namedRooms;
}
