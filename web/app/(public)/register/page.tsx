import { redirect } from "next/navigation";

import { AuthShell } from "@/components/layout/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";

export default async function RegisterPage() {
  const missingEnv = !hasSupabasePublicEnv();

  if (!missingEnv) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <AuthShell>
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Start controlling your business finances.</p>
      </header>
      {missingEnv ? (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Configure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in
          <code> .env.local</code> to enable authentication.
        </p>
      ) : null}
      <RegisterForm />
    </AuthShell>
  );
}
