"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getProductVariants } from "@/src/lib/api/admin-products.api";
import { getProducts } from "@/src/lib/api/products.api";
import { useUpdateOrderItem } from "@/src/lib/hooks/useOrders";
import type { Product, ProductVariant, OrderItem } from "@/src/lib/types";

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
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(item.variantId);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const updateItem = useUpdateOrderItem();

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSelectedProduct(null);
    setSelectedVariantId(item.variantId);
    loadVariants(item.variant?.productId ?? "");
  }, [open]);

  const loadVariants = (productId: string) => {
    if (!productId) return;
    setLoadingVariants(true);
    getProductVariants(productId)
      .then(setVariants)
      .catch(() => toast.error("No se pudieron cargar las variantes"))
      .finally(() => setLoadingVariants(false));
  };

  useEffect(() => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoadingProducts(true);
      getProducts({ search: search.trim(), limit: 8 })
        .then((res) => setProducts(res.data))
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariantId("");
    setProducts([]);
    setSearch(product.name);
    loadVariants(product.id);
  };

  const handleConfirm = async () => {
    if (!selectedVariantId || selectedVariantId === item.variantId) {
      onClose();
      return;
    }
    try {
      await updateItem.mutateAsync({ orderId, itemId: item.id, variantId: selectedVariantId });
      toast.success("Item actualizado exitosamente");
      onClose();
    } catch {
      toast.error("Error al actualizar el item");
    }
  };

  const selected = variants.find((v) => v.id === selectedVariantId);
  const isChangingProduct = !!selectedProduct;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar item: {item.productName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Actual: {item.variantSize} · {item.variantColor} · x{item.quantity}
          </p>

          <div className="relative">
            <label className="block text-xs font-semibold mb-1 text-muted-foreground">
              Cambiar producto (opcional)
            </label>
            <Input
              placeholder="Buscar otro producto..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value) {
                  setSelectedProduct(null);
                  loadVariants(item.variant?.productId ?? "");
                }
              }}
            />
            {products.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {loadingProducts ? (
                  <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
                ) : (
                  products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      {p.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {isChangingProduct && (
            <p className="text-xs font-medium text-primary">
              Producto: {selectedProduct?.name}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 text-muted-foreground">
              {isChangingProduct ? "Variante del nuevo producto" : "Cambiar talla / variante"}
            </label>

            {loadingVariants ? (
              <p className="text-sm text-muted-foreground">Cargando variantes...</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    disabled={v.stock < item.quantity && v.id !== item.variantId}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      selectedVariantId === v.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } ${
                      v.stock < item.quantity && v.id !== item.variantId
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <p className="font-semibold text-sm">
                      {v.size} · {v.color}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {v.stock} · ${Number(v.price).toFixed(2)}
                      {v.id === item.variantId && !isChangingProduct && " · actual"}
                      {!v.isActive && v.id !== item.variantId && " · agotada"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (selectedVariantId !== item.variantId || isChangingProduct) && (
            <p className="text-sm font-medium text-primary">
              Nuevo: {selected.size} · {selected.color} · ${Number(selected.price).toFixed(2)}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={updateItem.isPending || loadingVariants || !selectedVariantId}
          >
            {updateItem.isPending ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
