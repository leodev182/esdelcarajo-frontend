import { apiClient } from "./client";

export interface AdminCartItem {
  id: string;
  variantId: string;
  quantity: number;
  expiresAt: string;
  variant: {
    id: string;
    size: string;
    stock: number;
    price: string;
    product: { id: string; name: string; slug: string };
    images: { url: string }[];
  };
}

export interface AdminCartResponse {
  user: { id: string; email: string; name: string | null };
  cart: { id: string; items: AdminCartItem[] } | null;
  itemCount: number;
}

export async function getAdminUserCart(userId: string): Promise<AdminCartResponse> {
  const { data } = await apiClient.get<AdminCartResponse>(`/admin/users/${userId}/cart`);
  return data;
}

export async function removeAdminCartItem(userId: string, itemId: string): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}/cart/items/${itemId}`);
}

export async function clearAdminUserCart(userId: string): Promise<void> {
  await apiClient.delete(`/admin/users/${userId}/cart`);
}
