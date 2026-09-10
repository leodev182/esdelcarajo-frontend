import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/nextjs";
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
  resolve: () => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    logger.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    logger.info(
      `API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
    );
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      logger.warn("Token expirado, intentando refresh...");

      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/auth/refresh");
        logger.info("Token refrescado exitosamente");
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        logger.error(
          "Error refrescando token, redirigiendo a login",
          refreshError,
          { expected: true }
        );
        processQueue(refreshError as AxiosError);

        const isAuthCheck = originalRequest.url?.includes("/auth/profile");
        if (
          !isAuthCheck &&
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

    const status = error.response?.status;
    const isAuthFlow = status === 401 || status === 403;
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const responseData = error.response?.data;

    logger.error(
      `API Error: ${status} ${method} ${url}`,
      {
        status,
        url,
        method,
        responseData,
        message: error.message,
      },
      { expected: isAuthFlow }
    );

    if (!isAuthFlow) {
      Sentry.withScope((scope) => {
        scope.setTag("http.status_code", String(status ?? "unknown"));
        scope.setTag("http.method", method ?? "unknown");
        scope.setTag("http.url", url ?? "unknown");
        scope.setExtra("response_data", responseData);
        scope.setExtra("request_url", url);
        scope.setExtra("request_method", method);
        scope.setExtra("status_code", status);
        scope.setExtra("error_message", error.message);
        Sentry.captureException(error);
      });
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] };
    const msg = data?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string" && msg.trim()) return msg;
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado";
}
