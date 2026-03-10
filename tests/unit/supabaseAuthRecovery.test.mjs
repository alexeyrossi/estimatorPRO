import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const {
  getSupabaseAuthCookieNames,
  isRecoverableSupabaseRefreshError,
} = require("../../lib/auth/supabaseAuthRecovery.ts");

test("isRecoverableSupabaseRefreshError only matches stale refresh auth errors", () => {
  assert.equal(
    isRecoverableSupabaseRefreshError({
      __isAuthError: true,
      code: "refresh_token_not_found",
      message: "Invalid Refresh Token: Refresh Token Not Found",
    }),
    true,
  );

  assert.equal(
    isRecoverableSupabaseRefreshError({
      name: "AuthApiError",
      code: "invalid_refresh_token",
      message: "Invalid Refresh Token",
    }),
    true,
  );

  assert.equal(
    isRecoverableSupabaseRefreshError({
      __isAuthError: true,
      message: "Invalid Refresh Token: Refresh Token Not Found",
    }),
    true,
  );

  assert.equal(
    isRecoverableSupabaseRefreshError({
      __isAuthError: true,
      code: "unexpected_failure",
      message: "Invalid Refresh Token: Refresh Token Not Found",
    }),
    false,
  );

  assert.equal(
    isRecoverableSupabaseRefreshError({
      message: "Invalid Refresh Token: Refresh Token Not Found",
    }),
    false,
  );

  assert.equal(isRecoverableSupabaseRefreshError(new Error("boom")), false);
});

test("getSupabaseAuthCookieNames keeps only auth cookies and dedupes chunk names", () => {
  const names = getSupabaseAuthCookieNames(
    [
      { name: "sb-test-auth-token" },
      { name: "sb-test-auth-token.0" },
      { name: "other-cookie" },
    ],
    [
      { name: "sb-test-auth-token" },
      { name: "sb-test-auth-token.1" },
    ],
  ).sort();

  assert.deepEqual(names, [
    "sb-test-auth-token",
    "sb-test-auth-token.0",
    "sb-test-auth-token.1",
  ]);
});
