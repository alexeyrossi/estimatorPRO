export interface SessionAccess {
  isAuthenticated: boolean;
  canUseAdminMode: boolean;
  userId: string | null;
}
