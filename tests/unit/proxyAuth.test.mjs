import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");

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

function loadFreshProxyModule() {
  const proxyPath = require.resolve("../../proxy.ts");
  delete require.cache[proxyPath];
  return require("../../proxy.ts");
}

function makeStaleRefreshError() {
  return {
    __isAuthError: true,
    code: "refresh_token_not_found",
    message: "Invalid Refresh Token: Refresh Token Not Found",
  };
}

function getSetCookies(response) {
  return [...response.headers.entries()]
    .filter(([key]) => key === "set-cookie")
    .map(([, value]) => value);
}

async function withProxyMocks(createServerClient, fn) {
  await withMockedModule("@supabase/ssr", {
    createServerClient,
  }, async () => {
    await withMockedModule("../../lib/env.ts", {
      getSupabaseEnv: () => ({
        url: "https://example.supabase.co",
        anonKey: "anon-key",
      }),
    }, fn);
  });
}

test("proxy clears stale auth cookies and redirects protected routes to login", async () => {
  await withProxyMocks(() => ({
    auth: {
      getUser: async () => {
        throw makeStaleRefreshError();
      },
    },
  }), async () => {
    const { proxy } = loadFreshProxyModule();
    const request = new NextRequest("http://localhost:3000/dashboard", {
      headers: {
        cookie: "sb-test-auth-token=base; sb-test-auth-token.0=chunk; other-cookie=ok",
      },
    });

    const response = await proxy(request);
    const setCookies = getSetCookies(response);

    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "http://localhost:3000/login");
    assert.deepEqual(
      request.cookies.getAll().map(({ name }) => name),
      ["other-cookie"],
    );
    assert.equal(setCookies.length, 2);
    assert.ok(setCookies.some((value) => value.startsWith("sb-test-auth-token=")));
    assert.ok(setCookies.some((value) => value.startsWith("sb-test-auth-token.0=")));
  });
});

test("proxy clears stale auth cookies on login route without redirect loop", async () => {
  await withProxyMocks(() => ({
    auth: {
      getUser: async () => {
        throw makeStaleRefreshError();
      },
    },
  }), async () => {
    const { proxy } = loadFreshProxyModule();
    const request = new NextRequest("http://localhost:3000/login", {
      headers: {
        cookie: "sb-test-auth-token=base; sb-test-auth-token.0=chunk; other-cookie=ok",
      },
    });

    const response = await proxy(request);
    const setCookies = getSetCookies(response);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    assert.deepEqual(
      request.cookies.getAll().map(({ name }) => name),
      ["other-cookie"],
    );
    assert.equal(setCookies.length, 2);
    assert.ok(setCookies.some((value) => value.startsWith("sb-test-auth-token=")));
    assert.ok(setCookies.some((value) => value.startsWith("sb-test-auth-token.0=")));
  });
});
