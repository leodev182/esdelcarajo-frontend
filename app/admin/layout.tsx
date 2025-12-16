"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/hooks/useAuth";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated ||
        (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN"))
    ) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return null;
  }

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#2D2834] text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#FF6501]">DASHBOARD</h1>
          <p className="text-sm text-gray-400 mt-1">Panel Admin</p>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF6501] hover:bg-[#FF6501] hover:text-white transition-colors font-bold"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF6501] hover:bg-[#FF6501] hover:text-white transition-colors font-bold"
          >
            <Package className="h-5 w-5" />
            <span>Productos</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF6501] hover:bg-[#FF6501] hover:text-white transition-colors font-bold"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Órdenes</span>
          </Link>

          {isSuperAdmin && (
            <>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF6501] hover:bg-[#FF6501] hover:text-white transition-colors font-bold"
              >
                <FolderTree className="h-5 w-5" />
                <span>Categorías</span>
              </Link>

              <Link
                href="/admin/landing"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF6501] hover:bg-[#FF6501] hover:text-white transition-colors font-bold"
              >
                <Sparkles className="h-5 w-5" />
                <span>Landing</span>
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#FF6501] hover:bg-[#FF6501] hover:text-white transition-colors font-bold"
              >
                <Users className="h-5 w-5" />
                <span>Usuarios</span>
              </Link>
            </>
          )}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400 mb-2">
              {user.nickname || user.name}
            </p>
            <p className="text-xs text-[#FF6501] font-bold mb-4">
              {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </p>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-[#FF6501] hover:text-white transition-colors font-bold"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
