import { BookX, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center bg-[#FBF8F3]">
            <BookX className="h-16 w-16 text-[#8A2E2E]" strokeWidth={1.25} />

            <p className="mt-6 font-serif text-7xl text-stone-900">404</p>
            <h1 className="mt-2 text-xl font-medium text-stone-900">
                This page has been checked out
            </h1>
            <p className="mt-2 max-w-sm text-sm text-stone-500">
                We couldn't find the page you were looking for. It may have been moved,
                renamed, or never existed on our shelves.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button render={<Link to="/" />} className="bg-[#8A2E2E] hover:bg-[#732626]">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to home
                </Button>
                {/* <Button render={<Link to="/catalog" />} variant="outline">
                    Browse catalog
                </Button> */}
            </div>
        </div>
    );
}