import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  type AddFavoritePayload,
} from "../api/favorites.api";
import { useAuth } from "./useAuth";
import { logger } from "../utils/logger";

export function useFavorites() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isAuthenticated,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (payload: AddFavoritePayload) => addFavorite(payload),
    onSuccess: (_, variables) => {
      logger.info(`Producto agregado a favoritos - ID: ${variables.productId}`);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      logger.error("Error agregando a favoritos:", error);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (favoriteId: string) => removeFavorite(favoriteId),
    onSuccess: (_, favoriteId) => {
      logger.info(`Producto eliminado de favoritos - ID: ${favoriteId}`);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      logger.error("Error eliminando de favoritos:", error);
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

export function useIsFavorite(productId: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["favorites", "check", productId],
    queryFn: () => isFavorite(productId),
    enabled: isAuthenticated && !!productId,
  });
}
