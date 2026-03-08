import { z } from "zod";

import { currencySchema } from "@/lib/validation/common";

export const invoiceTypeSchema = z.enum(["issued", "received"]);
export const invoiceStatusSchema = z.enum(["draft", "pending", "paid", "overdue", "cancelled"]);

export const invoiceSchema = z.object({
  type: invoiceTypeSchema,
  status: invoiceStatusSchema,
  invoiceNumber: z.string().trim().max(100).optional().or(z.literal("")),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional()
    .or(z.literal("")),
  amountTotal: z.coerce.number().positive("Amount must be greater than 0").refine((v) => Number.isInteger(v * 100), {
    message: "Amount must use up to 2 decimals",
  }),
  currency: currencySchema,
  thirdPartyId: z.string().uuid("Invalid third party id").optional().or(z.literal("")),
  categoryId: z.string().uuid("Invalid category id").optional().or(z.literal("")),
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.dueDate && data.dueDate < data.issueDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["dueDate"],
      message: "Due date cannot be before issue date",
    });
  }
});

export type InvoiceSchemaInput = z.infer<typeof invoiceSchema>;
