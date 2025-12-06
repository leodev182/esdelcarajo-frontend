"use client";

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/src/lib/hooks/useCart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PriceDisplay } from "../product/PriceDisplay";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, isLoading, removeCartItem, updateCartItem } = useCart();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const totalItems = cart?.totalItems || 0;

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem({ itemId, payload: { quantity: newQuantity } });
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeCartItem(itemId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <ShoppingBag className="h-5 w-5" />
              Tu Carrito
              {totalItems > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando carrito...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-muted-foreground mb-6">
                Agrega productos del carajo para empezar a comprar
              </p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/tienda">Ver Productos</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Items List */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={
                          item.variant.product.images?.[0]?.url ||
                          "/placeholder.png"
                        }
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/tienda/${item.variant.product.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="font-semibold hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.variant.product.name}
                      </Link>

                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="capitalize">{item.variant.size}</span>
                        {" · "}
                        <span className="capitalize">{item.variant.color}</span>
                        {" · "}
                        <span className="capitalize">
                          {item.variant.gender}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Price */}
                        <PriceDisplay
                          priceEUR={Number(item.variant.price) * item.quantity}
                          className="font-bold text-primary"
                        />

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.variant.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Stock warning */}
                      {item.quantity >= item.variant.stock && (
                        <p className="text-xs text-amber-600 mt-1">
                          Stock máximo alcanzado
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="px-6 py-4 border-t mt-auto">
              <div className="w-full space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Subtotal:</span>
                  <PriceDisplay priceEUR={subtotal} className="text-primary" />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  El costo de envío se calculará en el checkout
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout" onClick={() => onOpenChange(false)}>
                      Proceder al Checkout
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onOpenChange(false)}
                    asChild
                  >
                    <Link href="/tienda">Seguir Comprando</Link>
                  </Button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
