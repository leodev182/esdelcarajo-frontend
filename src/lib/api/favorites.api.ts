import { apiClient } from "./client";
import type { Favorite } from "../types";

export interface AddFavoritePayload {
  productId: string;
}

export interface FavoritesResponse {
  total: number;
  favorites: Favorite[];
}

export interface IsFavoriteResponse {
  productId: string;
  isFavorite: boolean;
}

/**
 * Obtener todos los favoritos del usuario
 */
export async function getFavorites(): Promise<FavoritesResponse> {
  const { data } = await apiClient.get<FavoritesResponse>("/favorites");
  return data;
}

/**
 * Agregar producto a favoritos
 */
export async function addFavorite(
  payload: AddFavoritePayload
): Promise<{ message: string; favorite: Favorite }> {
  const { data } = await apiClient.post("/favorites", payload);
  return data;
}

/**
 * Verificar si un producto está en favoritos
 */
export async function isFavorite(
  productId: string
): Promise<IsFavoriteResponse> {
  const { data } = await apiClient.get<IsFavoriteResponse>(
    `/favorites/check/${productId}`
  );
  return data;
}

/**
 * Eliminar producto de favoritos
 */
export async function removeFavorite(
  favoriteId: string
): Promise<{ message: string }> {
  const { data } = await apiClient.delete(`/favorites/${favoriteId}`);
  return data;
}

/**
 * Limpiar todos los favoritos
 */
export async function clearFavorites(): Promise<{
  message: string;
  deleted: number;
}> {
  const { data } = await apiClient.delete("/favorites");
  return data;
}
