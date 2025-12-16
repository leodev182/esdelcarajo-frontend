"use client";

import { useState } from "react";
import { LandingSection } from "@/src/lib/api/landing.api";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { useDeleteSection, useUpdateSection } from "@/src/lib/hooks/useLanding";
import { toast } from "sonner";
import { EditSectionModal } from "./EditSectionModal";
import Image from "next/image";

interface SectionCardProps {
  section: LandingSection;
}

export function SectionCard({ section }: SectionCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const deleteSection = useDeleteSection();
  const updateSection = useUpdateSection();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta sección?")) return;

    try {
      await deleteSection.mutateAsync(section.id);
      toast.success("Sección eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la sección");
    }
  };

  const handleToggleActive = async () => {
    try {
      await updateSection.mutateAsync({
        id: section.id,
        payload: { isActive: !section.isActive },
      });
      toast.success(
        section.isActive ? "Sección desactivada" : "Sección activada"
      );
    } catch (error) {
      toast.error("Error al actualizar la sección");
    }
  };

  const typeLabel = section.type === "CAROUSEL" ? "Carrusel" : "Personalizada";
  const positionLabel = {
    LEFT: "Izquierda",
    CENTER: "Centro",
    RIGHT: "Derecha",
    TOP: "Arriba",
    BOTTOM: "Abajo",
  }[section.textPosition];

  return (
    <>
      <div
        className="bg-white rounded-lg border-2 border-dark p-6"
        style={{ opacity: section.isActive ? 1 : 0.6 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">{section.title}</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {typeLabel}
              </span>
              {!section.isActive && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                  Inactiva
                </span>
              )}
            </div>
            {section.description && (
              <p className="text-gray-600 mb-3">{section.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Posición: {positionLabel}</span>
              <span>Orden: {section.order}</span>
              <div
                className="flex items-center gap-2"
                style={{ backgroundColor: section.bgColor }}
              >
                <span>Color:</span>
                <div
                  className="w-6 h-6 rounded border-2 border-gray-300"
                  style={{ backgroundColor: section.bgColor }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleActive}
              className="gap-2"
            >
              {section.isActive ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Activar
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteSection.isPending}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-bold text-gray-600">
              Imágenes ({section.images.length}/5)
            </span>
          </div>

          {section.images.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {section.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No hay imágenes agregadas
            </p>
          )}
        </div>
      </div>

      <EditSectionModal
        section={section}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
