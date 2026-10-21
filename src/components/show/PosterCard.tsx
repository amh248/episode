import Link from "next/link";
import Image from "next/image";
import type { TmdbShow } from "@/lib/tmdb";
import { posterUrl } from "@/lib/tmdb";

type Props = {
  show: TmdbShow;
  href?: string;
  rating?: number | null;
  overlay?: React.ReactNode;
};

export function PosterCard({ show, href, rating, overlay }: Props) {
  const src = posterUrl(show.poster_path, "w342");
  const link = href ?? `/show/${show.id}`;

  return (
    <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-sm bg-lbd-panel shadow-poster">
      <Link href={link} className="block h-full w-full">
        {src ? (
          <Image
            src={src}
            alt={show.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, 180px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-lbd-panel p-2 text-center text-xs text-lbd-muted">
            {show.name}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-xs font-bold text-white line-clamp-2">{show.name}</p>
          {show.first_air_date && (
            <p className="text-[10px] text-lbd-muted">{show.first_air_date.slice(0, 4)}</p>
          )}
        </div>
      </Link>
      {rating != null && (
        <span className="absolute top-1 right-1 rounded bg-black/70 px-1 text-xs font-bold text-lbd-orange">
          ★ {rating}
        </span>
      )}
      {overlay && <div className="absolute top-1 left-1 flex gap-1">{overlay}</div>}
    </div>
  );
}
