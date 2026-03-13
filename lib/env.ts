function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseEnv() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return {
    url,
    anonKey,
  };
}

export function getGeminiEnv() {
  const apiKey = requireEnv("GEMINI_API_KEY");
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";

  return {
    apiKey,
    model,
  };
}
