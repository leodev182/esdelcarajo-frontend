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

/**
 * Hook para manejar el carrito de compras
 */
export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Query para obtener el carrito
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 segundos
  });

  // Mutation para agregar al carrito
  const addToCartMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Mutation para actualizar cantidad
  const updateCartItemMutation = useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: UpdateCartItemPayload;
    }) => updateCartItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Mutation para eliminar item
  const removeCartItemMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Mutation para vaciar carrito
  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
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
