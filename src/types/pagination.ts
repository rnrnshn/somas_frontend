export type PaginatedResponse<T> = {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
  }
  data: T[]
}
