import { z } from "zod";

import { currencySchema } from "@/lib/validation/common";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is too short").max(120).optional(),
  locale: z.string().trim().min(2).max(10).optional(),
  defaultCurrency: currencySchema.optional(),
  timezone: z.string().trim().min(2).max(100).optional(),
});

export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>;
