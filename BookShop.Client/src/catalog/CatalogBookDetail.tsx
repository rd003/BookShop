import useBook from "@/book/hooks/useBook";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAddCartItem } from "./hooks/useCartMutation";
import { formatCurrency } from "@/lib/format";
import type { ReadBook } from "@/book/types/readBook";
import { toast } from "@/components/ui/toast";
import type { AddCartItemRequest } from "@/cart/types/addCartItemRequest";

export default function CatalogBookDetail() {
  const { id } = useParams();
  const location = useLocation();
  const from = (location?.state as { from?: string } | null)?.from;
  const backUrl = from ? from : "/catalog";

  const bookQuery = useBook(Number(id));
  const addCartMutation = useAddCartItem();

  const book = bookQuery.data;
  const disableCartButton = addCartMutation.status==='pending'

  function handleAddToCart(bookId: number | undefined) {
     if(!bookId) return;

     const cartItemReq: AddCartItemRequest = {
            bookId,
            quantity: 1
        };
        addCartMutation.mutate(cartItemReq);
        toast.add({
            title: "Added to cart",
            type: "success"
        })
  }

  return (
    <div className="py-4 px-8">
    <h1 className="text-3xl my-2">Detail</h1>

    <Button className="my-2" nativeButton={false} variant="outline" render={<Link to={backUrl}/>}>Back</Button>

    <p>{book?.title}</p>
    <p>{book?.isbn}</p>
    <p>{formatCurrency(book?.price!)}</p>
    <p>
      <img src={book?.coverImageUrl || "https://placehold.co/300x440?text=Book"} alt={book?.title}/>
    </p>
    <p>{book?.description}</p>
    <p>{book?.publisherName}</p>
    <p>{book?.genres.map(g=>g.name).join(", ")}</p>
    <p>{book?.authors.map(a=>a.name).join(", ")}</p>
    <p>{book?.stockQuantity}</p>

    <div>
      <Button variant="default" type="button" disabled={disableCartButton} onClick={()=>handleAddToCart(book?.id)}>Add to cart</Button>
    </div>
    </div>
  )
}
