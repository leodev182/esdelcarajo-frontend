"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Trash2, Upload, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartners, useCreatePartner, useDeletePartner } from "@/src/lib/hooks/useLanding";
import { apiClient } from "@/src/lib/api/client";
import { toast } from "sonner";

export function PartnersAdmin() {
  const { data: partners, isLoading } = usePartners();
  const createPartner = useCreatePartner();
  const deletePartner = useDeletePartner();

  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await apiClient.post<{ url: string; publicId: string }>(
        "/upload/image",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      await createPartner.mutateAsync({
        imageUrl: data.url,
        publicId: data.publicId,
        linkUrl: linkUrl.trim() || undefined,
      });

      setLinkUrl("");
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Partner agregado");
    } catch {
      toast.error("Error al subir el partner");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePartner.mutateAsync(id);
    toast.success("Partner eliminado");
  };

  return (
    <div className="mt-10 border-t-2 border-dashed border-gray-200 pt-8">
      <h2 className="text-2xl font-bold mb-2">Partners</h2>
      <p className="text-gray-500 text-sm mb-6">
        Logos que aparecen en la banda de partners de la landing. PNG recomendado · tamaño ideal 300×120 px.
      </p>

      {/* Upload */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-xl">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="URL del partner (opcional)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="gap-2 shrink-0"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Subir logo
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/webp,image/svg+xml,image/jpeg"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Grid de partners */}
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      ) : !partners || partners.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay partners aún.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {partners.map((p) => (
            <div key={p.id} className="relative group border-2 border-gray-100 rounded-lg p-3 flex items-center justify-center bg-white min-h-[80px]">
              <Image
                src={p.imageUrl}
                alt="partner"
                width={160}
                height={60}
                className="object-contain max-h-14 w-auto"
              />
              {p.linkUrl && (
                <a
                  href={p.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-1 left-1 text-[10px] text-blue-500 truncate max-w-[80%]"
                >
                  🔗
                </a>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(p.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
