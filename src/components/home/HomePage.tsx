"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { useFeaturedProducts } from "@/src/lib/hooks/useProducts";
import { HeroClient } from "@/src/components/home/HeroClient";

export function HomePage() {
  const { data: products, isLoading } = useFeaturedProducts(8);

  return (
    <div className="flex flex-col">
      <HeroClient />

      <section className="py-20 bg-background">
        <div className="container px-6 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Productos Destacados</h2>
            <Button variant="outline" className="font-bold" asChild>
              <Link href="/catalogo">Ver todos</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-lg">Cargando productos...</p>
            </div>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </section>

      <section className="py-20 bg-beige-light/30">
        <div className="container px-6 md:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              href="/catalogo/carajos"
              className="group relative aspect-square overflow-hidden rounded-lg border-4 border-dark hover:border-primary transition-all hover:scale-105 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/80 flex items-center justify-center">
                <h3 className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform">
                  CARAJOS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/carajas"
              className="group relative aspect-square overflow-hidden rounded-lg border-4 border-dark hover:border-primary transition-all hover:scale-105 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/80 flex items-center justify-center">
                <h3 className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform">
                  CARAJAS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/carajitos"
              className="group relative aspect-square overflow-hidden rounded-lg border-4 border-dark hover:border-primary transition-all hover:scale-105 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/80 flex items-center justify-center">
                <h3 className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform">
                  CARAJITOS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/otras-vainas"
              className="group relative aspect-square overflow-hidden rounded-lg border-4 border-dark hover:border-primary transition-all hover:scale-105 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/80 flex items-center justify-center">
                <h3 className="text-2xl md:text-3xl font-black text-white group-hover:scale-110 transition-transform text-center px-2">
                  OTRAS VAINAS
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary via-orange-600 to-primary">
        <div className="container px-6 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-6 text-white uppercase">
              ¡Compra Aquí!
            </h2>
            <p className="text-xl mb-10 leading-relaxed text-white font-bold">
              Explora nuestro catálogo completo de ropa urbana venezolana
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="font-black text-lg px-10 py-6"
              asChild
            >
              <Link href="/catalogo">Ver Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
