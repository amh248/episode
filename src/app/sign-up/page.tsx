"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthState } from "@/lib/actions/auth";

const initial: AuthState = {};

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, initial);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-white">Create account</h1>
      <p className="mt-2 text-sm text-lbd-muted">Join episode and start logging TV.</p>
      <form action={action} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Username</span>
          <input
            name="username"
            type="text"
            pattern="[a-zA-Z0-9_]+"
            className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
            placeholder="optional"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
          />
        </label>
        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-sm bg-lbd-green py-2 text-sm font-bold uppercase tracking-wide text-black hover:bg-lbd-green-dim disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-lbd-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-lbd-green hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
