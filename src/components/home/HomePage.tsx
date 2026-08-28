"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { useFeaturedProducts } from "@/src/lib/hooks/useProducts";
import { usePublicLandingSections } from "@/src/lib/hooks/useLanding";
import { HeroClient } from "@/src/components/home/HeroClient";
import { DynamicCarousel } from "@/src/components/home/DynamicCarousel";
import { DynamicSection } from "@/src/components/home/DynamicSection";
import { DynamicVideo } from "@/src/components/home/DynamicVideo";
import { DynamicGallery } from "@/src/components/home/DynamicGallery";

export function HomePage() {
  const { data: products, isLoading: loadingProducts } = useFeaturedProducts(8);
  const { data: sections, isLoading: loadingSections } =
    usePublicLandingSections();

  return (
    <div className="flex flex-col">
      <HeroClient />

      <section className="py-20 bg-background">
        <div className="container px-6 md:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl md:text-6xl font-bold tracking-wide uppercase">Destacados</h2>
            <Button variant="outline" className="font-bold" asChild>
              <Link href="/catalogo">Ver todos</Link>
            </Button>
          </div>

          {loadingProducts ? (
            <div className="text-center py-12">
              <p className="text-lg">Cargando productos…</p>
            </div>
          ) : (
            <ProductGrid products={products || []} />
          )}
        </div>
      </section>

      {!loadingSections &&
        sections &&
        sections.map((section, index) => (
          <div key={section.id} className={index > 0 ? "mt-20" : ""}>
            {section.type === "CAROUSEL" ? (
              <DynamicCarousel section={section} />
            ) : section.type === "VIDEO" ? (
              <DynamicVideo section={section} />
            ) : section.type === "GALLERY" ? (
              <DynamicGallery section={section} />
            ) : (
              <DynamicSection section={section} />
            )}
          </div>
        ))}
    </div>
  );
}
