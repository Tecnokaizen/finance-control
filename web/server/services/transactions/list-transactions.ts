import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TransactionsRepository } from "@/server/repositories/transactions.repository";

export async function listTransactions(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const repository = new TransactionsRepository(supabase);

  return repository.listByBusinessId(businessId);
}
