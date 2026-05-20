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

export interface SellerStat {
  admin: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
  totalOrders: number;
  revenue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>(
    "/admin/dashboard/stats"
  );
  return data;
}

export async function getSellerStats(): Promise<SellerStat[]> {
  const { data } = await apiClient.get<SellerStat[]>(
    "/admin/dashboard/seller-stats"
  );
  return data;
}
