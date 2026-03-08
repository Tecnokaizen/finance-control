import { redirect } from "next/navigation";

import { PrivateShell } from "@/components/layout/private-shell";
import { DocumentsManager } from "@/features/documents/components/documents-manager";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { listCategories } from "@/server/services/categories/list-categories";
import { listDocuments } from "@/server/services/documents/list-documents";
import { listThirdParties } from "@/server/services/third-parties/list-third-parties";

export default async function DocumentsPage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const userId = await requireAuthUserId();
  const businessId = await requireCurrentBusinessId(userId);

  const [documents, categories, thirdParties] = await Promise.all([
    listDocuments(businessId),
    listCategories(businessId),
    listThirdParties(businessId),
  ]);

  return (
    <PrivateShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Documents (PDF)</h1>
          <p className="mt-2 text-sm text-slate-600">Upload, preview, parse suggestions, review manually, and apply to records.</p>
        </header>
        <DocumentsManager documents={documents} categories={categories} thirdParties={thirdParties} />
      </div>
    </PrivateShell>
  );
}
