"use server";

import { revalidatePath } from "next/cache";

import { requireAuthUserId } from "@/server/auth/require-auth";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";
import { updateCurrentBusiness } from "@/server/services/businesses/update-current-business";
import { updateProfile } from "@/server/services/profile/update-profile";
import type { SettingsActionState } from "@/features/settings/types/settings-action-state";

export async function updateProfileAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const userId = await requireAuthUserId();
    const result = await updateProfile(userId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/settings");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not update profile."),
    };
  }
}

export async function updateBusinessAction(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  try {
    const userId = await requireAuthUserId();
    const result = await updateCurrentBusiness(userId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/settings");

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not update business."),
    };
  }
}
