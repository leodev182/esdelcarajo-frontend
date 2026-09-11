"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useCategoryWithSubcategories } from "@/src/lib/hooks/useCategories";

const MAIN_CATEGORIES = [
  { name: "CARAJOS", slug: "carajos" },
  { name: "CARAJAS", slug: "carajas" },
  { name: "CARAJITOS", slug: "carajitos" },
  { name: "OTRAS VAINAS", slug: "otras-vainas" },
];

function CategoryItem({
  category,
  onClose,
}: {
  category: { name: string; slug: string };
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { data } = useCategoryWithSubcategories(category.slug);
  const hasSubcats = (data?.subcategories?.length ?? 0) > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-2 text-white hover:text-[#E1D7D7] hover:bg-white/10 transition-colors cursor-pointer">
        <Link
          href={`/catalogo/${category.slug}`}
          onClick={onClose}
          className="flex-1"
        >
          {category.name}
        </Link>
        {hasSubcats && <ChevronRight className="h-3.5 w-3.5 opacity-60 shrink-0" />}
      </div>

      {/* Submenu a la derecha */}
      {open && hasSubcats && (
        <div className="absolute left-full top-0 ml-1 w-max min-w-[8rem] rounded-2xl border border-white/20 bg-black/80 backdrop-blur-md shadow-xl py-3 z-50">
          {data!.subcategories!.map((sub) => (
            <Link
              key={sub.id}
              href={`/catalogo/${category.slug}/${sub.slug}`}
              onClick={onClose}
              className="block px-6 py-2 text-white hover:text-[#E1D7D7] hover:bg-white/10 transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface GarageMenuProps {
  onClose: () => void;
}

export function GarageMenu({ onClose }: GarageMenuProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max min-w-[14rem] rounded-2xl border border-white/20 bg-black/80 backdrop-blur-md shadow-xl py-3 z-50">
      {/* Tendedero → /catalogo */}
      <Link
        href="/catalogo"
        onClick={onClose}
        className="block px-6 py-2 text-white hover:text-[#E1D7D7] hover:bg-white/10 transition-colors text-2xl font-bold tracking-widest"
      >
        TENDEDERO
      </Link>
      <div className="my-2 border-t border-white/10" />

      {/* Categorías con submenu */}
      {MAIN_CATEGORIES.map((cat) => (
        <CategoryItem key={cat.slug} category={cat} onClose={onClose} />
      ))}
    </div>
  );
}
