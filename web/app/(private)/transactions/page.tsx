import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { TransactionsManager } from "@/features/transactions/components/transactions-manager";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getCurrentBusiness } from "@/server/services/businesses/get-current-business";
import { listCategories } from "@/server/services/categories/list-categories";
import { listThirdParties } from "@/server/services/third-parties/list-third-parties";
import { listTransactions } from "@/server/services/transactions/list-transactions";

export default async function TransactionsPage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const userId = await requireAuthUserId();
  const businessId = await requireCurrentBusinessId(userId);

  const [business, categories, thirdParties, transactions] = await Promise.all([
    getCurrentBusiness(userId),
    listCategories(businessId),
    listThirdParties(businessId),
    listTransactions(businessId),
  ]);

  return (
    <PrivateShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="mt-2 text-sm text-slate-600">Manual income and expense records for your current business.</p>
        </header>

        <TransactionsManager
          transactions={transactions}
          categories={categories}
          thirdParties={thirdParties}
          defaultCurrency={business.defaultCurrency}
        />
      </div>
    </PrivateShell>
  );
}
