import { z } from "zod";

export const importMappingSchema = z.object({
  transactionDate: z.string().min(1),
  type: z.string().min(1),
  amount: z.string().min(1),
  currency: z.string().min(1),
  description: z.string().min(1),
  categorySlug: z.string().min(1),
});

export type ImportMappingInput = z.infer<typeof importMappingSchema>;
