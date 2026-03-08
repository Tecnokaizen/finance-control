import { createSupabaseServerClient } from "@/lib/supabase/server";
import { transactionSchema } from "@/lib/validation/transactions";
import { CategoriesRepository } from "@/server/repositories/categories.repository";
import { ThirdPartiesRepository } from "@/server/repositories/third-parties.repository";
import { TransactionsRepository } from "@/server/repositories/transactions.repository";

export async function createTransaction(businessId: string, userId: string, formData: FormData) {
  const documentId = formData.get("documentId");
  const importId = formData.get("importId");

  const parsed = transactionSchema.safeParse({
    type: formData.get("type"),
    status: formData.get("status"),
    transactionDate: formData.get("transactionDate"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    description: formData.get("description") || "",
    categoryId: formData.get("categoryId"),
    thirdPartyId: formData.get("thirdPartyId") || "",
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstFieldError = Object.values(fieldErrors).flat()[0];

    return {
      success: false as const,
      message: firstFieldError
        ? `Please review transaction fields. ${firstFieldError}`
        : "Please review transaction fields.",
      fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const categoriesRepository = new CategoriesRepository(supabase);
  const thirdPartiesRepository = new ThirdPartiesRepository(supabase);
  const transactionsRepository = new TransactionsRepository(supabase);

  const category = await categoriesRepository.findById(businessId, parsed.data.categoryId);
  if (!category) {
    return {
      success: false as const,
      message: "Category does not belong to current business.",
    };
  }

  if (category.type !== parsed.data.type) {
    return {
      success: false as const,
      message: "Category type is incompatible with transaction type.",
    };
  }

  if (parsed.data.thirdPartyId) {
    const thirdParty = await thirdPartiesRepository.findById(businessId, parsed.data.thirdPartyId);
    if (!thirdParty) {
      return {
        success: false as const,
        message: "Third party does not belong to current business.",
      };
    }
  }

  await transactionsRepository.create(businessId, userId, {
    type: parsed.data.type,
    status: parsed.data.status,
    transactionDate: parsed.data.transactionDate,
    amount: parsed.data.amount,
    currency: parsed.data.currency,
    description: parsed.data.description,
    categoryId: parsed.data.categoryId,
    thirdPartyId: parsed.data.thirdPartyId,
    documentId: typeof documentId === "string" ? documentId : undefined,
    importId: typeof importId === "string" ? importId : undefined,
  });

  return {
    success: true as const,
    message: "Transaction created.",
  };
}
