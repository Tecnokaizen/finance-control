export type CategoryType = "income" | "expense";

export type CategoryDto = {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  type: CategoryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  slug: string;
  type: CategoryType;
};

export type UpdateCategoryInput = CreateCategoryInput;
