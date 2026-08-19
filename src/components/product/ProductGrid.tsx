import type { Product } from "@/src/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No se encontraron productos",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white">{emptyMessage}</p>
      </div>
    );
  }

  const sorted = [...products].sort((a, b) => {
    const aHasStock = a.variants.some((v) => v.stock > 0);
    const bHasStock = b.variants.some((v) => v.stock > 0);
    if (aHasStock === bHasStock) return 0;
    return aHasStock ? -1 : 1;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sorted.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
