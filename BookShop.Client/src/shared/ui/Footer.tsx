import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FOOTER_COLUMNS = [
    {
        title: "Shop",
        links: ["Catalog", "New Arrivals", "Bestsellers", "Gift Cards"],
    },
    {
        title: "Help",
        links: ["Track Order", "Returns", "Shipping Info", "Contact Us"],
    },
    {
        title: "Company",
        links: ["About", "Careers", "Terms of Service", "Privacy Policy"],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-stone-200 bg-[#FBF8F3]">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                    {/* Brand + newsletter */}
                    <div className="col-span-2">
                        <a href="/" className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-[#8A2E2E]" strokeWidth={1.75} />
                            <span className="font-serif text-lg text-stone-900">
                                Chapter & Verse
                            </span>
                        </a>
                        <p className="mt-3 text-sm text-stone-500 max-w-xs">
                            Books picked and shipped with care, delivered to your door.
                        </p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="mt-4 flex max-w-xs gap-2"
                        >
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="bg-white"
                                required
                            />
                            <Button type="submit" className="bg-[#8A2E2E] hover:bg-[#732626] shrink-0">
                                Subscribe
                            </Button>
                        </form>
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-sm font-medium text-stone-900">{col.title}</h3>
                            <ul className="mt-3 space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex flex-col-reverse items-center gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
                    <p className="text-xs text-stone-400">
                        © {new Date().getFullYear()} Chapter & Verse. All rights reserved.
                    </p>
                    <p className="text-xs text-stone-400">Cash on delivery available nationwide</p>
                </div>
            </div>
        </footer>
    );
}