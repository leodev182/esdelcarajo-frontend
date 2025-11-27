"use client";

import { useState } from "react";
import {
  useAllUsers,
  useUpdateUserRole,
  useToggleUserBan,
} from "@/src/lib/hooks/useUsers";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Shield, ShieldOff, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Role } from "@/src/lib/types";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  _count?: {
    orders: number;
    favorites: number;
  };
}

const ROLE_LABELS: Record<Role, string> = {
  USER: "Usuario",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_COLORS: Record<Role, string> = {
  USER: "bg-gray-100 text-gray-800",
  ADMIN: "bg-blue-100 text-blue-800",
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useAllUsers();
  const updateRole = useUpdateUserRole();
  const toggleBan = useToggleUserBan();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await updateRole.mutateAsync({ userId, role: newRole });
      toast.success(`Rol actualizado a ${ROLE_LABELS[newRole]}`);
      setEditingUserId(null);
    } catch {
      toast.error("Error al actualizar el rol");
    }
  };

  const handleToggleBan = async (
    userId: string,
    isCurrentlyActive: boolean
  ) => {
    try {
      await toggleBan.mutateAsync(userId);
      toast.success(
        isCurrentlyActive ? "Usuario baneado" : "Usuario desbaneado"
      );
    } catch {
      toast.error("Error al cambiar estado del usuario");
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar usuarios</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Usuarios</h1>

      <div className="bg-white rounded-lg border-2 border-dark p-6">
        {isLoading ? (
          <p className="text-center py-8 text-gray-600">Cargando...</p>
        ) : !data || data.users.length === 0 ? (
          <p className="text-center py-8 text-gray-600">No hay usuarios</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Total: {data.total} usuarios
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-dark">
                    <th className="text-left py-3 px-4">Usuario</th>
                    <th className="text-left py-3 px-4">Rol</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Órdenes</th>
                    <th className="text-left py-3 px-4">Registro</th>
                    <th className="text-left py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => {
                    const isCurrentUser = user.id === currentUser?.id;
                    const isEditing = editingUserId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 ${
                          !user.isActive ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold">
                            {user.nickname || user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              {(["USER", "ADMIN", "SUPER_ADMIN"] as Role[]).map(
                                (role) => (
                                  <button
                                    key={role}
                                    onClick={() =>
                                      handleRoleChange(user.id, role)
                                    }
                                    disabled={updateRole.isPending}
                                    className={`px-3 py-1 rounded text-xs font-bold text-left ${
                                      user.role === role
                                        ? ROLE_COLORS[role]
                                        : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                                  >
                                    {ROLE_LABELS[role]}
                                  </button>
                                )
                              )}
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                ROLE_COLORS[user.role]
                              }`}
                            >
                              {ROLE_LABELS[user.role]}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Activo" : "Baneado"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {user._count?.orders || 0}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDistanceToNow(new Date(user.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </td>
                        <td className="py-3 px-4">
                          {!isCurrentUser && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingUserId(user.id)}
                                title="Cambiar rol"
                              >
                                <UserCog className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleToggleBan(user.id, user.isActive)
                                }
                                disabled={toggleBan.isPending}
                                title={user.isActive ? "Banear" : "Desbanear"}
                                className={
                                  user.isActive
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-green-600 hover:text-green-700"
                                }
                              >
                                {user.isActive ? (
                                  <ShieldOff className="h-4 w-4" />
                                ) : (
                                  <Shield className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
