import { CatalogoPage } from "@/src/components/catalogo/CatalogoPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; subcategoria: string }>;
}) {
  const { categoria, subcategoria } = await params;
  const categoriaName = categoria.replace("-", " ").toUpperCase();
  const subcategoriaName = subcategoria
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${subcategoriaName} - ${categoriaName} - Del Carajo`,
    description: `Explora nuestra colección de ${subcategoriaName} en ${categoriaName}`,
  };
}

export default async function SubcategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string; subcategoria: string }>;
}) {
  const { categoria, subcategoria } = await params;
  return <CatalogoPage categoria={categoria} subcategoria={subcategoria} />;
}
