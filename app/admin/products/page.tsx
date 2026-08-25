"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useProducts } from "@/src/lib/hooks/useProducts";
import { useDeleteProduct, useUpdateProduct } from "@/src/lib/hooks/useAdminProducts";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { getErrorMessage } from "@/src/lib/api/client";
import { logger } from "@/src/lib/utils/logger";
import { ContentLoader } from "@/src/components/ui/ContentLoader";
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
  RotateCcw,
  PackageCheck,
  PackageX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal, useConfirm } from "@/src/components/ui/ConfirmModal";
import { toast } from "sonner";

type Tab = "active" | "deleted";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("active");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { confirm, confirmProps } = useConfirm();

  useEffect(() => {
    if (user && user.role !== "SUPER_ADMIN") {
      router.replace("/admin");
    }
  }, [user, router]);

  const { data, isLoading, error } = useProducts({
    search: search || undefined,
    page,
    limit: 10,
    ...(tab === "deleted"
      ? { includeAll: true, isActive: false }
      : { isActive: true }),
  });

  const displayedProducts = tab === "deleted"
    ? (data?.data ?? []).filter((p) => !p.isActive)
    : (data?.data ?? []);

  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const handleDelete = async (productId: string, productName: string) => {
    if (!(await confirm(`¿Eliminar el producto "${productName}"?`))) return;
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Producto eliminado");
    } catch (error) {
      logger.error("Error al eliminar producto", error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleReactivate = async (productId: string, productName: string) => {
    try {
      await updateProduct.mutateAsync({
        productId,
        // Enviamos name para que el service regenere el slug limpio
        payload: { isActive: true, name: productName },
      });
      toast.success(`"${productName}" reactivado`);
    } catch (error) {
      logger.error("Error al reactivar producto", error);
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) return <ContentLoader />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar productos</p>
      </div>
    );
  }

  return (
    <div>
      <ConfirmModal {...confirmProps} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Productos</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setTab("active"); setPage(1); setSearch(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
            tab === "active"
              ? "bg-dark text-white border-dark"
              : "bg-white text-dark border-dark hover:bg-gray-50"
          }`}
        >
          <PackageCheck className="h-4 w-4" />
          Activos
        </button>
        <button
          onClick={() => { setTab("deleted"); setPage(1); setSearch(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
            tab === "deleted"
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-red-600 border-red-300 hover:bg-red-50"
          }`}
        >
          <PackageX className="h-4 w-4" />
          Eliminados
        </button>
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

        {!data || displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {tab === "deleted" ? "No hay productos eliminados" : "No hay productos"}
            </p>
            {tab === "active" && (
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Producto
                </Button>
              </Link>
            )}
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
                    <th className="text-left py-3 px-4">Creado</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
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
                            <p className="text-xs text-gray-500">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{product.category?.name}</p>
                        {product.subcategory && (
                          <p className="text-xs text-gray-500">{product.subcategory.name}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-bold">{product.variants.length}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDistanceToNow(new Date(product.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        {tab === "deleted" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReactivate(product.id, product.name)}
                            disabled={updateProduct.isPending}
                            className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Reactivar
                          </Button>
                        ) : (
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
                              onClick={() => handleDelete(product.id, product.name)}
                              disabled={deleteProduct.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Página {data.meta.page} de {data.meta.totalPages} ({data.meta.total} productos)
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
