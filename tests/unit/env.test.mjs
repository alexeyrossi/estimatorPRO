import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadFreshEnvModule() {
  const envPath = require.resolve("../../lib/env.ts");
  delete require.cache[envPath];
  return require("../../lib/env.ts");
}

async function withEnv(overrides, fn) {
  const previousEnv = process.env;
  process.env = { ...previousEnv, ...overrides };

  try {
    return await fn();
  } finally {
    process.env = previousEnv;
  }
}

test("getGeminiEnv returns configured key and custom model", async () => {
  await withEnv({
    GEMINI_API_KEY: "gemini-key",
    GEMINI_MODEL: "gemini-2.5-pro",
  }, async () => {
    const { getGeminiEnv } = loadFreshEnvModule();

    assert.deepEqual(getGeminiEnv(), {
      apiKey: "gemini-key",
      model: "gemini-2.5-pro",
    });
  });
});

test("getGeminiEnv falls back to flash-lite model", async () => {
  await withEnv({
    GEMINI_API_KEY: "gemini-key",
    GEMINI_MODEL: "",
  }, async () => {
    const { getGeminiEnv } = loadFreshEnvModule();

    assert.deepEqual(getGeminiEnv(), {
      apiKey: "gemini-key",
      model: "gemini-2.5-flash-lite",
    });
  });
});

test("getGeminiEnv throws when GEMINI_API_KEY is missing", async () => {
  await withEnv({
    GEMINI_API_KEY: "",
    GEMINI_MODEL: "gemini-2.5-pro",
  }, async () => {
    const { getGeminiEnv } = loadFreshEnvModule();

    assert.throws(() => getGeminiEnv(), /Missing required environment variable: GEMINI_API_KEY/);
  });
});
