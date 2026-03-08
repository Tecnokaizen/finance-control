import type { PropsWithChildren } from "react";

export function AuthShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_15%,#bfdbfe_0%,#e0f2fe_35%,#f8fafc_70%)] px-4 py-10">
      <main className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        {children}
      </main>
    </div>
  );
}
