import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTrendingShowsSafe, getShowsByIds } from "@/lib/tmdb";
import { PosterGrid } from "@/components/show/PosterGrid";
import { SectionHeading } from "@/components/section/SectionHeading";
import { ReviewCard } from "@/components/review/ReviewCard";
import { getActivityFeed, getRecentReviews } from "@/lib/queries/user";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const [trending, recentReviews] = await Promise.all([
    getTrendingShowsSafe(),
    getRecentReviews(8),
  ]);

  const reviewShowIds = recentReviews.map((r) => r.tmdbId);
  const showMap = await getShowsByIds([...reviewShowIds, ...trending.map((s) => s.id)]);

  let activity = null;
  if (session?.user?.id) {
    activity = await getActivityFeed(session.user.id, 10);
  }

  return (
    <div className="space-y-10">
      {!session && (
        <section className="rounded-sm border border-lbd-border bg-lbd-panel p-6 md:p-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Track, rate, and share the TV you watch.
          </h1>
          <p className="mt-3 max-w-2xl text-lbd-muted">
            episode is a Letterboxd-style home for television — log episodes and series, keep a diary,
            curate lists, and follow friends to see what they&apos;re watching.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="rounded-sm bg-lbd-green px-4 py-2 text-sm font-bold uppercase tracking-wide text-black hover:bg-lbd-green-dim"
            >
              Get started — it&apos;s free
            </Link>
            <Link
              href="/shows"
              className="rounded-sm border border-lbd-border px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:border-lbd-green"
            >
              Browse shows
            </Link>
          </div>
        </section>
      )}

      {session && activity && activity.length > 0 && (
        <section>
          <SectionHeading title="Activity from you & friends" href={`/member/${session.user.username}`} linkLabel="Your profile" />
          <ul className="divide-y divide-lbd-border">
            {activity.map((entry) => (
              <li key={entry.id}>
                <ReviewCard entry={entry} show={showMap.get(entry.tmdbId) ?? null} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <SectionHeading title="Popular this week" href="/shows" />
        <PosterGrid shows={trending.slice(0, 14)} />
      </section>

      {recentReviews.length > 0 && (
        <section>
          <SectionHeading title="Popular reviews" href="/shows" linkLabel="Browse shows" />
          <ul>
            {recentReviews.map((entry) => (
              <ReviewCard key={entry.id} entry={entry} show={showMap.get(entry.tmdbId) ?? null} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
