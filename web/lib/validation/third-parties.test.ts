import { describe, expect, it } from "vitest";

import { thirdPartySchema } from "@/lib/validation/third-parties";

describe("thirdPartySchema", () => {
  it("accepts valid third party", () => {
    const parsed = thirdPartySchema.safeParse({
      type: "client",
      name: "Acme Inc",
      email: "finance@acme.com",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const parsed = thirdPartySchema.safeParse({
      type: "supplier",
      name: "Vendor",
      email: "invalid",
    });

    expect(parsed.success).toBe(false);
  });
});
