import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  type AddToCartPayload,
  type UpdateCartItemPayload,
} from "../api/cart.api";
import { useAuth } from "./useAuth";
import { logger } from "../utils/logger";

export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  const addToCartMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: (data) => {
      logger.info(
        `Producto agregado al carrito - Variant: ${data.items.length} items`
      );
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      logger.error("Error agregando al carrito:", error);
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdateCartItemPayload;
    }) => updateCartItem(itemId, payload),
    onSuccess: (data) => {
      logger.info(
        `Cantidad actualizada en carrito - Total items: ${data.totalItems}`
      );
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      logger.error("Error actualizando cantidad:", error);
    },
  });

  const removeCartItemMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      logger.info("Producto eliminado del carrito");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      logger.error("Error eliminando producto:", error);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      logger.info("Carrito vaciado");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      logger.error("Error vaciando carrito:", error);
    },
  });

  return {
    cart,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeCartItem: removeCartItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
}
