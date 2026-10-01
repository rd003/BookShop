import type { BookQueryParameters } from "../types/bookQueryParameters"

const normalize = <T extends { genreIds?: number[] }>(params: T): T => ({
  ...params,
  genreIds: params.genreIds
    ? [...params.genreIds].sort((a, b) => a - b)
    : params.genreIds,
})

export const bookKeys = {
  all: ["books"] as const,
  list: (params: BookQueryParameters) =>
    ["books", "list", normalize(params)] as const,
  infinite: (params: Omit<BookQueryParameters, "pageNumber">) =>
    ["books", "infinite", normalize(params)] as const,
  detail: (id: number) => ["books", "detail", id] as const,
}
