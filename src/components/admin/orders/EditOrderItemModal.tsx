"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getProductVariants } from "@/src/lib/api/admin-products.api";
import { useUpdateOrderItem } from "@/src/lib/hooks/useOrders";
import type { ProductVariant } from "@/src/lib/types";
import type { OrderItem } from "@/src/lib/types";

interface EditOrderItemModalProps {
  orderId: string;
  item: OrderItem & { variant?: ProductVariant & { productId: string } };
  open: boolean;
  onClose: () => void;
}

export function EditOrderItemModal({
  orderId,
  item,
  open,
  onClose,
}: EditOrderItemModalProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    item.variantId
  );
  const [loading, setLoading] = useState(false);

  const updateItem = useUpdateOrderItem();

  useEffect(() => {
    if (!open || !item.variant?.productId) return;

    setLoading(true);
    getProductVariants(item.variant.productId)
      .then(setVariants)
      .catch(() => toast.error("No se pudieron cargar las variantes"))
      .finally(() => setLoading(false));
  }, [open, item.variant?.productId]);

  const handleConfirm = async () => {
    if (selectedVariantId === item.variantId) {
      onClose();
      return;
    }

    try {
      await updateItem.mutateAsync({
        orderId,
        itemId: item.id,
        variantId: selectedVariantId,
      });
      toast.success("Item actualizado exitosamente");
      onClose();
    } catch {
      toast.error("Error al actualizar el item");
    }
  };

  const selected = variants.find((v) => v.id === selectedVariantId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar item: {item.productName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-sm text-muted-foreground">
            Actual: {item.variantSize} · {item.variantColor} · x{item.quantity}
          </p>

          {loading ? (
            <p className="text-sm text-muted-foreground">
              Cargando variantes...
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    selectedVariantId === v.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  } ${
                    v.stock < item.quantity && v.id !== item.variantId
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={v.stock < item.quantity && v.id !== item.variantId}
                >
                  <p className="font-semibold text-sm">
                    {v.size} · {v.color}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Stock: {v.stock} · ${Number(v.price).toFixed(2)}
                    {v.id === item.variantId && " · actual"}
                    {!v.isActive && v.id !== item.variantId && " · agotada"}
                  </p>
                </button>
              ))}
            </div>
          )}

          {selected && selectedVariantId !== item.variantId && (
            <p className="text-sm font-medium text-primary">
              Nuevo: {selected.size} · {selected.color} · $
              {Number(selected.price).toFixed(2)}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={updateItem.isPending || loading}
          >
            {updateItem.isPending ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
