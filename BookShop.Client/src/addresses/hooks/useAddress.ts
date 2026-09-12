import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../apis/addressApi";

export default function useAddress() {
    const { data, status, error } = useQuery({
        queryKey: ['addresses'],
        queryFn: getAddresses
    })
    return {
        addresses: data ?? [],
        addressQueryStatus: status,
        addressQueryError: error
    }
}