import "server-only";

import { getGeminiEnv } from "./env";
import {
  normalizeRoomInventoryResponse,
  serializeRoomInventoryToText,
  type RoomInventoryDraft,
} from "./roomInventory";

export type TranscriptCleanerErrorCode =
  | "env_missing"
  | "timeout"
  | "upstream_request"
  | "malformed_response"
  | "unknown";

export class TranscriptCleanerError extends Error {
  readonly code: TranscriptCleanerErrorCode;

  constructor(code: TranscriptCleanerErrorCode, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "TranscriptCleanerError";
    this.code = code;
    if (options && "cause" in options) {
      Object.defineProperty(this, "cause", {
        configurable: true,
        enumerable: false,
        value: options.cause,
        writable: true,
      });
    }
  }
}

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_TIMEOUT_MS = 15_000;
const GEMINI_TEMPERATURE = 0.1;

const TRANSCRIPT_CLEANER_SYSTEM_PROMPT = `You are an AI transcript cleaner for a moving estimator.

Your only job is to convert a messy moving-related customer conversation transcript into a room-grouped inventory draft for an existing downstream inventory parser.

Critical role boundaries:
- You are NOT the inventory parser.
- You are NOT the alias engine.
- You are NOT the canonical item mapper.
- You are NOT the estimator.
- You are NOT the pricing engine.
- You must not replace downstream parsing logic.
- You must not interpret business logic beyond cleaning the transcript.

The downstream parser is already highly refined and handles:
- alias recognition
- dirty inventory parsing
- normalization
- item recognition

Your output must be optimized for that parser while preserving room or area grouping.

Return JSON only in this exact shape:
{
  "rooms": [
    {
      "room_name": "string",
      "items": ["string"]
    }
  ]
}

Output requirements:
- Preserve room or area grouping whenever present or clearly implied.
- If no room or area grouping is present, place all items in a single room named "General".
- Do not flatten everything into one global list.
- Each item string must contain only one clearly confirmed physical inventory item.
- Use compact parser-friendly phrasing.
- Prefer formats like:
  "1 couch"
  "2 nightstands"
  "1 queen bed"
  "1 mattress"
- Keep wording short and literal.
- Preserve useful raw wording when it helps downstream parsing.
- Be conservative about invention, but aggressive about retaining explicitly mentioned items.
- Include quantity when clearly stated or directly implied. If quantity is unclear but the item is clearly present, keep it as quantity 1.
- If an item is clearly present but loosely named, keep the rough label instead of omitting it.
- Do not merge separate mentions unless they are clearly the same item in the same room.
- Do not merge items across rooms.
- If an item is uncertain, tentative, hypothetical, or unconfirmed, omit it.

Strictly exclude:
- greetings
- filler words
- small talk
- jokes
- repeated conversational fluff
- scheduling discussion
- pricing discussion
- addresses
- phone numbers
- email addresses
- customer names
- logistics
- service conditions
- move conditions
- access notes
- packing notes
- elevator notes
- stairs
- long carry
- fragile handling
- storage stops
- shuttle notes
- anything that is not a clearly confirmed physical inventory item

Do not include:
- commentary
- explanations
- notes
- prose
- extra JSON fields

Do not:
- invent items
- guess hidden furniture from room context
- infer missing furniture from room context
- over-normalize item names
- include non-physical services
- calculate trucks
- calculate volume
- calculate labor
- calculate pricing
- calculate packing

Important extraction rules:
- Include all explicitly mentioned physical inventory items.
- If an item is clearly present but roughly named, keep the rough label.
- Preserve duplicate-but-valid items in different rooms as separate room entries.
- Exclude non-inventory chatter and non-item logistics.

Examples:

Transcript:
"Entry / Hall: console table, mirror, large plant. Master Bedroom: king bed, 2 nightstands, dresser, mirror, 2 rocking chairs."

Return:
{
  "rooms": [
    {
      "room_name": "Entry / Hall",
      "items": [
        "1 console table",
        "1 mirror",
        "1 large plant"
      ]
    },
    {
      "room_name": "Master Bedroom",
      "items": [
        "1 king bed",
        "2 nightstands",
        "1 dresser",
        "1 mirror",
        "2 rocking chairs"
      ]
    }
  ]
}

Transcript:
"Kids Room: small bed, dresser, kids furniture item, toy holders (3)."

Return:
{
  "rooms": [
    {
      "room_name": "Kids Room",
      "items": [
        "1 small bed",
        "1 dresser",
        "1 kids furniture item",
        "3 toy holders"
      ]
    }
  ]
}

Transcript:
"Garage: 2 strollers, ~12 folding chairs, 2 large folding tables, TV box, misc garage items."

Return:
{
  "rooms": [
    {
      "room_name": "Garage",
      "items": [
        "2 strollers",
        "12 folding chairs",
        "2 large folding tables",
        "1 TV box",
        "1 misc garage items"
      ]
    }
  ]
}

Final goal:
Produce the cleanest possible room-grouped inventory draft for a downstream parser, with high recall for explicit items and no invented inventory.`;

function buildTranscriptCleanerPrompt(transcript: string) {
  return `Extract a room-grouped moving inventory draft for a downstream parser.

Return JSON only in this exact shape:
{
  "rooms": [
    {
      "room_name": "string",
      "items": ["string"]
    }
  ]
}

Rules:
- preserve room and area labels whenever present or clearly implied
- do not flatten everything into one list
- include all clearly mentioned physical inventory items
- keep rough labels when the item is clearly present but loosely named
- do not merge items across different rooms
- exclude uncertain items, chatter, pricing, scheduling, contact info, logistics, access notes, packing, stairs, elevator, long carry, fragile handling, storage stops, and unrelated conversation
- if no room grouping is present, use one room named "General"
- do not explain

Transcript:
${transcript}`;
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown error";
}

function createTranscriptCleanerError(
  code: TranscriptCleanerErrorCode,
  message: string,
  cause?: unknown
): TranscriptCleanerError {
  return new TranscriptCleanerError(code, message, { cause });
}

export function getTranscriptCleanerErrorCode(error: unknown): TranscriptCleanerErrorCode | null {
  if (error instanceof TranscriptCleanerError) {
    return error.code;
  }

  return null;
}

function extractGeminiText(payload: unknown): string {
  const parts = (payload as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  })?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts) || parts.length === 0) {
    throw new Error("Gemini transcript cleaner response missing candidate content.");
  }

  const text = parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("");

  if (!text) {
    throw new Error("Gemini transcript cleaner response missing text.");
  }

  return text;
}

const ROOM_INVENTORY_JSON_SCHEMA = {
  type: "object",
  properties: {
    rooms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          room_name: {
            type: "string",
          },
          items: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["room_name", "items"],
        additionalProperties: false,
      },
    },
  },
  required: ["rooms"],
  additionalProperties: false,
} as const;

function parseRoomInventory(text: string): RoomInventoryDraft {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini transcript cleaner returned malformed JSON.");
  }

  return normalizeRoomInventoryResponse(parsed);
}

export async function cleanTranscriptToRoomInventory(transcript: string): Promise<RoomInventoryDraft> {
  let apiKey: string;
  let model: string;

  try {
    ({ apiKey, model } = getGeminiEnv());
  } catch (error) {
    throw createTranscriptCleanerError("env_missing", getErrorMessage(error), error);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  const payload = {
    system_instruction: {
      parts: [
        {
          text: TRANSCRIPT_CLEANER_SYSTEM_PROMPT,
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildTranscriptCleanerPrompt(transcript),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: GEMINI_TEMPERATURE,
      responseMimeType: "application/json",
      responseJsonSchema: ROOM_INVENTORY_JSON_SCHEMA,
    },
  };

  let response: Response;

  try {
    response = await fetch(`${GEMINI_API_BASE}/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw createTranscriptCleanerError("timeout", "Gemini transcript cleaner timed out.", error);
    }

    throw createTranscriptCleanerError(
      "unknown",
      `Gemini transcript cleaner failed: ${getErrorMessage(error)}`,
      error
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const suffix = detail ? `: ${detail.slice(0, 200)}` : "";
    throw createTranscriptCleanerError(
      "upstream_request",
      `Gemini transcript cleaner request failed (${response.status})${suffix}`
    );
  }

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw createTranscriptCleanerError(
      "malformed_response",
      "Gemini transcript cleaner returned invalid API JSON."
    );
  }

  try {
    return parseRoomInventory(extractGeminiText(result));
  } catch (error) {
    if (error instanceof TranscriptCleanerError) {
      throw error;
    }

    throw createTranscriptCleanerError("malformed_response", getErrorMessage(error), error);
  }
}

export async function cleanTranscriptToInventoryText(transcript: string): Promise<string> {
  const roomInventory = await cleanTranscriptToRoomInventory(transcript);
  return serializeRoomInventoryToText(roomInventory.rooms);
}
