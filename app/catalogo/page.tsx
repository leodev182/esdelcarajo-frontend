import { CatalogoPage } from "@/src/components/catalogo/CatalogoPage";

export const metadata = {
  title: "Catálogo",
  description: "Explora todo nuestro catálogo de ropa urbana venezolana. Franelas, accesorios y más con diseños exclusivos Del Carajo.",
  openGraph: {
    title: "Catálogo | Del Carajo",
    description: "Ropa urbana venezolana con actitud. Diseños exclusivos para los que se atreven.",
    url: "https://esdelcarajo.com/catalogo",
  },
};

export default function Catalogo() {
  return <CatalogoPage />;
}
