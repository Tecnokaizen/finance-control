import type { AuthActionState } from "@/features/auth/actions/auth.actions";

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {
  success: false,
  message: "",
};
