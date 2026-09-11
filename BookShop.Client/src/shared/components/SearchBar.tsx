// New file: src/components/SearchBar.tsx
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

type SearchBarProps = {
    className?: string;
    placeholder?: string;
};

export default function SearchBar({ className, placeholder = "Search title or  author" }: SearchBarProps) {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('search') ?? '');
    const navigate = useNavigate();
    const location = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const currentSearchParam = new URLSearchParams(location.search).get('search') ?? '';
        if (query === currentSearchParam) return; // new: nothing actually changed, don't navigate (fixes StrictMode double-invoke bug)

        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(location.search);
            query ? params.set('search', query) : params.delete('search');
            navigate({ pathname: '/catalog', search: params.toString() }, { replace: true });
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [query]);

    function handleSearchSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        const params = new URLSearchParams(location.search);
        query ? params.set('search', query) : params.delete('search');
        navigate({ pathname: '/catalog', search: params.toString() });
    }

    return (
        <form onSubmit={handleSearchSubmit} className={className}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="pl-9 bg-white"
            />
        </form>
    );
}