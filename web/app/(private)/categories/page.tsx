import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { CategoriesManager } from "@/features/categories/components/categories-manager";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { listCategories } from "@/server/services/categories/list-categories";

export default async function CategoriesPage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const userId = await requireAuthUserId();
  const businessId = await requireCurrentBusinessId(userId);
  const categories = await listCategories(businessId);

  return (
    <PrivateShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="mt-2 text-sm text-slate-600">Manage income and expense categories for your current business.</p>
        </header>
        <CategoriesManager categories={categories} />
      </div>
    </PrivateShell>
  );
}
