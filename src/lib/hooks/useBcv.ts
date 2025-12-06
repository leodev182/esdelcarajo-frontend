import { useEffect, useState } from "react";
import { getBcvRate } from "../api/bcv.api";
import { logger } from "../utils/logger";

export function useBcv() {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setIsLoading(true);
        const data = await getBcvRate();
        setRate(data.rate);
        setLastUpdate(data.lastUpdate);
        setError(null);
      } catch (err) {
        logger.error("Error fetching BCV rate:", err);
        setError("No se pudo obtener la tasa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();

    // Actualizar cada hora
    const interval = setInterval(fetchRate, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  return { rate, isLoading, error, lastUpdate };
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
