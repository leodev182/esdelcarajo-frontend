"use client";

import { useState } from "react";
import { useCreateSection } from "@/src/lib/hooks/useLanding";
import { CreateSectionPayload, SectionType } from "@/src/lib/api/landing.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateSectionModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateSectionModal({ open, onClose }: CreateSectionModalProps) {
  const createSection = useCreateSection();

  const [formData, setFormData] = useState<CreateSectionPayload>({
    type: "CAROUSEL",
    title: "",
    description: "",
    textPosition: "CENTER",
    bgColor: "#FFFFFF",
    videoUrl: "",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { ...formData };
      if (!payload.videoUrl) delete payload.videoUrl;
      await createSection.mutateAsync(payload);
      toast.success("Sección creada exitosamente");
      onClose();
      setFormData({
        type: "CAROUSEL",
        title: "",
        description: "",
        textPosition: "CENTER",
        bgColor: "#FFFFFF",
        videoUrl: "",
        order: 0,
      });
    } catch (error) {
      toast.error("Error al crear la sección");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Nueva Sección de Landing
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Sección</Label>
              <Select
                value={formData.type}
                onValueChange={(value: SectionType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAROUSEL">Carrusel</SelectItem>
                  <SelectItem value="CUSTOM">Banner</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="GALLERY">Galería</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ej: Nueva Colección"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descripción de la sección..."
              rows={3}
            />
          </div>

          {formData.type === "VIDEO" && (
            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL del Video *</Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500">
                Compatible con YouTube y Vimeo. Formato recomendado: 16:9 (1920×1080px).
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="textPosition">Posición del Texto</Label>
              <Select
                value={formData.textPosition}
                onValueChange={(
                  value: "LEFT" | "CENTER" | "RIGHT" | "TOP" | "BOTTOM"
                ) => setFormData({ ...formData, textPosition: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEFT">Izquierda</SelectItem>
                  <SelectItem value="CENTER">Centro</SelectItem>
                  <SelectItem value="RIGHT">Derecha</SelectItem>
                  <SelectItem value="TOP">Arriba</SelectItem>
                  <SelectItem value="BOTTOM">Abajo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgColor">Color de Fondo</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) =>
                    setFormData({ ...formData, bgColor: e.target.value })
                  }
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) =>
                    setFormData({ ...formData, bgColor: e.target.value })
                  }
                  placeholder="#FFFFFF"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createSection.isPending}
              className="gap-2"
            >
              {createSection.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Crear Sección
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
