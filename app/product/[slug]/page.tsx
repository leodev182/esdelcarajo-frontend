import { ProductDetailPage } from "@/src/components/product/ProductDetailPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productName = slug.replace(/-/g, " ").toUpperCase();

  return {
    title: `${productName} - Del Carajo`,
    description: `Compra ${productName} en Del Carajo`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
