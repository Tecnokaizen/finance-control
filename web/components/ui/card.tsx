import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ className, children }: CardProps) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
      {children}
    </section>
  );
}

type CardHeaderProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
}>;

export function CardHeader({ title, action, children }: CardHeaderProps) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
      {action}
    </header>
  );
}
