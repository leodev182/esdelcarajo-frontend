"use client";

import { useAuth } from "@/src/lib/hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Dashboard - Bienvenido {user?.nickname || user?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <h3 className="text-sm font-bold text-gray-600 mb-2">Productos</h3>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <h3 className="text-sm font-bold text-gray-600 mb-2">Órdenes</h3>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <h3 className="text-sm font-bold text-gray-600 mb-2">Usuarios</h3>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-dark p-6">
          <h3 className="text-sm font-bold text-gray-600 mb-2">Ventas</h3>
          <p className="text-3xl font-bold">Bs.S 0.00</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg border-2 border-dark p-6">
        <h2 className="text-2xl font-bold mb-4">Órdenes Recientes</h2>
        <p className="text-gray-600">No hay órdenes recientes</p>
      </div>
    </div>
  );
}
