"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/src/lib/api/client";
import { toast } from "sonner";

interface AliasModalProps {
  onSuccess: () => void;
}

export function AliasModal({ onSuccess }: AliasModalProps) {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error("Por favor ingresa un alias");
      return;
    }

    if (nickname.length > 50) {
      toast.error("El alias no puede exceder 50 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.patch("/users/me", { nickname: nickname.trim() });
      toast.success(`¡Bienvenido a Del Carajo, ${nickname.trim()}!`);
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar el alias");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full border-4 border-primary">
        <h2 className="text-3xl font-bold mb-4 text-center">
          ¡Bienvenido a Del Carajo!
        </h2>

        <p className="text-muted-foreground mb-6 text-center">
          Para completar tu registro, elige un alias que usaremos para
          dirigirnos a ti
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Tu Alias</label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ej: Juancho, Mariela, ElPana..."
              maxLength={50}
              autoFocus
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {nickname.length}/50 caracteres
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !nickname.trim()}
          >
            {isLoading ? "Guardando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
