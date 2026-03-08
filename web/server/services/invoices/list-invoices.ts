import { createSupabaseServerClient } from "@/lib/supabase/server";
import { InvoicesRepository } from "@/server/repositories/invoices.repository";

export async function listInvoices(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const repository = new InvoicesRepository(supabase);

  return repository.listByBusinessId(businessId);
}
