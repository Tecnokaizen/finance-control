import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { ThirdPartiesManager } from "@/features/third-parties/components/third-parties-manager";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { listThirdParties } from "@/server/services/third-parties/list-third-parties";

export default async function ThirdPartiesPage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const userId = await requireAuthUserId();
  const businessId = await requireCurrentBusinessId(userId);
  const thirdParties = await listThirdParties(businessId);

  return (
    <PrivateShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Third Parties</h1>
          <p className="mt-2 text-sm text-slate-600">Manage clients and suppliers linked to your business.</p>
        </header>
        <ThirdPartiesManager thirdParties={thirdParties} />
      </div>
    </PrivateShell>
  );
}
