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
import { BcvDisplay } from "@/src/components/bcv/BcvDisplay";

export function HomePage() {
  const { data: products, isLoading: loadingProducts } = useFeaturedProducts(8);
  const { data: sections, isLoading: loadingSections } =
    usePublicLandingSections();

  return (
    <div className="flex flex-col">
      <HeroClient />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">

            {/* SIDEBAR — arriba en mobile, derecha en desktop */}
            <div className="w-full lg:w-[22%] lg:order-2 flex flex-col gap-6 justify-center">
              <div className="flex justify-center">
                <BcvDisplay />
              </div>
              <div className="w-full bg-[#C9BEA5] text-black p-8 border-4 border-black shadow-xl relative">
                <div className="absolute -bottom-3 -right-3 w-full h-full border-4 border-[#FF6501] pointer-events-none" />
                <h2 className="text-4xl font-black mb-5 uppercase">Visión</h2>
                <p className="font-bold leading-relaxed text-lg">
                  Ser la marca de ropa referente de aquellos que se atreven a
                  vestirse diferente a través de prendas que cuenten una historia
                </p>
              </div>
            </div>

            {/* DESTACADOS — abajo en mobile, izquierda en desktop */}
            <div className="w-full lg:w-[78%] lg:order-1">
              <div className="flex items-center gap-8 mb-12">
                <h2 className="text-5xl md:text-6xl font-bold tracking-wide uppercase" style={{ fontFamily: "var(--font-zuume-rough)" }}>Destacados</h2>
                <Button variant="outline" className="font-bold shrink-0" asChild>
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

          </div>
        </div>
      </section>

      <div className="min-h-[600px]">
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
    </div>
  );
}
