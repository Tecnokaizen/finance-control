export type ThirdPartyType = "client" | "supplier" | "both";

export type ThirdPartyDto = {
  id: string;
  businessId: string;
  type: ThirdPartyType;
  name: string;
  legalName: string | null;
  email: string | null;
  phone: string | null;
  taxId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateThirdPartyInput = {
  type: ThirdPartyType;
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  taxId?: string;
};

export type UpdateThirdPartyInput = CreateThirdPartyInput;
