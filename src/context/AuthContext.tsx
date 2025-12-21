"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/src/lib/types";
import { apiClient } from "@/src/lib/api/client";
import { getProfile } from "@/src/lib/api/auth.api";
import { AliasModal } from "@/src/components/auth/AliasModal";
import { logger } from "@/src/lib/utils/logger";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setToken: (token: string) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setToken: () => {},
  refreshUser: async () => {},
});

const TOKEN_KEY = "access_token";

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
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        logger.info("No hay token, usuario no autenticado");
        setIsLoading(false);
        return;
      }

      logger.info("Verificando autenticación...");
      const userData = await getProfile();
      setUser(userData);
      logger.info(`Usuario autenticado: ${userData.email}`);

      if (!userData.nickname) {
        logger.warn("Usuario sin nickname, mostrando modal");
        setShowAliasModal(true);
      }
    } catch (error) {
      logger.error("Error verificando autenticación:", error);
      localStorage.removeItem(TOKEN_KEY);
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

  const setToken = (token: string) => {
    logger.info("Token guardado, verificando autenticación");
    localStorage.setItem(TOKEN_KEY, token);
    checkAuth();
  };

  const login = () => {
    logger.info("Iniciando login con Google");
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const logout = () => {
    logger.info("Usuario cerrando sesión");
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setToken,
        refreshUser,
      }}
    >
      {children}
      {showAliasModal && <AliasModal onSuccess={handleAliasSuccess} />}
    </AuthContext.Provider>
  );
}
