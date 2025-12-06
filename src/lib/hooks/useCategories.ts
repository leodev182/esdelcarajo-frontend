import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories.api";
import { apiClient } from "../api/client";
import { CACHE_TIME } from "../utils/constants";
import type { Category } from "../types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: CACHE_TIME.LONG,
  });
}

export function useCategoryWithSubcategories(categorySlug: string) {
  return useQuery({
    queryKey: ["category", categorySlug],
    queryFn: async () => {
      const { data } = await apiClient.get<Category>(
        `/categories/slug/${categorySlug}`
      );
      return data;
    },
    staleTime: CACHE_TIME.LONG,
    enabled: !!categorySlug,
  });
}
