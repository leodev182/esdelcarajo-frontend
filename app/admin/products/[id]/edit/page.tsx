"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProductById } from "@/src/lib/hooks/useProducts";
import { ContentLoader } from "@/src/components/ui/ContentLoader";
import { useCategories } from "@/src/lib/hooks/useCategories";
import {
  useUpdateProduct,
  useDeleteProduct,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
  useAddProductImage,
  useDeleteProductImage,
  useUpdateImageVariants,
} from "@/src/lib/hooks/useAdminProducts";
import { ArrowLeft, Plus, Edit, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmModal, useConfirm } from "@/src/components/ui/ConfirmModal";
import { toast } from "sonner";
import type { ProductVariant } from "@/src/lib/types";
import { uploadProductImage } from "@/src/lib/api/admin-products.api";
import { getErrorMessage } from "@/src/lib/api/client";
import { logger } from "@/src/lib/utils/logger";
import * as Sentry from "@sentry/nextjs";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading } = useProductById(productId);
  const { data: categories } = useCategories();

  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createVariant = useCreateVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();
  const addImage = useAddProductImage();
  const deleteImage = useDeleteProductImage();
  const updateVariants = useUpdateImageVariants(productId);

  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingVariantIds, setEditingVariantIds] = useState<string[]>([]);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    categoryId: "",
    subcategoryId: "",
    isFeatured: false,
  });

  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  );
  const [isCreatingVariant, setIsCreatingVariant] = useState(false);
  const [variantForm, setVariantForm] = useState({
    sku: "",
    size: "M" as "S" | "M" | "L" | "XL" | "XXL" | "XXXL",
    color: "",
    shirtColor: "",
    gender: "MEN" as "MEN" | "WOMEN" | "KIDS",
    price: 0,
    stock: 0,
    shortDescription: "",
    features: "",
  });

  const [assigningImageToVariant, setAssigningImageToVariant] = useState<string | null>(null);
  const { confirm, confirmProps } = useConfirm();

  useEffect(() => {
    if (product) {
      setProductForm({
        name: product.name,
        description: product.description,
        longDescription: product.longDescription || "",
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId || "",
        isFeatured: product.isFeatured,
      });
    }
  }, [product]);

  if (isLoading) return <ContentLoader />;

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-[#FFFFFF]">Producto no encontrado</p>
        <Button onClick={() => router.push("/admin/products")} className="mt-4">
          Volver a productos
        </Button>
      </div>
    );
  }

  const selectedCategory = categories?.find(
    (c) => c.id === productForm.categoryId
  );

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProduct.mutateAsync({
        productId,
        payload: productForm,
      });
      toast.success("Producto actualizado");
    } catch (error) {
      logger.error("Error al actualizar producto", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteProduct = async () => {
    if (!(await confirm(`¿Eliminar el producto "${product.name}"?`))) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Producto eliminado");
      router.push("/admin/products");
    } catch (error) {
      logger.error("Error al eliminar producto", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleCreateVariant = async () => {
    if (!variantForm.sku || !variantForm.size || !variantForm.shirtColor) {
      toast.error("Completa SKU, talla y color de franela");
      return;
    }

    try {
      await createVariant.mutateAsync({
        productId,
        sku: variantForm.sku,
        size: variantForm.size,
        color: variantForm.color,
        shirtColor: variantForm.shirtColor || undefined,
        gender: variantForm.gender,
        price: variantForm.price,
        stock: variantForm.stock,
        shortDescription: variantForm.shortDescription || undefined,
        features: variantForm.features || undefined,
      });
      toast.success("Variante creada");
      setIsCreatingVariant(false);
      setVariantForm({
        sku: "",
        size: "M",
        color: "",
        shirtColor: "",
        gender: "MEN",
        price: 0,
        stock: 0,
        shortDescription: "",
        features: "",
      });
    } catch (error) {
      logger.error("Error al crear variante", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateVariant = async () => {
    if (!editingVariant) return;

    try {
      await updateVariant.mutateAsync({
        variantId: editingVariant.id,
        payload: {
          sku: variantForm.sku,
          size: variantForm.size,
          color: variantForm.color,
          shirtColor: variantForm.shirtColor || undefined,
          gender: variantForm.gender,
          price: variantForm.price,
          stock: variantForm.stock,
          shortDescription: variantForm.shortDescription || undefined,
          features: variantForm.features || undefined,
        },
      });
      toast.success("Variante actualizada");
      setEditingVariant(null);
      setVariantForm({
        sku: "",
        size: "M",
        color: "",
        shirtColor: "",
        gender: "MEN",
        price: 0,
        stock: 0,
        shortDescription: "",
        features: "",
      });
    } catch (error) {
      logger.error("Error al actualizar variante", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteVariant = async (variantId: string, variantSku: string) => {
    if (!(await confirm(`¿Eliminar la variante "${variantSku}"?`))) return;

    try {
      await deleteVariant.mutateAsync(variantId);
      toast.success("Variante eliminada");
    } catch (error) {
      logger.error("Error al eliminar variante", error);
      toast.error(getErrorMessage(error));
    }
  };

  const startEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantForm({
      sku: variant.sku,
      size: variant.size as "S" | "M" | "L" | "XL" | "XXL" | "XXXL",
      color: variant.color,
      shirtColor: variant.shirtColor || "",
      gender: variant.gender as "MEN" | "WOMEN" | "KIDS",
      price: Number(variant.price),
      stock: variant.stock,
      shortDescription: variant.shortDescription || "",
      features: variant.features || "",
    });
    setIsCreatingVariant(false);
  };

  return (
    <div>
      <ConfirmModal {...confirmProps} />
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-dark mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Editar Producto</h1>
        <Button
          variant="outline"
          onClick={handleDeleteProduct}
          disabled={deleteProduct.isPending}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Producto
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdateProduct}>
            <div className="bg-white rounded-lg border-2 border-dark p-6 space-y-4">
              <h2 className="text-xl font-bold">Información General</h2>

              <div>
                <label className="block text-sm font-bold mb-2">Nombre *</label>
                <Input
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Descripción *
                </label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Descripción Larga SEO (opcional)
                </label>
                <Textarea
                  value={productForm.longDescription}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      longDescription: e.target.value,
                    })
                  }
                  rows={6}
                  placeholder="Historia de la marca, inspiración del diseño, valores..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Aparece al final de la página del producto para mejorar SEO
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Categoría *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        categoryId: e.target.value,
                        subcategoryId: "",
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-dark rounded-lg"
                    required
                  >
                    <option value="">Selecciona categoría</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory?.subcategories &&
                  selectedCategory.subcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Subcategoría
                      </label>
                      <select
                        value={productForm.subcategoryId}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            subcategoryId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-dark rounded-lg"
                      >
                        <option value="">Sin subcategoría</option>
                        {selectedCategory.subcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.isFeatured}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      isFeatured: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-bold">
                  Producto destacado
                </label>
              </div>

              <Button
                type="submit"
                disabled={updateProduct.isPending}
                className="w-full"
              >
                {updateProduct.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>

          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Variantes ({product.variants.length})
              </h2>
              <Button
                size="sm"
                onClick={() => {
                  setIsCreatingVariant(true);
                  setEditingVariant(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Variante
              </Button>
            </div>

            {product.variants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay variantes. Crea la primera.
              </p>
            ) : (
              <div className="space-y-2">
                {product.variants.map((variant) => {
                  const variantImages = product.images.filter((img) =>
                    img.variants?.some((iv) => iv.variantId === variant.id)
                  );
                  const isAssigning = assigningImageToVariant === variant.id;

                  return (
                  <div key={variant.id} className="border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {variantImages[0] ? (
                          <img
                            src={variantImages[0].url}
                            alt={variant.sku}
                            className="w-12 h-12 object-cover rounded border shrink-0"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded border border-dashed border-gray-300 flex items-center justify-center shrink-0 cursor-pointer hover:border-primary"
                            onClick={() => setAssigningImageToVariant(isAssigning ? null : variant.id)}
                            title="Asignar imagen"
                          >
                            <Plus className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold">{variant.sku}</p>
                          <p className="text-sm text-gray-600">
                            {variant.size} · {variant.shirtColor || variant.color} · {variant.gender}
                          </p>
                          <p className="text-sm">
                            <span className="font-bold">Precio:</span> ${" "}
                            {Number(variant.price).toFixed(2)} ·{" "}
                            <span className="font-bold">Stock:</span>{" "}
                            {variant.stock}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAssigningImageToVariant(isAssigning ? null : variant.id)}
                          title="Asignar imagen"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          <span className="text-xs">Imagen</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditVariant(variant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteVariant(variant.id, variant.sku)}
                          disabled={deleteVariant.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {isAssigning && product.images.length > 0 && (
                      <div className="px-4 pb-4">
                        <p className="text-xs font-bold mb-2 text-gray-600">
                          Elige una imagen para esta variante:
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {product.images.map((img) => {
                            const linked = img.variants?.some(
                              (iv) => iv.variantId === variant.id
                            );
                            return (
                              <button
                                key={img.id}
                                type="button"
                                onClick={async () => {
                                  const currentIds =
                                    img.variants?.map((iv) => iv.variantId) ?? [];
                                  const newIds = linked
                                    ? currentIds.filter((id) => id !== variant.id)
                                    : [...currentIds, variant.id];
                                  try {
                                    await updateVariants.mutateAsync({
                                      imageId: img.id,
                                      variantIds: newIds,
                                    });
                                    toast.success(
                                      linked ? "Imagen desvinculada" : "Imagen asignada"
                                    );
                                  } catch (error) {
                                    logger.error("Error al actualizar imagen", error);
                                    toast.error(getErrorMessage(error));
                                  }
                                }}
                                className={`relative rounded border-2 overflow-hidden transition-all ${
                                  linked
                                    ? "border-primary"
                                    : "border-gray-200 hover:border-primary/50"
                                }`}
                              >
                                <img
                                  src={img.url}
                                  alt=""
                                  className="w-16 h-16 object-cover"
                                />
                                {linked && (
                                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-primary" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {product.images.length === 0 && (
                          <p className="text-xs text-gray-400">
                            Sube imágenes primero
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-4">
              Imágenes ({product.images.length}/5)
            </h2>

            {product.images.length < 5 && (
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">
                  Subir imagen a la galería
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const uploadResponse = await uploadProductImage(file);
                      await addImage.mutateAsync({
                        productId,
                        url: uploadResponse.url,
                        publicId: uploadResponse.publicId,
                        alt: product.name,
                        order: product.images.length + 1,
                      });
                      toast.success("Imagen subida. Asígnala a las variantes desde la lista.");
                      e.target.value = "";
                    } catch (error) {
                      const err = error instanceof Error ? error : new Error(String(error));
                      logger.error("Error al subir imagen de producto", err);
                      Sentry.captureException(err, {
                        tags: { action: "upload_product_image" },
                        extra: { productId, fileName: file.name, fileSize: file.size },
                      });
                      toast.error(getErrorMessage(error) || "Error al subir la imagen. Verifica el archivo e intenta nuevamente.");
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WEBP · Máximo 5MB · Asigna la imagen a las variantes desde la lista de arriba
                </p>
              </div>
            )}

            {product.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image) => {
                  const associatedVariants =
                    image.variants
                      ?.map((iv) =>
                        product.variants.find((v) => v.id === iv.variantId)
                      )
                      .filter(Boolean) || [];

                  const isEditing = editingImageId === image.id;

                  return (
                    <div key={image.id}>
                      <div className="relative group">
                        <img
                          src={image.url}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              if (isEditing) {
                                setEditingImageId(null);
                              } else {
                                setEditingImageId(image.id);
                                setEditingVariantIds(
                                  associatedVariants.map((v) => v!.id)
                                );
                              }
                            }}
                            className="p-1 bg-white rounded border hover:bg-gray-50"
                            title="Editar variantes"
                          >
                            <Edit className="h-3 w-3 text-gray-600" />
                          </button>
                          <label
                            className="p-1 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                            title="Cambiar imagen"
                          >
                            <Camera className="h-3 w-3 text-blue-600" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const currentVariantIds = associatedVariants.map((v) => v!.id);
                                  const uploadResponse = await uploadProductImage(file);
                                  await deleteImage.mutateAsync(image.id);
                                  await addImage.mutateAsync({
                                    productId,
                                    url: uploadResponse.url,
                                    publicId: uploadResponse.publicId,
                                    alt: product.name,
                                    order: product.images.length,
                                    variantIds: currentVariantIds,
                                  });
                                  toast.success("Imagen reemplazada");
                                  e.target.value = "";
                                } catch (error) {
                                  const err = error instanceof Error ? error : new Error(String(error));
                                  logger.error("Error al reemplazar imagen", err);
                                  Sentry.captureException(err, { tags: { action: "replace_product_image" }, extra: { imageId: image.id, productId } });
                                  toast.error(getErrorMessage(error) || "Error al reemplazar la imagen");
                                }
                              }}
                            />
                          </label>
                          <button
                            onClick={async () => {
                              try {
                                await deleteImage.mutateAsync(image.id);
                                toast.success("Imagen eliminada");
                              } catch (error) {
                                logger.error("Error al eliminar imagen", error);
                                toast.error(getErrorMessage(error));
                              }
                            }}
                            className="p-1 bg-white rounded border hover:bg-gray-50"
                            title="Eliminar imagen"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {associatedVariants.length > 0 ? (
                          associatedVariants.map((v) => (
                            <span
                              key={v!.id}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              {v!.size} · {v!.color}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            Sin variantes
                          </span>
                        )}
                      </div>

                      {isEditing && (
                        <div className="mt-2 p-3 border-2 border-primary rounded-lg space-y-2">
                          <p className="text-xs font-bold">Editar variantes:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {product.variants.map((v) => {
                              const sel = editingVariantIds.includes(v.id);
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() =>
                                    setEditingVariantIds((prev) =>
                                      sel
                                        ? prev.filter((id) => id !== v.id)
                                        : [...prev, v.id]
                                    )
                                  }
                                  className={`px-2 py-1 rounded-full text-xs border-2 transition-colors ${
                                    sel
                                      ? "border-primary bg-primary text-white"
                                      : "border-gray-300 text-gray-600 hover:border-primary"
                                  }`}
                                >
                                  {v.size} · {v.shirtColor || v.color}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs h-7"
                              onClick={() => setEditingImageId(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs h-7"
                              disabled={updateVariants.isPending}
                              onClick={async () => {
                                try {
                                  await updateVariants.mutateAsync({
                                    imageId: image.id,
                                    variantIds: editingVariantIds,
                                  });
                                  toast.success("Variantes actualizadas");
                                  setEditingImageId(null);
                                } catch (error) {
                                  logger.error("Error al actualizar variantes", error);
                                  toast.error(getErrorMessage(error));
                                }
                              }}
                            >
                              Guardar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No hay imágenes. Sube la primera.
              </p>
            )}
          </div>
        </div>

        <div>
          {(isCreatingVariant || editingVariant) && (
            <div className="bg-white rounded-lg border-2 border-dark p-6 sticky top-8 max-h-[calc(100dvh-4rem)] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingVariant ? "Editar Variante" : "Nueva Variante"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">SKU *</label>
                  <Input
                    value={variantForm.sku}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, sku: e.target.value })
                    }
                    placeholder="Ej: GOYO-M-NEGRO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Talla *
                  </label>
                  <select
                    value={variantForm.size}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        size: e.target.value as "S" | "M" | "L" | "XL" | "XXL" | "XXXL",
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-dark rounded-lg"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">2XL</option>
                    <option value="XXXL">3XL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Color de Estampado
                    <span className="text-xs font-normal text-gray-500 ml-1">(opcional)</span>

                  </label>
                  <Input
                    value={variantForm.color}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, color: e.target.value })
                    }
                    placeholder="Ej: Rojo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Color de Franela *
                  </label>
                  <Input
                    value={variantForm.shirtColor}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, shirtColor: e.target.value })
                    }
                    placeholder="Ej: Negra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Género *
                  </label>
                  <select
                    value={variantForm.gender}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        gender: e.target.value as "MEN" | "WOMEN" | "KIDS",
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-dark rounded-lg"
                  >
                    <option value="MEN">Hombre</option>
                    <option value="WOMEN">Mujer</option>
                    <option value="KIDS">Niños</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Precio (USD) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Stock *
                  </label>
                  <Input
                    type="number"
                    value={variantForm.stock}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Descripción Corta (opcional)
                  </label>
                  <Textarea
                    value={variantForm.shortDescription}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        shortDescription: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Descripción específica de esta variante..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 300 palabras. Aparece debajo del nombre del producto
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Características (opcional)
                  </label>
                  <Textarea
                    value={variantForm.features}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        features: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder='{"material":"100% Algodón","corte":"Regular Fit","cuello":"Redondo"}'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato JSON para lista con viñetas
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={
                      editingVariant ? handleUpdateVariant : handleCreateVariant
                    }
                    disabled={
                      createVariant.isPending || updateVariant.isPending
                    }
                  >
                    {editingVariant ? "Actualizar" : "Crear"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreatingVariant(false);
                      setEditingVariant(null);
                      setVariantForm({
                        sku: "",
                        size: "M",
                        color: "",
                        shirtColor: "",
                        gender: "MEN",
                        price: 0,
                        stock: 0,
                        shortDescription: "",
                        features: "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
