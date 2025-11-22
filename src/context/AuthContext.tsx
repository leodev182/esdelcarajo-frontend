"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/src/lib/types";
import { apiClient } from "@/src/lib/api/client";
import { getProfile } from "@/src/lib/api/auth.api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setToken: () => {},
});

const TOKEN_KEY = "access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
