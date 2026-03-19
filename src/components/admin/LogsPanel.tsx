"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trash2,
  Lock,
  X,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useLogs,
  useDeleteLog,
  useDeleteLogs,
  useMarkLogAsPermanent,
  useMarkLogsAsPermanent,
} from "@/src/lib/hooks/useLogs";
import type { LogLevel, LogEvent, AdminLog, LogsFilters } from "@/src/lib/api/logs.api";

// ==================== CONSTANTES ====================

const LEVEL_OPTIONS: { value: LogLevel | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos los niveles" },
  { value: "INFO", label: "INFO" },
  { value: "WARN", label: "WARN" },
  { value: "ERROR", label: "ERROR" },
];

const EVENT_OPTIONS: { value: LogEvent | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos los eventos" },
  { value: "USER_LOGIN", label: "Login de usuario" },
  { value: "USER_LOGOUT", label: "Logout de usuario" },
  { value: "USER_REGISTERED", label: "Nuevo registro" },
  { value: "USER_BANNED", label: "Usuario baneado" },
  { value: "USER_UNBANNED", label: "Usuario desbaneado" },
  { value: "USER_ROLE_CHANGED", label: "Rol cambiado" },
  { value: "ORDER_CREATED", label: "Orden creada" },
  { value: "ORDER_STATUS_UPDATED", label: "Estado de orden" },
  { value: "ORDER_CANCELLED", label: "Orden cancelada" },
  { value: "ORDER_PAYMENT_CONFIRMED", label: "Pago confirmado" },
  { value: "PRODUCT_CREATED", label: "Producto creado" },
  { value: "PRODUCT_UPDATED", label: "Producto actualizado" },
  { value: "PRODUCT_DELETED", label: "Producto eliminado" },
  { value: "UNHANDLED_EXCEPTION", label: "Error no manejado" },
  { value: "CUSTOM_EVENT", label: "Evento personalizado" },
];

const EVENT_LABELS: Record<LogEvent, string> = {
  USER_LOGIN: "Login",
  USER_LOGOUT: "Logout",
  USER_REGISTERED: "Registro",
  USER_BANNED: "Ban",
  USER_UNBANNED: "Desban",
  USER_ROLE_CHANGED: "Rol cambiado",
  ORDER_CREATED: "Orden creada",
  ORDER_STATUS_UPDATED: "Estado orden",
  ORDER_CANCELLED: "Orden cancelada",
  ORDER_PAYMENT_CONFIRMED: "Pago confirmado",
  PRODUCT_CREATED: "Producto creado",
  PRODUCT_UPDATED: "Producto actualizado",
  PRODUCT_DELETED: "Producto eliminado",
  UNHANDLED_EXCEPTION: "Error no manejado",
  CUSTOM_EVENT: "Evento custom",
};

const LEVEL_STYLES: Record<LogLevel, string> = {
  INFO: "bg-blue-100 text-blue-800",
  WARN: "bg-yellow-100 text-yellow-800",
  ERROR: "bg-red-100 text-red-800",
};

// ==================== HOOK DEBOUNCE ====================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ==================== COMPONENTE FILA EXPANDIDA ====================

function LogDetail({ log }: { log: AdminLog }) {
  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-3 text-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {log.method && (
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Método</p>
            <p className="font-mono">{log.method}</p>
          </div>
        )}
        {log.url && (
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">URL</p>
            <p className="font-mono truncate">{log.url}</p>
          </div>
        )}
        {log.statusCode && (
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
            <p
              className={`font-bold ${log.statusCode >= 500 ? "text-red-600" : log.statusCode >= 400 ? "text-yellow-600" : "text-green-600"}`}
            >
              {log.statusCode}
            </p>
          </div>
        )}
        {log.userId && (
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">User ID</p>
            <p className="font-mono text-xs truncate">{log.userId}</p>
          </div>
        )}
      </div>

      {log.context && (
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Contexto</p>
          <p className="font-mono text-xs bg-gray-100 rounded p-2">{log.context}</p>
        </div>
      )}

      {log.errorMessage && (
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Error</p>
          <pre className="font-mono text-xs bg-red-50 text-red-800 rounded p-2 overflow-x-auto whitespace-pre-wrap">
            {log.errorMessage}
          </pre>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 border-t border-gray-200 pt-2">
        <div>
          <span className="font-bold uppercase">Creado: </span>
          {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss")}
        </div>
        {log.expiresAt && (
          <div>
            <span className="font-bold uppercase">Expira: </span>
            {format(new Date(log.expiresAt), "dd/MM/yyyy HH:mm:ss")}
          </div>
        )}
        {log.isPermanent && (
          <div className="text-green-600 font-bold">🔒 Permanente</div>
        )}
      </div>
    </div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

export function LogsPanel() {
  // Filtros
  const [levelFilter, setLevelFilter] = useState<LogLevel | "ALL">("ALL");
  const [eventFilter, setEventFilter] = useState<LogEvent | "ALL">("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [permanentOnly, setPermanentOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Estado UI
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Debounce del search
  const debouncedSearch = useDebounce(searchInput, 300);

  // Construir filtros
  const filters: LogsFilters = {
    level: levelFilter === "ALL" ? undefined : levelFilter,
    event: eventFilter === "ALL" ? undefined : eventFilter,
    search: debouncedSearch || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
    isPermanent: permanentOnly || undefined,
    page,
    limit: 20,
  };

  const { data, isLoading, error } = useLogs(filters);

  const deleteLogMutation = useDeleteLog();
  const deleteLogsMutation = useDeleteLogs();
  const markPermanentMutation = useMarkLogAsPermanent();
  const markPermanentsMutation = useMarkLogsAsPermanent();

  // Reset página cuando cambian filtros
  const resetPage = useCallback(() => setPage(1), []);

  // Limpiar filtros
  const clearFilters = () => {
    setLevelFilter("ALL");
    setEventFilter("ALL");
    setSearchInput("");
    setFromDate("");
    setToDate("");
    setPermanentOnly(false);
    setPage(1);
  };

  const hasActiveFilters =
    levelFilter !== "ALL" ||
    eventFilter !== "ALL" ||
    debouncedSearch !== "" ||
    fromDate !== "" ||
    toDate !== "" ||
    permanentOnly;

  // Selección
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!data) return;
    const pageIds = new Set(data.data.map((l) => l.id));
    const allSelected = data.data.every((l) => selectedIds.has(l.id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    await deleteLogsMutation.mutateAsync(Array.from(selectedIds));
    setSelectedIds(new Set());
    setConfirmDelete(false);
  };

  // Bulk permanent
  const handleBulkPermanent = async () => {
    await markPermanentsMutation.mutateAsync(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  // Delete individual
  const handleDeleteOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar este log?")) return;
    await deleteLogMutation.mutateAsync(id);
    if (expandedId === id) setExpandedId(null);
    selectedIds.delete(id);
    setSelectedIds(new Set(selectedIds));
  };

  // Permanent individual
  const handlePermanentOne = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markPermanentMutation.mutateAsync(id);
  };

  const allPageSelected =
    !!data && data.data.length > 0 && data.data.every((l) => selectedIds.has(l.id));

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar logs</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── FILTROS ─── */}
      <div className="bg-white rounded-lg border-2 border-dark p-4">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <span className="font-bold text-sm text-gray-700">Filtros</span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="h-3 w-3" />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Nivel */}
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value as LogLevel | "ALL");
              resetPage();
            }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {LEVEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Evento */}
          <select
            value={eventFilter}
            onChange={(e) => {
              setEventFilter(e.target.value as LogEvent | "ALL");
              resetPage();
            }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {EVENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Buscar */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en mensajes..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                resetPage();
              }}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Desde */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              resetPage();
            }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Hasta */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              resetPage();
            }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Solo permanentes */}
          <label className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={permanentOnly}
              onChange={(e) => {
                setPermanentOnly(e.target.checked);
                resetPage();
              }}
              className="rounded"
            />
            Solo permanentes
          </label>
        </div>
      </div>

      {/* ─── BULK ACTIONS BAR ─── */}
      {selectedIds.size > 0 && (
        <div className="bg-[#2D2834] text-white rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-sm font-bold">
            {selectedIds.size} seleccionado{selectedIds.size !== 1 ? "s" : ""}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#2D2834]"
              onClick={handleBulkPermanent}
              disabled={markPermanentsMutation.isPending}
            >
              <Lock className="h-3 w-3 mr-1" />
              Marcar permanentes
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Eliminar
            </Button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-gray-400 hover:text-white ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── TABLA ─── */}
      <div className="bg-white rounded-lg border-2 border-dark overflow-hidden">
        {isLoading ? (
          <p className="text-center py-8 text-gray-600">Cargando logs...</p>
        ) : !data || data.data.length === 0 ? (
          <p className="text-center py-8 text-gray-600">
            {hasActiveFilters ? "No hay logs con estos filtros" : "No hay logs"}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-dark bg-gray-50">
                    <th className="py-3 px-4 w-8">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500 w-16">
                      Nivel
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">
                      Evento
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">
                      Mensaje
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">
                      Usuario
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500 w-16">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">
                      Hace
                    </th>
                    <th className="py-3 px-4 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((log) => (
                    <>
                      <tr
                        key={log.id}
                        onClick={() =>
                          setExpandedId(expandedId === log.id ? null : log.id)
                        }
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          expandedId === log.id ? "bg-gray-50" : ""
                        } ${selectedIds.has(log.id) ? "bg-blue-50" : ""}`}
                      >
                        {/* Checkbox */}
                        <td
                          className="py-3 px-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(log.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(log.id)}
                            onChange={() => toggleSelect(log.id)}
                            className="rounded"
                          />
                        </td>

                        {/* Nivel */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_STYLES[log.level]}`}
                          >
                            {log.level}
                          </span>
                        </td>

                        {/* Evento */}
                        <td className="py-3 px-4 text-sm font-medium">
                          {EVENT_LABELS[log.event] ?? log.event}
                        </td>

                        {/* Mensaje */}
                        <td className="py-3 px-4 text-sm text-gray-700 max-w-xs">
                          <p className="truncate">{log.message}</p>
                        </td>

                        {/* Usuario */}
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {log.userEmail ? (
                            <p className="truncate max-w-[140px]">
                              {log.userEmail}
                            </p>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Status Code */}
                        <td className="py-3 px-4 text-sm">
                          {log.statusCode ? (
                            <span
                              className={
                                log.statusCode >= 500
                                  ? "text-red-600 font-bold"
                                  : log.statusCode >= 400
                                    ? "text-yellow-600 font-bold"
                                    : "text-gray-600"
                              }
                            >
                              {log.statusCode}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Tiempo relativo */}
                        <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </td>

                        {/* Acciones */}
                        <td
                          className="py-3 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            {log.isPermanent ? (
                              <Lock className="h-4 w-4 text-green-500" />
                            ) : (
                              <button
                                onClick={(e) => handlePermanentOne(log.id, e)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Marcar permanente"
                              >
                                <Lock className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteOne(log.id, e)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            {expandedId === log.id ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Fila expandida */}
                      {expandedId === log.id && (
                        <tr key={`${log.id}-detail`}>
                          <td colSpan={8} className="p-0">
                            <LogDetail log={log} />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Página {data.meta.page} de {data.meta.totalPages} (
                  {data.meta.total} logs)
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.meta.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── DIALOG CONFIRMAR BULK DELETE ─── */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar los logs seleccionados?</DialogTitle>
            <DialogDescription>
              Se eliminarán {selectedIds.size} log
              {selectedIds.size !== 1 ? "s" : ""}. Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deleteLogsMutation.isPending}
            >
              {deleteLogsMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
