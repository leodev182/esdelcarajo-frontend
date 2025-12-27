"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/src/lib/hooks/useCategories";
import { useCreateProduct } from "@/src/lib/hooks/useAdminProducts";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const createProduct = useCreateProduct();

  const [form, setForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    categoryId: "",
    subcategoryId: "",
    isFeatured: false,
  });

  const selectedCategory = categories?.find((c) => c.id === form.categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.categoryId) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    try {
      const product = await createProduct.mutateAsync({
        name: form.name,
        description: form.description,
        longDescription: form.longDescription || undefined,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || undefined,
        isFeatured: form.isFeatured,
      });

      toast.success("Producto creado");
      router.push(`/admin/products/${product.id}/edit`);
    } catch {
      toast.error("Error al crear producto");
    }
  };

  if (loadingCategories) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-dark mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <h1 className="text-4xl font-bold mb-8">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg border-2 border-dark p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">
              Nombre del Producto *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Franela Goyo Classic"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Descripción Corta *
            </label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descripción breve que aparece en listados..."
              rows={3}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Descripción principal del producto
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              Descripción Larga SEO (opcional)
            </label>
            <Textarea
              value={form.longDescription}
              onChange={(e) =>
                setForm({ ...form, longDescription: e.target.value })
              }
              placeholder="Descripción detallada para SEO, historia de la marca, inspiración del diseño..."
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Aparece al final de la página del producto para mejorar SEO
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Categoría *</label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryId: e.target.value,
                  subcategoryId: "",
                })
              }
              className="w-full px-3 py-2 border-2 border-dark rounded-lg"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory?.subcategories &&
            selectedCategory.subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-bold mb-2">
                  Subcategoría (opcional)
                </label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) =>
                    setForm({ ...form, subcategoryId: e.target.value })
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="isFeatured" className="text-sm font-bold">
              Producto destacado
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createProduct.isPending}
              className="flex-1"
            >
              {createProduct.isPending ? "Creando..." : "Crear Producto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
