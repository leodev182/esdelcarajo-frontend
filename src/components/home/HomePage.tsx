"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { useFeaturedProducts } from "@/src/lib/hooks/useProducts";

export function HomePage() {
  const { data: products, isLoading } = useFeaturedProducts(8);

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-beige-light via-background to-background py-24 md:py-40">
        <div className="container px-6 md:px-8">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              DEL CARAJO
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-6 text-primary">
              Devotos del Arte
            </p>
            <p className="text-lg md:text-xl mb-12 leading-relaxed">
              Nuestra web está caída pero con los kilos...
              <br />
              Nos descubriste, la estamos haciendo desde cero.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="font-bold text-base" asChild>
                <Link href="/catalogo">Ver Catálogo</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold text-base"
                asChild
              >
                <Link href="/catalogo/carajos">Carajos</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-10 right-10 text-primary/10 text-9xl font-bold pointer-events-none hidden md:block">
          ⚡
        </div>
      </section>

      <section className="py-20">
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
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dark hover:border-primary transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-2xl md:text-3xl font-bold group-hover:scale-110 transition-transform">
                  CARAJOS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/carajas"
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dark hover:border-primary transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-2xl md:text-3xl font-bold group-hover:scale-110 transition-transform">
                  CARAJAS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/carajitos"
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dark hover:border-primary transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-2xl md:text-3xl font-bold group-hover:scale-110 transition-transform">
                  CARAJITOS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/otras-vainas"
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dark hover:border-primary transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-xl md:text-2xl font-bold group-hover:scale-110 transition-transform text-center px-2">
                  OTRAS VAINAS
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-6 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Mientras tanto, compra aquí
            </h2>
            <p className="text-lg mb-10 leading-relaxed">
              Explora nuestro catálogo completo de ropa urbana venezolana
            </p>
            <Button size="lg" className="font-bold text-base" asChild>
              <Link href="/catalogo">Ir al Catálogo Completo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
