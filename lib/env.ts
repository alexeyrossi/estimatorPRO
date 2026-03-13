function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const DEFAULT_GEMINI_MODEL_CHAIN = [
  "gemini-3.1-flash-lite-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash",
] as const;

function uniqueNonEmpty(values: string[]) {
  const seen = new Set<string>();
  const normalizedValues: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    normalizedValues.push(normalized);
  }

  return normalizedValues;
}

function parseGeminiModelChain(value?: string) {
  if (!value) return [];
  return uniqueNonEmpty(value.split(","));
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
  const configuredChain = parseGeminiModelChain(process.env.GEMINI_MODEL_CHAIN);
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const modelChain = configuredChain.length
    ? configuredChain
    : configuredModel
      ? uniqueNonEmpty([configuredModel, ...DEFAULT_GEMINI_MODEL_CHAIN])
      : [...DEFAULT_GEMINI_MODEL_CHAIN];

  return {
    apiKey,
    modelChain,
  };
}
