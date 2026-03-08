export type SettingsActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_SETTINGS_ACTION_STATE: SettingsActionState = {
  success: false,
  message: "",
};
