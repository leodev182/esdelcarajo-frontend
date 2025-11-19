import { apiClient } from "./client";
import type {
  Order,
  PaginatedResponse,
  OrderStatus,
  PaymentMethod,
} from "../types";

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  adminNotes?: string;
}

/**
 * Crear una nueva orden desde el carrito
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", payload);
  return data;
}

/**
 * Obtener órdenes del usuario autenticado
 */
export async function getUserOrders(
  filters: OrderFilters = {}
): Promise<PaginatedResponse<Order>> {
  const { data } = await apiClient.get<PaginatedResponse<Order>>("/orders", {
    params: filters,
  });
  return data;
}

/**
 * Obtener detalle de una orden específica
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${orderId}`);
  return data;
}

/**
 * Obtener todas las órdenes (solo ADMIN)
 */
export async function getAllOrders(
  filters: OrderFilters = {}
): Promise<PaginatedResponse<Order>> {
  const { data } = await apiClient.get<PaginatedResponse<Order>>(
    "/orders/all",
    {
      params: filters,
    }
  );
  return data;
}

/**
 * Actualizar estado de una orden (solo ADMIN)
 */
export async function updateOrderStatus(
  orderId: string,
  payload: UpdateOrderStatusPayload
): Promise<Order> {
  const { data } = await apiClient.patch<Order>(
    `/orders/${orderId}/status`,
    payload
  );
  return data;
}
