import { notFound } from "next/navigation";
import { getUserByUsername, getUserWatchEntries } from "@/lib/queries/user";
import { getShowsByIds, posterUrl } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { ReviewCard } from "@/components/review/ReviewCard";

type Props = { params: Promise<{ username: string }> };

export default async function MemberProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const recent = await getUserWatchEntries(user.id);
  const favorites = user.favoriteShows;
  const showMap = await getShowsByIds([
    ...recent.slice(0, 6).map((e) => e.tmdbId),
    ...favorites.map((f) => f.tmdbId),
  ]);

  const recentReviews = recent.filter((e) => e.review).slice(0, 5);

  return (
    <div className="space-y-8">
      {favorites.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-lbd-muted">Favorite shows</h2>
          <ul className="flex flex-wrap gap-2">
            {favorites.map((f) => {
              const show = showMap.get(f.tmdbId);
              const src = show ? posterUrl(show.poster_path, "w185") : null;
              return (
                <li key={f.id}>
                  <Link
                    href={`/show/${f.tmdbId}`}
                    className="relative block h-36 w-24 overflow-hidden rounded-sm bg-lbd-panel"
                  >
                    {src ? (
                      <Image src={src} alt={show?.name ?? ""} fill className="object-cover" sizes="96px" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs">TV</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {recentReviews.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-lbd-muted">Recent reviews</h2>
          {recentReviews.map((entry) => (
            <ReviewCard key={entry.id} entry={entry} show={showMap.get(entry.tmdbId) ?? null} />
          ))}
        </section>
      )}

      {recent.length === 0 && (
        <p className="text-lbd-muted">No activity yet.</p>
      )}
    </div>
  );
}
