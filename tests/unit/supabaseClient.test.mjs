import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function withEnv(overrides, fn) {
  const previousEnv = process.env;
  process.env = { ...previousEnv, ...overrides };

  try {
    return await fn();
  } finally {
    process.env = previousEnv;
  }
}

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
    if (previous) {
      require.cache[resolved] = previous;
    } else {
      delete require.cache[resolved];
    }
  }
}

function loadFreshSupabaseClientModule() {
  const modulePath = require.resolve("../../lib/supabase/client.ts");
  delete require.cache[modulePath];
  return require("../../lib/supabase/client.ts");
}

test("getBrowserSupabaseEnv returns both public Supabase keys", async () => {
  await withEnv({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  }, async () => {
    const { getBrowserSupabaseEnv } = loadFreshSupabaseClientModule();

    assert.deepEqual(getBrowserSupabaseEnv(), {
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });
  });
});

test("getBrowserSupabaseEnv throws when NEXT_PUBLIC_SUPABASE_URL is missing", async () => {
  await withEnv({
    NEXT_PUBLIC_SUPABASE_URL: "   ",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  }, async () => {
    const { getBrowserSupabaseEnv } = loadFreshSupabaseClientModule();

    assert.throws(() => getBrowserSupabaseEnv(), /Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL/);
  });
});

test("getBrowserSupabaseEnv throws when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing", async () => {
  await withEnv({
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
  }, async () => {
    const { getBrowserSupabaseEnv } = loadFreshSupabaseClientModule();

    assert.throws(() => getBrowserSupabaseEnv(), /Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });
});

test("createClient passes statically-read public Supabase env to createBrowserClient", async () => {
  const calls = [];

  await withMockedModule("@supabase/ssr", {
    createBrowserClient: (url, anonKey) => {
      calls.push({ url, anonKey });
      return { kind: "browser-client", url, anonKey };
    },
  }, async () => {
    await withEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    }, async () => {
      const { createClient } = loadFreshSupabaseClientModule();

      assert.deepEqual(createClient(), {
        kind: "browser-client",
        url: "https://example.supabase.co",
        anonKey: "anon-key",
      });
      assert.deepEqual(calls, [{
        url: "https://example.supabase.co",
        anonKey: "anon-key",
      }]);
    });
  });
});
