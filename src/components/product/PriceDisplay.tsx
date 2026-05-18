"use client";

import { usePriceConverter } from "@/src/lib/hooks/useBcv";

interface PriceDisplayProps {
  priceUSD: number;
  className?: string;
}

export function PriceDisplay({ priceUSD, className = "" }: PriceDisplayProps) {
  const priceData = usePriceConverter(priceUSD);

  // Mientras carga la tasa
  if (!priceData) {
    return <span className={className}>Cargando...</span>;
  }

  // Expresión completa lista para mostrar (escalable para v1.1)
  const displayPrice = `Bs. ${priceData.formatted}`;

  return <span className={className}>{displayPrice}</span>;
}
