import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-lbd-border bg-lbd-header py-8 text-sm text-lbd-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-bold text-white">episode</span> — a social network for TV lovers. Inspired by{" "}
          <a href="https://letterboxd.com" className="text-lbd-green hover:underline" target="_blank" rel="noreferrer">
            Letterboxd
          </a>
          .
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/shows" className="hover:text-white">
            Browse shows
          </Link>
        </div>
      </div>
    </footer>
  );
}
