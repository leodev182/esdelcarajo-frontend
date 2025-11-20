import { apiClient } from "../api/client";
import type { Product, PaginatedResponse } from "../types";

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  subcategoryId?: string;
  gender?: "UNISEX" | "MALE" | "FEMALE" | "KIDS";
  size?: string;
  isFeatured?: boolean;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "price" | "name";
  sortOrder?: "asc" | "desc";
}

/**
 * Obtener listado de productos con filtros
 */
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const { data } = await apiClient.get<PaginatedResponse<Product>>(
    "/products",
    {
      params: filters,
    }
  );
  return data;
}

/**
 * Obtener producto por ID
 */
export async function getProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}

/**
 * Obtener productos destacados
 */
export async function getFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  const { data } = await apiClient.get<PaginatedResponse<Product>>(
    "/products",
    {
      params: { isFeatured: true, limit },
    }
  );
  return data.data;
}

/**
 * Obtener producto por slug
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/slug/${slug}`);
  return data;
}
