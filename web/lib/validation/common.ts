import { z } from "zod";

export const currencySchema = z
  .string()
  .trim()
  .length(3, "Currency must have 3 characters")
  .transform((value) => value.toUpperCase());
