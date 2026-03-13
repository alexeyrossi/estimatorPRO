import "server-only";

import { getGeminiEnv } from "./env";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_TIMEOUT_MS = 15_000;
const GEMINI_TEMPERATURE = 0.1;

const TRANSCRIPT_CLEANER_SYSTEM_PROMPT = `You are an AI transcript cleaner for a moving estimator.

Your only job is to convert a messy moving-related customer conversation transcript into a clean raw inventory list for an existing downstream inventory parser.

Critical role boundaries:
- You are NOT the inventory parser.
- You are NOT the alias engine.
- You are NOT the canonical item mapper.
- You are NOT the estimator.
- You are NOT the pricing engine.
- You must not replace downstream parsing logic.
- You must not return structured inventory objects.
- You must not interpret business logic beyond cleaning the transcript.

The downstream parser is already highly refined and handles:
- alias recognition
- dirty inventory parsing
- normalization
- item recognition

Your output must be optimized for that parser.

Return JSON only in this exact shape:
{
  "inventory_text": "string"
}

Output requirements:
- inventory_text must contain only clearly confirmed physical inventory items.
- Output one item per line.
- Use compact parser-friendly phrasing.
- Prefer formats like:
  "1 couch"
  "2 nightstands"
  "1 queen bed"
  "1 mattress"
- Keep wording short and literal.
- Preserve useful raw wording when it helps downstream parsing.
- Include quantity only when clearly stated or directly implied.
- If quantity is unclear, omit the item instead of guessing.
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
- headings
- bullets
- markdown
- commentary
- explanations
- notes
- prose
- punctuation noise
- extra JSON fields

Do not:
- invent items
- guess unclear quantities
- infer missing furniture from room context
- infer item types from vague references
- include non-physical services
- calculate trucks
- calculate volume
- calculate labor
- calculate pricing
- calculate packing

Important conservative rule:
If there is any meaningful doubt whether an item is clearly confirmed, leave it out.

Examples:

Transcript:
"Hey, we definitely have one big couch, one queen bed, one mattress, and two nightstands."

Return:
{
  "inventory_text": "1 big couch\\n1 queen bed\\n1 mattress\\n2 nightstands"
}

Transcript:
"We are moving next Friday from Irvine. We have one dining table and four chairs. Maybe there is also a small cabinet in the hallway, not sure."

Return:
{
  "inventory_text": "1 dining table\\n4 chairs"
}

Transcript:
"There are stairs at pickup and we need kitchen packing, but inventory is one couch and one dresser."

Return:
{
  "inventory_text": "1 couch\\n1 dresser"
}

Transcript:
"I think maybe a chair, not sure, and possibly a desk."

Return:
{
  "inventory_text": ""
}

Final goal:
Produce the cleanest possible raw inventory list for a downstream parser, while being conservative and excluding anything uncertain or non-inventory.`;

function buildTranscriptCleanerPrompt(transcript: string) {
  return `Clean this moving-related transcript into a compact raw inventory list for a downstream parser.

Return JSON only in this exact shape:
{
  "inventory_text": "string"
}

Rules:
- include only clearly confirmed physical inventory items
- one item per line
- compact parser-friendly wording
- exclude uncertain items
- exclude logistics, packing, stairs, elevator, long carry, fragile handling, storage, pricing, scheduling, addresses, phone numbers, and unrelated conversation
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

function normalizeInventoryText(inventoryText: string) {
  return inventoryText
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .trim();
}

function parseInventoryText(text: string) {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini transcript cleaner returned malformed JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Gemini transcript cleaner returned malformed JSON.");
  }

  const inventoryText = (parsed as { inventory_text?: unknown }).inventory_text;
  if (typeof inventoryText !== "string") {
    throw new Error("Gemini transcript cleaner response missing inventory_text.");
  }

  return normalizeInventoryText(inventoryText);
}

export async function cleanTranscriptToInventoryText(transcript: string): Promise<string> {
  const { apiKey, model } = getGeminiEnv();
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
      responseJsonSchema: {
        type: "object",
        properties: {
          inventory_text: {
            type: "string",
          },
        },
        required: ["inventory_text"],
      },
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
      throw new Error("Gemini transcript cleaner timed out.");
    }

    throw new Error(`Gemini transcript cleaner failed: ${getErrorMessage(error)}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const suffix = detail ? `: ${detail.slice(0, 200)}` : "";
    throw new Error(`Gemini transcript cleaner request failed (${response.status})${suffix}`);
  }

  let result: unknown;

  try {
    result = await response.json();
  } catch {
    throw new Error("Gemini transcript cleaner returned invalid API JSON.");
  }

  return parseInventoryText(extractGeminiText(result));
}
