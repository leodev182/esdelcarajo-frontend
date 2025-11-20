import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  type ProductFilters,
} from "../api/products.api";
import { CACHE_TIME } from "../utils/constants";

/**
 * Hook para obtener listado de productos con filtros
 */
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: CACHE_TIME.MEDIUM,
  });
}

/**
 * Hook para obtener un producto por ID
 */
export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
    staleTime: CACHE_TIME.LONG,
  });
}

/**
 * Hook para obtener productos destacados
 */
export function useFeaturedProducts(limit: number = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => getFeaturedProducts(limit),
    staleTime: CACHE_TIME.LONG,
  });
}

/**
 * Hook para obtener un producto por slug
 */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", "slug", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: CACHE_TIME.LONG,
  });
}
