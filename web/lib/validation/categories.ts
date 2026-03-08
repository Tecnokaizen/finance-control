import { z } from "zod";

export const categoryTypeSchema = z.enum(["income", "expense"]);

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers and dashes"),
  type: categoryTypeSchema,
});

export type CategorySchemaInput = z.infer<typeof categorySchema>;
