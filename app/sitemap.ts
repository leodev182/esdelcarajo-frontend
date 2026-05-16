import { MetadataRoute } from "next";
import { Category, PaginatedResponse, Product } from "@/src/lib/types";

const BASE_URL = "https://esdelcarajo.com";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function fetchAllProducts(): Promise<Product[]> {
  const limit = 100;
  let page = 1;
  const all: Product[] = [];

  while (true) {
    const res = await fetch(
      `${API_URL}/products?limit=${limit}&page=${page}&isActive=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) break;

    const data: PaginatedResponse<Product> = await res.json();
    all.push(...data.data);

    if (page >= data.meta.totalPages) break;
    page++;
  }

  return all;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap(
    (category) => {
      const categoryEntry: MetadataRoute.Sitemap[number] = {
        url: `${BASE_URL}/catalogo/${category.slug}`,
        lastModified: new Date(category.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      };

      const subcategoryEntries: MetadataRoute.Sitemap =
        (category.subcategories ?? []).map((sub) => ({
          url: `${BASE_URL}/catalogo/${category.slug}/${sub.slug}`,
          lastModified: new Date(sub.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));

      return [categoryEntry, ...subcategoryEntries];
    }
  );

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
