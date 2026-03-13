import { pathToFileURL } from "node:url";

const REQUIRED_SUPABASE_PUBLIC_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

export function isVercelBuildContext(env = process.env) {
  const vercelFlag = String(env.VERCEL ?? "").trim().toLowerCase();
  return vercelFlag === "1" || vercelFlag === "true" || String(env.VERCEL_ENV ?? "").trim().length > 0;
}

export function getMissingSupabasePublicEnv(env = process.env) {
  return REQUIRED_SUPABASE_PUBLIC_ENV.filter((name) => !String(env[name] ?? "").trim());
}

export function verifyDeployEnv(env = process.env) {
  if (!isVercelBuildContext(env)) {
    return {
      ok: true,
      skipped: true,
      missing: [],
    };
  }

  const missing = getMissingSupabasePublicEnv(env);
  if (missing.length === 0) {
    return {
      ok: true,
      skipped: false,
      missing,
    };
  }

  return {
    ok: false,
    skipped: false,
    missing,
    message: `[verify-deploy-env] Missing required Vercel build env: ${missing.join(", ")}.`,
  };
}

const entryUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

if (entryUrl && import.meta.url === entryUrl) {
  const result = verifyDeployEnv();

  if (!result.ok) {
    console.error(result.message);
    console.error("[verify-deploy-env] Add the missing public Supabase env in Vercel Project Settings and redeploy.");
    process.exitCode = 1;
  }
}
