export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-lbd-green">
      <h1>About episode</h1>
      <p>
        episode is an open-source, Letterboxd-inspired social network for television. Log what you watch,
        rate and review shows, maintain a diary and watchlist, build ranked lists, and follow friends.
      </p>
      <h2>Letterboxd parallels</h2>
      <ul>
        <li>
          <strong>Shows</strong> instead of films — powered by{" "}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            TMDB
          </a>
        </li>
        <li>
          <strong>Watched / Like / Watchlist / Rate</strong> from poster actions
        </li>
        <li>
          <strong>+ Log</strong> for diary entries with date, review, tags
        </li>
        <li>
          <strong>Profile tabs:</strong> Shows, Diary, Watchlist, Lists
        </li>
        <li>
          <strong>Activity feed</strong> from people you follow
        </li>
      </ul>
      <h2>Setup</h2>
      <p>
        Copy <code>.env.example</code> to <code>.env</code>, set <code>TMDB_API_KEY</code> (free from TMDB),
        run <code>npx prisma migrate dev</code>, then <code>npm run dev</code>.
      </p>
    </article>
  );
}
