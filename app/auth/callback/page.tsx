"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Página de callback después del login con Google
 *
 * El backend redirige aquí con el access_token en la URL.
 * El refresh_token ya está guardado en una HttpOnly Cookie (seguro).
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Guardar solo el access_token (el refresh_token está en cookie)
      localStorage.setItem("access_token", token);
      router.push("/");
    } else {
      console.error("No se recibió token");
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
}
