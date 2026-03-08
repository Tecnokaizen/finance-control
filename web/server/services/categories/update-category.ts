import { categorySchema } from "@/lib/validation/categories";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoriesRepository } from "@/server/repositories/categories.repository";

export async function updateCategory(businessId: string, formData: FormData) {
  const categoryId = formData.get("id");
  if (!categoryId || typeof categoryId !== "string") {
    return {
      success: false as const,
      message: "Category id is required.",
    };
  }

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

  await repository.updateById(businessId, categoryId, parsed.data);

  return {
    success: true as const,
    message: "Category updated.",
  };
}
