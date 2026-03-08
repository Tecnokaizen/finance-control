import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BusinessesRepository } from "@/server/repositories/businesses.repository";
import type { BusinessDto } from "@/types/business";

const DEFAULT_CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "EUR";

export async function getCurrentBusiness(userId: string): Promise<BusinessDto> {
  const supabase = await createSupabaseServerClient();
  const repository = new BusinessesRepository(supabase);

  const existing = await repository.getCurrentByUserId(userId);
  if (existing) {
    return existing;
  }

  return repository.createDefaultForUser(userId, {
    name: "My Business",
    defaultCurrency: DEFAULT_CURRENCY,
    legalName: "",
    taxId: "",
    country: "",
  });
}
