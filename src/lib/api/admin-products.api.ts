import { apiClient } from "./client";
import type { Product, ProductVariant, ProductImage } from "../types";

// ==================== TYPES ====================

export interface CreateProductPayload {
  name: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  subcategoryId?: string;
  isFeatured?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  longDescription?: string;
  categoryId?: string;
  subcategoryId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface CreateVariantPayload {
  productId: string;
  sku: string;
  size: "S" | "M" | "L" | "XL";
  color: string;
  gender: "MEN" | "WOMEN" | "KIDS";
  price: number;
  stock: number;
  shortDescription?: string;
  features?: string;
}

export interface UpdateVariantPayload {
  sku?: string;
  size?: "S" | "M" | "L" | "XL";
  color?: string;
  gender?: "MEN" | "WOMEN" | "KIDS";
  price?: number;
  stock?: number;
  shortDescription?: string;
  features?: string;
}

export interface CreateProductImagePayload {
  productId: string;
  variantIds?: string[];
  url: string;
  publicId: string;
  alt: string;
  order: number;
}

// ==================== PRODUCTOS ====================

export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  const { data } = await apiClient.post<Product>("/products", payload);
  return data;
}

export async function updateProduct(
  productId: string,
  payload: UpdateProductPayload
): Promise<Product> {
  const { data } = await apiClient.patch<Product>(
    `/products/${productId}`,
    payload
  );
  return data;
}

export async function deleteProduct(productId: string): Promise<void> {
  await apiClient.delete(`/products/${productId}`);
}

// ==================== VARIANTES ====================

export async function createVariant(
  payload: CreateVariantPayload
): Promise<ProductVariant> {
  const { data } = await apiClient.post<ProductVariant>(
    "/products/variants",
    payload
  );
  return data;
}

export async function updateVariant(
  variantId: string,
  payload: UpdateVariantPayload
): Promise<ProductVariant> {
  const { data } = await apiClient.patch<ProductVariant>(
    `/products/variants/${variantId}`,
    payload
  );
  return data;
}

export async function deleteVariant(variantId: string): Promise<void> {
  await apiClient.delete(`/products/variants/${variantId}`);
}

// ==================== IMÁGENES ====================

export async function addProductImage(
  payload: CreateProductImagePayload
): Promise<ProductImage> {
  const { data } = await apiClient.post<ProductImage>(
    "/products/images",
    payload
  );
  return data;
}

export async function deleteProductImage(imageId: string): Promise<void> {
  await apiClient.delete(`/products/images/${imageId}`);
}

export async function uploadProductImage(file: File): Promise<{
  url: string;
  publicId: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<{
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    size: number;
  }>("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    url: data.url,
    publicId: data.publicId,
  };
}
