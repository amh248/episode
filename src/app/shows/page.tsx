import { getPopularShowsSafe, getTopRatedShows } from "@/lib/tmdb";
import { PosterGrid } from "@/components/show/PosterGrid";
import { SectionHeading } from "@/components/section/SectionHeading";

export const metadata = { title: "Shows" };

export default async function ShowsPage() {
  const [popular, topRated] = await Promise.all([getPopularShowsSafe(), getTopRatedShows()]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold text-white">Shows</h1>
        <p className="mt-1 text-sm text-lbd-muted">
          Browse the database — mark watched, rate, review, and add to your watchlist.
        </p>
      </header>

      <section>
        <SectionHeading title="Popular" />
        <PosterGrid shows={popular} />
      </section>

      {topRated.length > 0 && (
        <section>
          <SectionHeading title="Top rated" />
          <PosterGrid shows={topRated} />
        </section>
      )}
    </div>
  );
}
