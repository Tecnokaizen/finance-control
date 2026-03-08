export type DocumentsActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_DOCUMENTS_ACTION_STATE: DocumentsActionState = {
  success: false,
  message: "",
};
