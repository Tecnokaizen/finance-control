"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { createThirdPartyAction, updateThirdPartyAction } from "@/features/third-parties/actions/third-parties.actions";
import {
  INITIAL_THIRD_PARTIES_ACTION_STATE,
  type ThirdPartiesActionState,
} from "@/features/third-parties/types/third-parties-action-state";
import type { ThirdPartyDto } from "@/types/third-party";

function getFieldError(state: ThirdPartiesActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

type ThirdPartyRowFormProps = {
  thirdParty: ThirdPartyDto;
};

function ThirdPartyRowForm({ thirdParty }: ThirdPartyRowFormProps) {
  const [state, action, isPending] = useActionState(updateThirdPartyAction, INITIAL_THIRD_PARTIES_ACTION_STATE);

  return (
    <form action={action} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
      <input type="hidden" name="id" value={thirdParty.id} />
      <input
        name="name"
        defaultValue={thirdParty.name}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      />
      <select
        name="type"
        defaultValue={thirdParty.type}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        <option value="client">Client</option>
        <option value="supplier">Supplier</option>
        <option value="both">Both</option>
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Update"}
      </button>

      <input
        name="legalName"
        defaultValue={thirdParty.legalName ?? ""}
        placeholder="Legal name"
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      />
      <input
        name="email"
        defaultValue={thirdParty.email ?? ""}
        placeholder="Email"
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      />
      <input
        name="taxId"
        defaultValue={thirdParty.taxId ?? ""}
        placeholder="Tax ID"
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      />
      <input
        name="phone"
        defaultValue={thirdParty.phone ?? ""}
        placeholder="Phone"
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm sm:col-span-2"
      />

      {state.message ? (
        <p className={`text-xs sm:col-span-3 ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
      ) : null}
      {getFieldError(state, "name") ? <p className="text-xs text-rose-600 sm:col-span-3">{getFieldError(state, "name")}</p> : null}
      {getFieldError(state, "email") ? <p className="text-xs text-rose-600 sm:col-span-3">{getFieldError(state, "email")}</p> : null}
    </form>
  );
}

type ThirdPartiesManagerProps = {
  thirdParties: ThirdPartyDto[];
};

export function ThirdPartiesManager({ thirdParties }: ThirdPartiesManagerProps) {
  const [createState, createAction, createPending] = useActionState(
    createThirdPartyAction,
    INITIAL_THIRD_PARTIES_ACTION_STATE,
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Create Third Party" />
        <form action={createAction} className="grid gap-3 sm:grid-cols-3">
          <input name="name" placeholder="Name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <select name="type" defaultValue="client" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="client">Client</option>
            <option value="supplier">Supplier</option>
            <option value="both">Both</option>
          </select>
          <input
            name="email"
            placeholder="Email (optional)"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="legalName"
            placeholder="Legal name"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input name="taxId" placeholder="Tax ID" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="phone" placeholder="Phone" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button
            type="submit"
            disabled={createPending}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-3"
          >
            {createPending ? "Creating..." : "Create"}
          </button>
        </form>
        {createState.message ? (
          <p className={`mt-3 text-sm ${createState.success ? "text-emerald-700" : "text-rose-700"}`}>
            {createState.message}
          </p>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="Third Parties" />
        <div className="space-y-3">
          {thirdParties.length === 0 ? <p className="text-sm text-slate-500">No third parties yet.</p> : null}
          {thirdParties.map((thirdParty) => (
            <ThirdPartyRowForm key={thirdParty.id} thirdParty={thirdParty} />
          ))}
        </div>
      </Card>
    </div>
  );
}
