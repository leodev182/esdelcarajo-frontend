"use client";

import { useState } from "react";
import Link from "next/link";
import { useAllOrders } from "@/src/lib/hooks/useOrders";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/src/lib/types";

const STATUS_OPTIONS: { value: OrderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos" },
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

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useAllOrders({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    limit: 10,
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar órdenes</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Órdenes</h1>

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
          <p className="text-center py-8 text-gray-600">No hay órdenes</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-dark">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Cliente</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Comprobante</th>
                    <th className="text-left py-3 px-4">Fecha</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold">{order.user?.name}</p>
                        <p className="text-sm text-gray-600">
                          {order.user?.email}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-bold">
                        $ {Number(order.total).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {order.paymentProof ? (
                          <a
                            href={order.paymentProof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm font-bold"
                          >
                            Ver
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Sin comprobante
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
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
