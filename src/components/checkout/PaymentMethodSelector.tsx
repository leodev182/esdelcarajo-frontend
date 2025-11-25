"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export type PaymentMethod =
  | "TRANSFERENCIA"
  | "PAGO_MOVIL"
  | "ZELLE"
  | "EFECTIVO"
  | "MERCADO_PAGO";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PAYMENT_METHODS = [
  {
    value: "TRANSFERENCIA" as PaymentMethod,
    label: "Transferencia Bancaria",
    description: "Transferencia entre bancos venezolanos",
  },
  {
    value: "PAGO_MOVIL" as PaymentMethod,
    label: "Pago Móvil",
    description: "Pago móvil interbancario",
  },
  {
    value: "ZELLE" as PaymentMethod,
    label: "Zelle",
    description: "Pago en USD vía Zelle",
  },
  {
    value: "EFECTIVO" as PaymentMethod,
    label: "Efectivo",
    description: "Pago en efectivo contraentrega",
  },
  {
    value: "MERCADO_PAGO" as PaymentMethod,
    label: "Mercado Pago",
    description: "Próximamente",
    disabled: true,
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Selecciona el método de pago</h3>

      <div className="grid gap-4">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.value}
            onClick={() => !method.disabled && onSelectMethod(method.value)}
            disabled={method.disabled}
            className={`relative p-4 border-2 rounded-lg text-left transition-all ${
              method.disabled
                ? "opacity-50 cursor-not-allowed border-gray-200"
                : selectedMethod === method.value
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary"
            }`}
          >
            {selectedMethod === method.value && !method.disabled && (
              <div className="absolute top-4 right-4">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{method.label}</span>
                  {method.disabled && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold">
                      Próximamente
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
