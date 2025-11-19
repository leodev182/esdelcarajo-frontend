import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  type AddFavoritePayload,
} from "../api/favorites.api";
import { useAuth } from "./useAuth";

/**
 * Hook para manejar favoritos
 */
export function useFavorites() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Query para obtener favoritos
  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isAuthenticated,
  });

  // Mutation para agregar favorito
  const addFavoriteMutation = useMutation({
    mutationFn: (payload: AddFavoritePayload) => addFavorite(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // Mutation para eliminar favorito
  const removeFavoriteMutation = useMutation({
    mutationFn: (favoriteId: string) => removeFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites: data?.favorites || [],
    totalFavorites: data?.total || 0,
    isLoading,
    error,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isAddingFavorite: addFavoriteMutation.isPending,
  };
}

/**
 * Hook para verificar si un producto está en favoritos
 */
export function useIsFavorite(productId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["favorites", "check", productId],
    queryFn: () => isFavorite(productId),
    enabled: isAuthenticated && !!productId,
  });
}
