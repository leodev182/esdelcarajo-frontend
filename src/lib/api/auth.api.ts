import { apiClient } from "../api/client";
import type { User } from "../types";

export interface LoginResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user: User;
}

/**
 * Obtener perfil del usuario autenticado
 */
export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/profile");
  return data;
}

/**
 * Iniciar login con Google OAuth
 * Redirige al backend que a su vez redirige a Google
 */
export function initiateGoogleLogin(): void {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
}

/**
 * Logout (limpia el token del cliente)
 */
export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/";
}
