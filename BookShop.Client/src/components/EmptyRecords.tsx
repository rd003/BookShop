export default function EmptyRecords({ filtered, onClear }: { filtered: boolean; onClear: () => void }) {
    return (
        <div className="mt-2 rounded-md border p-6 text-center">
            {filtered ? (
                <>
                    <p>No genres match the selected filters.</p>
                    <button type="button" onClick={onClear} className="mt-2 underline">Clear filters</button>
                </>
            ) : (
                <>
                    <p>You haven't added any genres yet.</p>
                </>
            )}
        </div>
    );
}