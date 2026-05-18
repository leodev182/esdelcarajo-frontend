"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/src/lib/types";
import { getProfile } from "@/src/lib/api/auth.api";
import { AliasModal } from "@/src/components/auth/AliasModal";
import { logger } from "@/src/lib/utils/logger";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAliasModal, setShowAliasModal] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      logger.info("Verificando autenticación...");
      const userData = await getProfile();
      setUser(userData);
      logger.info(`Usuario autenticado: ${userData.email}`);

      if (!userData.nickname) {
        logger.warn("Usuario sin nickname, mostrando modal");
        setShowAliasModal(true);
      }
    } catch {
      logger.info("No hay sesión activa");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      logger.info("Refrescando datos del usuario...");
      const userData = await getProfile();
      setUser(userData);
      logger.info("Datos del usuario actualizados");
    } catch (error) {
      logger.error("Error refrescando usuario:", error);
    }
  };

  const handleAliasSuccess = async () => {
    logger.info("Nickname configurado exitosamente");
    await refreshUser();
    setShowAliasModal(false);
  };

  const login = () => {
    logger.info("Iniciando login con Google");
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const logout = async () => {
    logger.info("Usuario cerrando sesión");
    try {
      const { apiClient } = await import("@/src/lib/api/client");
      await apiClient.post("/auth/logout");
    } catch (error) {
      logger.error("Error en logout del backend:", error);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
      {showAliasModal && <AliasModal onSuccess={handleAliasSuccess} />}
    </AuthContext.Provider>
  );
}
