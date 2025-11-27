import { apiClient } from "./client";
import type { User, Role } from "../types";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orders: number;
    favorites: number;
  };
}

export interface UpdateProfilePayload {
  name?: string;
  nickname?: string;
  phone?: string;
}

export interface UpdateUserRolePayload {
  role: Role;
}

/**
 * Obtener mi perfil
 */
export async function getMyProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
}

/**
 * Actualizar mi perfil
 */
export async function updateMyProfile(
  payload: UpdateProfilePayload
): Promise<{ message: string; user: User }> {
  const { data } = await apiClient.patch("/users/me", payload);
  return data;
}

/**
 * Obtener todos los usuarios (ADMIN)
 */
export async function getAllUsers(): Promise<{
  total: number;
  users: AdminUser[];
}> {
  const { data } = await apiClient.get("/users");
  return data;
}

/**
 * Obtener usuario por ID (ADMIN)
 */
export async function getUserById(userId: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${userId}`);
  return data;
}

/**
 * Cambiar rol de usuario (SUPER_ADMIN)
 */
export async function updateUserRole(
  userId: string,
  role: Role
): Promise<{ message: string; user: User }> {
  const { data } = await apiClient.patch(`/users/${userId}/role`, { role });
  return data;
}

/**
 * Banear/desbanear usuario (SUPER_ADMIN)
 */
export async function toggleUserBan(
  userId: string
): Promise<{ message: string; user: { id: string; isActive: boolean } }> {
  const { data } = await apiClient.patch(`/users/${userId}/ban`);
  return data;
}
