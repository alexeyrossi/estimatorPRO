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

test("cleanTranscriptToInventoryText sends the expected Gemini request payload", async () => {
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
                  text: "{\"inventory_text\":\"1 couch  \\r\\n2 chairs\\t\"}",
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
      const { cleanTranscriptToInventoryText } = loadFreshCleanerModule();
      const cleanedText = await cleanTranscriptToInventoryText("We have one couch and two chairs.");

      assert.equal(cleanedText, "1 couch\n2 chairs");
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
          inventory_text: {
            type: "string",
          },
        },
        required: ["inventory_text"],
      });
      assert.match(body.system_instruction.parts[0].text, /You are an AI transcript cleaner for a moving estimator\./);
      assert.match(body.contents[0].parts[0].text, /Return JSON only in this exact shape:/);
      assert.match(body.contents[0].parts[0].text, /Transcript:\nWe have one couch and two chairs\./);
    });
  });
});

test("cleanTranscriptToInventoryText rejects non-OK Gemini responses", async () => {
  await withMockedModule("../../lib/env.ts", {
    getGeminiEnv: () => ({
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    }),
  }, async () => {
    await withFetchMock(async () => new Response("backend exploded", { status: 503 }), async () => {
      const { cleanTranscriptToInventoryText } = loadFreshCleanerModule();

      await assert.rejects(
        () => cleanTranscriptToInventoryText("one couch"),
        /Gemini transcript cleaner request failed \(503\): backend exploded/
      );
    });
  });
});

test("cleanTranscriptToInventoryText rejects malformed candidate JSON", async () => {
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
      const { cleanTranscriptToInventoryText } = loadFreshCleanerModule();

      await assert.rejects(
        () => cleanTranscriptToInventoryText("one couch"),
        /Gemini transcript cleaner returned malformed JSON/
      );
    });
  });
});

test("cleanTranscriptToInventoryText rejects missing inventory_text output", async () => {
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
      const { cleanTranscriptToInventoryText } = loadFreshCleanerModule();

      await assert.rejects(
        () => cleanTranscriptToInventoryText("one couch"),
        /Gemini transcript cleaner response missing inventory_text/
      );
    });
  });
});

test("cleanTranscriptToInventoryText rejects Gemini timeouts", async () => {
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
        const { cleanTranscriptToInventoryText } = loadFreshCleanerModule();

        await assert.rejects(
          () => cleanTranscriptToInventoryText("one couch"),
          /Gemini transcript cleaner timed out/
        );
      });
    });
  });
});
