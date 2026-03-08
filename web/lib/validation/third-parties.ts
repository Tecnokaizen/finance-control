import { z } from "zod";

export const thirdPartyTypeSchema = z.enum(["client", "supplier", "both"]);

export const thirdPartySchema = z.object({
  type: thirdPartyTypeSchema,
  name: z.string().trim().min(2, "Name is required").max(150),
  legalName: z.string().trim().max(150).optional().or(z.literal("")),
  email: z.email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  taxId: z.string().trim().max(50).optional().or(z.literal("")),
});

export type ThirdPartySchemaInput = z.infer<typeof thirdPartySchema>;
