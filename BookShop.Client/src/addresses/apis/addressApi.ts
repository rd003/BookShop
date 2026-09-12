import { apiFetch } from "@/lib/apiClient";
import type { ReadAddress } from "../types/readAddress";
import type { CreateAddress } from "../types/createAddress";
import type { UpdateAddress } from "../types/updateAddress";

const url = "/addresses";

export async function getAddresses(): Promise<ReadAddress[]> {
    const addresses = await apiFetch<ReadAddress[]>(url);
    return addresses;
}

export async function createAddress(createAddress: CreateAddress): Promise<ReadAddress> {
    const createdAddress = await apiFetch<ReadAddress>(url, {
        method: 'POST',
        body: JSON.stringify(createAddress)
    });
    return createdAddress;
}

export async function updateAddress(updateAddress: UpdateAddress): Promise<void> {
    await apiFetch<ReadAddress>(url, {
        method: 'PATCH',
        body: JSON.stringify(updateAddress)
    });
}

export async function deleteAddress(addressId: number): Promise<void> {
    await apiFetch<ReadAddress>(url + "/" + addressId, {
        method: 'DELETE',
    });
}