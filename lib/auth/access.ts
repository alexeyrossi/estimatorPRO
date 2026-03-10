import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { isRecoverableSupabaseRefreshError } from "./supabaseAuthRecovery";
import type { SessionAccess } from "../types/auth";

export async function getSessionAccess(): Promise<SessionAccess> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        isAuthenticated: false,
        userId: null,
      };
    }

    return {
      isAuthenticated: true,
      userId: user.id,
    };
  } catch (error) {
    if (isRecoverableSupabaseRefreshError(error)) {
      return {
        isAuthenticated: false,
        userId: null,
      };
    }

    throw error;
  }
}

export async function requireAuthenticatedPageAccess() {
  const access = await getSessionAccess();
  if (!access.isAuthenticated || !access.userId) {
    redirect("/login");
  }
  return access;
}

export async function requireAuthenticatedAccess() {
  const access = await getSessionAccess();
  if (!access.isAuthenticated || !access.userId) {
    throw new Error("Unauthorized");
  }
  return access;
}
