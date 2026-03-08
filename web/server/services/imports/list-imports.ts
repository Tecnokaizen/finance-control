import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ImportsRepository } from "@/server/repositories/imports.repository";

export async function listImportsWithRows(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const repository = new ImportsRepository(supabase);

  return repository.listWithRowsByBusinessId(businessId);
}
