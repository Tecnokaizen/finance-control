import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { ImportsManager } from "@/features/imports/components/imports-manager";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { listImportsWithRows } from "@/server/services/imports/list-imports";

export default async function ImportsPage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const userId = await requireAuthUserId();
  const businessId = await requireCurrentBusinessId(userId);
  const imports = await listImportsWithRows(businessId);

  return (
    <PrivateShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">CSV Imports</h1>
          <p className="mt-2 text-sm text-slate-600">Template, mapping, row validation, preview, and controlled execution.</p>
        </header>
        <ImportsManager imports={imports} />
      </div>
    </PrivateShell>
  );
}
