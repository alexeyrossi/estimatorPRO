import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

async function loadVerifyDeployEnvModule() {
  const modulePath = path.join(process.cwd(), "scripts", "verify-deploy-env.mjs");
  return import(`${pathToFileURL(modulePath).href}?t=${Date.now()}_${Math.random()}`);
}

test("verifyDeployEnv skips outside Vercel build context", async () => {
  const { verifyDeployEnv } = await loadVerifyDeployEnvModule();

  assert.deepEqual(verifyDeployEnv({}), {
    ok: true,
    skipped: true,
    missing: [],
  });
});

test("verifyDeployEnv fails when Vercel build context is missing public Supabase env", async () => {
  const { verifyDeployEnv } = await loadVerifyDeployEnvModule();
  const result = verifyDeployEnv({
    VERCEL: "1",
    NEXT_PUBLIC_SUPABASE_URL: "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
  });

  assert.equal(result.ok, false);
  assert.equal(result.skipped, false);
  assert.deepEqual(result.missing, [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]);
  assert.match(result.message, /Missing required Vercel build env/);
});

test("verifyDeployEnv passes when Vercel build context has both public Supabase env keys", async () => {
  const { verifyDeployEnv } = await loadVerifyDeployEnvModule();

  assert.deepEqual(verifyDeployEnv({
    VERCEL_ENV: "production",
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  }), {
    ok: true,
    skipped: false,
    missing: [],
  });
});
