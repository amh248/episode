# episode

A **Letterboxd-style social network for TV shows** — log what you watch, rate and review, keep a diary and watchlist, build lists, and follow friends.

![Stack](https://img.shields.io/badge/Next.js-15-black) ![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748)

## Features (Letterboxd parallels)

| Letterboxd | episode |
|------------|---------|
| Films | **Shows** (TMDB TV database) |
| Eye / Like / Watchlist / Stars | Same actions on show pages |
| + Log (diary) | **+ Log** with watch date, review, tags |
| Profile: Films, Diary, Watchlist, Lists | Same tab structure under `/member/[username]` |
| Activity from people you follow | Home feed when signed in |
| Lists & reviews | Public lists, community reviews on show pages |
| Members | `/members` directory |

## Quick start

```bash
cp .env.example .env
# Add TMDB_API_KEY from https://www.themoviedb.org/settings/api
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a TMDB key, the app uses a small **demo show catalog** so you can click through the UI.

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path, e.g. `file:./dev.db` |
| `NEXTAUTH_URL` | App URL |
| `NEXTAUTH_SECRET` | Random secret for sessions |
| `TMDB_API_KEY` | The Movie Database API key |

## Roadmap (closer to Letterboxd)

- Episode-level diary (Serializd-style) and season progress
- Streaming availability (JustWatch-style filters)
- Pro-style stats (genres, decades, networks, watch time)
- Import/export, OAuth providers, mobile PWA
- Likes on reviews, list comments, notifications

## License

MIT
