import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateBusinessSchema } from "@/lib/validation/businesses";
import { BusinessesRepository } from "@/server/repositories/businesses.repository";

export async function updateCurrentBusiness(userId: string, input: FormData) {
  const parsed = updateBusinessSchema.safeParse({
    name: input.get("name"),
    legalName: input.get("legalName") || "",
    taxId: input.get("taxId") || "",
    defaultCurrency: input.get("defaultCurrency"),
    country: input.get("country") || "",
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: "Please review business fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const repository = new BusinessesRepository(supabase);

  await repository.updateCurrentByUserId(userId, {
    name: parsed.data.name,
    legalName: parsed.data.legalName || "",
    taxId: parsed.data.taxId || "",
    defaultCurrency: parsed.data.defaultCurrency,
    country: parsed.data.country || "",
  });

  return {
    success: true as const,
    message: "Business updated.",
  };
}
