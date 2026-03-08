import { createSupabaseServerClient } from "@/lib/supabase/server";
import { invoiceSchema } from "@/lib/validation/invoices";
import { CategoriesRepository } from "@/server/repositories/categories.repository";
import { InvoicesRepository } from "@/server/repositories/invoices.repository";
import { ThirdPartiesRepository } from "@/server/repositories/third-parties.repository";

export async function createInvoice(businessId: string, userId: string, formData: FormData) {
  const documentId = formData.get("documentId");
  const importId = formData.get("importId");

  const parsed = invoiceSchema.safeParse({
    type: formData.get("type"),
    status: formData.get("status"),
    invoiceNumber: formData.get("invoiceNumber") || "",
    issueDate: formData.get("issueDate"),
    dueDate: formData.get("dueDate") || "",
    amountTotal: formData.get("amountTotal"),
    currency: formData.get("currency"),
    thirdPartyId: formData.get("thirdPartyId") || "",
    categoryId: formData.get("categoryId") || "",
    notes: formData.get("notes") || "",
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstFieldError = Object.values(fieldErrors).flat()[0];

    return {
      success: false as const,
      message: firstFieldError ? `Please review invoice fields. ${firstFieldError}` : "Please review invoice fields.",
      fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const thirdPartiesRepository = new ThirdPartiesRepository(supabase);
  const categoriesRepository = new CategoriesRepository(supabase);
  const invoicesRepository = new InvoicesRepository(supabase);

  if (parsed.data.thirdPartyId) {
    const thirdParty = await thirdPartiesRepository.findById(businessId, parsed.data.thirdPartyId);
    if (!thirdParty) {
      return {
        success: false as const,
        message: "Third party does not belong to current business.",
      };
    }
  }

  if (parsed.data.categoryId) {
    const category = await categoriesRepository.findById(businessId, parsed.data.categoryId);
    if (!category) {
      return {
        success: false as const,
        message: "Category does not belong to current business.",
      };
    }
  }

  await invoicesRepository.create(businessId, userId, {
    type: parsed.data.type,
    status: parsed.data.status,
    invoiceNumber: parsed.data.invoiceNumber,
    issueDate: parsed.data.issueDate,
    dueDate: parsed.data.dueDate,
    amountTotal: parsed.data.amountTotal,
    currency: parsed.data.currency,
    thirdPartyId: parsed.data.thirdPartyId,
    categoryId: parsed.data.categoryId,
    documentId: typeof documentId === "string" ? documentId : undefined,
    importId: typeof importId === "string" ? importId : undefined,
    notes: parsed.data.notes,
  });

  return {
    success: true as const,
    message: "Invoice created.",
  };
}
