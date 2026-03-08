import type { SupabaseClient } from "@supabase/supabase-js";

import type { CategoryDto, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

type CategoryRow = {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  type: "income" | "expense";
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function toDto(row: CategoryRow): CategoryDto {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    slug: row.slug,
    type: row.type,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class CategoriesRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByBusinessId(businessId: string): Promise<CategoryDto[]> {
    const { data, error } = await this.supabase
      .from("categories")
      .select("id,business_id,name,slug,type,is_active,created_at,updated_at")
      .eq("business_id", businessId)
      .order("name", { ascending: true })
      .returns<CategoryRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(toDto);
  }

  async create(businessId: string, input: CreateCategoryInput): Promise<CategoryDto> {
    const { data, error } = await this.supabase
      .from("categories")
      .insert({
        business_id: businessId,
        name: input.name,
        slug: input.slug,
        type: input.type,
      })
      .select("id,business_id,name,slug,type,is_active,created_at,updated_at")
      .single<CategoryRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }

  async findById(businessId: string, id: string): Promise<CategoryDto | null> {
    const { data, error } = await this.supabase
      .from("categories")
      .select("id,business_id,name,slug,type,is_active,created_at,updated_at")
      .eq("business_id", businessId)
      .eq("id", id)
      .maybeSingle<CategoryRow>();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return toDto(data);
  }

  async updateById(businessId: string, categoryId: string, input: UpdateCategoryInput): Promise<CategoryDto> {
    const { data, error } = await this.supabase
      .from("categories")
      .update({
        name: input.name,
        slug: input.slug,
        type: input.type,
      })
      .eq("id", categoryId)
      .eq("business_id", businessId)
      .select("id,business_id,name,slug,type,is_active,created_at,updated_at")
      .single<CategoryRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }
}
