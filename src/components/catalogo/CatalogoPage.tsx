"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/src/components/product/ProductGrid";
import { useProducts } from "@/src/lib/hooks/useProducts";
import { useCategories } from "@/src/lib/hooks/useCategories";
import { getCategoryStyle } from "@/src/lib/config/category-styles";
import { PRODUCTS_PER_PAGE } from "@/src/lib/utils/constants";

interface CatalogoPageProps {
  categoria?: string;
  subcategoria?: string;
}

export function CatalogoPage({ categoria, subcategoria }: CatalogoPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categories } = useCategories();

  const category =
    categoria && categories
      ? categories.find((cat) => cat.slug === categoria)
      : undefined;

  const categoryId = category?.id;

  const subcategory =
    subcategoria && category?.subcategories
      ? category.subcategories.find((sub) => sub.slug === subcategoria)
      : undefined;

  const subcategoryId = subcategory?.id;

  const styleConfig = getCategoryStyle(categoria, subcategoria);
  const backgroundClass = styleConfig?.background || "bg-white";
  const backgroundImage = styleConfig?.backgroundImage;
  const textColorClass = styleConfig?.textColor || "text-dark";
  const sideImage = styleConfig?.sideImage;

  const filters = {
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,
    ...(searchTerm && { search: searchTerm }),
    ...(categoryId && { categoryId }),
    ...(subcategoryId && { subcategoryId }),
  };

  const { data, isLoading, error } = useProducts(filters);

  const products = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const getCategoryName = (slug?: string) => {
    if (!slug) return "Todos los productos";

    const names: Record<string, string> = {
      carajos: "CARAJOS",
      carajas: "CARAJAS",
      carajitos: "CARAJITOS",
      "otras-vainas": "OTRAS VAINAS",
    };

    return names[slug] || slug.toUpperCase();
  };

  const getSubcategoryName = (slug?: string) => {
    if (!slug) return "";
    return slug.split("-").slice(1).join(" ").toUpperCase();
  };

  const pageTitle = subcategoria
    ? `${getSubcategoryName(subcategoria)} - ${getCategoryName(categoria)}`
    : getCategoryName(categoria);

  return (
    <div
      className={`min-h-screen ${backgroundClass}`}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className="container py-8 px-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <div className="mb-8">
              <h1 className={`text-4xl font-bold mb-4 ${textColorClass}`}>
                {pageTitle}
              </h1>

              <div className="flex gap-4 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando productos...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-destructive">Error al cargar productos</p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {data?.meta?.total || 0} producto
                  {data?.meta?.total !== 1 ? "s" : ""} encontrado
                  {data?.meta?.total !== 1 ? "s" : ""}
                </div>

                <ProductGrid
                  products={products}
                  emptyMessage="No se encontraron productos que coincidan con tu búsqueda"
                />

                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                    >
                      Anterior
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={
                                  page === currentPage ? "default" : "outline"
                                }
                                onClick={() => setCurrentPage(page)}
                                className="w-10"
                              >
                                {page}
                              </Button>
                            );
                          }

                          if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2">
                                ...
                              </span>
                            );
                          }

                          return null;
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {sideImage && (
            <div className="hidden lg:block">
              <div
                className="sticky top-24 h-[600px] bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${sideImage})` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
