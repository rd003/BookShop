import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/auth/api/authApi";
import { getUserFacingError } from "@/lib/getUserFacingError";
import { useState } from "react";
import type { SignupPayload } from "@/auth/types/signupPayload";

const schema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(30, "Name can not exceed 30 characters."),
    email: z.string()
        .min(1, "Email is required")
        .max(30, "Email can not exceed 30 characters."),
    password: z.string()
        .min(1, "Password is required")
        .max(30, "Password can not exceed 30 characters."),
    confirmPassword: z.string()
        .min(1, "Password Confirm is required")
        .max(30, "Password Confirm can not exceed 30 characters.")

})
.refine((data)=> data.password === data.confirmPassword,{
   message: "Passwords do not match",
   path: ['confirmPassword']
})

type IFormInput = z.infer<typeof schema>;

export default function Signup() {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string|null>(null);

    const signupMutation = useMutation({
        mutationFn: signup,
        onSuccess:()=>{
            setMessage('You have been successfully registered');
            reset();
            navigate("/login")
        },
        onError:(err)=>{
          console.log(err);
        }
    });

    const submitting = signupMutation.status === 'pending';

    const { register, handleSubmit, reset, formState: { errors, isValid, isDirty } } = useForm<IFormInput>({
            resolver: zodResolver(schema),
            mode: 'onChange'
    })

    const onFormSubmit: SubmitHandler<IFormInput> = (data) => {
        const {confirmPassword, ...signupData} =  data;
        signupMutation.mutate(signupData);
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-[#FBF8F3] px-4 py-4">
            <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-8">
                <div className="flex flex-col items-center">
                    <BookOpen className="h-8 w-8 text-[#8A2E2E]" strokeWidth={1.5} />
                    <h1 className="mt-3 font-serif text-2xl text-stone-900">Create an account</h1>
                    <p className="mt-1 text-sm text-stone-500">Join Chapter & Verse</p>
                </div>

                <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-stone-700">
                            Full name
                        </label>
                        <input
                            {...register("name")}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Jane Doe"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                         {errors.name && <p style={{ 'color': 'red' }}>{errors.name?.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-stone-700">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                         {errors.email && <p style={{ 'color': 'red' }}>{errors.email?.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-stone-700">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                         {errors.password && <p style={{ 'color': 'red' }}>{errors.password?.message}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-stone-700">
                            Confirm password
                        </label>
                        <input
                            {...register("confirmPassword")}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-[#8A2E2E]"
                        />
                         {errors.confirmPassword && <p style={{ 'color': 'red' }}>{errors.confirmPassword?.message}</p>}
                    </div>


                {signupMutation.status==='error' && <p role="alert" className="text-destructive mt-1">
                    {getUserFacingError(signupMutation.error)}
                </p>}

                 {
                    message && <p role="alert" className="text-green-600 mt-1">
                       {message}
                    </p>
                 }
                    <button
                        type="submit"
                        className="mt-2 rounded-md bg-[#8A2E2E] px-4 py-2 text-sm font-medium text-white hover:bg-[#732626]"
                        disabled = {submitting || !isDirty || !isValid}
                    >
                        {submitting ? 'Saving...':'Sign up'}
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