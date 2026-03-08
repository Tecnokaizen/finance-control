"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { createInvoiceAction, updateInvoiceAction } from "@/features/invoices/actions/invoices.actions";
import {
  INITIAL_INVOICES_ACTION_STATE,
  type InvoicesActionState,
} from "@/features/invoices/types/invoices-action-state";
import type { CategoryDto } from "@/types/category";
import type { InvoiceWithRelationsDto } from "@/types/invoice";
import type { ThirdPartyDto } from "@/types/third-party";

function getFieldError(state: InvoicesActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

type InvoiceRowFormProps = {
  invoice: InvoiceWithRelationsDto;
  categories: CategoryDto[];
  thirdParties: ThirdPartyDto[];
};

function InvoiceRowForm({ invoice, categories, thirdParties }: InvoiceRowFormProps) {
  const [state, action, isPending] = useActionState(updateInvoiceAction, INITIAL_INVOICES_ACTION_STATE);

  return (
    <form action={action} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <input type="hidden" name="id" value={invoice.id} />
      <div className="grid gap-2 sm:grid-cols-4">
        <select name="type" defaultValue={invoice.type} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="issued">issued</option>
          <option value="received">received</option>
        </select>
        <select name="status" defaultValue={invoice.status} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="draft">draft</option>
          <option value="pending">pending</option>
          <option value="paid">paid</option>
          <option value="overdue">overdue</option>
          <option value="cancelled">cancelled</option>
        </select>
        <input name="issueDate" type="date" defaultValue={invoice.issueDate} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" />
        <input name="dueDate" type="date" defaultValue={invoice.dueDate ?? ""} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <input name="invoiceNumber" defaultValue={invoice.invoiceNumber ?? ""} placeholder="Invoice #" className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" />
        <input name="amountTotal" type="number" step="0.01" defaultValue={invoice.amountTotal} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" />
        <input name="currency" defaultValue={invoice.currency} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Update"}
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <select name="thirdPartyId" defaultValue={invoice.thirdPartyId ?? ""} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="">No third party</option>
          {thirdParties.map((thirdParty) => (
            <option key={thirdParty.id} value={thirdParty.id}>
              {thirdParty.name}
            </option>
          ))}
        </select>
        <select name="categoryId" defaultValue={invoice.categoryId ?? ""} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input name="notes" defaultValue={invoice.notes ?? ""} placeholder="Notes" className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" />
      </div>

      {state.message ? <p className={`text-xs ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p> : null}
    </form>
  );
}

type InvoicesManagerProps = {
  invoices: InvoiceWithRelationsDto[];
  categories: CategoryDto[];
  thirdParties: ThirdPartyDto[];
  defaultCurrency: string;
};

export function InvoicesManager({ invoices, categories, thirdParties, defaultCurrency }: InvoicesManagerProps) {
  const [createState, createAction, createPending] = useActionState(createInvoiceAction, INITIAL_INVOICES_ACTION_STATE);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Create Invoice" />
        <form action={createAction} className="grid gap-3 sm:grid-cols-4">
          <select name="type" defaultValue="issued" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="issued">issued</option>
            <option value="received">received</option>
          </select>
          <select name="status" defaultValue="pending" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="overdue">overdue</option>
            <option value="cancelled">cancelled</option>
          </select>
          <input name="issueDate" type="date" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <input name="dueDate" type="date" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="invoiceNumber" placeholder="Invoice #" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="amountTotal" type="number" step="0.01" placeholder="Amount" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <input name="currency" defaultValue={defaultCurrency} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <select name="thirdPartyId" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">No third party</option>
            {thirdParties.map((thirdParty) => (
              <option key={thirdParty.id} value={thirdParty.id}>
                {thirdParty.name}
              </option>
            ))}
          </select>
          <select name="categoryId" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input name="notes" placeholder="Notes" className="rounded-xl border border-slate-300 px-3 py-2 text-sm sm:col-span-2" />
          <button
            type="submit"
            disabled={createPending}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2"
          >
            {createPending ? "Creating..." : "Create"}
          </button>
        </form>

        {createState.message ? (
          <p className={`mt-3 text-sm ${createState.success ? "text-emerald-700" : "text-rose-700"}`}>{createState.message}</p>
        ) : null}
        {getFieldError(createState, "amountTotal") ? (
          <p className="mt-1 text-xs text-rose-600">{getFieldError(createState, "amountTotal")}</p>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="Invoices" />
        <div className="space-y-3">
          {invoices.length === 0 ? <p className="text-sm text-slate-500">No invoices yet.</p> : null}
          {invoices.map((invoice) => (
            <InvoiceRowForm key={invoice.id} invoice={invoice} categories={categories} thirdParties={thirdParties} />
          ))}
        </div>
      </Card>
    </div>
  );
}
