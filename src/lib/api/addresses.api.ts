import { apiClient } from "./client";
import type { Address } from "../types";

export interface CreateAddressPayload {
  alias: string;
  fullName: string;
  phone: string;
  state: string;
  city: string;
  municipality?: string;
  address: string;
  zipCode?: string;
  reference?: string;
  isDefault?: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export async function getAddresses(): Promise<Address[]> {
  const { data } = await apiClient.get<Address[]>("/address");
  return data;
}

export async function getAddressById(addressId: string): Promise<Address> {
  const { data } = await apiClient.get<Address>(`/address/${addressId}`);
  return data;
}

export async function createAddress(
  payload: CreateAddressPayload
): Promise<Address> {
  const { data } = await apiClient.post<Address>("/address", payload);
  return data;
}

export async function updateAddress(
  addressId: string,
  payload: UpdateAddressPayload
): Promise<Address> {
  const { data } = await apiClient.patch<Address>(
    `/address/${addressId}`,
    payload
  );
  return data;
}

export async function setDefaultAddress(addressId: string): Promise<Address> {
  const { data } = await apiClient.patch<Address>(
    `/address/${addressId}/set-default`
  );
  return data;
}

export async function deleteAddress(addressId: string): Promise<Address> {
  const { data } = await apiClient.delete<Address>(`/address/${addressId}`);
  return data;
}
