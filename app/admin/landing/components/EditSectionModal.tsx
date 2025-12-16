"use client";

import { useState, useEffect } from "react";
import {
  useUpdateSection,
  useAddSectionImage,
  useDeleteSectionImage,
} from "@/src/lib/hooks/useLanding";
import {
  LandingSection,
  UpdateSectionPayload,
} from "@/src/lib/api/landing.api";
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
import { Loader2, Upload, X } from "lucide-react";
import { uploadProductImage } from "@/src/lib/api/admin-products.api";
import Image from "next/image";

interface EditSectionModalProps {
  section: LandingSection;
  open: boolean;
  onClose: () => void;
}

export function EditSectionModal({
  section,
  open,
  onClose,
}: EditSectionModalProps) {
  const updateSection = useUpdateSection();
  const addImage = useAddSectionImage();
  const deleteImage = useDeleteSectionImage();

  const [formData, setFormData] = useState<UpdateSectionPayload>({
    type: section.type,
    title: section.title,
    description: section.description,
    textPosition: section.textPosition,
    bgColor: section.bgColor,
    order: section.order,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        type: section.type,
        title: section.title,
        description: section.description,
        textPosition: section.textPosition,
        bgColor: section.bgColor,
        order: section.order,
      });
    }
  }, [section, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    try {
      await updateSection.mutateAsync({
        id: section.id,
        payload: formData,
      });
      toast.success("Sección actualizada exitosamente");
      onClose();
    } catch (error) {
      toast.error("Error al actualizar la sección");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (section.images.length >= 5) {
      toast.error("Máximo 5 imágenes por sección");
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadResult = await uploadProductImage(file);

      await addImage.mutateAsync({
        sectionId: section.id,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        alt: formData.title || "",
        order: section.images.length,
      });

      toast.success("Imagen agregada exitosamente");
      e.target.value = "";
    } catch (error) {
      toast.error("Error al subir la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      await deleteImage.mutateAsync({
        imageId,
        sectionId: section.id,
      });
      toast.success("Imagen eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la imagen");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Editar Sección
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Sección</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "CAROUSEL" | "CUSTOM") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAROUSEL">Carrusel</SelectItem>
                  <SelectItem value="CUSTOM">Personalizada</SelectItem>
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
            <Label htmlFor="title">Título *</Label>
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
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descripción de la sección..."
              rows={3}
            />
          </div>

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

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label>Imágenes ({section.images.length}/5)</Label>
                {formData.type === "CAROUSEL" && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Dimensiones recomendadas:</strong>
                    <br />
                    Panorámico: 1920x800px · Standard: 1920x1080px
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={section.images.length >= 5 || isUploadingImage}
                onClick={() => document.getElementById("image-upload")?.click()}
                className="gap-2"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Agregar Imagen
                  </>
                )}
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {section.images.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {section.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic text-center py-4">
                No hay imágenes agregadas
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateSection.isPending}
              className="gap-2"
            >
              {updateSection.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
