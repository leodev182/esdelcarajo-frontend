"use client";

import Link from "next/link";
import { useCategoryWithSubcategories } from "@/src/lib/hooks/useCategories";
import { ChevronRight } from "lucide-react";

interface MegaMenuProps {
  categorySlug: string;
  isOpen: boolean;
}

export function MegaMenu({ categorySlug, isOpen }: MegaMenuProps) {
  const { data: category, isLoading } =
    useCategoryWithSubcategories(categorySlug);

  if (!isOpen) return null;

  return (
    <div className="absolute left-0 top-full w-full bg-white border-t-4 border-primary shadow-lg z-50">
      <div className="container px-6 py-8">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-sm">Cargando...</p>
          </div>
        ) : category?.subcategories && category.subcategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/catalogo/${categorySlug}/${subcategory.slug}`}
                className="group flex items-center gap-2 p-3 rounded-lg hover:bg-beige-light transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                <span className="font-bold text-sm uppercase">
                  {subcategory.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
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
