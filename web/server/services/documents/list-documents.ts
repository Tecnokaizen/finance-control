import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DocumentsRepository } from "@/server/repositories/documents.repository";

export async function listDocuments(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const repository = new DocumentsRepository(supabase);

  return repository.listByBusinessId(businessId);
}
