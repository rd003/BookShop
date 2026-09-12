import { AddressList } from "./AddressList";
import useAddress from "./hooks/useAddress";
import type { ReadAddress } from "./types/readAddress";

export default function Addresses() {
    const { addresses, addressQueryStatus, addressQueryError } = useAddress();

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

            {addressQueryStatus === 'pending' && <p>Loading...</p>}

            {addressQueryStatus === 'error' && <p>{addressQueryError?.message ?? 'Error on loading addresses!'}</p>}

            <AddressList
                addresses={addresses}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleChangeDefaultAddress}
            />
        </div>
    )
}