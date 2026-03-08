import { describe, expect, it } from "vitest";

import { updateBusinessSchema } from "@/lib/validation/businesses";

describe("updateBusinessSchema", () => {
  it("normalizes currency and country", () => {
    const parsed = updateBusinessSchema.safeParse({
      name: "My Studio",
      defaultCurrency: "eur",
      country: "es",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.defaultCurrency).toBe("EUR");
      expect(parsed.data.country).toBe("ES");
    }
  });

  it("requires business name", () => {
    const parsed = updateBusinessSchema.safeParse({
      name: "",
      defaultCurrency: "EUR",
    });

    expect(parsed.success).toBe(false);
  });
});
