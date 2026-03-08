import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateThirdPartyInput, ThirdPartyDto, UpdateThirdPartyInput } from "@/types/third-party";

type ThirdPartyRow = {
  id: string;
  business_id: string;
  type: "client" | "supplier" | "both";
  name: string;
  legal_name: string | null;
  email: string | null;
  phone: string | null;
  tax_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function toDto(row: ThirdPartyRow): ThirdPartyDto {
  return {
    id: row.id,
    businessId: row.business_id,
    type: row.type,
    name: row.name,
    legalName: row.legal_name,
    email: row.email,
    phone: row.phone,
    taxId: row.tax_id,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ThirdPartiesRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByBusinessId(businessId: string): Promise<ThirdPartyDto[]> {
    const { data, error } = await this.supabase
      .from("third_parties")
      .select("id,business_id,type,name,legal_name,email,phone,tax_id,is_active,created_at,updated_at")
      .eq("business_id", businessId)
      .order("name", { ascending: true })
      .returns<ThirdPartyRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(toDto);
  }

  async create(businessId: string, input: CreateThirdPartyInput): Promise<ThirdPartyDto> {
    const { data, error } = await this.supabase
      .from("third_parties")
      .insert({
        business_id: businessId,
        type: input.type,
        name: input.name,
        legal_name: input.legalName || null,
        email: input.email || null,
        phone: input.phone || null,
        tax_id: input.taxId || null,
      })
      .select("id,business_id,type,name,legal_name,email,phone,tax_id,is_active,created_at,updated_at")
      .single<ThirdPartyRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }

  async findById(businessId: string, id: string): Promise<ThirdPartyDto | null> {
    const { data, error } = await this.supabase
      .from("third_parties")
      .select("id,business_id,type,name,legal_name,email,phone,tax_id,is_active,created_at,updated_at")
      .eq("business_id", businessId)
      .eq("id", id)
      .maybeSingle<ThirdPartyRow>();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return toDto(data);
  }

  async updateById(businessId: string, id: string, input: UpdateThirdPartyInput): Promise<ThirdPartyDto> {
    const { data, error } = await this.supabase
      .from("third_parties")
      .update({
        type: input.type,
        name: input.name,
        legal_name: input.legalName || null,
        email: input.email || null,
        phone: input.phone || null,
        tax_id: input.taxId || null,
      })
      .eq("id", id)
      .eq("business_id", businessId)
      .select("id,business_id,type,name,legal_name,email,phone,tax_id,is_active,created_at,updated_at")
      .single<ThirdPartyRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }
}
