"use client";

import { useFavorites } from "@/src/lib/hooks/useFavorites";
import { useCart } from "@/src/lib/hooks/useCart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function FavoritosPage() {
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const { addToCart, isAddingToCart } = useCart();

  const handleRemove = async (favoriteId: string, productName: string) => {
    try {
      removeFavorite(favoriteId);
      toast.success(`${productName} eliminado de favoritos`);
    } catch {
      toast.error("Error al eliminar de favoritos");
    }
  };

  const handleAddToCart = async (
    variantId: string,
    productName: string,
    favoriteId: string
  ) => {
    try {
      addToCart({ variantId, quantity: 1 });
      removeFavorite(favoriteId);
      toast.success(`${productName} agregado al carrito`);
    } catch {
      toast.error("Error al agregar al carrito");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl">Cargando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Mis Favoritos</h1>

      {!favorites || favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">
            No tienes productos favoritos
          </p>
          <Link href="/catalogo">
            <Button>Ir a Comprar</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => {
            const product = favorite.product;
            const firstVariant = product.variants[0];
            const mainImage = product.images[0];

            return (
              <div
                key={favorite.id}
                className="bg-white rounded-lg border-2 border-dark overflow-hidden"
              >
                <Link href={`/producto/${product.slug}`}>
                  <div className="aspect-square bg-gray-100 relative">
                    {mainImage ? (
                      <img
                        src={mainImage.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/producto/${product.slug}`}>
                    <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {firstVariant && (
                    <p className="text-xl font-bold text-primary mb-3">
                      $ {Number(firstVariant.price).toFixed(2)}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {firstVariant && firstVariant.stock > 0 ? (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleAddToCart(
                            firstVariant.id,
                            product.name,
                            favorite.id
                          )
                        }
                        disabled={isAddingToCart}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Al Carrito
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1" disabled>
                        Sin Stock
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(favorite.id, product.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
