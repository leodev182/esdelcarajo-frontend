"use client";

import { useState } from "react";
import Link from "next/link";
import { useAddresses, useDeleteAddress } from "@/src/lib/hooks/useAddresses";
import { ArrowLeft, Plus, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DireccionesPage() {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();

  const handleDelete = async (addressId: string, alias: string) => {
    if (!confirm(`¿Eliminar la dirección "${alias}"?`)) return;

    try {
      await deleteAddress.mutateAsync(addressId);
      toast.success("Dirección eliminada");
    } catch {
      toast.error("Error al eliminar dirección");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl">Cargando direcciones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/perfil"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-dark mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Mi Perfil
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Mis Direcciones</h1>
        <Link href="/checkout">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Dirección
          </Button>
        </Link>
      </div>

      {!addresses || addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dark">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 mb-4">
            No tienes direcciones guardadas
          </p>
          <Link href="/checkout">
            <Button>Agregar Primera Dirección</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg border-2 border-dark p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{address.alias}</h3>
                  {address.isDefault && (
                    <span className="inline-block mt-1 px-2 py-1 bg-primary text-white text-xs font-bold rounded">
                      Predeterminada
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(address.id, address.alias)}
                  disabled={deleteAddress.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-bold">{address.fullName}</span>
                </p>
                <p>{address.phone}</p>
                <p className="text-gray-600">
                  {address.address}
                  {address.reference && (
                    <>
                      <br />
                      <span className="text-xs">Ref: {address.reference}</span>
                    </>
                  )}
                </p>
                <p className="text-gray-600">
                  {address.city}, {address.state}
                  {address.zipCode && ` - ${address.zipCode}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Puedes agregar nuevas direcciones durante el
          proceso de checkout.
        </p>
      </div>
    </div>
  );
}
