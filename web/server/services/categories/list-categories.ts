import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoriesRepository } from "@/server/repositories/categories.repository";

export async function listCategories(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const repository = new CategoriesRepository(supabase);

  return repository.listByBusinessId(businessId);
}
