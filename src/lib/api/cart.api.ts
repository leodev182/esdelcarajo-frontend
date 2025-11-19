import { apiClient } from "./client";
import type { CartWithTotals } from "../types";

export interface AddToCartPayload {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

/**
 * Obtener carrito del usuario
 */
export async function getCart(): Promise<CartWithTotals> {
  const { data } = await apiClient.get<CartWithTotals>("/cart");
  return data;
}

/**
 * Agregar item al carrito
 */
export async function addToCart(
  payload: AddToCartPayload
): Promise<CartWithTotals> {
  const { data } = await apiClient.post<CartWithTotals>("/cart", payload);
  return data;
}

/**
 * Actualizar cantidad de un item
 */
export async function updateCartItem(
  itemId: string,
  payload: UpdateCartItemPayload
): Promise<CartWithTotals> {
  const { data } = await apiClient.patch<CartWithTotals>(
    `/cart/items/${itemId}`,
    payload
  );
  return data;
}

/**
 * Eliminar item del carrito
 */
export async function removeCartItem(itemId: string): Promise<CartWithTotals> {
  const { data } = await apiClient.delete<CartWithTotals>(
    `/cart/items/${itemId}`
  );
  return data;
}

/**
 * Vaciar carrito completo
 */
export async function clearCart(): Promise<CartWithTotals> {
  const { data } = await apiClient.delete<CartWithTotals>("/cart");
  return data;
}
