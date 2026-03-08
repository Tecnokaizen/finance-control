export type ImportsActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_IMPORTS_ACTION_STATE: ImportsActionState = {
  success: false,
  message: "",
};
