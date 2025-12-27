"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductBySlug } from "@/src/lib/hooks/useProducts";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useCart } from "@/src/lib/hooks/useCart";
import { PriceDisplay } from "./PriceDisplay";

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { data: product, isLoading, error } = useProductBySlug(slug);
  const { isAuthenticated } = useAuth();
  const { addToCart, isAddingToCart } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  const selectedVariant =
    product?.variants.find((v) => v.id === selectedVariantId) ||
    product?.variants[0] ||
    null;

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
          <p className="text-destructive text-white">Producto no encontrado</p>
          <Button className="mt-4" asChild>
            <a href="/catalogo">Volver al catálogo</a>
          </Button>
        </div>
      </div>
    );
  }

  const variantImages =
    selectedVariant?.images?.filter((img) => img.isActive) || [];
  const productGeneralImages = product.images.filter(
    (img) => !img.variantId && img.isActive
  );

  const images =
    variantImages.length > 0
      ? variantImages
      : productGeneralImages.length > 0
      ? productGeneralImages
      : [{ url: "/placeholder.png", altText: product.name }];

  const currentImage = images[selectedImageIndex];

  const sizeOrder = { S: 1, M: 2, L: 3, XL: 4 };
  const availableSizes = [...new Set(product.variants.map((v) => v.size))].sort(
    (a, b) =>
      sizeOrder[a as keyof typeof sizeOrder] -
      sizeOrder[b as keyof typeof sizeOrder]
  );
  const availableColors = [...new Set(product.variants.map((v) => v.color))];
  const availableGenders = [...new Set(product.variants.map((v) => v.gender))];

  const price = selectedVariant ? Number(selectedVariant.price) : 0;
  const hasStock = selectedVariant ? selectedVariant.stock > 0 : false;

  const handleSizeChange = (size: string) => {
    const variant = product.variants.find(
      (v) =>
        v.size === size &&
        v.color === selectedVariant?.color &&
        v.gender === selectedVariant?.gender &&
        v.stock > 0
    );

    if (variant) setSelectedVariantId(variant.id);
  };

  const handleColorChange = (color: string) => {
    const variant =
      product.variants.find(
        (v) =>
          v.color === color &&
          v.size === selectedVariant?.size &&
          v.gender === selectedVariant?.gender &&
          v.stock > 0
      ) || product.variants.find((v) => v.color === color && v.stock > 0);

    if (variant) setSelectedVariantId(variant.id);
  };

  const handleGenderChange = (gender: string) => {
    const variant = product.variants.find(
      (v) =>
        v.gender === gender &&
        v.size === selectedVariant?.size &&
        v.color === selectedVariant?.color &&
        v.stock > 0
    );

    if (variant) setSelectedVariantId(variant.id);
  };

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={currentImage.url}
              alt={currentImage.altText || product.name}
              fill
              className="object-cover"
              priority
            />

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

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <PriceDisplay priceEUR={price} className="text-3xl font-bold" />

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-4">
            {availableSizes.length > 0 && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Talla: {selectedVariant?.size}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const hasVariantWithSize = product.variants.some(
                      (v) =>
                        v.size === size &&
                        v.color === selectedVariant?.color &&
                        v.gender === selectedVariant?.gender &&
                        v.stock > 0
                    );
                    const isSelected = selectedVariant?.size === size;

                    return (
                      <Button
                        key={size}
                        variant={isSelected ? "default" : "outline"}
                        disabled={!hasVariantWithSize}
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {availableColors.length > 1 && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Color: {selectedVariant?.color}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => {
                    const hasVariantWithColor = product.variants.some(
                      (v) => v.color === color && v.stock > 0
                    );
                    const isSelected = selectedVariant?.color === color;

                    return (
                      <Button
                        key={color}
                        variant={isSelected ? "default" : "outline"}
                        disabled={!hasVariantWithColor}
                        onClick={() => handleColorChange(color)}
                      >
                        {color}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {availableGenders.length > 1 && (
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Género: {selectedVariant?.gender}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenders.map((gender) => {
                    const hasVariantWithGender = product.variants.some(
                      (v) =>
                        v.gender === gender &&
                        v.size === selectedVariant?.size &&
                        v.color === selectedVariant?.color &&
                        v.stock > 0
                    );
                    const isSelected = selectedVariant?.gender === gender;

                    return (
                      <Button
                        key={gender}
                        variant={isSelected ? "default" : "outline"}
                        disabled={!hasVariantWithGender}
                        onClick={() => handleGenderChange(gender)}
                      >
                        {gender}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
