import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLogs,
  getGroupedLogs,
  getLogById,
  deleteLog,
  deleteLogs,
  markLogAsPermanent,
  markLogsAsPermanent,
  LogsFilters,
} from "../api/logs.api";
import { CACHE_TIME } from "../utils/constants";
import { logger } from "../utils/logger";

// ==================== QUERY KEYS ====================

export const logsKeys = {
  all: ["admin", "logs"] as const,
  list: (filters?: LogsFilters) => ["admin", "logs", "list", filters] as const,
  grouped: () => ["admin", "logs", "grouped"] as const,
  detail: (id: string) => ["admin", "logs", id] as const,
};

// ==================== QUERIES ====================

export function useLogs(filters?: LogsFilters) {
  return useQuery({
    queryKey: logsKeys.list(filters),
    queryFn: () => getLogs(filters),
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useGroupedLogs() {
  return useQuery({
    queryKey: logsKeys.grouped(),
    queryFn: () => getGroupedLogs(),
    staleTime: CACHE_TIME.SHORT,
  });
}

export function useLogById(id: string) {
  return useQuery({
    queryKey: logsKeys.detail(id),
    queryFn: () => getLogById(id),
    staleTime: CACHE_TIME.SHORT,
    enabled: !!id,
  });
}

// ==================== MUTATIONS ====================

export function useDeleteLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLog(id),
    onSuccess: (_, id) => {
      logger.info(`Log eliminado - ID: ${id}`);
      queryClient.invalidateQueries({ queryKey: logsKeys.all });
    },
    onError: (error) => {
      logger.error("Error eliminando log:", error);
    },
  });
}

export function useDeleteLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => deleteLogs(ids),
    onSuccess: (result) => {
      logger.info(`${result.count} logs eliminados`);
      queryClient.invalidateQueries({ queryKey: logsKeys.all });
    },
    onError: (error) => {
      logger.error("Error en bulk delete de logs:", error);
    },
  });
}

export function useMarkLogAsPermanent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markLogAsPermanent(id),
    onSuccess: (_, id) => {
      logger.info(`Log marcado como permanente - ID: ${id}`);
      queryClient.invalidateQueries({ queryKey: logsKeys.all });
    },
    onError: (error) => {
      logger.error("Error marcando log como permanente:", error);
    },
  });
}

export function useMarkLogsAsPermanent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => markLogsAsPermanent(ids),
    onSuccess: (result) => {
      logger.info(`${result.count} logs marcados como permanentes`);
      queryClient.invalidateQueries({ queryKey: logsKeys.all });
    },
    onError: (error) => {
      logger.error("Error en bulk permanent de logs:", error);
    },
  });
}
