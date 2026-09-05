import { BookOpen, Heart, Truck, Users } from "lucide-react";

const VALUES = [
    {
        icon: BookOpen,
        title: "Curated, not just cataloged",
        description:
            "Every title on our shelves is picked by someone who's actually read it — no algorithm-only listings.",
    },
    {
        icon: Truck,
        title: "Fast, careful shipping",
        description:
            "Books are packed to survive the journey, and most orders leave our warehouse within 24 hours.",
    },
    {
        icon: Users,
        title: "Built for readers",
        description:
            "From students to lifelong collectors, we stock across genres, price points, and formats.",
    },
    {
        icon: Heart,
        title: "Independent at heart",
        description:
            "We're a small team that loves books first and business second — that order matters to us.",
    },
];

const TEAM = [
    { name: "Aditi Rao", role: "Founder & Curator" },
    { name: "Rohan Mehta", role: "Operations" },
    { name: "Simran Kaur", role: "Customer Experience" },
];

export default function About() {
    return (
        <div className="bg-[#FBF8F3]">
            {/* Hero */}
            <section className="mx-auto max-w-4xl px-4 py-16 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-[#8A2E2E]" strokeWidth={1.5} />
                <h1 className="mt-4 font-serif text-4xl text-stone-900">
                    About Chapter & Verse
                </h1>
                <p className="mt-4 text-stone-600 leading-relaxed">
                    We started Chapter & Verse in 2021 with a simple idea: buying books
                    online shouldn't feel like buying anything else off a shelf. This is
                    placeholder copy — replace it with your real founding story, mission,
                    and whatever makes your bookstore worth shopping at.
                </p>
            </section>

            {/* Values grid */}
            <section className="mx-auto max-w-5xl px-4 pb-16">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {VALUES.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="rounded-lg border border-stone-200 bg-white p-5"
                        >
                            <Icon className="h-6 w-6 text-[#8A2E2E]" strokeWidth={1.5} />
                            <h3 className="mt-3 text-sm font-medium text-stone-900">
                                {title}
                            </h3>
                            <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="mx-auto max-w-4xl px-4 pb-20">
                <h2 className="text-center font-serif text-2xl text-stone-900">
                    The people behind the shelves
                </h2>
                <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
                    {TEAM.map((member) => (
                        <div key={member.name} className="text-center">
                            <div className="mx-auto h-16 w-16 rounded-full bg-stone-200" />
                            <p className="mt-3 text-sm font-medium text-stone-900">
                                {member.name}
                            </p>
                            <p className="text-xs text-stone-500">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}