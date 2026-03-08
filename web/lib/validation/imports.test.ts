import { describe, expect, it } from "vitest";

import { importMappingSchema } from "@/lib/validation/imports";

describe("importMappingSchema", () => {
  it("accepts valid mapping", () => {
    const parsed = importMappingSchema.safeParse({
      transactionDate: "date",
      type: "type",
      amount: "amount",
      currency: "currency",
      description: "description",
      categorySlug: "category_slug",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects empty mapping", () => {
    const parsed = importMappingSchema.safeParse({
      transactionDate: "",
      type: "",
      amount: "",
      currency: "",
      description: "",
      categorySlug: "",
    });

    expect(parsed.success).toBe(false);
  });
});
