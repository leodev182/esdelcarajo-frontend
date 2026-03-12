import { useQuery } from "@tanstack/react-query";
import { getBcvRate } from "../api/bcv.api";

const BCV_CACHE_TIME = 1000 * 60 * 60; // 1 hora

export function useBcv() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bcv-rate"],
    queryFn: getBcvRate,
    staleTime: BCV_CACHE_TIME,
    gcTime: BCV_CACHE_TIME * 2,
    retry: 2,
    refetchInterval: BCV_CACHE_TIME,
  });

  return {
    rate: data?.rate ?? null,
    lastUpdate: data?.lastUpdate ?? null,
    isLoading,
    error: error ? "No se pudo obtener la tasa" : null,
  };
}

/**
 * Hook para convertir precio EUR a Bs (Bolívares)
 * Retorna la tasa y el precio formateado
 */
export function usePriceConverter(priceEUR: number) {
  const { rate } = useBcv();

  if (!rate) return null;

  const priceInBs = priceEUR * rate;

  return {
    priceInBs,
    rate,
    formatted: new Intl.NumberFormat("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceInBs),
  };
}
