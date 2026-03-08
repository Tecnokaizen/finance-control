import { describe, expect, it } from "vitest";

import { updateProfileSchema } from "@/lib/validation/profile";

describe("updateProfileSchema", () => {
  it("accepts valid profile payload", () => {
    const parsed = updateProfileSchema.safeParse({
      fullName: "Ada Lovelace",
      locale: "es",
      defaultCurrency: "eur",
      timezone: "Europe/Madrid",
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.defaultCurrency).toBe("EUR");
    }
  });

  it("rejects too short fullName", () => {
    const parsed = updateProfileSchema.safeParse({ fullName: "A" });
    expect(parsed.success).toBe(false);
  });
});
