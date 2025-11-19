import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Crear instancia de Axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar el token JWT en cada request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Si el token expiró o es inválido (401)
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Redirigir al login si no estamos ya ahí
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Log del error en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        message: error.response?.data || error.message,
        status: error.response?.status,
        url: error.config?.url,
      });
    }

    return Promise.reject(error);
  }
);

// Helper para extraer el mensaje de error
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data as { message?: string };
    return errorData?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado";
}
