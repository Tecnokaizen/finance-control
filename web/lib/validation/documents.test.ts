import { describe, expect, it } from "vitest";

import { applyParsedDocumentSchema } from "@/lib/validation/documents";

describe("applyParsedDocumentSchema", () => {
  it("accepts valid payload", () => {
    const parsed = applyParsedDocumentSchema.safeParse({
      targetType: "transaction",
      transactionType: "expense",
      date: "2026-03-08",
      amount: 33.4,
      currency: "eur",
      description: "Parsed",
      invoiceNumber: "",
      categoryId: "",
      thirdPartyId: "",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid amount", () => {
    const parsed = applyParsedDocumentSchema.safeParse({
      targetType: "invoice",
      date: "2026-03-08",
      amount: -1,
      currency: "EUR",
    });

    expect(parsed.success).toBe(false);
  });
});
