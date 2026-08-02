"use client";

import { useActionState, useEffect, useRef, startTransition } from "react";
import { useForm } from "react-hook-form";
import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { loginWithPassword } from "@/actions/auth";
import type { LoginState } from "@/types/auth";

type LoginFields = { email: string; password: string };
const initialLoginState: LoginState = { status: "idle" };

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(loginWithPassword, initialLoginState);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({ mode: "onBlur" });

  useEffect(() => {
    if (state.status === "error" && state.message) toast.error(state.message);
    if (state.status === "success") window.location.assign("/admin");
  }, [state]);

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(() => formAction(formData));
  }

  return <main className="grid min-h-screen place-items-center bg-cream px-5"><section className="w-full max-w-md rounded-[2rem] border border-rose/30 bg-white p-8 shadow-sm"><LockKeyhole className="text-gold" /><p className="mt-6 text-sm font-semibold tracking-[0.2em] text-gold">ADMINISTRACIÓN</p><h1 className="mt-2 font-serif text-3xl text-wine">Bienvenida</h1><p className="mt-3 text-sm leading-6 text-stone-500">Ingresa con la cuenta administrativa autorizada.</p><form ref={formRef} className="mt-7 space-y-4" noValidate onSubmit={(event) => { event.preventDefault(); void handleSubmit(submit)(); }}><label className="block text-sm font-medium">Correo electrónico<input {...register("email", { required: "Ingresa tu correo electrónico." })} name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /></label>{errors.email && <p className="text-sm text-red-700">{errors.email.message}</p>}<label className="block text-sm font-medium">Contraseña<input {...register("password", { required: "Ingresa tu contraseña." })} name="password" type="password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /></label>{errors.password && <p className="text-sm text-red-700">{errors.password.message}</p>}<button disabled={pending} className="w-full rounded-xl bg-wine py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Verificando…" : "Ingresar"}</button></form></section></main>;
}
