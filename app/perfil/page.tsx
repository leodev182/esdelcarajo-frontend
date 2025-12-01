"use client";

import { useState } from "react";
import { useAuth } from "@/src/lib/hooks/useAuth";
import { useUpdateUser } from "@/src/lib/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin, ShoppingBag, Heart, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const updateUser = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    nickname: user?.nickname || "",
    phone: user?.phone || "",
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl mb-4">Debes iniciar sesión para ver tu perfil</p>
        <Link href="/login">
          <Button>Iniciar Sesión</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser.mutateAsync(form);
      toast.success("Perfil actualizado");
      setIsEditing(false);
    } catch {
      toast.error("Error al actualizar perfil");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Mi Perfil</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border-2 border-dark p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Información Personal</h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Nombre Completo
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Nickname / Alias
                  </label>
                  <Input
                    value={form.nickname}
                    onChange={(e) =>
                      setForm({ ...form, nickname: e.target.value })
                    }
                    placeholder="Tu alias"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Teléfono
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="0412-XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-500">
                    Email (no editable)
                  </label>
                  <Input value={user.email} disabled />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={updateUser.isPending}
                    className="flex-1"
                  >
                    {updateUser.isPending ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({
                        name: user?.name || "",
                        nickname: user?.nickname || "",
                        phone: user?.phone || "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-bold">{user.name || "Sin nombre"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Nickname</p>
                  <p className="font-bold">{user.nickname || "Sin nickname"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-bold">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-bold">{user.phone || "Sin teléfono"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-4">Accesos Rápidos</h2>
            <div className="space-y-2">
              <Link href="/perfil/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Mis Órdenes
                </Button>
              </Link>

              <Link href="/perfil/direcciones">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Mis Direcciones
                </Button>
              </Link>

              <Link href="/favoritos">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Mis Favoritos
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-dark p-6">
            <h2 className="text-xl font-bold mb-2">Información de Cuenta</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Rol:</span>{" "}
                <span className="font-bold">
                  {user.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : user.role === "ADMIN"
                    ? "Admin"
                    : "Usuario"}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Miembro desde:</span>{" "}
                <span className="font-bold">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("es-VE")
                    : "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
