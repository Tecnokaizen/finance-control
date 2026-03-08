"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { updateBusinessAction } from "@/features/settings/actions/settings.actions";
import {
  INITIAL_SETTINGS_ACTION_STATE,
  type SettingsActionState,
} from "@/features/settings/types/settings-action-state";
import type { BusinessDto } from "@/types/business";

function getFirstError(state: SettingsActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

type BusinessSettingsFormProps = {
  business: BusinessDto;
};

export function BusinessSettingsForm({ business }: BusinessSettingsFormProps) {
  const [state, action, isPending] = useActionState(updateBusinessAction, INITIAL_SETTINGS_ACTION_STATE);

  return (
    <Card>
      <CardHeader title="Current Business" />
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Business name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={business.name}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          />
          {getFirstError(state, "name") ? <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "name")}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="legalName" className="mb-1 block text-sm font-medium text-slate-700">
              Legal name
            </label>
            <input
              id="legalName"
              name="legalName"
              defaultValue={business.legalName ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            {getFirstError(state, "legalName") ? (
              <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "legalName")}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="taxId" className="mb-1 block text-sm font-medium text-slate-700">
              Tax ID
            </label>
            <input
              id="taxId"
              name="taxId"
              defaultValue={business.taxId ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            {getFirstError(state, "taxId") ? <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "taxId")}</p> : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="defaultCurrency" className="mb-1 block text-sm font-medium text-slate-700">
              Default currency
            </label>
            <input
              id="defaultCurrency"
              name="defaultCurrency"
              defaultValue={business.defaultCurrency}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              required
            />
            {getFirstError(state, "defaultCurrency") ? (
              <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "defaultCurrency")}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-slate-700">
              Country
            </label>
            <input
              id="country"
              name="country"
              defaultValue={business.country ?? ""}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="ES"
            />
            {getFirstError(state, "country") ? <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "country")}</p> : null}
          </div>
        </div>

        {state.message ? (
          <p
            className={`rounded-xl px-3 py-2 text-sm ${
              state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save business"}
        </button>
      </form>
    </Card>
  );
}
