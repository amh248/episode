"use client";

import { useTransition } from "react";
import { addShowToList } from "@/lib/actions/shows";

export function AddToListForm({ listId }: { listId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mt-6 flex flex-wrap gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const id = Number(fd.get("tmdbId"));
        if (Number.isNaN(id)) return;
        startTransition(() => addShowToList(listId, id));
      }}
    >
      <input
        name="tmdbId"
        placeholder="TMDB show ID to add"
        className="rounded-sm border border-lbd-border px-3 py-1.5 text-sm focus:border-lbd-green focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm border border-lbd-border px-3 py-1.5 text-xs font-bold uppercase text-white hover:border-lbd-green disabled:opacity-60"
      >
        Add show
      </button>
    </form>
  );
}
