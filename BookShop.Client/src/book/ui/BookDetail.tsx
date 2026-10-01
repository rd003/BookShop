import { useParams } from "react-router-dom"

export default function BookDetail() {
  const {id} = useParams();
  return (
    <div>
        <h1>BookDetail of {id}</h1>

    </div>
  )
}
