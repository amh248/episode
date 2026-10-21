"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { logShow } from "@/lib/actions/shows";
import { StarRating } from "@/components/show/StarRating";

function LogForm() {
  const params = useSearchParams();
  const presetShow = params.get("show");
  const [tmdbId, setTmdbId] = useState(presetShow ?? "");
  const [watchedAt, setWatchedAt] = useState(new Date().toISOString().slice(0, 10));
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [liked, setLiked] = useState(false);
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (presetShow) setTmdbId(presetShow);
  }, [presetShow]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = Number(tmdbId);
    if (Number.isNaN(id)) {
      setError("Enter a valid TMDB show ID (see URL on any show page).");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await logShow({
          tmdbId: id,
          watchedAt,
          rating: rating ?? undefined,
          review,
          liked,
          tags,
        });
        window.location.href = `/show/${id}`;
      } catch {
        setError("You must be signed in to log shows.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg space-y-4">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Show ID</span>
        <input
          value={tmdbId}
          onChange={(e) => setTmdbId(e.target.value)}
          required
          className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
          placeholder="e.g. 1396 for Breaking Bad"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Watched on</span>
        <input
          type="date"
          value={watchedAt}
          onChange={(e) => setWatchedAt(e.target.value)}
          className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
        />
      </label>
      <div>
        <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Rating</span>
        <div className="mt-1">
          <StarRating value={rating} onChange={setRating} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={liked} onChange={(e) => setLiked(e.target.checked)} />
        I liked this show
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Review</span>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-lbd-muted">Tags</span>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1 w-full rounded-sm border border-lbd-border px-3 py-2 focus:border-lbd-green focus:outline-none"
          placeholder="comma-separated"
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-lbd-green px-6 py-2 text-sm font-bold uppercase tracking-wide text-black hover:bg-lbd-green-dim disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save log"}
      </button>
    </form>
  );
}

export default function LogPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Log a show</h1>
      <p className="mb-6 text-sm text-lbd-muted">
        Like Letterboxd&apos;s diary — add the date you watched, your rating, and a review.
      </p>
      <Suspense fallback={<p className="text-lbd-muted">Loading…</p>}>
        <LogForm />
      </Suspense>
    </div>
  );
}
