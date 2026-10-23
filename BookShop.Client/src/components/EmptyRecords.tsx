export default function EmptyRecords({ filtered, onClear, message, emptyMessage = "You haven't added any records yet." }: { filtered: boolean; onClear: () => void, message: string,emptyMessage?:string }) {
    return (
        <div className="mt-2 rounded-md border p-6 text-center">
            {filtered ? (
                <>
                    <p>{message}</p>
                    <button type="button" onClick={onClear} className="mt-2 underline">Clear filters</button>
                </>
            ) : (
                <>
                    <p>{emptyMessage}</p>
                </>
            )}
        </div>
    );
}