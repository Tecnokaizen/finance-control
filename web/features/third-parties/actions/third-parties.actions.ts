"use server";

import { revalidatePath } from "next/cache";

import type { ThirdPartiesActionState } from "@/features/third-parties/types/third-parties-action-state";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";
import { createThirdParty } from "@/server/services/third-parties/create-third-party";
import { updateThirdParty } from "@/server/services/third-parties/update-third-party";

export async function createThirdPartyAction(
  _prevState: ThirdPartiesActionState,
  formData: FormData,
): Promise<ThirdPartiesActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await createThirdParty(businessId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/third-parties");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not create third party."),
    };
  }
}

export async function updateThirdPartyAction(
  _prevState: ThirdPartiesActionState,
  formData: FormData,
): Promise<ThirdPartiesActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await updateThirdParty(businessId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/third-parties");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not update third party."),
    };
  }
}
