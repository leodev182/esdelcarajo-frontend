"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/src/lib/utils";
import type { Product } from "@/src/lib/types";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useFavorites, useIsFavorite } from "@/src/lib/hooks/useFavorites";
import { toast } from "sonner";
import { PriceDisplay } from "./PriceDisplay";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, favorites } = useFavorites();

  const mainImage = product.images[0]?.url || "/placeholder.png";
  const minPrice = Math.min(...product.variants.map((v) => Number(v.price)));
  const hasStock = product.variants.some((v) => v.stock > 0);

  const favoriteItem = favorites.find((fav) => fav.product.id === product.id);
  const isFavorite = !!favoriteItem;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isFavorite && favoriteItem) {
      removeFavorite(favoriteItem.id);
      toast.success("Eliminado de favoritos");
    } else {
      addFavorite({ productId: product.id });
      toast.success("Agregado a favoritos");
    }
  };

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {product.isFeatured && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              DESTACADO
            </div>
          )}

          {!hasStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-lg font-bold">
                DE VUELTA <br /> PRÓXIMAMENTE
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-semibold truncate hover:text-primary transition-colors text-[#FF6501]">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-[#FF6501] font-semibold">
              {product.category?.name}
            </p>
          </div>

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <PriceDisplay
            priceEUR={minPrice}
            className="text-lg text-[#FF6501] font-bold"
          />
          {hasStock && (
            <span className="text-xs text-[#FF6501] font-semibold">
              {product.variants.length} variante
              {product.variants.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
