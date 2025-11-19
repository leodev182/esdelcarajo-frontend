import { apiClient } from "./client";
import type { User, Role } from "../types";

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
export async function getAllUsers(): Promise<{ total: number; users: User[] }> {
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
