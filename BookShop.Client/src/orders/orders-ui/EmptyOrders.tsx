import { Link } from "react-router-dom";

export default function EmptyOrders({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
    return (
        <div className="mt-2 rounded-md border p-6 text-center">
            {filtered ? (
                <>
                    <p>No orders match the selected filters.</p>
                    <button type="button" onClick={onClear} className="mt-2 underline">Clear filters</button>
                </>
            ) : (
                <>
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/" className="mt-2 inline-block underline">Browse books</Link>
                </>
            )}
        </div>
    );
}