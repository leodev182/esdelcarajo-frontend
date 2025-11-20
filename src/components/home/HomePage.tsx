"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { useFeaturedProducts } from "@/src/lib/hooks/useProducts";

export function HomePage() {
  const { data: products, isLoading } = useFeaturedProducts(8);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-background to-background py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">DEL CARAJO</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Devotos del Arte
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Nuestra web está caída pero con los kilos...
              <br />
              Nos descubriste, la estamos haciendo desde cero.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/catalogo">Ver Catálogo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/catalogo/carajos">Carajos</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-10 right-10 text-primary/10 text-9xl font-bold pointer-events-none hidden md:block">
          ⚡
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <Button variant="outline" asChild>
              <Link href="/catalogo">Ver todos</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/catalogo/carajos"
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-2xl font-bold group-hover:scale-110 transition-transform">
                  CARAJOS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/carajas"
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-2xl font-bold group-hover:scale-110 transition-transform">
                  CARAJAS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/carajitos"
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-2xl font-bold group-hover:scale-110 transition-transform">
                  CARAJITOS
                </h3>
              </div>
            </Link>

            <Link
              href="/catalogo/otras-vainas"
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-border hover:border-primary transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <h3 className="text-xl font-bold group-hover:scale-110 transition-transform text-center px-2">
                  OTRAS VAINAS
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Mientras tanto, compra aquí
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explora nuestro catálogo completo de ropa urbana venezolana
            </p>
            <Button size="lg" asChild>
              <Link href="/catalogo">Ir al Catálogo Completo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
