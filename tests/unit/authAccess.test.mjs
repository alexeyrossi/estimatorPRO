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

function loadFreshAccessModule() {
  const accessPath = require.resolve("../../lib/auth/access.ts");
  delete require.cache[accessPath];
  return require("../../lib/auth/access.ts");
}

test("getSessionAccess treats stale refresh token errors as anonymous", async () => {
  await withMockedModule("../../lib/supabase/server.ts", {
    createClient: async () => ({
      auth: {
        getUser: async () => {
          throw {
            __isAuthError: true,
            code: "refresh_token_not_found",
            message: "Invalid Refresh Token: Refresh Token Not Found",
          };
        },
      },
    }),
  }, async () => {
    const { getSessionAccess } = loadFreshAccessModule();

    assert.deepEqual(await getSessionAccess(), {
      isAuthenticated: false,
      userId: null,
    });
  });
});
