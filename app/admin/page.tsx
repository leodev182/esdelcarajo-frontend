"use client";

import { useDashboardStats } from "@/src/lib/hooks/useAdminDashboard";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Dashboard - Bienvenido {user?.nickname || user?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-600">Productos</h3>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{stats?.products.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.products.active || 0} activos
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-600">Órdenes</h3>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{stats?.orders.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.orders.pendingPayment || 0} pendientes
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-600">Usuarios</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{stats?.users.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.users.admins || 0} admins
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-600">Ventas</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">
            $ {Number(stats?.sales.total || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total en USD</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <h2 className="text-2xl font-bold mb-4">Estado de Órdenes</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Pendiente de Pago</span>
              <span className="font-bold text-yellow-600">
                {stats?.orders.pendingPayment || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pago Confirmado</span>
              <span className="font-bold text-blue-600">
                {stats?.orders.confirmedPayment || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">En Camino</span>
              <span className="font-bold text-purple-600">
                {stats?.orders.inTransit || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Entregado</span>
              <span className="font-bold text-green-600">
                {stats?.orders.delivered || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cancelado</span>
              <span className="font-bold text-red-600">
                {stats?.orders.cancelled || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <h2 className="text-2xl font-bold mb-4">Estado de Productos</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total de Productos</span>
              <span className="font-bold">{stats?.products.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Activos</span>
              <span className="font-bold text-green-600">
                {stats?.products.active || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Inactivos</span>
              <span className="font-bold text-gray-600">
                {stats?.products.inactive || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
