import { z } from "zod";

import { currencySchema } from "@/lib/validation/common";

export const documentUploadSchema = z.object({
  documentType: z.enum(["invoice_pdf", "receipt_pdf", "statement_pdf", "generic_pdf"]),
});

export const applyParsedDocumentSchema = z.object({
  targetType: z.enum(["transaction", "invoice"]),
  transactionType: z.enum(["income", "expense"]).optional(),
  invoiceType: z.enum(["issued", "received"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.coerce.number().positive().refine((v) => Number.isInteger(v * 100), {
    message: "Amount must use up to 2 decimals",
  }),
  currency: currencySchema,
  description: z.string().trim().max(500).optional().or(z.literal("")),
  invoiceNumber: z.string().trim().max(100).optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  thirdPartyId: z.string().uuid().optional().or(z.literal("")),
});
