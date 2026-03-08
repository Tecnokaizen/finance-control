import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ThirdPartiesRepository } from "@/server/repositories/third-parties.repository";

export async function listThirdParties(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const repository = new ThirdPartiesRepository(supabase);

  return repository.listByBusinessId(businessId);
}
