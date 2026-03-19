import { apiClient } from "./client";

// ==================== TIPOS ====================

export type LogLevel = "INFO" | "WARN" | "ERROR";

export type LogEvent =
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "USER_REGISTERED"
  | "USER_BANNED"
  | "USER_UNBANNED"
  | "USER_ROLE_CHANGED"
  | "ORDER_CREATED"
  | "ORDER_STATUS_UPDATED"
  | "ORDER_CANCELLED"
  | "ORDER_PAYMENT_CONFIRMED"
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_DELETED"
  | "UNHANDLED_EXCEPTION"
  | "CUSTOM_EVENT";

export interface AdminLog {
  id: string;
  level: LogLevel;
  event: LogEvent;
  message: string;
  method?: string;
  url?: string;
  statusCode?: number;
  userId?: string;
  userEmail?: string;
  errorMessage?: string;
  context?: string;
  isPermanent: boolean;
  expiresAt?: string | null;
  createdAt: string;
}

export interface LogsFilters {
  level?: LogLevel;
  event?: LogEvent;
  userId?: string;
  search?: string;
  isPermanent?: boolean;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface LogsResponse {
  data: AdminLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GroupedLog {
  level: LogLevel;
  event: LogEvent;
  url?: string;
  _count: { _all: number };
  lastSeen?: string;
}

// ==================== FUNCIONES ====================

/**
 * Obtener logs con filtros y paginación
 */
export async function getLogs(filters: LogsFilters = {}): Promise<LogsResponse> {
  const { data } = await apiClient.get<LogsResponse>("/logs", {
    params: filters,
  });
  return data;
}

/**
 * Obtener logs agrupados por event/level/url
 */
export async function getGroupedLogs(): Promise<GroupedLog[]> {
  const { data } = await apiClient.get<GroupedLog[]>("/logs/grouped");
  return data;
}

/**
 * Obtener detalle de un log
 */
export async function getLogById(id: string): Promise<AdminLog> {
  const { data } = await apiClient.get<AdminLog>(`/logs/${id}`);
  return data;
}

/**
 * Eliminar un log
 */
export async function deleteLog(id: string): Promise<void> {
  await apiClient.delete(`/logs/${id}`);
}

/**
 * Eliminar múltiples logs (bulk)
 */
export async function deleteLogs(ids: string[]): Promise<{ count: number }> {
  const { data } = await apiClient.delete<{ count: number }>("/logs", {
    data: { ids },
  });
  return data;
}

/**
 * Marcar un log como permanente
 */
export async function markLogAsPermanent(id: string): Promise<AdminLog> {
  const { data } = await apiClient.patch<AdminLog>(`/logs/${id}/permanent`);
  return data;
}

/**
 * Marcar múltiples logs como permanentes (bulk)
 */
export async function markLogsAsPermanent(
  ids: string[]
): Promise<{ count: number }> {
  const { data } = await apiClient.patch<{ count: number }>("/logs/permanent", {
    ids,
  });
  return data;
}
