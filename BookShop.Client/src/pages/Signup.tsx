import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Signup() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-[#FBF8F3] px-4 py-4">
            <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-8">
                <div className="flex flex-col items-center">
                    <BookOpen className="h-8 w-8 text-[#8A2E2E]" strokeWidth={1.5} />
                    <h1 className="mt-3 font-serif text-2xl text-stone-900">Create an account</h1>
                    <p className="mt-1 text-sm text-stone-500">Join Chapter & Verse</p>
                </div>

                <form className="mt-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-stone-700">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Jane Doe"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-stone-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-stone-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-stone-700">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 rounded-md bg-[#8A2E2E] px-4 py-2 text-sm font-medium text-white hover:bg-[#732626]"
                    >
                        Sign up
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-stone-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#8A2E2E] font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}