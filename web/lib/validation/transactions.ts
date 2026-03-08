import { z } from "zod";

import { currencySchema } from "@/lib/validation/common";

export const transactionTypeSchema = z.enum(["income", "expense"]);
export const transactionStatusSchema = z.enum(["draft", "pending", "confirmed", "cancelled"]);

export const transactionSchema = z.object({
  type: transactionTypeSchema,
  status: transactionStatusSchema,
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  amount: z.coerce.number().positive("Amount must be greater than 0").refine((v) => Number.isInteger(v * 100), {
    message: "Amount must use up to 2 decimals",
  }),
  currency: currencySchema,
  description: z.string().trim().max(500).optional().or(z.literal("")),
  categoryId: z.string().uuid("Invalid category id"),
  thirdPartyId: z.string().uuid("Invalid third party id").optional().or(z.literal("")),
});

export type TransactionSchemaInput = z.infer<typeof transactionSchema>;
