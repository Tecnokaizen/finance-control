"use server";

import { revalidatePath } from "next/cache";

import type { CategoriesActionState } from "@/features/categories/types/categories-action-state";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";
import { createCategory } from "@/server/services/categories/create-category";
import { updateCategory } from "@/server/services/categories/update-category";

export async function createCategoryAction(
  _prevState: CategoriesActionState,
  formData: FormData,
): Promise<CategoriesActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await createCategory(businessId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/categories");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not create category."),
    };
  }
}

export async function updateCategoryAction(
  _prevState: CategoriesActionState,
  formData: FormData,
): Promise<CategoriesActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await updateCategory(businessId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/categories");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not update category."),
    };
  }
}
