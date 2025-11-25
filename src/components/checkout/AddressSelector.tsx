"use client";

import { useState } from "react";
import { useAddresses, useDeleteAddress } from "@/src/lib/hooks/useAddresses";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Check, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Address } from "@/src/lib/types";

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
  onAddNew: () => void;
  onEdit: (address: Address) => void;
}

export function AddressSelector({
  selectedAddressId,
  onSelectAddress,
  onAddNew,
  onEdit,
}: AddressSelectorProps) {
  const { data: addresses, isLoading } = useAddresses();
  const deleteAddress = useDeleteAddress();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;

    try {
      setDeletingId(addressId);
      await deleteAddress.mutateAsync(addressId);
      toast.success("Dirección eliminada");

      if (selectedAddressId === addressId) {
        onSelectAddress(null);
      }
    } catch (error) {
      toast.error("Error al eliminar dirección");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (address: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(address);
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-center">Cargando direcciones...</p>
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-bold mb-2">
          No tienes direcciones guardadas
        </h3>
        <p className="text-muted-foreground mb-4">
          Agrega una dirección de envío para continuar
        </p>
        <Button onClick={onAddNew} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dirección
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Selecciona una dirección</h3>
        <Button variant="outline" onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Dirección
        </Button>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <button
            key={address.id}
            onClick={() => onSelectAddress(address.id)}
            className={`relative p-4 border-2 rounded-lg text-left transition-all hover:border-primary ${
              selectedAddressId === address.id
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
          >
            {selectedAddressId === address.id && (
              <div className="absolute top-4 right-4">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">{address.alias}</span>
                  {address.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                      Predeterminada
                    </span>
                  )}
                </div>
                <p className="font-medium mb-1">{address.fullName}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {address.address}
                  {address.municipality && `, ${address.municipality}`}
                  <br />
                  {address.city}, {address.state}
                  {address.zipCode && ` ${address.zipCode}`}
                </p>
                {address.reference && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Referencia:</span>{" "}
                    {address.reference}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEdit(address, e)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleDelete(address.id, e)}
                    disabled={deletingId === address.id}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {deletingId === address.id ? "Eliminando..." : "Eliminar"}
                  </Button>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
