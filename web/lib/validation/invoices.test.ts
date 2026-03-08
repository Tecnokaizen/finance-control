import { describe, expect, it } from "vitest";

import { invoiceSchema } from "@/lib/validation/invoices";

describe("invoiceSchema", () => {
  it("accepts valid invoice", () => {
    const parsed = invoiceSchema.safeParse({
      type: "issued",
      status: "pending",
      issueDate: "2026-03-08",
      amountTotal: 200,
      currency: "eur",
      thirdPartyId: "",
      categoryId: "",
      notes: "",
      dueDate: "",
      invoiceNumber: "",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid date", () => {
    const parsed = invoiceSchema.safeParse({
      type: "issued",
      status: "pending",
      issueDate: "08-03-2026",
      amountTotal: 200,
      currency: "EUR",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects dueDate earlier than issueDate", () => {
    const parsed = invoiceSchema.safeParse({
      type: "issued",
      status: "pending",
      issueDate: "2026-03-08",
      dueDate: "2026-03-01",
      amountTotal: 200,
      currency: "EUR",
      thirdPartyId: "",
      categoryId: "",
      notes: "",
      invoiceNumber: "",
    });

    expect(parsed.success).toBe(false);
  });
});
