import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getShowSafe, posterUrl, profileUrl } from "@/lib/tmdb";
import { ShowActions } from "@/components/show/ShowActions";
import { getShowUserState } from "@/lib/queries/user";
import { db } from "@/lib/db";
import { ReviewCard } from "@/components/review/ReviewCard";
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const show = await getShowSafe(Number(id));
  return { title: show?.name ?? "Show" };
}

export default async function ShowPage({ params }: Props) {
  const { id } = await params;
  const tmdbId = Number(id);
  if (Number.isNaN(tmdbId)) notFound();

  const session = await getServerSession(authOptions);
  const [show, userState] = await Promise.all([
    getShowSafe(tmdbId),
    getShowUserState(session?.user?.id, tmdbId),
  ]);

  if (!show) notFound();

  const backdrop = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : null;
  const poster = posterUrl(show.poster_path, "w500");

  const communityReviews = await db.watchEntry.findMany({
    where: { tmdbId, review: { not: null } },
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: {
      user: { select: { username: true, displayName: true, avatarUrl: true } },
      likes: true,
    },
  });

  const avg =
    communityReviews.length > 0
      ? communityReviews.reduce((s, e) => s + (e.rating ?? 0), 0) /
        communityReviews.filter((e) => e.rating != null).length
      : null;

  return (
    <div>
      {backdrop && (
        <div className="relative -mx-4 -mt-8 mb-8 h-48 overflow-hidden md:h-64 lg:h-80">
          <Image src={backdrop} alt="" fill className="object-cover opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-lbd-bg via-lbd-bg/60 to-transparent" />
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative mx-auto h-72 w-48 shrink-0 overflow-hidden rounded-sm bg-lbd-panel shadow-poster md:mx-0">
          {poster ? (
            <Image src={poster} alt={show.name} fill className="object-cover" sizes="192px" />
          ) : (
            <div className="flex h-full items-center justify-center text-lbd-muted">No poster</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold text-white">{show.name}</h1>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-lbd-muted">
            {show.first_air_date && <span>{show.first_air_date.slice(0, 4)}</span>}
            {show.number_of_seasons != null && (
              <span>
                {show.number_of_seasons} season{show.number_of_seasons !== 1 ? "s" : ""}
              </span>
            )}
            {show.status && <span>{show.status}</span>}
            <span className="text-lbd-orange">TMDB ★ {show.vote_average.toFixed(1)}</span>
            {avg != null && !Number.isNaN(avg) && (
              <span className="text-lbd-green">Community ★ {avg.toFixed(1)}</span>
            )}
          </div>

          {show.genres && show.genres.length > 0 && (
            <p className="mt-2 text-sm text-lbd-text">{show.genres.map((g) => g.name).join(" · ")}</p>
          )}

          {session ? (
            <div className="mt-4">
              <ShowActions
                tmdbId={tmdbId}
                watched={!!userState?.entry}
                liked={userState?.entry?.liked ?? false}
                onWatchlist={userState?.onWatchlist ?? false}
                rating={userState?.entry?.rating ?? null}
              />
              <Link
                href={`/log?show=${tmdbId}`}
                className="mt-3 inline-block text-sm font-bold uppercase tracking-wide text-lbd-green hover:text-white"
              >
                + Log this show
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-lbd-muted">
              <Link href="/sign-in" className="text-lbd-green hover:underline">
                Sign in
              </Link>{" "}
              to watch, rate, and review.
            </p>
          )}

          <p className="mt-6 leading-relaxed text-lbd-text">{show.overview || "No overview yet."}</p>

          {show.created_by && show.created_by.length > 0 && (
            <p className="mt-4 text-sm text-lbd-muted">
              Created by {show.created_by.map((c) => c.name).join(", ")}
            </p>
          )}
        </div>
      </div>

      {show.credits?.cast && show.credits.cast.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-lbd-muted">Cast</h2>
          <ul className="flex gap-3 overflow-x-auto pb-2">
            {show.credits.cast.slice(0, 12).map((person) => {
              const img = profileUrl(person.profile_path);
              return (
                <li key={person.id} className="w-24 shrink-0 text-center">
                  <div className="relative mx-auto h-28 w-24 overflow-hidden rounded-sm bg-lbd-panel">
                    {img ? (
                      <Image src={img} alt={person.name} fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-lbd-muted">?</div>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-bold text-white line-clamp-1">{person.name}</p>
                  <p className="text-[10px] text-lbd-muted line-clamp-2">{person.character}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {communityReviews.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-lbd-muted">Reviews</h2>
          {communityReviews.map((entry) => (
            <ReviewCard key={entry.id} entry={entry} show={show} />
          ))}
        </section>
      )}
    </div>
  );
}
