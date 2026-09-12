import { AddressList } from "./AddressList";
import type { ReadAddress } from "./types/readAddress";

export default function Addresses() {
    const sampleAddresses: ReadAddress[] = [
        {
            id: 1,
            fullName: "John Doe",
            phone: "+1 555-123-4567",
            line1: "123 Main St",
            line2: "Apt 4B",
            city: "San Francisco",
            state: "CA",
            postalCode: "94105",
            country: "United States",
            isDefault: true,
        },
        {
            id: 2,
            fullName: "Jane Smith",
            phone: "+1 555-987-6543",
            line1: "456 Market Ave",
            line2: null,
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
            isDefault: false,
        },
    ];
    function handleEditAddress(address: ReadAddress) {
        console.log("edit", address);
    }

    function handleDeleteAddress(id: number) {
        console.log("delete", id);
    }

    function handleChangeDefaultAddress(id: number) {
        console.log("set default", id)
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-6 text-2xl font-semibold">My Addresses</h1>
            <AddressList
                addresses={sampleAddresses}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleChangeDefaultAddress}
            />
        </div>
    )
}