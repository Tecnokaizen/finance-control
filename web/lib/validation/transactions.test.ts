import { describe, expect, it } from "vitest";

import { transactionSchema } from "@/lib/validation/transactions";

describe("transactionSchema", () => {
  it("accepts valid transaction", () => {
    const parsed = transactionSchema.safeParse({
      type: "expense",
      status: "confirmed",
      transactionDate: "2026-03-08",
      amount: 10.5,
      currency: "eur",
      description: "Test",
      categoryId: "2cd8b7d1-f67c-4d69-a3b9-b8f88ff652aa",
      thirdPartyId: "",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid amount", () => {
    const parsed = transactionSchema.safeParse({
      type: "expense",
      status: "confirmed",
      transactionDate: "2026-03-08",
      amount: 0,
      currency: "EUR",
      categoryId: "2cd8b7d1-f67c-4d69-a3b9-b8f88ff652aa",
    });

    expect(parsed.success).toBe(false);
  });
});
