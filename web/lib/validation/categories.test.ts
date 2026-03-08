import { describe, expect, it } from "vitest";

import { categorySchema } from "@/lib/validation/categories";

describe("categorySchema", () => {
  it("accepts valid category", () => {
    const parsed = categorySchema.safeParse({
      name: "Software",
      slug: "software-tools",
      type: "expense",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid slug", () => {
    const parsed = categorySchema.safeParse({
      name: "Software",
      slug: "Software Tools",
      type: "expense",
    });

    expect(parsed.success).toBe(false);
  });
});
