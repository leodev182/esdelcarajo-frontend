import type { Metadata } from "next";
import { ProductDetailPage } from "@/src/components/product/ProductDetailPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
const BASE_URL = "https://esdelcarajo.com";

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/products/slug/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Producto | Del Carajo",
      description: "Ropa urbana venezolana con actitud. Del Carajo — Devotos del Arte.",
    };
  }

  const price = product.variants?.[0]?.price;
  const image = product.images?.[0]?.url;
  const inStock = product.variants?.some((v: { stock: number }) => v.stock > 0);
  const description = product.description
    ? `${product.description} Disponible en Del Carajo.`
    : `Compra ${product.name} en Del Carajo. Ropa urbana venezolana con actitud.${price ? ` Desde $${price} USD.` : ""}`;

  return {
    title: `${product.name} | Del Carajo`,
    description,
    openGraph: {
      title: `${product.name} | Del Carajo`,
      description,
      url: `${BASE_URL}/product/${slug}`,
      siteName: "Del Carajo",
      images: image ? [{ url: image, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Del Carajo`,
      description,
      images: image ? [image] : [],
    },
    other: {
      "product:price:amount": price ? String(price) : "",
      "product:price:currency": "USD",
      "product:availability": inStock ? "in stock" : "out of stock",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || `${product.name} — Del Carajo`,
        image: product.images?.[0]?.url,
        url: `${BASE_URL}/product/${slug}`,
        brand: { "@type": "Brand", name: "Del Carajo" },
        offers: product.variants?.map((v: { price: number; stock: number; sku: string }) => ({
          "@type": "Offer",
          price: v.price,
          priceCurrency: "USD",
          availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          sku: v.sku,
          seller: { "@type": "Organization", name: "Del Carajo" },
        })),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailPage slug={slug} />
    </>
  );
}
