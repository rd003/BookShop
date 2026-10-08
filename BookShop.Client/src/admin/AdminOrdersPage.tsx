import { parseSort, type SortItem } from "@/lib/sort";
import type { GetAdminOrder } from "./types/getAdminOrder"
import AdminOrderList from "./ui/AdminOrderList";

export default function AdminOrdersPage() {
    // const sortItems = parseSort(queryParams.sortBy);
    const sortItems:SortItem[] = [{column:'orderDate',direction:'asc'}];
    const orders:GetAdminOrder[] = [
    {
      "orderId": 1,
      "customerEmail": "john@example.com",
      "orderNumber": "ORD-20261008-27A49",
      "orderDate": "2026-10-08T08:34:00.9434418+05:30",
      "orderStatus": "Pending",
      "pyamentMethod": "CashOnDelivery",
      "pyamentStatus": "Pending",
      "orderItems": [
        {
          "id": 0,
          "bookId": 1,
          "bookTitle": "The Fellowship of the Ring",
          "coverImageUrl": null,
          "authors": [
            "J.R.R. Tolkien"
          ],
          "genres": [
            "Fiction",
            "Fantasy"
          ],
          "quantity": 1,
          "unitPrice": 12.99,
          "itemTotalPrice": 12.99
        },
        {
          "id": 0,
          "bookId": 2,
          "bookTitle": "Dune",
          "coverImageUrl": null,
          "authors": [
            "Frank Herbert"
          ],
          "genres": [
            "Fiction",
            "Science Fiction"
          ],
          "quantity": 2,
          "unitPrice": 15.99,
          "itemTotalPrice": 31.98
        },
        {
          "id": 0,
          "bookId": 4,
          "bookTitle": "Clean Code",
          "coverImageUrl": null,
          "authors": [
            "Robert C. Martin"
          ],
          "genres": [
            "Programming"
          ],
          "quantity": 1,
          "unitPrice": 500.0,
          "itemTotalPrice": 500.0
        }
      ],
      "orderTotal": 544.97
    },
    {
      "orderId": 2,
      "customerEmail": "john@example.com",
      "orderNumber": "ORD-20261008-B1E53",
      "orderDate": "2026-10-08T08:34:46.2462214+05:30",
      "orderStatus": "Pending",
      "pyamentMethod": "CashOnDelivery",
      "pyamentStatus": "Pending",
      "orderItems": [
        {
          "id": 0,
          "bookId": 1,
          "bookTitle": "The Fellowship of the Ring",
          "coverImageUrl": null,
          "authors": [
            "J.R.R. Tolkien"
          ],
          "genres": [
            "Fiction",
            "Fantasy"
          ],
          "quantity": 1,
          "unitPrice": 12.99,
          "itemTotalPrice": 12.99
        }
      ],
      "orderTotal": 12.99
    }
  ]

  function handleSortToggle(column: string, multi = false){
    console.log(column);
    //  updateSearchParams((p) => {
    //                 p.set("sortBy", serializeSort(toggleSort(sortItems, column, multi)));
    //                 p.set("pageNumber", "1");
    //             })
  }
    return (<>
      <h1 className="text-2xl">Orders</h1>

      <AdminOrderList
       orders={orders}
       sort={sortItems}
       onSortToggle={handleSortToggle}
      />
    </>)
}