"use client";

import { useState } from "react";
import { useCategories } from "@/src/lib/hooks/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
} from "@/src/lib/hooks/useAdminCategories";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Category, Subcategory } from "@/src/lib/types";

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState<
    string | null
  >(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    color: "#FF6501",
    order: 0,
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    order: 0,
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    try {
      await createCategory.mutateAsync(categoryForm);
      toast.success("Categoría creada");
      setCategoryForm({
        name: "",
        description: "",
        color: "#FF6501",
        order: 0,
      });
      setIsCreatingCategory(false);
    } catch {
      toast.error("Error al crear categoría");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      await updateCategory.mutateAsync({
        categoryId: editingCategory.id,
        payload: categoryForm,
      });
      toast.success("Categoría actualizada");
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        description: "",
        color: "#FF6501",
        order: 0,
      });
    } catch {
      toast.error("Error al actualizar categoría");
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    if (!confirm(`¿Eliminar la categoría "${categoryName}"?`)) return;

    try {
      await deleteCategory.mutateAsync(categoryId);
      toast.success("Categoría eliminada");
    } catch (error: unknown) {
      const message =
        (error as any).response?.data?.message || "Error al eliminar categoría";
      toast.error(message);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!subcategoryForm.name.trim() || !subcategoryForm.categoryId) {
      toast.error("Nombre y categoría son requeridos");
      return;
    }

    try {
      await createSubcategory.mutateAsync(subcategoryForm);
      toast.success("Subcategoría creada");
      setSubcategoryForm({
        categoryId: "",
        name: "",
        description: "",
        order: 0,
      });
      setIsCreatingSubcategory(null);
    } catch {
      toast.error("Error al crear subcategoría");
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!editingSubcategory) return;

    try {
      await updateSubcategory.mutateAsync({
        subcategoryId: editingSubcategory.id,
        payload: subcategoryForm,
      });
      toast.success("Subcategoría actualizada");
      setEditingSubcategory(null);
      setSubcategoryForm({
        categoryId: "",
        name: "",
        description: "",
        order: 0,
      });
    } catch {
      toast.error("Error al actualizar subcategoría");
    }
  };

  const handleDeleteSubcategory = async (
    subcategoryId: string,
    subcategoryName: string
  ) => {
    if (!confirm(`¿Eliminar la subcategoría "${subcategoryName}"?`)) return;

    try {
      await deleteSubcategory.mutateAsync(subcategoryId);
      toast.success("Subcategoría eliminada");
    } catch (error: unknown) {
      const message =
        (error as any).response?.data?.message ||
        "Error al eliminar subcategoría";
      toast.error(message);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      color: category.color || "#FF6501",
      order: category.order,
    });
    setIsCreatingCategory(false);
  };

  const startEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      categoryId: subcategory.categoryId,
      name: subcategory.name,
      description: subcategory.description || "",
      order: subcategory.order,
    });
    setIsCreatingSubcategory(null);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubcategory(null);
    setIsCreatingCategory(false);
    setIsCreatingSubcategory(null);
    setCategoryForm({ name: "", description: "", color: "#FF6501", order: 0 });
    setSubcategoryForm({ categoryId: "", name: "", description: "", order: 0 });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Categorías</h1>
        <Button onClick={() => setIsCreatingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border-2 border-dark p-6">
            {!categories || categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No hay categorías</p>
                <Button onClick={() => setIsCreatingCategory(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Categoría
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="text-gray-500 hover:text-dark"
                        >
                          {expandedCategories.has(category.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className="font-bold">{category.name}</p>
                          <p className="text-sm text-gray-500">
                            {category.slug} •{" "}
                            {category.subcategories?.length || 0} subcategorías
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsCreatingSubcategory(category.id);
                            setSubcategoryForm({
                              categoryId: category.id,
                              name: "",
                              description: "",
                              order: (category.subcategories?.length || 0) + 1,
                            });
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDeleteCategory(category.id, category.name)
                          }
                          disabled={deleteCategory.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedCategories.has(category.id) &&
                      category.subcategories &&
                      category.subcategories.length > 0 && (
                        <div className="border-t bg-gray-50 p-4">
                          <div className="space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="flex items-center justify-between p-3 bg-white rounded border"
                              >
                                <div>
                                  <p className="font-bold text-sm">
                                    {subcategory.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {subcategory.slug}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      startEditSubcategory(subcategory)
                                    }
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleDeleteSubcategory(
                                        subcategory.id,
                                        subcategory.name
                                      )
                                    }
                                    disabled={deleteSubcategory.isPending}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border-2 border-dark p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory
                ? "Editar Categoría"
                : editingSubcategory
                ? "Editar Subcategoría"
                : isCreatingCategory
                ? "Nueva Categoría"
                : isCreatingSubcategory
                ? "Nueva Subcategoría"
                : "Selecciona una opción"}
            </h2>

            {(isCreatingCategory || editingCategory) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Nombre *
                  </label>
                  <Input
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    placeholder="Ej: Franelas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Descripción
                  </label>
                  <Textarea
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Descripción de la categoría"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Orden</label>
                  <Input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={
                      editingCategory
                        ? handleUpdateCategory
                        : handleCreateCategory
                    }
                    disabled={
                      createCategory.isPending || updateCategory.isPending
                    }
                  >
                    {editingCategory ? "Actualizar" : "Crear"}
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {(isCreatingSubcategory || editingSubcategory) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Nombre *
                  </label>
                  <Input
                    value={subcategoryForm.name}
                    onChange={(e) =>
                      setSubcategoryForm({
                        ...subcategoryForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Ej: Manga Corta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Descripción
                  </label>
                  <Textarea
                    value={subcategoryForm.description}
                    onChange={(e) =>
                      setSubcategoryForm({
                        ...subcategoryForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Descripción de la subcategoría"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Orden</label>
                  <Input
                    type="number"
                    value={subcategoryForm.order}
                    onChange={(e) =>
                      setSubcategoryForm({
                        ...subcategoryForm,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={
                      editingSubcategory
                        ? handleUpdateSubcategory
                        : handleCreateSubcategory
                    }
                    disabled={
                      createSubcategory.isPending || updateSubcategory.isPending
                    }
                  >
                    {editingSubcategory ? "Actualizar" : "Crear"}
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {!isCreatingCategory &&
              !editingCategory &&
              !isCreatingSubcategory &&
              !editingSubcategory && (
                <p className="text-gray-500 text-sm text-center">
                  Crea o edita categorías y subcategorías
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
