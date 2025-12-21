import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { logger } from "@/src/lib/utils/logger";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor para agregar el token JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error: AxiosError) => {
    logger.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresh automático
apiClient.interceptors.response.use(
  (response) => {
    logger.info(
      `API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - ${response.status}`
    );
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si es 401 y no es el endpoint de refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      logger.warn("Token expirado, intentando refresh...");

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post("/auth/refresh");
        const newToken = data.access_token;

        localStorage.setItem("access_token", newToken);
        logger.info("Token refrescado exitosamente");

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        logger.error(
          "Error refrescando token, redirigiendo a login",
          refreshError
        );

        processQueue(refreshError as AxiosError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Log del error
    logger.error("API Error:", {
      message: error.response?.data || error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });

    return Promise.reject(error);
  }
);

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
