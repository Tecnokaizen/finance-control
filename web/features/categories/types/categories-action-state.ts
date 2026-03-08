export type CategoriesActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_CATEGORIES_ACTION_STATE: CategoriesActionState = {
  success: false,
  message: "",
};
