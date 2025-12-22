"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { logger } from "@/src/lib/utils/logger";
import { useAuth } from "@/src/lib/hooks/useAuth";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Usar setToken del AuthContext en lugar de localStorage directo
      setToken(token);
      logger.info("Token guardado, redirigiendo...");
      // Redirigir después de un pequeño delay para que el context actualice
      setTimeout(() => {
        router.push("/");
      }, 100);
    } else {
      logger.error("No se recibió token");
      router.push("/");
    }
  }, [searchParams, router, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
