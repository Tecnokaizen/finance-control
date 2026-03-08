import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getMonthlySummary } from "@/server/services/reports/get-monthly-summary";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function ReportsPage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const userId = await requireAuthUserId();
  const businessId = await requireCurrentBusinessId(userId);
  const series = await getMonthlySummary(businessId);

  return (
    <PrivateShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-2 text-sm text-slate-600">Monthly summary using confirmed transactions only.</p>
        </header>

        <Card>
          <CardHeader title="Monthly Income vs Expense" />
          {series.length === 0 ? <p className="text-sm text-slate-500">No confirmed data yet.</p> : null}
          <div className="space-y-2">
            {series.map((point) => (
              <div key={point.month} className="grid grid-cols-4 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{point.month}</span>
                <span className="text-emerald-700">{formatCurrency(point.income)}</span>
                <span className="text-rose-700">{formatCurrency(point.expense)}</span>
                <span className="text-slate-900">{formatCurrency(point.netProfit)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PrivateShell>
  );
}
