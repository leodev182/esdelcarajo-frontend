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
  SectionType,
} from "@/src/lib/api/landing.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmModal, useConfirm } from "@/src/components/ui/ConfirmModal";
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
import { getErrorMessage } from "@/src/lib/api/client";
import { logger } from "@/src/lib/utils/logger";
import * as Sentry from "@sentry/nextjs";

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
  const { confirm, confirmProps } = useConfirm();

  const [formData, setFormData] = useState<UpdateSectionPayload>({
    type: section.type,
    title: section.title,
    description: section.description,
    textPosition: section.textPosition,
    bgColor: section.bgColor,
    videoUrl: section.videoUrl,
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
        videoUrl: section.videoUrl,
        order: section.order,
      });
    }
  }, [section, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = { ...formData };
      if (!payload.videoUrl) delete payload.videoUrl;
      await updateSection.mutateAsync({
        id: section.id,
        payload,
      });
      toast.success("Sección actualizada exitosamente");
      onClose();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Error al actualizar sección de landing", err);
      Sentry.captureException(err, { tags: { action: "update_landing_section" }, extra: { sectionId: section.id } });
      toast.error(getErrorMessage(error) || "Error al actualizar la sección");
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
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Error al subir imagen en sección de landing", err);
      Sentry.captureException(err, { tags: { action: "upload_landing_section_image" }, extra: { sectionId: section.id } });
      toast.error(getErrorMessage(error) || "Error al subir la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!(await confirm("¿Estás seguro de eliminar esta imagen?"))) return;

    try {
      await deleteImage.mutateAsync({
        imageId,
        sectionId: section.id,
      });
      toast.success("Imagen eliminada exitosamente");
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error("Error al eliminar imagen de sección de landing", err);
      Sentry.captureException(err, { tags: { action: "delete_landing_section_image" }, extra: { imageId, sectionId: section.id } });
      toast.error(getErrorMessage(error) || "Error al eliminar la imagen");
    }
  };

  return (
    <>
    <ConfirmModal {...confirmProps} />
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
              value={formData.description || ""}
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
              <Label>Fondo de Sección</Label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bgColor: "glass" })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    formData.bgColor === "glass"
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  ✨ Efecto Glass
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bgColor: "#FFFFFF" })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    formData.bgColor !== "glass"
                      ? "bg-gray-100 border-gray-400 text-gray-700"
                      : "bg-white border-gray-200 text-gray-500"
                  }`}
                >
                  Color sólido
                </button>
              </div>
              {formData.bgColor !== "glass" && (
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
              )}
            </div>
          </div>

          {formData.type !== "VIDEO" && <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  Imágenes ({section.images.length}/{formData.type === "GALLERY" ? 20 : 5})
                </Label>
                {formData.type === "CAROUSEL" && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Dimensiones recomendadas:</strong>
                    <br />
                    Panorámico: 1920x800px · Standard: 1920x1080px
                  </p>
                )}
                {formData.type === "GALLERY" && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Dimensiones recomendadas (máx. 20 fotos):</strong>
                    <br />
                    Retrato: 800×1200px · Cuadrado: 800×800px · Paisaje: 1200×800px
                    <br />
                    Mínimo 800px de ancho. Mezclar orientaciones da mejor efecto visual.
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={section.images.length >= (formData.type === "GALLERY" ? 20 : 5) || isUploadingImage}
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
          </div>}

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
    </>
  );
}
