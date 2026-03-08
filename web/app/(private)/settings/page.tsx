import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { BusinessSettingsForm } from "@/features/settings/components/business-settings-form";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { getCurrentBusiness } from "@/server/services/businesses/get-current-business";
import { getCurrentProfile } from "@/server/services/profile/get-current-profile";

export default async function SettingsPage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const userId = await requireAuthUserId();
  const [profile, business] = await Promise.all([
    getCurrentProfile(userId),
    getCurrentBusiness(userId),
  ]);

  return (
    <PrivateShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-sm text-slate-600">Manage your profile and current business data.</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <ProfileSettingsForm profile={profile} />
          <BusinessSettingsForm business={business} />
        </div>
      </div>
    </PrivateShell>
  );
}
