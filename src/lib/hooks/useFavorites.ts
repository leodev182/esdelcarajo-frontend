import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  type AddFavoritePayload,
} from "../api/favorites.api";
import { getErrorMessage } from "../api/client";
import { useAuth } from "./useAuth";
import { logger } from "../utils/logger";
import { toast } from "sonner";
import axios from "axios";

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
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
        return;
      }
      logger.error("Error agregando a favoritos:", error);
      toast.error(getErrorMessage(error) || "No se pudo agregar a favoritos");
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
      toast.error(getErrorMessage(error) || "No se pudo quitar de favoritos");
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
