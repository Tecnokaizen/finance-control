import { createSupabaseServerClient } from "@/lib/supabase/server";
import { thirdPartySchema } from "@/lib/validation/third-parties";
import { ThirdPartiesRepository } from "@/server/repositories/third-parties.repository";

export async function updateThirdParty(businessId: string, formData: FormData) {
  const thirdPartyId = formData.get("id");
  if (!thirdPartyId || typeof thirdPartyId !== "string") {
    return {
      success: false as const,
      message: "Third party id is required.",
    };
  }

  const parsed = thirdPartySchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    legalName: formData.get("legalName") || "",
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    taxId: formData.get("taxId") || "",
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: "Please review third party fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const repository = new ThirdPartiesRepository(supabase);

  await repository.updateById(businessId, thirdPartyId, {
    type: parsed.data.type,
    name: parsed.data.name,
    legalName: parsed.data.legalName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    taxId: parsed.data.taxId,
  });

  return {
    success: true as const,
    message: "Third party updated.",
  };
}
