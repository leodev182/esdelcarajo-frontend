"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUserCart,
  removeAdminCartItem,
  clearAdminUserCart,
} from "@/src/lib/api/admin-cart.api";
import { getErrorMessage } from "@/src/lib/api/client";
import { logger } from "@/src/lib/utils/logger";
import { Button } from "@/components/ui/button";
import { ConfirmModal, useConfirm } from "@/src/components/ui/ConfirmModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface UserCartModalProps {
  userId: string;
  userName: string;
  open: boolean;
  onClose: () => void;
}

export function UserCartModal({ userId, userName, open, onClose }: UserCartModalProps) {
  const queryClient = useQueryClient();
  const { confirm, confirmProps } = useConfirm();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "cart", userId],
    queryFn: () => getAdminUserCart(userId),
    enabled: open,
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => removeAdminCartItem(userId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cart", userId] });
      toast.success("Item eliminado del carrito");
    },
    onError: (error) => {
      logger.error("Error eliminando item del carrito de usuario", error);
      toast.error(getErrorMessage(error) || "No se pudo eliminar el item");
    },
  });

  const clearCart = useMutation({
    mutationFn: () => clearAdminUserCart(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cart", userId] });
      toast.success("Carrito vaciado");
    },
    onError: (error) => {
      logger.error("Error vaciando carrito de usuario", error);
      toast.error(getErrorMessage(error) || "No se pudo vaciar el carrito");
    },
  });

  const handleRemoveItem = async (itemId: string, productName: string) => {
    if (!(await confirm(`¿Eliminar "${productName}" del carrito?`))) return;
    removeItem.mutate(itemId);
  };

  const handleClearCart = async () => {
    if (!(await confirm(`¿Vaciar todo el carrito de ${userName}?`))) return;
    clearCart.mutate();
  };

  const items = data?.cart?.items ?? [];

  return (
    <>
      <ConfirmModal {...confirmProps} />
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrito de {userName}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <p className="text-center py-8 text-gray-500">Cargando carrito…</p>
          ) : !data?.cart || items.length === 0 ? (
            <p className="text-center py-8 text-gray-500">El carrito está vacío</p>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleClearCart}
                  disabled={clearCart.isPending}
                >
                  Vaciar carrito
                </Button>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-4">
                    {item.variant.images[0]?.image && (
                      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border">
                        <Image
                          src={item.variant.images[0].image.url}
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{item.variant.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Talla: {item.variant.size} · Cantidad: {item.quantity} · Stock disponible: {item.variant.stock}
                      </p>
                      <p className="text-xs text-gray-400">
                        Expira: {formatDistanceToNow(new Date(item.expiresAt), { addSuffix: true, locale: es })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold">${Number(item.variant.price).toFixed(2)}</p>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.variant.product.name)}
                        disabled={removeItem.isPending}
                        className="mt-1 text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Eliminar item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
