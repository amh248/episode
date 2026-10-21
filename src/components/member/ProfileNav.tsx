"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = (username: string) => [
  { href: `/member/${username}`, label: "Profile" },
  { href: `/member/${username}/shows`, label: "Shows" },
  { href: `/member/${username}/diary`, label: "Diary" },
  { href: `/member/${username}/watchlist`, label: "Watchlist" },
  { href: `/member/${username}/lists`, label: "Lists" },
];

export function ProfileNav({ username }: { username: string }) {
  const pathname = usePathname();
  const items = tabs(username);

  return (
    <nav className="mb-6 flex flex-wrap gap-1 border-b border-lbd-border pb-2">
      {items.map((tab) => {
        const active =
          tab.href === `/member/${username}`
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
              active ? "bg-lbd-panel text-white" : "text-lbd-muted hover:text-white",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
