import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const DEFAULT_MODEL_CHAIN = [
  "gemini-3.1-flash-lite-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash",
];

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

async function withConsoleSpy(fn) {
  const previousInfo = console.info;
  const previousWarn = console.warn;
  const previousError = console.error;
  const logs = {
    info: [],
    warn: [],
    error: [],
  };

  console.info = (...args) => {
    logs.info.push(args);
  };
  console.warn = (...args) => {
    logs.warn.push(args);
  };
  console.error = (...args) => {
    logs.error.push(args);
  };

  try {
    return await fn(logs);
  } finally {
    console.info = previousInfo;
    console.warn = previousWarn;
    console.error = previousError;
  }
}

async function withMockedGeminiEnv(modelChain, fn) {
  return withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      modelChain,
    }),
  }, fn);
}

async function captureError(fn) {
  try {
    await fn();
    assert.fail("Expected promise to reject");
  } catch (error) {
    return error;
  }
}

test("cleanTranscriptToRoomInventory sends the expected Gemini request payload", async () => {
  let requestUrl = "";
  let requestOptions = null;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async (logs) => {
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
        assert.equal(
          requestUrl,
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent"
        );
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
        assert.match(body.contents[0].parts[0].text, /keep each item as one compact parser-friendly line/i);
        assert.match(body.contents[0].parts[0].text, /output valid JSON only/i);
        assert.match(body.contents[0].parts[0].text, /Transcript:\nEntry \/ Hall has one couch and two chairs\./);

        const successLog = logs.info.find(([message]) => message === "Gemini transcript cleaner succeeded");
        assert.ok(successLog);
        assert.equal(successLog[1].requestedModel, "gemini-3.1-flash-lite-preview");
        assert.equal(successLog[1].finalModelUsed, "gemini-3.1-flash-lite-preview");
        assert.equal(successLog[1].responseRoomCount, 1);
        assert.equal(successLog[1].totalExtractedItemCount, 2);
      });
    });
  });
});

test("cleanTranscriptToInventoryText serializes grouped room inventory for the raw parser flow", async () => {
  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async () => {
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
});

test("cleanTranscriptToRoomInventory falls back on HTTP 429 and logs the fallback path", async () => {
  const requestUrls = [];
  let attempt = 0;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async (logs) => {
      await withFetchMock(async (url) => {
        requestUrls.push(url);
        attempt += 1;

        if (attempt === 1) {
          return new Response("rate limit exceeded", { status: 429 });
        }

        return new Response(JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      rooms: [
                        {
                          room_name: "Garage",
                          items: ["2 strollers"],
                        },
                      ],
                    }),
                  },
                ],
              },
            },
          ],
        }), { status: 200 });
      }, async () => {
        const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
        const cleanedInventory = await cleanTranscriptToRoomInventory("Garage has two strollers.");

        assert.deepEqual(cleanedInventory, {
          rooms: [
            {
              room_name: "Garage",
              items: ["2 strollers"],
            },
          ],
        });
        assert.deepEqual(requestUrls, [
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent",
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
        ]);

        const fallbackLog = logs.warn.find(([message]) => message === "Gemini transcript cleaner fallback triggered");
        assert.ok(fallbackLog);
        assert.equal(fallbackLog[1].requestedModel, "gemini-3.1-flash-lite-preview");
        assert.equal(fallbackLog[1].fallbackTriggerReason, "http_429");
        assert.equal(fallbackLog[1].fallbackTargetModel, "gemini-2.5-flash-lite");

        const successLog = logs.info.find(([message]) => message === "Gemini transcript cleaner succeeded");
        assert.ok(successLog);
        assert.equal(successLog[1].requestedModel, "gemini-3.1-flash-lite-preview");
        assert.equal(successLog[1].finalModelUsed, "gemini-2.5-flash-lite");
      });
    });
  });
});

for (const [label, detail, expectedReason] of [
  ["quota", "quota exceeded for this model", "quota"],
  ["resource exhausted", "resource exhausted", "resource_exhausted"],
  ["model unavailable", "model unavailable right now", "model_unavailable"],
]) {
  test(`cleanTranscriptToRoomInventory falls back on ${label} responses`, async () => {
    let attempt = 0;

    await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
      await withConsoleSpy(async (logs) => {
        await withFetchMock(async () => {
          attempt += 1;

          if (attempt === 1) {
            return new Response(detail, { status: 503 });
          }

          return new Response(JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        rooms: [
                          {
                            room_name: "Living Room",
                            items: ["1 sofa"],
                          },
                        ],
                      }),
                    },
                  ],
                },
              },
            ],
          }), { status: 200 });
        }, async () => {
          const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
          const cleanedInventory = await cleanTranscriptToRoomInventory("Living room has a sofa.");

          assert.deepEqual(cleanedInventory, {
            rooms: [
              {
                room_name: "Living Room",
                items: ["1 sofa"],
              },
            ],
          });

          const fallbackLog = logs.warn.find(([message]) => message === "Gemini transcript cleaner fallback triggered");
          assert.ok(fallbackLog);
          assert.equal(fallbackLog[1].fallbackTriggerReason, expectedReason);
          assert.equal(fallbackLog[1].fallbackTargetModel, "gemini-2.5-flash-lite");
        });
      });
    });
  });
}

test("cleanTranscriptToRoomInventory rejects non-retryable Gemini responses without fallback", async () => {
  let requestCount = 0;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async () => {
      await withFetchMock(async () => {
        requestCount += 1;
        return new Response("backend exploded", { status: 503 });
      }, async () => {
        const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
        const error = await captureError(() => cleanTranscriptToRoomInventory("one couch"));

        assert.match(error.message, /Gemini transcript cleaner request failed \(503\): backend exploded/);
        assert.equal(error.code, "upstream_request");
        assert.equal(requestCount, 1);
      });
    });
  });
});

test("cleanTranscriptToRoomInventory rejects malformed candidate JSON without fallback", async () => {
  let requestCount = 0;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async () => {
      await withFetchMock(async () => {
        requestCount += 1;
        return new Response(JSON.stringify({
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
        }), { status: 200 });
      }, async () => {
        const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
        const error = await captureError(() => cleanTranscriptToRoomInventory("one couch"));

        assert.match(error.message, /Gemini transcript cleaner returned malformed JSON/);
        assert.equal(error.code, "malformed_response");
        assert.equal(requestCount, 1);
      });
    });
  });
});

test("cleanTranscriptToRoomInventory rejects missing rooms output without fallback", async () => {
  let requestCount = 0;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async () => {
      await withFetchMock(async () => {
        requestCount += 1;
        return new Response(JSON.stringify({
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
        }), { status: 200 });
      }, async () => {
        const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
        const error = await captureError(() => cleanTranscriptToRoomInventory("one couch"));

        assert.match(error.message, /Gemini transcript cleaner response missing rooms/);
        assert.equal(error.code, "malformed_response");
        assert.equal(requestCount, 1);
      });
    });
  });
});

test("cleanTranscriptToRoomInventory rejects malformed room entries without fallback", async () => {
  let requestCount = 0;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async () => {
      await withFetchMock(async () => {
        requestCount += 1;
        return new Response(JSON.stringify({
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
        }), { status: 200 });
      }, async () => {
        const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
        const error = await captureError(() => cleanTranscriptToRoomInventory("one couch"));

        assert.match(error.message, /Gemini transcript cleaner returned malformed room inventory/);
        assert.equal(error.code, "malformed_response");
        assert.equal(requestCount, 1);
      });
    });
  });
});

test("cleanTranscriptToRoomInventory rejects Gemini timeouts without fallback", async () => {
  let requestCount = 0;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async () => {
      await withImmediateTimeout(async () => {
        await withFetchMock(async (_url, options) => {
          requestCount += 1;

          if (options.signal.aborted) {
            const error = new Error("Request aborted");
            error.name = "AbortError";
            throw error;
          }

          return new Promise(() => {});
        }, async () => {
          const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
          const error = await captureError(() => cleanTranscriptToRoomInventory("one couch"));

          assert.match(error.message, /Gemini transcript cleaner timed out/);
          assert.equal(error.code, "timeout");
          assert.equal(requestCount, 1);
        });
      });
    });
  });
});

test("cleanTranscriptToRoomInventory returns upstream_request after exhausting the retryable model chain", async () => {
  let requestCount = 0;

  await withMockedGeminiEnv(DEFAULT_MODEL_CHAIN, async () => {
    await withConsoleSpy(async (logs) => {
      await withFetchMock(async () => {
        requestCount += 1;
        return new Response("rate limit exceeded", { status: 429 });
      }, async () => {
        const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
        const error = await captureError(() => cleanTranscriptToRoomInventory("one couch"));

        assert.match(error.message, /Gemini transcript cleaner request failed \(429\): rate limit exceeded/);
        assert.equal(error.code, "upstream_request");
        assert.equal(requestCount, DEFAULT_MODEL_CHAIN.length);
        assert.equal(
          logs.warn.filter(([message]) => message === "Gemini transcript cleaner fallback triggered").length,
          DEFAULT_MODEL_CHAIN.length - 1
        );
      });
    });
  });
});

test("cleanTranscriptToRoomInventory classifies missing Gemini env", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => {
      throw new Error("Missing required environment variable: GEMINI_API_KEY");
    },
  }, async () => {
    await withConsoleSpy(async () => {
      const { cleanTranscriptToRoomInventory } = loadFreshCleanerModule();
      const error = await captureError(() => cleanTranscriptToRoomInventory("one couch"));

      assert.match(error.message, /Missing required environment variable: GEMINI_API_KEY/);
      assert.equal(error.code, "env_missing");
    });
  });
});
