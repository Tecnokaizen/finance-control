import { createSupabaseServerClient } from "@/lib/supabase/server";

type Row = {
  transaction_date: string;
  type: "income" | "expense";
  amount: number;
};

export type MonthlySummaryPoint = {
  month: string;
  income: number;
  expense: number;
  netProfit: number;
};

export async function getMonthlySummary(businessId: string): Promise<MonthlySummaryPoint[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("transaction_date,type,amount")
    .eq("business_id", businessId)
    .eq("status", "confirmed")
    .returns<Row[]>();

  if (error) {
    throw new Error(error.message);
  }

  const map = new Map<string, { income: number; expense: number }>();

  for (const row of data ?? []) {
    const month = row.transaction_date.slice(0, 7);
    const current = map.get(month) ?? { income: 0, expense: 0 };

    if (row.type === "income") {
      current.income += Number(row.amount);
    } else {
      current.expense += Number(row.amount);
    }

    map.set(month, current);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
      netProfit: values.income - values.expense,
    }));
}
