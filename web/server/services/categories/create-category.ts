import { categorySchema } from "@/lib/validation/categories";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoriesRepository } from "@/server/repositories/categories.repository";

export async function createCategory(businessId: string, formData: FormData) {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: "Please review category fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const repository = new CategoriesRepository(supabase);

  await repository.create(businessId, parsed.data);

  return {
    success: true as const,
    message: "Category created.",
  };
}
