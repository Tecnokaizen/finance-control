import type { SupabaseClient } from "@supabase/supabase-js";

import type { BusinessDto, UpdateBusinessInput } from "@/types/business";

type BusinessRow = {
  id: string;
  user_id: string;
  name: string;
  legal_name: string | null;
  tax_id: string | null;
  default_currency: string;
  country: string | null;
  created_at: string;
  updated_at: string;
};

function toBusinessDto(row: BusinessRow): BusinessDto {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    legalName: row.legal_name,
    taxId: row.tax_id,
    defaultCurrency: row.default_currency,
    country: row.country,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BusinessesRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getCurrentByUserId(userId: string): Promise<BusinessDto | null> {
    const { data, error } = await this.supabase
      .from("businesses")
      .select("id,user_id,name,legal_name,tax_id,default_currency,country,created_at,updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle<BusinessRow>();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return toBusinessDto(data);
  }

  async updateCurrentByUserId(userId: string, input: UpdateBusinessInput): Promise<BusinessDto> {
    const current = await this.getCurrentByUserId(userId);

    if (!current) {
      return this.createDefaultForUser(userId, input);
    }

    const { data, error } = await this.supabase
      .from("businesses")
      .update({
        name: input.name,
        legal_name: input.legalName || null,
        tax_id: input.taxId || null,
        default_currency: input.defaultCurrency,
        country: input.country || null,
      })
      .eq("id", current.id)
      .eq("user_id", userId)
      .select("id,user_id,name,legal_name,tax_id,default_currency,country,created_at,updated_at")
      .single<BusinessRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toBusinessDto(data);
  }

  async createDefaultForUser(userId: string, input: UpdateBusinessInput): Promise<BusinessDto> {
    const { data, error } = await this.supabase
      .from("businesses")
      .insert({
        user_id: userId,
        name: input.name,
        legal_name: input.legalName || null,
        tax_id: input.taxId || null,
        default_currency: input.defaultCurrency,
        country: input.country || null,
      })
      .select("id,user_id,name,legal_name,tax_id,default_currency,country,created_at,updated_at")
      .single<BusinessRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toBusinessDto(data);
  }
}
