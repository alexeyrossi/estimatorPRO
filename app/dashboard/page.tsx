import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getSessionAccess } from "@/lib/auth/access";

export default async function DashboardPage() {
  const access = await getSessionAccess();
  return <DashboardClient access={access} />;
}
