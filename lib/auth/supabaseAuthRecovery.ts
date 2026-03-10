const RECOVERABLE_REFRESH_ERROR_CODES = new Set([
  "refresh_token_not_found",
  "invalid_refresh_token",
]);

export const SUPABASE_AUTH_COOKIE_RE = /^sb-.*-auth-token(?:\.\d+)?$/;

type CookieLike = {
  name: string;
};

function isAuthApiError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const candidate = error as {
    __isAuthError?: unknown;
    name?: unknown;
  };

  return candidate.__isAuthError === true || candidate.name === "AuthApiError";
}

export function isRecoverableSupabaseRefreshError(error: unknown) {
  if (!isAuthApiError(error)) return false;

  const candidate = error as {
    code?: unknown;
    message?: unknown;
  };

  if (typeof candidate.code === "string") {
    return RECOVERABLE_REFRESH_ERROR_CODES.has(candidate.code);
  }

  return typeof candidate.message === "string"
    && candidate.message.startsWith("Invalid Refresh Token");
}

export function getSupabaseAuthCookieNames(...cookieLists: CookieLike[][]) {
  const names = new Set<string>();

  cookieLists.forEach((cookies) => {
    cookies.forEach(({ name }) => {
      if (SUPABASE_AUTH_COOKIE_RE.test(name)) {
        names.add(name);
      }
    });
  });

  return [...names];
}
