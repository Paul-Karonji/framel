/**
 * Category related TypeScript types
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  imageURL?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}
