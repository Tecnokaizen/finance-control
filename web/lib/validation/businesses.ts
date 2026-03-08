import { z } from "zod";

import { currencySchema } from "@/lib/validation/common";

export const updateBusinessSchema = z.object({
  name: z.string().trim().min(2, "Business name is required").max(150),
  legalName: z.string().trim().max(150).optional().or(z.literal("")),
  taxId: z.string().trim().max(50).optional().or(z.literal("")),
  defaultCurrency: currencySchema,
  country: z
    .string()
    .trim()
    .min(2)
    .max(2)
    .transform((value) => value.toUpperCase())
    .optional()
    .or(z.literal("")),
});

export type UpdateBusinessSchemaInput = z.infer<typeof updateBusinessSchema>;
