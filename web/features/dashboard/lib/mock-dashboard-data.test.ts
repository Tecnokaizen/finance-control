import { describe, expect, it } from "vitest";

import { mockDashboardSummary } from "./mock-dashboard-data";

describe("mockDashboardSummary", () => {
  it("keeps net profit consistent with income minus expense", () => {
    expect(mockDashboardSummary.kpis.netProfit).toBe(
      mockDashboardSummary.kpis.totalIncome - mockDashboardSummary.kpis.totalExpense,
    );
  });
});
