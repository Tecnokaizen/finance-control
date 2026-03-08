import Link from "next/link";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { logoutAction } from "@/features/auth/actions/auth.actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";

export default async function PrivateLayout({ children }: PropsWithChildren) {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-semibold tracking-wide text-slate-900">
              Finance Control
            </Link>
            <nav className="flex items-center gap-3 text-sm text-slate-600">
              <Link href="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/transactions" className="hover:text-slate-900">
                Transactions
              </Link>
              <Link href="/invoices" className="hover:text-slate-900">
                Invoices
              </Link>
              <Link href="/categories" className="hover:text-slate-900">
                Categories
              </Link>
              <Link href="/third-parties" className="hover:text-slate-900">
                Third Parties
              </Link>
              <Link href="/documents" className="hover:text-slate-900">
                Documents
              </Link>
              <Link href="/imports" className="hover:text-slate-900">
                Imports
              </Link>
              <Link href="/reports" className="hover:text-slate-900">
                Reports
              </Link>
              <Link href="/settings" className="hover:text-slate-900">
                Settings
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
