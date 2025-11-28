import { apiClient } from "./client";

export interface DashboardStats {
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  users: {
    total: number;
    admins: number;
    superAdmins: number;
    regular: number;
  };
  orders: {
    total: number;
    pendingPayment: number;
    confirmedPayment: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
  };
  sales: {
    total: number;
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>(
    "/admin/dashboard/stats"
  );
  return data;
}
