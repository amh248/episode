"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/shows", label: "Shows" },
  { href: "/lists", label: "Lists" },
  { href: "/members", label: "Members" },
];

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const username = session?.user?.username;

  return (
    <header className="border-b border-lbd-border bg-lbd-header">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-bold tracking-tight text-white">
            episode<span className="text-lbd-green">.</span>
          </span>
        </Link>

        <form action="/search" method="get" className="hidden flex-1 md:block max-w-md">
          <input
            name="q"
            type="search"
            placeholder="Search shows, lists, members…"
            className="w-full rounded-sm border border-lbd-border bg-lbd-bg px-3 py-1.5 text-sm text-lbd-text placeholder:text-lbd-muted focus:border-lbd-green focus:outline-none"
          />
        </form>

        <nav className="hidden items-center gap-4 text-sm font-semibold uppercase tracking-wide lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-lbd-muted hover:text-white transition-colors",
                pathname.startsWith(item.href) && "text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/log"
                className="hidden rounded-sm bg-lbd-green px-3 py-1.5 font-bold uppercase tracking-wide text-black hover:bg-lbd-green-dim sm:inline-block"
              >
                + Log
              </Link>
              <Link href={`/member/${username}`} className="font-semibold text-lbd-green hover:text-white">
                {username}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-lbd-muted hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="font-semibold text-lbd-muted hover:text-white">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-sm bg-lbd-green px-3 py-1.5 font-bold uppercase tracking-wide text-black hover:bg-lbd-green-dim"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
