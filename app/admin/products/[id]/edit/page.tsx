"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProductById } from "@/src/lib/hooks/useProducts";
import { useCategories } from "@/src/lib/hooks/useCategories";
import {
  useUpdateProduct,
  useDeleteProduct,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
  useAddProductImage,
  useDeleteProductImage,
} from "@/src/lib/hooks/useAdminProducts";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { ProductVariant } from "@/src/lib/types";
import { uploadProductImage } from "@/src/lib/api/admin-products.api";

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
    size: "M" as "S" | "M" | "L" | "XL",
    color: "",
    gender: "MEN" as "MEN" | "WOMEN" | "KIDS",
    price: 0,
    stock: 0,
    shortDescription: "",
    features: "",
  });

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Cargando producto...</p>
      </div>
    );
  }

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
    } catch {
      toast.error("Error al actualizar producto");
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm(`¿Eliminar el producto "${product.name}"?`)) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Producto eliminado");
      router.push("/admin/products");
    } catch {
      toast.error("Error al eliminar producto");
    }
  };

  const handleCreateVariant = async () => {
    if (!variantForm.sku || !variantForm.size || !variantForm.color) {
      toast.error("Completa todos los campos de la variante");
      return;
    }

    try {
      await createVariant.mutateAsync({
        productId,
        sku: variantForm.sku,
        size: variantForm.size,
        color: variantForm.color,
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
        gender: "MEN",
        price: 0,
        stock: 0,
        shortDescription: "",
        features: "",
      });
    } catch {
      toast.error("Error al crear variante");
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
          gender: variantForm.gender,
          price: variantForm.price,
          stock: variantForm.stock,
        },
      });
      toast.success("Variante actualizada");
      setEditingVariant(null);
      setVariantForm({
        sku: "",
        size: "M",
        color: "",
        gender: "MEN",
        price: 0,
        stock: 0,
        shortDescription: "",
        features: "",
      });
    } catch {
      toast.error("Error al actualizar variante");
    }
  };

  const handleDeleteVariant = async (variantId: string, variantSku: string) => {
    if (!confirm(`¿Eliminar la variante "${variantSku}"?`)) return;

    try {
      await deleteVariant.mutateAsync(variantId);
      toast.success("Variante eliminada");
    } catch {
      toast.error("Error al eliminar variante");
    }
  };

  const startEditVariant = (variant: ProductVariant) => {
    const startEditVariant = (variant: ProductVariant) => {
      setEditingVariant(variant);
      setVariantForm({
        sku: variant.sku,
        size: variant.size as "S" | "M" | "L" | "XL",
        color: variant.color,
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
                  <label className="block text-sm font-bold mb-2">
                    Nombre *
                  </label>
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
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-bold">{variant.sku}</p>
                        <p className="text-sm text-gray-600">
                          {variant.size} · {variant.color} · {variant.gender}
                        </p>
                        <p className="text-sm">
                          <span className="font-bold">Precio:</span> ${" "}
                          {Number(variant.price).toFixed(2)} ·{" "}
                          <span className="font-bold">Stock:</span>{" "}
                          {variant.stock}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
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
                          onClick={() =>
                            handleDeleteVariant(variant.id, variant.sku)
                          }
                          disabled={deleteVariant.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border-2 border-dark p-6">
              <h2 className="text-xl font-bold mb-4">
                Imágenes ({product.images.length}/5)
              </h2>

              {product.images.length < 5 && (
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 pb-2 border-b">
                      Asociar imagen a variantes:
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Selecciona todas las variantes que compartan esta imagen
                      (ej: todas las tallas del mismo color)
                    </p>

                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                      {product.variants.map((v) => (
                        <label
                          key={v.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={v.id}
                            className="variant-checkbox w-4 h-4"
                          />
                          <span className="text-sm">
                            {v.sku} ({v.size} - {v.color} - {v.gender})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Subir nueva imagen
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const checkboxes = document.querySelectorAll(
                          ".variant-checkbox:checked"
                        ) as NodeListOf<HTMLInputElement>;
                        const selectedVariantIds = Array.from(checkboxes).map(
                          (cb) => cb.value
                        );

                        if (selectedVariantIds.length === 0) {
                          toast.error("Selecciona al menos una variante");
                          return;
                        }

                        try {
                          const uploadResponse = await uploadProductImage(file);

                          await addImage.mutateAsync({
                            productId,
                            variantIds: selectedVariantIds,
                            url: uploadResponse.url,
                            publicId: uploadResponse.publicId,
                            alt: product.name,
                            order: product.images.length + 1,
                          });

                          toast.success(
                            `Imagen asociada a ${selectedVariantIds.length} variante(s)`
                          );
                          e.target.value = "";

                          checkboxes.forEach((cb) => (cb.checked = false));
                        } catch {
                          toast.error("Error al subir imagen");
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPG, PNG, WEBP · Máximo 5MB
                    </p>
                  </div>
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

                    return (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded border"
                        />
                        {associatedVariants.length > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1">
                            <p className="font-bold text-center">
                              {associatedVariants.length} variante(s)
                            </p>
                            <p className="text-center truncate">
                              {associatedVariants.map((v) => v?.sku).join(", ")}
                            </p>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              await deleteImage.mutateAsync(image.id);
                              toast.success("Imagen eliminada");
                            } catch {
                              toast.error("Error al eliminar imagen");
                            }
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
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
              <div className="bg-white rounded-lg border-2 border-dark p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-4">
                  {editingVariant ? "Editar Variante" : "Nueva Variante"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      SKU *
                    </label>
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
                          size: e.target.value as "S" | "M" | "L" | "XL",
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-dark rounded-lg"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Color *
                    </label>
                    <Input
                      value={variantForm.color}
                      onChange={(e) =>
                        setVariantForm({
                          ...variantForm,
                          color: e.target.value,
                        })
                      }
                      placeholder="Ej: Negro"
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
                      Max 300 palabras
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
                      Formato JSON para lisatas con viñetas
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={
                        editingVariant
                          ? handleUpdateVariant
                          : handleCreateVariant
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
  };
}
