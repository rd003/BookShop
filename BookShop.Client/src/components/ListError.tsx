export default function ListError({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div role="alert" className="mt-2 rounded-md border border-red-300 bg-red-50 p-4">
            <p className="text-red-800">{message}</p>
            <button type="button" onClick={onRetry} className="mt-2 underline">
                Try again
            </button>
        </div>
    );
}