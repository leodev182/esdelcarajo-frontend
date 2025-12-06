import { apiClient } from "../api/client";
import type { User } from "../types";
import { logger } from "@/src/lib/utils/logger";
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
 * Logout del backend (revoca refresh token) y limpia cliente
 */
export async function logout(): Promise<void> {
  try {
    // Llamar al backend para revocar el refresh token (cookie)
    await apiClient.post("/auth/logout");
  } catch (error) {
    // Ignorar errores del logout del backend
    logger.error("Error en logout del backend:", error);
  } finally {
    // Siempre limpiar el cliente
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
}
