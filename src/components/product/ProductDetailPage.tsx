"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductBySlug } from "@/src/lib/hooks/useProducts";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useCart } from "@/src/lib/hooks/useCart";
import { formatPrice } from "@/src/lib/utils";
import type { ProductVariant } from "@/src/lib/types";

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  // Por ahora el backend no tiene endpoint por slug, usaremos el ID
  // TODO: Cambiar esto cuando el backend tenga endpoint por slug
  const { data: product, isLoading, error } = useProductBySlug(slug);
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  // Cuando cargue el producto, seleccionar la primera variante disponible
  if (product && !selectedVariant && product.variants.length > 0) {
    setSelectedVariant(product.variants[0]);
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-destructive">Producto no encontrado</p>
          <Button className="mt-4" asChild>
            <a href="/catalogo">Volver al catálogo</a>
          </Button>
        </div>
      </div>
    );
  }

  const images =
    product.images.length > 0
      ? product.images
      : [{ url: "/placeholder.png", altText: product.name }];
  const currentImage = images[selectedImageIndex];

  // Agrupar variantes por atributos
  const availableSizes = [...new Set(product.variants.map((v) => v.size))];
  const availableColors = [...new Set(product.variants.map((v) => v.color))];
  const availableGenders = [...new Set(product.variants.map((v) => v.gender))];

  // Obtener precio de la variante seleccionada
  const price = selectedVariant ? Number(selectedVariant.price) : 0;
  const hasStock = selectedVariant ? selectedVariant.stock > 0 : false;

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          {/* Imagen principal */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={currentImage.url}
              alt={currentImage.altText || product.name}
              fill
              className="object-cover"
              priority
            />

            {/* Navegación de imágenes */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                    index === selectedImageIndex
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Título y categoría */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          {/* Precio */}
          <div className="text-3xl font-bold">{formatPrice(price)}</div>

          {/* Descripción */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Selector de variantes */}
          <div className="space-y-4">
            {/* Tallas */}
            {availableSizes.length > 0 && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Talla: {selectedVariant?.size}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const variant = product.variants.find(
                      (v) =>
                        v.size === size &&
                        (!selectedVariant ||
                          (v.color === selectedVariant.color &&
                            v.gender === selectedVariant.gender))
                    );
                    const isSelected = selectedVariant?.size === size;
                    const isAvailable = variant && variant.stock > 0;

                    return (
                      <Button
                        key={size}
                        variant={isSelected ? "default" : "outline"}
                        disabled={!isAvailable}
                        onClick={() => variant && setSelectedVariant(variant)}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colores */}
            {availableColors.length > 1 && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Color: {selectedVariant?.color}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const variant = product.variants.find(
                      (v) =>
                        v.color === color &&
                        (!selectedVariant ||
                          (v.size === selectedVariant.size &&
                            v.gender === selectedVariant.gender))
                    );
                    const isSelected = selectedVariant?.color === color;
                    const isAvailable = variant && variant.stock > 0;

                    return (
                      <Button
                        key={color}
                        variant={isSelected ? "default" : "outline"}
                        disabled={!isAvailable}
                        onClick={() => variant && setSelectedVariant(variant)}
                      >
                        {color}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Género */}
            {availableGenders.length > 1 && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Género: {selectedVariant?.gender}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenders.map((gender) => {
                    const variant = product.variants.find(
                      (v) =>
                        v.gender === gender &&
                        (!selectedVariant ||
                          (v.size === selectedVariant.size &&
                            v.color === selectedVariant.color))
                    );
                    const isSelected = selectedVariant?.gender === gender;
                    const isAvailable = variant && variant.stock > 0;

                    return (
                      <Button
                        key={gender}
                        variant={isSelected ? "default" : "outline"}
                        disabled={!isAvailable}
                        onClick={() => variant && setSelectedVariant(variant)}
                      >
                        {gender}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Stock */}
          {selectedVariant && (
            <div className="text-sm">
              {hasStock ? (
                <p className="text-green-600">
                  En stock ({selectedVariant.stock} disponibles)
                </p>
              ) : (
                <p className="text-destructive">Agotado</p>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={
                !hasStock ||
                !selectedVariant ||
                isAddingToCart ||
                !isAuthenticated
              }
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? "Agregando..." : "Agregar al Carrito"}
            </Button>

            {isAuthenticated && (
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            )}
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              Inicia sesión para agregar productos al carrito
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
