import type { DashboardSummaryDto } from "@/types/dashboard";

export const mockDashboardSummary: DashboardSummaryDto = {
  range: {
    from: "2026-03-01",
    to: "2026-03-31",
  },
  kpis: {
    totalIncome: 18450,
    totalExpense: 9230,
    netProfit: 9220,
    pendingInvoicesCount: 3,
    pendingInvoicesAmount: 3670,
  },
  latestTransactions: [
    {
      id: "tx_01",
      date: "2026-03-07",
      description: "Website maintenance retainer",
      type: "income",
      amount: 1500,
      currency: "EUR",
      categoryName: "Services",
      status: "confirmed",
    },
    {
      id: "tx_02",
      date: "2026-03-06",
      description: "Cloud infrastructure",
      type: "expense",
      amount: 420,
      currency: "EUR",
      categoryName: "Infrastructure",
      status: "confirmed",
    },
    {
      id: "tx_03",
      date: "2026-03-05",
      description: "Design subcontractor",
      type: "expense",
      amount: 890,
      currency: "EUR",
      categoryName: "Contractors",
      status: "confirmed",
    },
  ],
  expenseByCategory: [
    { categoryId: "cat_01", categoryName: "Contractors", value: 4320 },
    { categoryId: "cat_02", categoryName: "Infrastructure", value: 2210 },
    { categoryId: "cat_03", categoryName: "Software", value: 1320 },
    { categoryId: "cat_04", categoryName: "Operations", value: 1380 },
  ],
  incomeVsExpenseSeries: [
    { bucket: "Week 1", income: 4300, expense: 2300 },
    { bucket: "Week 2", income: 5120, expense: 2680 },
    { bucket: "Week 3", income: 4760, expense: 2310 },
    { bucket: "Week 4", income: 4270, expense: 1940 },
  ],
};
