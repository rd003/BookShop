import type { PagedList } from "@/shared/types/pagedList"
import type { AdminOrderQueryParameters } from "../types/adminOrderQueryParameters"
import type { GetAdminOrder } from "../types/getAdminOrder"
import { apiFetch } from "@/lib/apiClient"
import type { ChangeOrderStatus } from "../types/changeOrderStatus"
import type { ChangePaymentStatus } from "../types/changePaymentStatus"

const url = "/admin/orders"

export async function getAdminOrders(
  queryParams: AdminOrderQueryParameters
): Promise<PagedList<GetAdminOrder>> {
  const params = new URLSearchParams({
    pageNumber: String(queryParams.pageNumber),
    pageSize: String(queryParams.pageSize),
  })

  if (queryParams.sortBy) {
    params.set("sortBy", queryParams.sortBy)
  }

  if (queryParams.startingOrderDate) {
    params.set("startingOrderDate", queryParams.startingOrderDate)
  }

  if (queryParams.endingOrderDate) {
    params.set("endingOrderDate", queryParams.endingOrderDate)
  }

  return await apiFetch<PagedList<GetAdminOrder>>(`${url}/${params.toString()}`)
}

export async function getAdminOrderDetail(
  orderId: number
): Promise<GetAdminOrder> {
  return await apiFetch(`${url}/${orderId}`)
}

export async function changePaymentStatus(
  data: ChangePaymentStatus
): Promise<void> {
  await apiFetch<void>(`${url}/change-payment-status`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function changeOrderStatus(
  data: ChangeOrderStatus
): Promise<void> {
  await apiFetch<void>(`${url}/change-order-status`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}
