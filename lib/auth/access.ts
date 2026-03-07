import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { SessionAccess } from "@/lib/types/auth";

export async function getSessionAccess(): Promise<SessionAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthenticated: false,
      canUseAdminMode: false,
      userId: null,
    };
  }

  return {
    isAuthenticated: true,
    canUseAdminMode: true,
    userId: user.id,
  };
}

export async function requireAuthenticatedAccess() {
  const access = await getSessionAccess();
  if (!access.isAuthenticated || !access.userId) {
    throw new Error("Unauthorized");
  }
  return access;
}
