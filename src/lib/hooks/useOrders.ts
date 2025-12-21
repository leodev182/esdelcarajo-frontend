import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  CreateOrderPayload,
  OrderFilters,
  UpdateOrderStatusPayload,
} from "../api/orders.api";
import { uploadPaymentProof } from "../api/upload.api";
import { CACHE_TIME } from "../utils/constants";
import { logger } from "../utils/logger";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: (order) => {
      logger.info(`Orden creada exitosamente - ID: ${order.id}`);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      logger.error("Error creando orden:", error);
    },
  });
}

export function useUserOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => getUserOrders(filters),
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useOrderById(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    staleTime: CACHE_TIME.SHORT,
    enabled: !!orderId,
  });
}

export function useUploadPaymentProof() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, file }: { orderId: string; file: File }) =>
      uploadPaymentProof(orderId, file),
    onSuccess: (_, variables) => {
      logger.info(`Comprobante de pago subido - Orden: ${variables.orderId}`);
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      logger.error("Error subiendo comprobante de pago:", error);
    },
  });
}

// ==================== ADMIN HOOKS ====================

export function useAllOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ["admin", "orders", filters],
    queryFn: () => getAllOrders(filters),
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: UpdateOrderStatusPayload;
    }) => updateOrderStatus(orderId, payload),
    onSuccess: (order, variables) => {
      logger.info(
        `Estado de orden actualizado - ID: ${variables.orderId}, Estado: ${variables.payload.status}`
      );
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      logger.error("Error actualizando estado de orden:", error);
    },
  });
}
