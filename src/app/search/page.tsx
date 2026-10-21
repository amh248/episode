import Link from "next/link";
import { searchShows, searchPeople, profileUrl } from "@/lib/tmdb";
import Image from "next/image";
import { PosterGrid } from "@/components/show/PosterGrid";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Search</h1>
        <p className="mt-2 text-lbd-muted">Enter a query in the header search box.</p>
      </div>
    );
  }

  const [shows, people] = await Promise.all([searchShows(query), searchPeople(query)]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Results for <span className="text-lbd-green">&ldquo;{query}&rdquo;</span>
      </h1>

      {shows.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-lbd-muted">Shows</h2>
          <PosterGrid shows={shows} />
        </section>
      )}

      {people.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-lbd-muted">People</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {people.map((person) => {
              const img = profileUrl(person.profile_path);
              return (
                <li key={person.id} className="text-center">
                  <div className="relative mx-auto aspect-square w-full max-w-[120px] overflow-hidden rounded-full bg-lbd-panel">
                    {img ? (
                      <Image src={img} alt={person.name} fill className="object-cover" sizes="120px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lbd-muted">?</div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-bold text-white">{person.name}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {shows.length === 0 && people.length === 0 && (
        <p className="text-lbd-muted">
          No results. Add a{" "}
          <code className="text-lbd-green">TMDB_API_KEY</code> in `.env` for live search, or try demo
          shows from the{" "}
          <Link href="/shows" className="text-lbd-green hover:underline">
            browse page
          </Link>
          .
        </p>
      )}
    </div>
  );
}
