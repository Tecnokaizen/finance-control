export type TransactionsActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_TRANSACTIONS_ACTION_STATE: TransactionsActionState = {
  success: false,
  message: "",
};
