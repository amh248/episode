import { notFound } from "next/navigation";
import { getUserByUsername, getWatchlist } from "@/lib/queries/user";
import { getShowsByIds } from "@/lib/tmdb";
import { PosterGrid } from "@/components/show/PosterGrid";

type Props = { params: Promise<{ username: string }> };

export default async function MemberWatchlistPage({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const items = await getWatchlist(user.id);
  const showMap = await getShowsByIds(items.map((i) => i.tmdbId));
  const shows = items.map((i) => showMap.get(i.tmdbId)).filter(Boolean) as NonNullable<
    ReturnType<typeof showMap.get>
  >[];

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Watchlist</h2>
      {shows.length > 0 ? (
        <PosterGrid shows={shows} />
      ) : (
        <p className="text-lbd-muted">Watchlist is empty — use the clock icon on any show.</p>
      )}
    </div>
  );
}
