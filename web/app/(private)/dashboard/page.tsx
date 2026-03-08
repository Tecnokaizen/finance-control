import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getCurrentBusiness } from "@/server/services/businesses/get-current-business";
import { getDashboardSummary } from "@/server/services/dashboard/get-dashboard-summary";

type DashboardPageProps = {
  searchParams?: Promise<{ from?: string; to?: string }>;
};

function getDefaultRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));

  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const params = await searchParams;
  const defaultRange = getDefaultRange();
  const range = {
    from: params?.from ?? defaultRange.from,
    to: params?.to ?? defaultRange.to,
  };

  const userId = await requireAuthUserId();
  const businessId = await requireCurrentBusinessId(userId);
  const [data, business] = await Promise.all([
    getDashboardSummary(businessId, range),
    getCurrentBusiness(userId),
  ]);

  return (
    <PrivateShell>
      <DashboardOverview data={data} currency={business.defaultCurrency} />
    </PrivateShell>
  );
}
