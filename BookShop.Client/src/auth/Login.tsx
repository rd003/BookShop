import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { login, getUserInfo } from './api/authApi';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Login.tsx — add these imports at top, alongside existing ones
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const schema = z.object({
    username: z.string()
        .min(1, "Username is required")
        .max(30, "Username can not exceed 30 characters."),
    password: z.string()
        .min(1, "Password is required")
        .max(30, "Password can not exceed 30 characters.")
})

type IFormInput = z.infer<typeof schema>;

export default function Login() {
    const { register, handleSubmit, reset, formState: { errors, isValid, isDirty } } = useForm<IFormInput>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    const onFormSubmit: SubmitHandler<IFormInput> = (data) => {
        loginMutation.mutate(data, {
            onSuccess: () => reset()
        })
    }

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            navigate('/');
        }
    })

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-[#FBF8F3] px-4 py-4">
            <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-8">
                <div className="flex flex-col items-center">
                    <BookOpen className="h-8 w-8 text-[#8A2E2E]" strokeWidth={1.5} />
                    <h1 className="mt-3 font-serif text-2xl text-stone-900">Welcome back</h1>
                    <p className="mt-1 text-sm text-stone-500">Log in to your account</p>
                </div>

                <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="username" className="text-sm font-medium text-stone-700">
                            Username
                        </label>
                        <input
                            {...register("username")}
                            id="username"
                            name="username"
                            type="text"
                            placeholder="you@example.com"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                        {errors.username && <p style={{ 'color': 'red' }}>{errors.username?.message}</p>}

                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium text-stone-700">
                                Password
                            </label>
                            <Link to="/forgot-password" className="text-xs text-stone-500 hover:text-stone-900">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            {...register("password")}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                        {errors.password && <p style={{ 'color': 'red' }}>{errors.password.message}</p>}
                    </div>
                    {
                        loginMutation.isError && (<p className="text-red-500">Invalid username or password</p>)
                    }
                    <button
                        type="submit"
                        className="mt-2 rounded-md bg-[#8A2E2E] px-4 py-2 text-sm font-medium text-white hover:bg-[#732626]"
                        disabled={!isDirty || !isValid || loginMutation.isPending}
                    >
                        Log in
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-stone-500">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-[#8A2E2E] font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}