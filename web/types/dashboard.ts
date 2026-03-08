export type Money = number;

export type DashboardDateRange = {
  from: string;
  to: string;
};

export type DashboardTransactionItem = {
  id: string;
  date: string;
  description: string;
  type: "income" | "expense";
  amount: Money;
  currency: string;
  categoryName: string;
  status: "confirmed" | "pending";
};

export type ExpenseByCategoryPoint = {
  categoryId: string;
  categoryName: string;
  value: Money;
};

export type IncomeVsExpensePoint = {
  bucket: string;
  income: Money;
  expense: Money;
};

export type DashboardKpis = {
  totalIncome: Money;
  totalExpense: Money;
  netProfit: Money;
  pendingInvoicesCount: number;
  pendingInvoicesAmount: Money;
};

export type DashboardSummaryDto = {
  range: DashboardDateRange;
  kpis: DashboardKpis;
  latestTransactions: DashboardTransactionItem[];
  expenseByCategory: ExpenseByCategoryPoint[];
  incomeVsExpenseSeries: IncomeVsExpensePoint[];
};
