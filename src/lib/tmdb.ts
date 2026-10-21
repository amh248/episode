const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p";

export type TmdbShow = {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  networks?: { id: number; name: string; logo_path: string | null }[];
  genres?: { id: number; name: string }[];
  created_by?: { id: number; name: string; profile_path: string | null }[];
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }[];
  };
};

export type TmdbPerson = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
};

function apiKey(): string | undefined {
  const key = process.env.TMDB_API_KEY;
  return key && key.length > 0 ? key : undefined;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const key = apiKey();
  if (!key) return null;

  const search = new URLSearchParams({ api_key: key, language: "en-US", ...params });
  const res = await fetch(`${TMDB_BASE}${path}?${search}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

export function posterUrl(path: string | null | undefined, size: "w185" | "w342" | "w500" | "original" = "w342") {
  if (!path) return null;
  return `${TMDB_IMAGE}/${size}${path}`;
}

export function profileUrl(path: string | null | undefined, size: "w185" | "h632" = "w185") {
  if (!path) return null;
  return `${TMDB_IMAGE}/${size}${path}`;
}

export async function getPopularShows(page = 1) {
  const data = await tmdbFetch<{ results: TmdbShow[] }>("/tv/popular", { page: String(page) });
  return data?.results ?? [];
}

export async function getTrendingShows() {
  const data = await tmdbFetch<{ results: TmdbShow[] }>("/trending/tv/week");
  return data?.results ?? [];
}

export async function getTopRatedShows(page = 1) {
  const data = await tmdbFetch<{ results: TmdbShow[] }>("/tv/top_rated", { page: String(page) });
  return data?.results ?? [];
}

export async function getShow(id: number): Promise<TmdbShow | null> {
  const data = await tmdbFetch<TmdbShow>(`/tv/${id}`, {
    append_to_response: "credits",
  });
  return data;
}

export async function getShowsByIds(ids: number[]): Promise<Map<number, TmdbShow>> {
  const map = new Map<number, TmdbShow>();
  const unique = [...new Set(ids)];
  await Promise.all(
    unique.map(async (id) => {
      const show = await getShow(id);
      if (show) map.set(id, show);
    }),
  );
  return map;
}

export async function searchShows(query: string, page = 1) {
  const data = await tmdbFetch<{ results: TmdbShow[] }>("/search/tv", {
    query,
    page: String(page),
  });
  return data?.results ?? [];
}

export async function searchPeople(query: string, page = 1) {
  const data = await tmdbFetch<{ results: TmdbPerson[] }>("/search/person", {
    query,
    page: String(page),
  });
  return data?.results ?? [];
}

/** Placeholder grid when TMDB is not configured (dev/demo). */
export const DEMO_SHOWS: TmdbShow[] = [
  {
    id: 1396,
    name: "Breaking Bad",
    overview: "A chemistry teacher diagnosed with cancer turns to cooking meth.",
    poster_path: "/ggFHVNu6YYI5LFLpdcOxgkoEikI.png",
    backdrop_path: "/tsRy63Mu9uFTEZ2A1JqD9GjGRMh.jpg",
    first_air_date: "2008-01-20",
    vote_average: 8.9,
    vote_count: 12000,
    popularity: 100,
  },
  {
    id: 1399,
    name: "Game of Thrones",
    overview: "Nine noble families fight for control over the lands of Westeros.",
    poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJ2.jpg",
    backdrop_path: "/2OMB0ynKlyIenMJWI2BuKJ4nT2.jpg",
    first_air_date: "2011-04-17",
    vote_average: 8.4,
    vote_count: 21000,
    popularity: 95,
  },
  {
    id: 66732,
    name: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery.",
    poster_path: "/49WJfeN0uoxf9xWD3No2mbBFTsW.jpg",
    backdrop_path: "/56v2KjBlU4XaOv9rJRBPQzHxwi9.jpg",
    first_air_date: "2016-07-15",
    vote_average: 8.6,
    vote_count: 16000,
    popularity: 90,
  },
  {
    id: 94605,
    name: "Arcane",
    overview: "Amid the stark discord of Piltover and Zaun, two sisters fight on rival sides.",
    poster_path: "/fqldf2t8ztjtTZvCWHjlD98dwh7.jpg",
    backdrop_path: "/93B0stpPOfk3d1tPCL8n7jWV0Bq.jpg",
    first_air_date: "2021-11-06",
    vote_average: 8.7,
    vote_count: 5000,
    popularity: 80,
  },
  {
    id: 60059,
    name: "Better Call Saul",
    overview: "The trials and tribulations of criminal lawyer Jimmy McGill.",
    poster_path: "/fC2HDm5t0kHl7mTmhnerrNiLDFW.jpg",
    backdrop_path: "/9faGSFi5jam6pDWGNdXn5X5IsLk.jpg",
    first_air_date: "2015-02-08",
    vote_average: 8.7,
    vote_count: 8000,
    popularity: 75,
  },
  {
    id: 82856,
    name: "The Mandalorian",
    overview: "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
    poster_path: "/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg",
    backdrop_path: "/9ijMGlJKqcslswWUQTEQMc0d0GR.jpg",
    first_air_date: "2019-11-12",
    vote_average: 8.5,
    vote_count: 9000,
    popularity: 70,
  },
];

export async function getPopularShowsSafe() {
  const shows = await getPopularShows();
  return shows.length > 0 ? shows : DEMO_SHOWS;
}

export async function getTrendingShowsSafe() {
  const shows = await getTrendingShows();
  return shows.length > 0 ? shows : DEMO_SHOWS;
}

export async function getShowSafe(id: number) {
  const show = await getShow(id);
  if (show) return show;
  return DEMO_SHOWS.find((s) => s.id === id) ?? null;
}
