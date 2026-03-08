import { createHash } from "node:crypto";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { documentUploadSchema } from "@/lib/validation/documents";
import { DocumentsRepository } from "@/server/repositories/documents.repository";

export async function uploadDocument(businessId: string, userId: string, formData: FormData) {
  const file = formData.get("file");
  const documentType = formData.get("documentType");

  const parsed = documentUploadSchema.safeParse({ documentType });
  if (!parsed.success) {
    return {
      success: false as const,
      message: "Invalid document type.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!(file instanceof File)) {
    return {
      success: false as const,
      message: "PDF file is required.",
    };
  }

  if (file.type !== "application/pdf") {
    return {
      success: false as const,
      message: "Only PDF files are allowed.",
    };
  }

  const bytes = await file.arrayBuffer();
  const hash = createHash("sha1").update(new Uint8Array(bytes)).digest("hex").slice(0, 12);
  const storagePath = `documents/${businessId}/${Date.now()}-${hash}-${file.name}`;

  const supabase = await createSupabaseServerClient();
  const repository = new DocumentsRepository(supabase);

  await repository.create(businessId, userId, {
    fileName: file.name,
    originalFileName: file.name,
    mimeType: file.type,
    fileSize: file.size,
    storagePath,
    documentType: parsed.data.documentType,
  });

  return {
    success: true as const,
    message: "Document uploaded and stored for review.",
  };
}
