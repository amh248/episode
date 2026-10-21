import { notFound } from "next/navigation";
import { getUserByUsername, getUserWatchEntries } from "@/lib/queries/user";
import { getShowsByIds } from "@/lib/tmdb";
import { PosterGrid } from "@/components/show/PosterGrid";

type Props = { params: Promise<{ username: string }> };

export default async function MemberShowsPage({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const entries = await getUserWatchEntries(user.id);
  const showMap = await getShowsByIds(entries.map((e) => e.tmdbId));
  const shows = entries.map((e) => showMap.get(e.tmdbId)).filter(Boolean) as NonNullable<
    ReturnType<typeof showMap.get>
  >[];
  const ratings = Object.fromEntries(entries.map((e) => [e.tmdbId, e.rating]));

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">{entries.length} shows watched</h2>
      {shows.length > 0 ? (
        <PosterGrid shows={shows} ratings={ratings} />
      ) : (
        <p className="text-lbd-muted">No shows marked yet.</p>
      )}
    </div>
  );
}
