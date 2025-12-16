"use client";

import { useState } from "react";
import { useLandingSections } from "@/src/lib/hooks/useLanding";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { SectionCard } from "./components/SectionCard";
import { CreateSectionModal } from "./components/CreateSectionModal";

export default function LandingPage() {
  const { data: sections, isLoading } = useLandingSections();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Secciones de Landing</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las secciones dinámicas de la página principal
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 font-bold"
        >
          <Plus className="h-5 w-5" />
          Nueva Sección
        </Button>
      </div>

      {!sections || sections.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 mb-4">No hay secciones creadas todavía</p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Crear primera sección
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      )}

      <CreateSectionModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
