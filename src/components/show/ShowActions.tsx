"use client";

import { useTransition } from "react";
import {
  markWatched,
  toggleLike,
  toggleWatchlist,
  setRating,
} from "@/lib/actions/shows";
import { StarRating } from "./StarRating";

type Props = {
  tmdbId: number;
  watched: boolean;
  liked: boolean;
  onWatchlist: boolean;
  rating: number | null;
};

export function ShowActions({ tmdbId, watched, liked, onWatchlist, rating }: Props) {
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) => {
    startTransition(() => {
      void fn();
    });
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${pending ? "opacity-70" : ""}`}>
      <button
        type="button"
        title="Mark watched"
        onClick={() => run(() => markWatched(tmdbId))}
        className={`rounded-sm border px-3 py-1.5 text-sm font-bold uppercase tracking-wide ${
          watched
            ? "border-lbd-green bg-lbd-green/20 text-lbd-green"
            : "border-lbd-border text-lbd-muted hover:border-lbd-green hover:text-lbd-green"
        }`}
      >
        👁 Watched
      </button>
      <button
        type="button"
        title="Like"
        onClick={() => run(() => toggleLike(tmdbId))}
        className={`rounded-sm border px-3 py-1.5 text-sm ${
          liked ? "border-pink-500 text-pink-400" : "border-lbd-border text-lbd-muted hover:text-pink-400"
        }`}
      >
        ♥ {liked ? "Liked" : "Like"}
      </button>
      <button
        type="button"
        title="Watchlist"
        onClick={() => run(() => toggleWatchlist(tmdbId))}
        className={`rounded-sm border px-3 py-1.5 text-sm font-bold uppercase tracking-wide ${
          onWatchlist
            ? "border-sky-400 text-sky-300"
            : "border-lbd-border text-lbd-muted hover:border-sky-400 hover:text-sky-300"
        }`}
      >
        🕐 {onWatchlist ? "On watchlist" : "Watchlist"}
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-lbd-muted">Rate</span>
        <StarRating
          value={rating}
          onChange={(v) => run(() => setRating(tmdbId, v))}
          size="md"
        />
      </div>
    </div>
  );
}
