"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserOrders } from "@/src/lib/hooks/useOrders";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/src/lib/types";
import { PriceDisplay } from "@/src/components/product/PriceDisplay";

const STATUS_OPTIONS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING_PAYMENT", label: "Pendiente de Pago" },
  { value: "PAGO_CONFIRMADO", label: "Pago Confirmado" },
  { value: "EN_CAMINO", label: "En Camino" },
  { value: "ENTREGADO", label: "Entregado" },
  { value: "CANCELADO", label: "Cancelado" },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAGO_CONFIRMADO: "bg-blue-100 text-blue-800",
  EN_CAMINO: "bg-purple-100 text-purple-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pendiente de Pago",
  PAGO_CONFIRMADO: "Pago Confirmado",
  EN_CAMINO: "En Camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export default function MyOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useUserOrders({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    limit: 10,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Error al cargar órdenes</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/perfil"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-dark mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mi Perfil
      </Link>

      <h1 className="text-4xl font-bold mb-8">Mis Órdenes</h1>

      <div className="bg-white rounded-lg border-2 border-dark p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setStatusFilter(option.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                statusFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center py-8 text-gray-600">Cargando...</p>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No tienes órdenes todavía</p>
            <Link href="/catalogo">
              <Button>Ir a Comprar</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data.data.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-dark rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-sm text-gray-600">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        STATUS_COLORS[order.status]
                      }`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} producto(s)
                      </p>
                      <PriceDisplay
                        priceEUR={Number(order.total)}
                        className="text-xl font-bold"
                      />
                    </div>
                    <Link href={`/order/${order.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Página {data.meta.page} de {data.meta.totalPages} (
                  {data.meta.total} órdenes)
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
