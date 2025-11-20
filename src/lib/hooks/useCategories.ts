import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categories.api";
import { CACHE_TIME } from "../utils/constants";

/**
 * Hook para obtener todas las categorías
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: CACHE_TIME.LONG,
  });
}
