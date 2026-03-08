"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import {
  loginAction,
} from "@/features/auth/actions/auth.actions";
import { INITIAL_AUTH_ACTION_STATE } from "@/features/auth/actions/auth.state";

function getFirstError(errors: Record<string, string[]> | undefined, key: string) {
  return errors?.[key]?.[0];
}

export function LoginForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(loginAction, INITIAL_AUTH_ACTION_STATE);

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          placeholder="you@business.com"
          required
        />
        {getFirstError(state.fieldErrors, "email") ? (
          <p className="mt-1 text-xs text-rose-600">{getFirstError(state.fieldErrors, "email")}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          placeholder="********"
          required
        />
        {getFirstError(state.fieldErrors, "password") ? (
          <p className="mt-1 text-xs text-rose-600">{getFirstError(state.fieldErrors, "password")}</p>
        ) : null}
      </div>

      {state.message && !state.success ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{state.message}</p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-600">
        No account yet?{" "}
        <Link href="/register" className="font-medium text-slate-900 underline underline-offset-2">
          Create one
        </Link>
      </p>
    </form>
  );
}
