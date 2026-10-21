import type { TmdbShow } from "@/lib/tmdb";
import { PosterCard } from "./PosterCard";

type Props = {
  shows: TmdbShow[];
  ratings?: Record<number, number | null>;
};

export function PosterGrid({ shows, ratings }: Props) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {shows.map((show) => (
        <li key={show.id}>
          <PosterCard show={show} rating={ratings?.[show.id] ?? undefined} />
        </li>
      ))}
    </ul>
  );
}
