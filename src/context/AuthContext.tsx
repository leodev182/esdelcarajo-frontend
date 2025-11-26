"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/src/lib/types";
import { apiClient } from "@/src/lib/api/client";
import { getProfile } from "@/src/lib/api/auth.api";
import { AliasModal } from "@/src/components/auth/AliasModal";

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
        setIsLoading(false);
        return;
      }

      const userData = await getProfile();
      setUser(userData);

      if (!userData.nickname) {
        setShowAliasModal(true);
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Error refrescando usuario:", error);
    }
  };

  const handleAliasSuccess = async () => {
    await refreshUser();
    setShowAliasModal(false);
  };

  const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    checkAuth();
  };

  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const logout = () => {
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
