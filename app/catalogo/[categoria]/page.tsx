import { CatalogoPage } from "@/src/components/catalogo/CatalogoPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const categoriaName = categoria.replace("-", " ").toUpperCase();

  return {
    title: `${categoriaName} - Del Carajo`,
    description: `Explora nuestra colección de ${categoriaName}`,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  return <CatalogoPage categoria={categoria} />;
}
