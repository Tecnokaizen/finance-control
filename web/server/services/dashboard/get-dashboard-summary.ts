import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardSummaryDto, DashboardTransactionItem } from "@/types/dashboard";

type TransactionRow = {
  id: string;
  type: "income" | "expense";
  status: "draft" | "pending" | "confirmed" | "cancelled";
  transaction_date: string;
  amount: number;
  currency: string;
  description: string | null;
  category_id: string;
  categories?: { name: string } | null;
};

type InvoiceRow = {
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled";
  amount_total: number;
};

function toBucketKey(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function getDashboardSummary(
  businessId: string,
  range: { from: string; to: string },
): Promise<DashboardSummaryDto> {
  const supabase = await createSupabaseServerClient();

  const [transactionsResult, invoicesResult] = await Promise.all([
    supabase
      .from("transactions")
      .select(
        "id,type,status,transaction_date,amount,currency,description,category_id,categories!transactions_category_id_fkey(name)",
      )
      .eq("business_id", businessId)
      .gte("transaction_date", range.from)
      .lte("transaction_date", range.to)
      .neq("status", "cancelled")
      .returns<TransactionRow[]>(),
    supabase
      .from("invoices")
      .select("status,amount_total")
      .eq("business_id", businessId)
      .in("status", ["pending", "overdue"])
      .returns<InvoiceRow[]>(),
  ]);

  if (transactionsResult.error) {
    throw new Error(transactionsResult.error.message);
  }

  if (invoicesResult.error) {
    throw new Error(invoicesResult.error.message);
  }

  const transactions = transactionsResult.data ?? [];
  const invoices = invoicesResult.data ?? [];

  const confirmedTransactions = transactions.filter((transaction) => transaction.status === "confirmed");

  const totalIncome = confirmedTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalExpense = confirmedTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const netProfit = totalIncome - totalExpense;

  const pendingInvoicesCount = invoices.length;
  const pendingInvoicesAmount = invoices.reduce((sum, invoice) => sum + Number(invoice.amount_total), 0);

  const latestTransactions: DashboardTransactionItem[] = transactions
    .filter((transaction) => transaction.status === "confirmed" || transaction.status === "pending")
    .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date))
    .slice(0, 8)
      .map((transaction) => ({
      id: transaction.id,
      date: transaction.transaction_date,
      description: transaction.description ?? "No description",
      type: transaction.type,
      amount: Number(transaction.amount),
      currency: transaction.currency,
      categoryName: transaction.categories?.name ?? "Uncategorized",
      status: transaction.status === "confirmed" ? "confirmed" : "pending",
    }));

  const expenseByCategoryMap = new Map<string, { categoryName: string; value: number }>();

  for (const transaction of confirmedTransactions.filter((item) => item.type === "expense")) {
    const current = expenseByCategoryMap.get(transaction.category_id) ?? {
      categoryName: transaction.categories?.name ?? "Uncategorized",
      value: 0,
    };

    current.value += Number(transaction.amount);
    expenseByCategoryMap.set(transaction.category_id, current);
  }

  const expenseByCategory = [...expenseByCategoryMap.entries()].map(([categoryId, values]) => ({
    categoryId,
    categoryName: values.categoryName,
    value: values.value,
  }));

  const seriesMap = new Map<string, { income: number; expense: number }>();

  for (const transaction of confirmedTransactions) {
    const bucket = toBucketKey(transaction.transaction_date);
    const current = seriesMap.get(bucket) ?? { income: 0, expense: 0 };

    if (transaction.type === "income") {
      current.income += Number(transaction.amount);
    } else {
      current.expense += Number(transaction.amount);
    }

    seriesMap.set(bucket, current);
  }

  const incomeVsExpenseSeries = [...seriesMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([bucket, values]) => ({
      bucket,
      income: values.income,
      expense: values.expense,
    }));

  return {
    range,
    kpis: {
      totalIncome,
      totalExpense,
      netProfit,
      pendingInvoicesCount,
      pendingInvoicesAmount,
    },
    latestTransactions,
    expenseByCategory,
    incomeVsExpenseSeries,
  };
}
