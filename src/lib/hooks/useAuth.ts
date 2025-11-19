import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, initiateGoogleLogin, logout } from "../api/auth.api";
import type { User } from "../types";

/**
 * Hook para manejar autenticación
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // Verificar si hay token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const isAuthenticated = !!token;

  // Query para obtener el perfil del usuario
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["auth", "profile"],
    queryFn: getProfile,
    enabled: isAuthenticated, // Solo ejecuta si hay token
    retry: false,
  });

  // Función para login
  const login = () => {
    initiateGoogleLogin();
  };

  // Función para logout
  const handleLogout = () => {
    queryClient.clear(); // Limpia todo el caché de React Query
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: handleLogout,
  };
}
