import { apiClient } from "../api/client";
import type { Category } from "../types";

/**
 * Obtener todas las categorías con subcategorías
 */
export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/categories");
  return data;
}

/**
 * Obtener categoría por ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  const { data } = await apiClient.get<Category>(`/categories/${id}`);
  return data;
}
