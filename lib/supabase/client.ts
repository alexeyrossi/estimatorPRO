import { createBrowserClient } from "@supabase/ssr";

function requireBrowserSupabaseEnvValue(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  // NEXT_PUBLIC_* values must use static property access so Next can inline
  // them into the client bundle during build.
  const value = name === "NEXT_PUBLIC_SUPABASE_URL"
    ? process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getBrowserSupabaseEnv() {
  return {
    url: requireBrowserSupabaseEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireBrowserSupabaseEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function createClient() {
  const { url, anonKey } = getBrowserSupabaseEnv();

  return createBrowserClient(url, anonKey);
}
