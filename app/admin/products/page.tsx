"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts } from "@/src/lib/hooks/useProducts";
import { useDeleteProduct } from "@/src/lib/hooks/useAdminProducts";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useProducts({
    search: search || undefined,
    page,
    limit: 10,
  });

  const deleteProduct = useDeleteProduct();

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Eliminar el producto "${productName}"?`)) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar producto");
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar productos</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Productos</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border-2 border-dark p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-center py-8 text-gray-600">Cargando...</p>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No hay productos</p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Producto
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-dark">
                    <th className="text-left py-3 px-4">Producto</th>
                    <th className="text-left py-3 px-4">Categoría</th>
                    <th className="text-left py-3 px-4">Variantes</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Creado</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-gray-400 text-xs">
                              Sin img
                            </div>
                          )}
                          <div>
                            <p className="font-bold">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{product.category?.name}</p>
                        {product.subcategory && (
                          <p className="text-xs text-gray-500">
                            {product.subcategory.name}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-bold">
                          {product.variants.length}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDistanceToNow(new Date(product.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/product/${product.slug}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            disabled={deleteProduct.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Página {data.meta.page} de {data.meta.totalPages} (
                  {data.meta.total} productos)
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.meta.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
