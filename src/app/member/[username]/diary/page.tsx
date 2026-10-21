import { notFound } from "next/navigation";
import { getUserByUsername, getUserWatchEntries } from "@/lib/queries/user";
import { getShowsByIds } from "@/lib/tmdb";
import { ReviewCard } from "@/components/review/ReviewCard";

type Props = { params: Promise<{ username: string }> };

export default async function MemberDiaryPage({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const entries = await getUserWatchEntries(user.id, { diaryOnly: true });
  const showMap = await getShowsByIds(entries.map((e) => e.tmdbId));

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-white">Diary</h2>
      {entries.length > 0 ? (
        entries.map((entry) => (
          <ReviewCard key={entry.id} entry={entry} show={showMap.get(entry.tmdbId) ?? null} />
        ))
      ) : (
        <p className="text-lbd-muted">
          Diary entries appear when you log a show with a watch date.{" "}
          <a href="/log" className="text-lbd-green hover:underline">
            Log a show
          </a>
          .
        </p>
      )}
    </div>
  );
}
