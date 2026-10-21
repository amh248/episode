import Link from "next/link";
import Image from "next/image";
import type { TmdbShow } from "@/lib/tmdb";
import { posterUrl } from "@/lib/tmdb";
import { formatRating } from "@/lib/utils";

type Review = {
  id: string;
  tmdbId: number;
  rating: number | null;
  review: string | null;
  watchedAt: Date | null;
  user: { username: string; displayName: string | null; avatarUrl: string | null };
  likes: { id: string }[];
};

type Props = {
  entry: Review;
  show?: TmdbShow | null;
};

export function ReviewCard({ entry, show }: Props) {
  const poster = show ? posterUrl(show.poster_path, "w185") : null;

  return (
    <article className="flex gap-3 border-b border-lbd-border py-4">
      <Link href={`/show/${entry.tmdbId}`} className="relative h-24 w-16 shrink-0 overflow-hidden rounded-sm bg-lbd-panel">
        {poster ? (
          <Image src={poster} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-lbd-muted">TV</div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <Link href={`/show/${entry.tmdbId}`} className="font-bold text-white hover:text-lbd-green">
            {show?.name ?? `Show #${entry.tmdbId}`}
          </Link>
          {entry.rating != null && (
            <span className="text-sm font-bold text-lbd-orange">★ {formatRating(entry.rating)}</span>
          )}
        </div>
        <p className="text-sm text-lbd-muted">
          Review by{" "}
          <Link href={`/member/${entry.user.username}`} className="text-lbd-green hover:underline">
            {entry.user.displayName ?? entry.user.username}
          </Link>
          {entry.watchedAt && (
            <span> · {entry.watchedAt.toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
          )}
        </p>
        {entry.review && (
          <p className="mt-2 text-sm leading-relaxed text-lbd-text line-clamp-4">{entry.review}</p>
        )}
        {entry.likes.length > 0 && (
          <p className="mt-1 text-xs text-lbd-muted">{entry.likes.length} likes</p>
        )}
      </div>
    </article>
  );
}
