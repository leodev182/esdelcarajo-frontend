"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreateAddress,
  useUpdateAddress,
} from "@/src/lib/hooks/useAddresses";
import { toast } from "sonner";
import type { Address } from "@/src/lib/types";

const addressSchema = z.object({
  alias: z.string().min(1, "Alias es obligatorio").max(50),
  fullName: z.string().min(1, "Nombre completo es obligatorio").max(100),
  phone: z.string().min(1, "Teléfono es obligatorio").max(20),
  state: z.string().min(1, "Estado es obligatorio").max(100),
  city: z.string().min(1, "Ciudad es obligatoria").max(100),
  municipality: z.string().max(100).optional(),
  address: z.string().min(1, "Dirección es obligatoria").max(500),
  zipCode: z.string().max(20).optional(),
  reference: z.string().max(500).optional(),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddressForm({
  address,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const isEditing = !!address;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? {
          alias: address.alias,
          fullName: address.fullName,
          phone: address.phone,
          state: address.state,
          city: address.city,
          municipality: address.municipality || "",
          address: address.address,
          zipCode: address.zipCode || "",
          reference: address.reference || "",
          isDefault: address.isDefault,
        }
      : {
          isDefault: false,
        },
  });

  const isDefault = watch("isDefault");

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (isEditing) {
        await updateAddress.mutateAsync({
          addressId: address.id,
          payload: data,
        });
        toast.success("Dirección actualizada exitosamente");
      } else {
        await createAddress.mutateAsync(data);
        toast.success("Dirección agregada exitosamente");
      }
      onSuccess();
    } catch (error) {
      toast.error(
        isEditing
          ? "Error al actualizar dirección"
          : "Error al agregar dirección"
      );
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">
            Alias <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("alias")}
            placeholder="Ej: Casa, Oficina"
            className={errors.alias ? "border-red-500" : ""}
          />
          {errors.alias && (
            <p className="text-sm text-red-500 mt-1">{errors.alias.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("fullName")}
            placeholder="Quien recibe el pedido"
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("phone")}
            placeholder="+58 424-1234567"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Estado <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("state")}
            placeholder="Ej: Miranda"
            className={errors.state ? "border-red-500" : ""}
          />
          {errors.state && (
            <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("city")}
            placeholder="Ej: Caracas"
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Municipio</label>
          <Input {...register("municipality")} placeholder="Opcional" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          Dirección Completa <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("address")}
          placeholder="Calle, Avenida, Edificio, Piso, Apartamento"
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">Código Postal</label>
          <Input {...register("zipCode")} placeholder="Opcional" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">
            Punto de Referencia
          </label>
          <Input {...register("reference")} placeholder="Opcional" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(checked) => setValue("isDefault", !!checked)}
        />
        <label
          htmlFor="isDefault"
          className="text-sm font-medium cursor-pointer"
        >
          Marcar como dirección predeterminada
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? isEditing
              ? "Actualizando..."
              : "Guardando..."
            : isEditing
            ? "Actualizar Dirección"
            : "Guardar Dirección"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
