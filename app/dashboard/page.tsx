import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { requireAuthenticatedPageAccess } from "@/lib/auth/access";

export default async function DashboardPage() {
  await requireAuthenticatedPageAccess();
  return <DashboardClient />;
}
