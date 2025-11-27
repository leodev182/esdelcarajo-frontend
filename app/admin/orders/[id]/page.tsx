"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrderById, useUpdateOrderStatus } from "@/src/lib/hooks/useOrders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { OrderStatus } from "@/src/lib/types";

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

const STATUS_FLOW: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAGO_CONFIRMADO",
  "EN_CAMINO",
  "ENTREGADO",
];

const PAYMENT_LABELS: Record<string, string> = {
  TRANSFERENCIA: "Transferencia Bancaria",
  PAGO_MOVIL: "Pago Móvil",
  ZELLE: "Zelle",
  EFECTIVO: "Efectivo",
  MERCADO_PAGO: "Mercado Pago",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, error } = useOrderById(orderId);
  const updateStatus = useUpdateOrderStatus();

  const [adminNotes, setAdminNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Cargando orden...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar la orden</p>
        <Button onClick={() => router.back()} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({
        orderId,
        payload: {
          status: newStatus,
          adminNotes: adminNotes || undefined,
        },
      });
      toast.success(`Estado actualizado a: ${STATUS_LABELS[newStatus]}`);
      setSelectedStatus(null);
      setAdminNotes("");
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-dark mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a órdenes
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Orden #{order.id.slice(0, 8)}</h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(order.createdAt), "PPPp", { locale: es })}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            STATUS_COLORS[order.status]
          }`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-4">Productos</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-bold">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {item.variantSize} · {item.variantColor} · x
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">
                    Bs.S {Number(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-dark mt-4 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>Bs.S {Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-4">Comprobante de Pago</h2>
            <p className="text-sm text-gray-600 mb-2">
              Método: {PAYMENT_LABELS[order.paymentMethod]}
            </p>
            {order.paymentProof ? (
              <div className="space-y-3">
                <a
                  href={order.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-bold"
                >
                  Ver comprobante
                  <ExternalLink className="h-4 w-4" />
                </a>
                <img
                  src={order.paymentProof}
                  alt="Comprobante de pago"
                  className="max-w-sm rounded-lg border"
                />
              </div>
            ) : (
              <p className="text-gray-500">
                El cliente aún no ha subido el comprobante
              </p>
            )}
          </div>

          {order.customerNotes && (
            <div className="bg-white rounded-lg border-2 border-dark p-6">
              <h2 className="text-xl font-bold mb-2">Notas del Cliente</h2>
              <p className="text-gray-700">{order.customerNotes}</p>
            </div>
          )}

          {order.adminNotes && (
            <div className="bg-white rounded-lg border-2 border-dark p-6">
              <h2 className="text-xl font-bold mb-2">Notas del Admin</h2>
              <p className="text-gray-700">{order.adminNotes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-4">Cliente</h2>
            <div className="space-y-2">
              <p className="font-bold">{order.user?.name}</p>
              <p className="text-sm text-gray-600">{order.user?.email}</p>
              {order.user?.phone && (
                <p className="text-sm text-gray-600">{order.user.phone}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
            {order.address && (
              <div className="space-y-1 text-sm">
                <p className="font-bold">{order.address.fullName}</p>
                <p>{order.address.address}</p>
                <p>
                  {order.address.city}, {order.address.state}
                </p>
                {order.address.zipCode && <p>CP: {order.address.zipCode}</p>}
                <p className="text-gray-600">{order.address.phone}</p>
                {order.address.reference && (
                  <p className="text-gray-600 italic">
                    Ref: {order.address.reference}
                  </p>
                )}
              </div>
            )}
          </div>

          {order.status !== ("ENTREGADO" as OrderStatus) &&
            order.status !== ("CANCELADO" as OrderStatus) && (
              <div className="bg-white rounded-lg border-2 border-dark p-6">
                <h2 className="text-xl font-bold mb-4">Cambiar Estado</h2>

                <div className="space-y-3">
                  {STATUS_FLOW.slice(currentStatusIndex + 1).map((status) => (
                    <Button
                      key={status}
                      variant={
                        selectedStatus === status ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedStatus(status)}
                    >
                      {selectedStatus === status && (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      {STATUS_LABELS[status]}
                    </Button>
                  ))}

                  <Button
                    variant={
                      selectedStatus === "CANCELADO" ? "default" : "outline"
                    }
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => setSelectedStatus("CANCELADO")}
                  >
                    {selectedStatus === "CANCELADO" && (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Cancelar Orden
                  </Button>
                </div>

                {selectedStatus && (
                  <div className="mt-4 space-y-3">
                    <Textarea
                      placeholder="Notas del admin (opcional)"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                    />
                    <Button
                      className="w-full"
                      onClick={() => handleUpdateStatus(selectedStatus)}
                      disabled={updateStatus.isPending}
                    >
                      {updateStatus.isPending
                        ? "Actualizando..."
                        : `Confirmar: ${STATUS_LABELS[selectedStatus]}`}
                    </Button>
                  </div>
                )}
              </div>
            )}

          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-4">Historial</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Creada:</span>{" "}
                {format(new Date(order.createdAt), "Pp", { locale: es })}
              </p>
              {order.paidAt && (
                <p>
                  <span className="text-gray-600">Pago confirmado:</span>{" "}
                  {format(new Date(order.paidAt), "Pp", { locale: es })}
                </p>
              )}
              {order.shippedAt && (
                <p>
                  <span className="text-gray-600">Enviada:</span>{" "}
                  {format(new Date(order.shippedAt), "Pp", { locale: es })}
                </p>
              )}
              {order.deliveredAt && (
                <p>
                  <span className="text-gray-600">Entregada:</span>{" "}
                  {format(new Date(order.deliveredAt), "Pp", { locale: es })}
                </p>
              )}
              {order.cancelledAt && (
                <p>
                  <span className="text-gray-600">Cancelada:</span>{" "}
                  {format(new Date(order.cancelledAt), "Pp", { locale: es })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
