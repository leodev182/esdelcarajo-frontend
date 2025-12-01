"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useCart } from "@/src/lib/hooks/useCart";
import { useCreateOrder } from "@/src/lib/hooks/useOrders";
import { AddressSelector } from "./AddressSelector";
import { AddressForm } from "@/src/components/forms/AddressForm";
import { PaymentMethodSelector, PaymentMethod } from "./PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Address } from "@/src/lib/types";
import { set } from "date-fns";

export function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const createOrder = useCreateOrder();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [customerNotes, setCustomerNotes] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (isCreatingOrder) return;

    if (!isAuthenticated) {
      router.push("/");
    }

    if (!cart || cart.items.length === 0) {
      router.push("/");
    }
  }, [isAuthenticated, cart, router, isCreatingOrder]);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const handleAddressFormSuccess = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleCancel = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleCreateOrder = async () => {
    if (!selectedAddressId || !selectedPaymentMethod) return;

    setIsCreatingOrder(true);

    try {
      const order = await createOrder.mutateAsync({
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
        customerNotes: customerNotes || undefined,
      });

      toast.success("Pedido creado exitosamente");
      router.push(`/order/${order.id}`);
    } catch (error) {
      toast.error("Error al crear el pedido");
      console.error(error);
      setIsCreatingOrder(false);
    }
  };

  const canProceed = selectedAddressId && selectedPaymentMethod;

  return (
    <div className="container px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="border-2 border-dark rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Dirección de Envío</h2>

            {showAddressForm ? (
              <AddressForm
                address={editingAddress}
                onSuccess={handleAddressFormSuccess}
                onCancel={handleCancel}
              />
            ) : (
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onAddNew={handleAddNew}
                onEdit={handleEdit}
              />
            )}
          </div>

          <div className="border-2 border-dark rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Método de Pago</h2>
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={setSelectedPaymentMethod}
            />

            <div className="mt-6">
              <label className="block text-sm font-bold mb-2">
                Notas adicionales (opcional)
              </label>
              <Textarea
                placeholder="Instrucciones especiales, horario de entrega preferido, etc."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border-2 border-dark rounded-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="flex-1">
                    <p className="font-bold">{item.variant.product.name}</p>
                    <p className="text-muted-foreground">
                      {item.variant.size} · {item.variant.color} · x
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">
                    $ {(Number(item.variant.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dark pt-4 space-y-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal:</span>
                <span>$ {cart.subtotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                El costo de envío se acuerda por WhatsApp
              </p>
            </div>

            <Button
              size="lg"
              className="w-full mt-6"
              disabled={!canProceed || createOrder.isPending}
              onClick={handleCreateOrder}
            >
              {createOrder.isPending ? "Creando pedido..." : "Crear Pedido"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
