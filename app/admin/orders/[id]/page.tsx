"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrderById, useUpdateOrderStatus } from "@/src/lib/hooks/useOrders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, ExternalLink, Check, Pencil, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { OrderItem, OrderStatus, ProductVariant } from "@/src/lib/types";
import { PriceDisplay } from "@/src/components/product/PriceDisplay";
import { EditOrderItemModal } from "@/src/components/admin/orders/EditOrderItemModal";
import { useAuth } from "@/src/lib/hooks/useAuth";

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

const CANCEL_WARNINGS: Partial<Record<OrderStatus, string>> = {
  PAGO_CONFIRMADO: "El pago ya fue confirmado. Se restaurará el stock de los productos.",
  EN_CAMINO: "El pedido ya está en camino. Coordina con el cliente antes de cancelar. Se restaurará el stock.",
  ENTREGADO: "El pedido ya fue entregado. Cancelar no revertirá la entrega.",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { user } = useAuth();

  const { data: order, isLoading, error } = useOrderById(orderId);
  const updateStatus = useUpdateOrderStatus();

  const [adminNotes, setAdminNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [editingItem, setEditingItem] = useState<(OrderItem & { variant?: ProductVariant & { productId: string } }) | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

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
        payload: { status: newStatus, adminNotes: adminNotes || undefined },
      });
      toast.success(`Estado actualizado a: ${STATUS_LABELS[newStatus]}`);
      setSelectedStatus(null);
      setAdminNotes("");
      setConfirmingCancel(false);
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  const handleCancelClick = () => {
    setSelectedStatus("CANCELADO");
    setConfirmingCancel(true);
  };

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const cancelWarning = CANCEL_WARNINGS[order.status];

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
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${STATUS_COLORS[order.status]}`}>
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
                  <div className="flex-1">
                    <p className="font-bold">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      {item.variantSize} · {item.variantColor} · x{item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriceDisplay priceUSD={Number(item.subtotal)} className="font-bold" />
                    {isSuperAdmin && (
                      <button
                        onClick={() => setEditingItem(item as typeof editingItem)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                        title="Editar item"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-dark mt-4 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <PriceDisplay priceUSD={Number(order.total)} />
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
              <p className="text-gray-500">El cliente aún no ha subido el comprobante</p>
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
                <p>{order.address.city}, {order.address.state}</p>
                {order.address.zipCode && <p>CP: {order.address.zipCode}</p>}
                <p className="text-gray-600">{order.address.phone}</p>
                {order.address.reference && (
                  <p className="text-gray-600 italic">Ref: {order.address.reference}</p>
                )}
              </div>
            )}
          </div>

          {order.status !== ("ENTREGADO" as OrderStatus) &&
            order.status !== ("CANCELADO" as OrderStatus) && (
              <div className="bg-white rounded-lg border-2 border-dark p-6">
                <h2 className="text-xl font-bold mb-4">Cambiar Estado</h2>

                {!confirmingCancel ? (
                  <div className="space-y-3">
                    {STATUS_FLOW.slice(currentStatusIndex + 1).map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedStatus(status);
                          setConfirmingCancel(false);
                        }}
                      >
                        {selectedStatus === status && <Check className="h-4 w-4 mr-2" />}
                        {STATUS_LABELS[status]}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleCancelClick}
                    >
                      Cancelar Orden
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cancelWarning && (
                      <div className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">{cancelWarning}</p>
                      </div>
                    )}
                    <Textarea
                      placeholder="Motivo de cancelación (opcional)"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setConfirmingCancel(false);
                          setSelectedStatus(null);
                        }}
                      >
                        Atrás
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleUpdateStatus("CANCELADO")}
                        disabled={updateStatus.isPending}
                      >
                        {updateStatus.isPending ? "Cancelando..." : "Confirmar Cancelación"}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedStatus && !confirmingCancel && (
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

      {editingItem && (
        <EditOrderItemModal
          orderId={orderId}
          item={editingItem}
          open={!!editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
