import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getSellerStats } from "../api/admin-dashboard.api";
import { CACHE_TIME } from "../utils/constants";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useSellerStats() {
  return useQuery({
    queryKey: ["admin", "dashboard", "seller-stats"],
    queryFn: getSellerStats,
    staleTime: CACHE_TIME.SHORT,
  });
}
