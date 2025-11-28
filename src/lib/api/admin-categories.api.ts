import { apiClient } from "./client";
import type { Category, Subcategory } from "../types";

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  order?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateSubcategoryPayload {
  categoryId: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface UpdateSubcategoryPayload {
  categoryId?: string;
  name?: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<Category> {
  const { data } = await apiClient.post<Category>("/categories", payload);
  return data;
}

export async function updateCategory(
  categoryId: string,
  payload: UpdateCategoryPayload
): Promise<Category> {
  const { data } = await apiClient.patch<Category>(
    `/categories/${categoryId}`,
    payload
  );
  return data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await apiClient.delete(`/categories/${categoryId}`);
}

export async function createSubcategory(
  payload: CreateSubcategoryPayload
): Promise<Subcategory> {
  const { data } = await apiClient.post<Subcategory>(
    "/categories/subcategories",
    payload
  );
  return data;
}

export async function updateSubcategory(
  subcategoryId: string,
  payload: UpdateSubcategoryPayload
): Promise<Subcategory> {
  const { data } = await apiClient.patch<Subcategory>(
    `/categories/subcategories/${subcategoryId}`,
    payload
  );
  return data;
}

export async function deleteSubcategory(subcategoryId: string): Promise<void> {
  await apiClient.delete(`/categories/subcategories/${subcategoryId}`);
}
