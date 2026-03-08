import type { PropsWithChildren } from "react";

export function PrivateShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_15%,#dbeafe_0%,#eff6ff_25%,#f8fafc_55%,#ffffff_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
