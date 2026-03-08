export type BusinessDto = {
  id: string;
  userId: string;
  name: string;
  legalName: string | null;
  taxId: string | null;
  defaultCurrency: string;
  country: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateBusinessInput = {
  name: string;
  legalName?: string;
  taxId?: string;
  defaultCurrency: string;
  country?: string;
};
