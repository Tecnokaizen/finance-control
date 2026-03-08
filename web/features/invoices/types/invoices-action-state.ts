export type InvoicesActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_INVOICES_ACTION_STATE: InvoicesActionState = {
  success: false,
  message: "",
};
