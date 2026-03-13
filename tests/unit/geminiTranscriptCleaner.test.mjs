import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function withMockedModule(modulePath, exports, fn) {
  const resolved = require.resolve(modulePath);
  const previous = require.cache[resolved];
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  };

  try {
    return await fn();
  } finally {
    if (previous) require.cache[resolved] = previous;
    else delete require.cache[resolved];
  }
}

function loadFreshCleanerModule() {
  const cleanerPath = require.resolve("../../lib/geminiTranscriptCleaner.ts");
  delete require.cache[cleanerPath];
  return require("../../lib/geminiTranscriptCleaner.ts");
}

async function withFetchMock(fetchImpl, fn) {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = fetchImpl;

  try {
    return await fn();
  } finally {
    globalThis.fetch = previousFetch;
  }
}

async function withImmediateTimeout(fn) {
  const previousSetTimeout = globalThis.setTimeout;
  const previousClearTimeout = globalThis.clearTimeout;

  globalThis.setTimeout = ((callback) => {
    callback();
    return 1;
  });
  globalThis.clearTimeout = (() => {});

  try {
    return await fn();
  } finally {
    globalThis.setTimeout = previousSetTimeout;
    globalThis.clearTimeout = previousClearTimeout;
  }
}

test("cleanTranscriptToRoomInventory sends the expected Gemini request payload", async () => {
  let requestUrl = "";
  let requestOptions = null;

  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withFetchMock(async (url, options) => {
      requestUrl = url;
      requestOptions = options;

      return new Response(JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    rooms: [
                      {
                        room_name: " Entry / Hall ",
                        items: ["1 couch  ", " 2 chairs\t"],
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }, async () => {
      const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
      const cleanedInventory = await cleanTranscriptToRoomInventory("Entry / Hall has one couch and two chairs.");

      assert.deepEqual(cleanedInventory, {
        rooms: [
          {
            room_name: "Entry / Hall",
            items: ["1 couch", "2 chairs"],
          },
        ],
      });
      assert.equal(requestUrl, "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent");
      assert.equal(requestOptions.method, "POST");
      assert.equal(requestOptions.cache, "no-store");
      assert.equal(requestOptions.headers["Content-Type"], "application/json");
      assert.equal(requestOptions.headers["x-goog-api-key"], "gemini-key");

      const body = JSON.parse(requestOptions.body);
      assert.equal(body.generationConfig.temperature, 0.1);
      assert.equal(body.generationConfig.responseMimeType, "application/json");
      assert.deepEqual(body.generationConfig.responseJsonSchema, {
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
      });
      assert.match(body.system_instruction.parts[0].text, /room-grouped inventory draft/i);
      assert.match(body.contents[0].parts[0].text, /preserve room and area labels whenever present or clearly implied/i);
      assert.match(body.contents[0].parts[0].text, /Transcript:\nEntry \/ Hall has one couch and two chairs\./);
    });
  });
});

test("cleanTranscriptToInventoryText serializes grouped room inventory for the raw parser flow", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withFetchMock(async () => new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  rooms: [
                    {
                      room_name: "Entry / Hall",
                      items: ["1 console table", "1 mirror"],
                    },
                    {
                      room_name: "Master Bedroom",
                      items: ["1 king bed", "2 nightstands"],
                    },
                  ],
                }),
              },
            ],
          },
        },
      ],
    }), { status: 200 }), async () => {
      const { cleanTranscriptToInventoryText } = loadFreshCleanerModule();
      const cleanedText = await cleanTranscriptToInventoryText("one transcript");

      assert.equal(
        cleanedText,
        "Entry / Hall:\n1 console table\n1 mirror\n\nMaster Bedroom:\n1 king bed\n2 nightstands"
      );
    });
  });
});

test("cleanTranscriptToRoomInventory rejects non-OK Gemini responses", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withFetchMock(async () => new Response("backend exploded", { status: 503 }), async () => {
      const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();

      await assert.rejects(
        () => cleanTranscriptToRoomInventory("one couch"),
        /Gemini transcript cleaner request failed \(503\): backend exploded/
      );
    });
  });
});

test("cleanTranscriptToRoomInventory rejects malformed candidate JSON", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withFetchMock(async () => new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              {
                text: "not valid json",
              },
            ],
          },
        },
      ],
    }), { status: 200 }), async () => {
      const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();

      await assert.rejects(
        () => cleanTranscriptToRoomInventory("one couch"),
        /Gemini transcript cleaner returned malformed JSON/
      );
    });
  });
});

test("cleanTranscriptToRoomInventory rejects missing rooms output", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withFetchMock(async () => new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              {
                text: "{\"unexpected\":\"value\"}",
              },
            ],
          },
        },
      ],
    }), { status: 200 }), async () => {
      const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();

      await assert.rejects(
        () => cleanTranscriptToRoomInventory("one couch"),
        /Gemini transcript cleaner response missing rooms/
      );
    });
  });
});

test("cleanTranscriptToRoomInventory rejects malformed room entries", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withFetchMock(async () => new Response(JSON.stringify({
      candidates: [
        {
          content: {
            parts: [
              {
                text: "{\"rooms\":[{\"room_name\":\"Garage\"}]}",
              },
            ],
          },
        },
      ],
    }), { status: 200 }), async () => {
      const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();

      await assert.rejects(
        () => cleanTranscriptToRoomInventory("one couch"),
        /Gemini transcript cleaner returned malformed room inventory/
      );
    });
  });
});

test("cleanTranscriptToRoomInventory rejects Gemini timeouts", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withImmediateTimeout(async () => {
      await withFetchMock(async (_url, options) => {
        if (options.signal.aborted) {
          const error = new Error("Request aborted");
          error.name = "AbortError";
          throw error;
        }

        return new Promise(() => {});
      }, async () => {
        const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();

        await assert.rejects(
          () => cleanTranscriptToRoomInventory("one couch"),
          /Gemini transcript cleaner timed out/
        );
      });
    });
  });
});
