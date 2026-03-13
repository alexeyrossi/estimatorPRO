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

test("getGeminiEnv prepends GEMINI_MODEL and preserves fallback defaults", async () => {
  await withEnv({
    GEMINI_API_KEY: "gemini-key",
    GEMINI_MODEL: "gemini-2.5-pro",
  }, async () => {
    const { getGeminiEnv } = loadFreshEnvModule();

    assert.deepEqual(getGeminiEnv(), {
      apiKey: "gemini-key",
      modelChain: [
        "gemini-2.5-pro",
        "gemini-3.1-flash-lite-preview",
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-3-flash",
      ],
    });
  });
});

test("getGeminiEnv prefers GEMINI_MODEL_CHAIN when configured", async () => {
  await withEnv({
    GEMINI_API_KEY: "gemini-key",
    GEMINI_MODEL: "gemini-2.5-pro",
    GEMINI_MODEL_CHAIN: " gemini-3.1-flash-lite-preview , , gemini-2.5-flash-lite , gemini-2.5-flash-lite , gemini-3-flash ",
  }, async () => {
    const { getGeminiEnv } = loadFreshEnvModule();

    assert.deepEqual(getGeminiEnv(), {
      apiKey: "gemini-key",
      modelChain: [
        "gemini-3.1-flash-lite-preview",
        "gemini-2.5-flash-lite",
        "gemini-3-flash",
      ],
    });
  });
});

test("getGeminiEnv falls back to the default Gemini model chain", async () => {
  await withEnv({
    GEMINI_API_KEY: "gemini-key",
    GEMINI_MODEL: "",
    GEMINI_MODEL_CHAIN: "",
  }, async () => {
    const { getGeminiEnv } = loadFreshEnvModule();

    assert.deepEqual(getGeminiEnv(), {
      apiKey: "gemini-key",
      modelChain: [
        "gemini-3.1-flash-lite-preview",
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-3-flash",
      ],
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

test("getSupabaseEnv returns both public Supabase keys", async () => {
  await withEnv({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  }, async () => {
    const { getSupabaseEnv } = loadFreshEnvModule();

    assert.deepEqual(getSupabaseEnv(), {
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });
  });
});

test("getSupabaseEnv throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
  await withEnv({
    NEXT_PUBLIC_SUPABASE_URL: "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  }, async () => {
    const { getSupabaseEnv } = loadFreshEnvModule();

    assert.throws(() => getSupabaseEnv(), /Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL/);
  });
});

test("getSupabaseEnv throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", async () => {
  await withEnv({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "   ",
  }, async () => {
    const { getSupabaseEnv } = loadFreshEnvModule();

    assert.throws(() => getSupabaseEnv(), /Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });
});
