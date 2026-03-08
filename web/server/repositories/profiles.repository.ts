import type { SupabaseClient } from "@supabase/supabase-js";

import type { ProfileDto, UpdateProfileInput } from "@/types/profile";

type ProfileRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  locale: string | null;
  default_currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
};

function toProfileDto(row: ProfileRow): ProfileDto {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    locale: row.locale ?? "es",
    defaultCurrency: row.default_currency,
    timezone: row.timezone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ProfilesRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getByUserId(userId: string): Promise<ProfileDto | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("id,user_id,full_name,avatar_url,locale,default_currency,timezone,created_at,updated_at")
      .eq("user_id", userId)
      .maybeSingle<ProfileRow>();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return toProfileDto(data);
  }

  async upsertByUserId(userId: string, input: UpdateProfileInput): Promise<ProfileDto> {
    const { data, error } = await this.supabase
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          full_name: input.fullName,
          locale: input.locale,
          default_currency: input.defaultCurrency,
          timezone: input.timezone,
        },
        { onConflict: "user_id" },
      )
      .select("id,user_id,full_name,avatar_url,locale,default_currency,timezone,created_at,updated_at")
      .single<ProfileRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toProfileDto(data);
  }
}
