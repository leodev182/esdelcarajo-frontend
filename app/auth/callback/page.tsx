"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/src/lib/utils/logger";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    logger.info("Callback de autenticación recibido, redirigiendo...");
    const callbackUrl = sessionStorage.getItem("auth_callback_url");
    sessionStorage.removeItem("auth_callback_url");
    router.push(callbackUrl || "/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
}
