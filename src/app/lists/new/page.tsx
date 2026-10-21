"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createList } from "@/lib/actions/shows";

export default function NewListPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        const id = await createList(title, description);
        router.push(`/list/${id}`);
      } catch {
        setError("Sign in to create lists.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-white">New list</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-lbd-green px-4 py-2 text-sm font-bold uppercase text-black disabled:opacity-60"
        >
          Create list
        </button>
      </form>
    </div>
  );
}
