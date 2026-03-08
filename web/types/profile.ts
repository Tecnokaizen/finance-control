export type ProfileDto = {
  id: string;
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  locale: string;
  defaultCurrency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  fullName?: string;
  locale?: string;
  defaultCurrency?: string;
  timezone?: string;
};
