export interface CategoryStyle {
  background: string;
  backgroundImage?: string;
  textColor?: string;
  sideImage: string;
  subcategories?: {
    [key: string]: {
      sideImage: string;
    };
  };
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  carajos: {
    background: "bg-cover bg-center bg-no-repeat",
    backgroundImage: "/images/fondo-categorias.png",
    textColor: "text-white",
    sideImage: "/images/carajos-franelas.png", // Imagen por defecto de la categoría
    subcategories: {
      "carajos-franelas": {
        sideImage: "/images/carajos-franelas.png",
      },
      "carajos-hoodies": {
        sideImage: "/images/carajos-hoodies.png",
      },
    },
  },
  carajas: {
    background: "bg-cover bg-center bg-no-repeat",
    backgroundImage: "/images/fondo-categorias.png",
    textColor: "text-white",
    sideImage: "/images/carajas-franelas.png", // Imagen por defecto
    subcategories: {
      "carajas-franelas": {
        sideImage: "/images/carajas-franelas.png",
      },
      "carajas-hoodies": {
        sideImage: "/images/carajas-hoodies.png",
      },
    },
  },
  carajitos: {
    background: "bg-cover bg-center bg-no-repeat",
    backgroundImage: "/images/fondo-categorias.png",
    textColor: "text-white",
    sideImage: "/images/carajitos-franelas.png",
    subcategories: {
      // Agregar subcategorias
    },
  },
  "otras-vainas": {
    background: "bg-cover bg-center bg-no-repeat",
    backgroundImage: "/images/fondo-categorias.png",
    textColor: "text-white",
    sideImage: "/images/devotowhite.png",
    subcategories: {
      // Agregar subcategorias
    },
  },
};

export function getCategoryStyle(
  categorySlug?: string,
  subcategorySlug?: string
): CategoryStyle | null {
  if (!categorySlug) return null;

  const categoryConfig = CATEGORY_STYLES[categorySlug];
  if (!categoryConfig) return null;

  if (subcategorySlug && categoryConfig.subcategories) {
    const subcategoryConfig = categoryConfig.subcategories[subcategorySlug];
    if (subcategoryConfig) {
      return {
        ...categoryConfig,
        sideImage: subcategoryConfig.sideImage,
      };
    }
  }

  return categoryConfig;
}
