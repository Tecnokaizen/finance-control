import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email").trim(),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, "Full name must have at least 2 characters").max(120),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
