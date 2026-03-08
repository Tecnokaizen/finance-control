import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Clock3, Wallet } from "lucide-react";

import { Card, CardHeader } from "@/components/ui/card";
import type { DashboardSummaryDto } from "@/types/dashboard";

type DashboardOverviewProps = {
  data: DashboardSummaryDto;
  currency: string;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function DashboardOverview({ data, currency }: DashboardOverviewProps) {
  const hasNoFinancialData =
    data.latestTransactions.length === 0 &&
    data.expenseByCategory.length === 0 &&
    data.incomeVsExpenseSeries.length === 0;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
        <p className="text-sm font-medium text-slate-500">Finance Control MVP</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Confirmed transaction metrics from {data.range.from} to {data.range.to}.
        </p>
        <p className="mt-1 text-xs text-slate-500">Business currency: {currency}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader title="Total Income" />
          <p className="flex items-center gap-2 text-2xl font-semibold text-emerald-700">
            <ArrowUpRight className="size-5" />
            {formatCurrency(data.kpis.totalIncome, currency)}
          </p>
        </Card>
        <Card>
          <CardHeader title="Total Expense" />
          <p className="flex items-center gap-2 text-2xl font-semibold text-rose-700">
            <ArrowDownRight className="size-5" />
            {formatCurrency(data.kpis.totalExpense, currency)}
          </p>
        </Card>
        <Card>
          <CardHeader title="Net Profit" />
          <p className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Wallet className="size-5" />
            {formatCurrency(data.kpis.netProfit, currency)}
          </p>
        </Card>
        <Card>
          <CardHeader title="Pending Invoices" />
          <p className="flex items-center gap-2 text-2xl font-semibold text-amber-700">
            <Clock3 className="size-5" />
            {data.kpis.pendingInvoicesCount}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Amount: {formatCurrency(data.kpis.pendingInvoicesAmount, currency)}
          </p>
        </Card>
      </section>

      {hasNoFinancialData ? (
        <Card>
          <CardHeader title="No Data Yet" />
          <p className="text-sm text-slate-600">
            Start by creating a transaction or invoice, uploading a PDF, or importing a CSV.
          </p>
          <p className="mt-2 flex flex-wrap gap-3 text-sm">
            <Link href="/transactions" className="text-slate-900 underline underline-offset-2">
              New transaction
            </Link>
            <Link href="/invoices" className="text-slate-900 underline underline-offset-2">
              New invoice
            </Link>
            <Link href="/documents" className="text-slate-900 underline underline-offset-2">
              Upload PDF
            </Link>
            <Link href="/imports" className="text-slate-900 underline underline-offset-2">
              Import CSV
            </Link>
          </p>
        </Card>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Latest Transactions" />
          <ul className="space-y-3">
            {data.latestTransactions.length === 0 ? (
              <li className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                No transactions in this period yet. Create one to populate this block.
              </li>
            ) : (
              data.latestTransactions.map((transaction) => (
                <li key={transaction.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{transaction.description}</p>
                    <p className="text-xs text-slate-500">
                      {transaction.date} · {transaction.categoryName}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatCurrency(transaction.amount, transaction.currency || currency)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Expense By Category" />
          <ul className="space-y-3">
            {data.expenseByCategory.length === 0 ? (
              <li className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                No confirmed expense data in this period.
              </li>
            ) : (
              data.expenseByCategory.map((point) => (
                <li key={point.categoryId} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-700">{point.categoryName}</span>
                  <span className="text-sm font-semibold text-slate-800">{formatCurrency(point.value, currency)}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </section>
    </div>
  );
}
