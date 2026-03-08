export type ThirdPartiesActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_THIRD_PARTIES_ACTION_STATE: ThirdPartiesActionState = {
  success: false,
  message: "",
};
