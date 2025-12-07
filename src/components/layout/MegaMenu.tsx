"use client";

import Link from "next/link";
import { useCategoryWithSubcategories } from "@/src/lib/hooks/useCategories";

interface MegaMenuProps {
  categorySlug: string;
  isOpen: boolean;
}

export function MegaMenu({ categorySlug, isOpen }: MegaMenuProps) {
  const { data: category, isLoading } =
    useCategoryWithSubcategories(categorySlug);

  if (!isOpen) return null;

  return (
    <div
      className="
    absolute left-1/2 -translate-x-1/2 top-full
    bg-[#C9BEA5]/20 backdrop-blur-md
    border-1 border-dark 
    rounded-xl
    px-6 py-4
    shadow-lg
    z-50
    min-w-[220px]
  "
    >
      <div className="container text-[#2D2834] mx-auto px-6 py-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm font-bold">Cargando...</p>
          </div>
        ) : category?.subcategories && category.subcategories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/catalogo/${categorySlug}/${subcategory.slug}`}
                className="min-w-[120px] px-6 py-3 bg-beige-light rounded-lg border-2 border-dark font-bold text-sm text-center uppercase hover:bg-primary hover:text-white transition-all"
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Link
              href={`/catalogo/${categorySlug}`}
              className="font-bold text-primary hover:underline"
            >
              Ver todos los productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
