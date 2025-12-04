"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/rayitohd.svg"
            alt="Del Carajo"
            width={80}
            height={80}
            className="w-20 h-20"
          />
          <h1 className="text-4xl font-bold">DEL CARAJO</h1>
          <p className="text-muted-foreground">Devotos del Arte</p>
        </div>

        <div className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
            <p className="text-muted-foreground">
              Usa tu cuenta de Google para acceder de forma rápida y segura.
            </p>
          </div>

          <Button onClick={handleGoogleLogin} size="lg" className="w-full">
            <Chrome className="mr-2 h-5 w-5" />
            Continuar con Google
          </Button>

          <div className="pt-4 space-y-2 text-sm text-muted-foreground">
            <p>
              Al iniciar sesión, podrás gestionar tus pedidos, favoritos y
              direcciones.
            </p>
            <p>
              Puedes editar tu información en cualquier momento desde tu perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
