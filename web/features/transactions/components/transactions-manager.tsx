"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import { createTransactionAction, updateTransactionAction } from "@/features/transactions/actions/transactions.actions";
import {
  INITIAL_TRANSACTIONS_ACTION_STATE,
  type TransactionsActionState,
} from "@/features/transactions/types/transactions-action-state";
import type { CategoryDto } from "@/types/category";
import type { ThirdPartyDto } from "@/types/third-party";
import type { TransactionWithRelationsDto } from "@/types/transaction";

function getFieldError(state: TransactionsActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

type TransactionRowFormProps = {
  transaction: TransactionWithRelationsDto;
  categories: CategoryDto[];
  thirdParties: ThirdPartyDto[];
};

function TransactionRowForm({ transaction, categories, thirdParties }: TransactionRowFormProps) {
  const [state, action, isPending] = useActionState(updateTransactionAction, INITIAL_TRANSACTIONS_ACTION_STATE);
  const filteredCategories = categories.filter((category) => category.type === transaction.type);

  return (
    <form action={action} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <input type="hidden" name="id" value={transaction.id} />
      <div className="grid gap-2 sm:grid-cols-4">
        <select name="type" defaultValue={transaction.type} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="income">income</option>
          <option value="expense">expense</option>
        </select>
        <select name="status" defaultValue={transaction.status} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="draft">draft</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <input
          name="transactionDate"
          type="date"
          defaultValue={transaction.transactionDate}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          defaultValue={transaction.amount}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <input
          name="currency"
          defaultValue={transaction.currency}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        />
        <select
          name="categoryId"
          defaultValue={transaction.categoryId}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        >
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="thirdPartyId"
          defaultValue={transaction.thirdPartyId ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        >
          <option value="">No third party</option>
          {thirdParties.map((thirdParty) => (
            <option key={thirdParty.id} value={thirdParty.id}>
              {thirdParty.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm font-medium hover:bg-slate-100 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Update"}
        </button>
      </div>

      <input
        name="description"
        defaultValue={transaction.description ?? ""}
        placeholder="Description"
        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
      />

      {state.message ? <p className={`text-xs ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p> : null}
    </form>
  );
}

type TransactionsManagerProps = {
  transactions: TransactionWithRelationsDto[];
  categories: CategoryDto[];
  thirdParties: ThirdPartyDto[];
  defaultCurrency: string;
};

export function TransactionsManager({ transactions, categories, thirdParties, defaultCurrency }: TransactionsManagerProps) {
  const [createState, createAction, createPending] = useActionState(
    createTransactionAction,
    INITIAL_TRANSACTIONS_ACTION_STATE,
  );

  const expenseCategories = categories.filter((category) => category.type === "expense");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Create Transaction" />
        <form action={createAction} className="grid gap-3 sm:grid-cols-4">
          <select name="type" defaultValue="expense" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="income">income</option>
            <option value="expense">expense</option>
          </select>
          <select name="status" defaultValue="confirmed" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <input name="transactionDate" type="date" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="currency"
            defaultValue={defaultCurrency}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          />
          <select name="categoryId" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select name="thirdPartyId" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">No third party</option>
            {thirdParties.map((thirdParty) => (
              <option key={thirdParty.id} value={thirdParty.id}>
                {thirdParty.name}
              </option>
            ))}
          </select>
          <input name="description" placeholder="Description" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button
            type="submit"
            disabled={createPending}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {createPending ? "Creating..." : "Create"}
          </button>
        </form>

        {createState.message ? (
          <p className={`mt-3 text-sm ${createState.success ? "text-emerald-700" : "text-rose-700"}`}>{createState.message}</p>
        ) : null}
        {getFieldError(createState, "categoryId") ? (
          <p className="mt-1 text-xs text-rose-600">{getFieldError(createState, "categoryId")}</p>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="Transactions" />
        <div className="space-y-3">
          {transactions.length === 0 ? <p className="text-sm text-slate-500">No transactions yet.</p> : null}
          {transactions.map((transaction) => (
            <TransactionRowForm
              key={transaction.id}
              transaction={transaction}
              categories={categories}
              thirdParties={thirdParties}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
