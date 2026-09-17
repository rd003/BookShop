export interface QueryParameters {
    pageSize: number;
    pageNumber: number;
    sortBy: string;
    searchTerm: string;
}

export type OrdersQueryParameters = Omit<QueryParameters, "searchTerm">;