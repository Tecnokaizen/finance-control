"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { updateProfileAction } from "@/features/settings/actions/settings.actions";
import {
  INITIAL_SETTINGS_ACTION_STATE,
  type SettingsActionState,
} from "@/features/settings/types/settings-action-state";
import type { ProfileDto } from "@/types/profile";

function getFirstError(state: SettingsActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

type ProfileSettingsFormProps = {
  profile: ProfileDto;
};

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const [state, action, isPending] = useActionState(updateProfileAction, INITIAL_SETTINGS_ACTION_STATE);

  return (
    <Card>
      <CardHeader title="Profile" />
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            defaultValue={profile.fullName ?? ""}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          {getFirstError(state, "fullName") ? (
            <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "fullName")}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="defaultCurrency" className="mb-1 block text-sm font-medium text-slate-700">
              Default currency
            </label>
            <input
              id="defaultCurrency"
              name="defaultCurrency"
              defaultValue={profile.defaultCurrency}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            {getFirstError(state, "defaultCurrency") ? (
              <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "defaultCurrency")}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="locale" className="mb-1 block text-sm font-medium text-slate-700">
              Locale
            </label>
            <input
              id="locale"
              name="locale"
              defaultValue={profile.locale}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
            {getFirstError(state, "locale") ? (
              <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "locale")}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="timezone" className="mb-1 block text-sm font-medium text-slate-700">
            Timezone
          </label>
          <input
            id="timezone"
            name="timezone"
            defaultValue={profile.timezone}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          {getFirstError(state, "timezone") ? (
            <p className="mt-1 text-xs text-rose-600">{getFirstError(state, "timezone")}</p>
          ) : null}
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
          {isPending ? "Saving..." : "Save profile"}
        </button>
      </form>
    </Card>
  );
}
