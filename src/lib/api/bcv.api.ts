import { apiClient } from "./client";

export interface BcvRate {
  rate: number;
  lastUpdate: string;
  source: string;
}

/**
 * Obtener la tasa de cambio EUR → VES del BCV
 */
export async function getBcvRate(): Promise<BcvRate> {
  const { data } = await apiClient.get<BcvRate>("/bcv/rate");
  return data;
}
