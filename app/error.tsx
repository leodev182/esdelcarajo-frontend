"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-wide uppercase">Algo salió mal</h1>
        <p className="text-muted-foreground">
          Ocurrió un error inesperado. Ya fuimos notificados.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Intentar de nuevo</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
