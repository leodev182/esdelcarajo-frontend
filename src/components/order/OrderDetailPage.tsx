"use client";

import { useOrderById } from "@/src/lib/hooks/useOrders";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, MapPin, CreditCard, FileText } from "lucide-react";
import { PaymentProofUpload } from "./PaymentProofUpload";
import { PriceDisplay } from "../product/PriceDisplay";

interface OrderDetailPageProps {
  orderId: string;
}

const ORDER_STATUS_LABELS = {
  PENDING_PAYMENT: "Pendiente de Pago",
  PAGO_CONFIRMADO: "Pago Confirmado",
  EN_CAMINO: "En Camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const PAYMENT_METHOD_LABELS = {
  TRANSFERENCIA: "Transferencia Bancaria",
  PAGO_MOVIL: "Pago Móvil",
  ZELLE: "Zelle",
  EFECTIVO: "Efectivo",
  MERCADO_PAGO: "Mercado Pago",
};

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const router = useRouter();
  const { data: order, isLoading } = useOrderById(orderId);

  if (isLoading) {
    return (
      <div className="container px-6 py-12">
        <p className="text-center text-lg">Cargando orden...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Orden no encontrada</h1>
        <Button onClick={() => router.push("/")}>Volver al inicio</Button>
      </div>
    );
  }

  const isPendingPayment = order.status === "PENDING_PAYMENT";

  return (
    <div className="container px-6 py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-2 border-dark rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Orden #{order.id.slice(0, 8)}
              </h1>
              <p className="text-muted-foreground">
                Creada el{" "}
                {new Date(order.createdAt).toLocaleDateString("es-VE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-4 py-2 rounded-lg font-bold ${
                  order.status === "PENDING_PAYMENT"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "PAGO_CONFIRMADO"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "EN_CAMINO"
                    ? "bg-purple-100 text-purple-800"
                    : order.status === "ENTREGADO"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Dirección de Envío
              </h3>
              {order.address ? (
                <div className="text-sm space-y-1">
                  <p className="font-bold">{order.address.fullName}</p>
                  <p>{order.address.phone}</p>
                  <p className="text-muted-foreground">
                    {order.address.address}
                    {order.address.municipality &&
                      `, ${order.address.municipality}`}
                    <br />
                    {order.address.city}, {order.address.state}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Dirección no disponible
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Método de Pago
              </h3>
              <p className="font-bold">
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </p>
            </div>
          </div>

          {order.customerNotes && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Notas del Cliente
              </h3>
              <p className="text-sm text-muted-foreground">
                {order.customerNotes}
              </p>
            </div>
          )}
        </div>

        <div className="border-2 border-dark rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Productos
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b last:border-0"
              >
                <div className="flex-1">
                  <p className="font-bold">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.variantSize} · {item.variantColor} ·{" "}
                    {item.variantGender}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <PriceDisplay
                      priceEUR={Number(item.price)}
                      className="inline"
                    />{" "}
                    × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <PriceDisplay
                    priceEUR={Number(item.subtotal)}
                    className="font-bold"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dark pt-4 mt-4">
            <div className="flex justify-between font-bold text-xl">
              <span>Total:</span>
              <PriceDisplay priceEUR={Number(order.total)} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              El costo de envío se acuerda por WhatsApp
            </p>
          </div>
        </div>

        {isPendingPayment && (
          <PaymentProofUpload
            orderId={order.id}
            paymentMethod={order.paymentMethod}
            total={Number(order.total)}
          />
        )}
      </div>
    </div>
  );
}
