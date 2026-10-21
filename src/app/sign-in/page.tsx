"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignInForm() {
  const params = useSearchParams();
  const registered = params.get("registered");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-white">Sign in</h1>
      {registered && (
        <p className="mt-2 text-sm text-lbd-green">Account created — sign in below.</p>
      )}
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
            className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-lbd-green py-2 text-sm font-bold uppercase tracking-wide text-black hover:bg-lbd-green-dim disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-lbd-muted">
        New here?{" "}
        <Link href="/sign-up" className="text-lbd-green hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md text-lbd-muted">Loading…</div>}>
      <SignInForm />
    </Suspense>
  );
}
