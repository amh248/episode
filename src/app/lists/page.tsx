import Link from "next/link";
import { getPopularLists } from "@/lib/queries/user";

export const metadata = { title: "Lists" };

export default async function ListsPage() {
  const lists = await getPopularLists(20);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Lists</h1>
          <p className="mt-1 text-sm text-lbd-muted">Curated collections from the community.</p>
        </div>
        <Link
          href="/lists/new"
          className="rounded-sm bg-lbd-green px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-black hover:bg-lbd-green-dim"
        >
          + New list
        </Link>
      </header>

      {lists.length > 0 ? (
        <ul className="space-y-3">
          {lists.map((list) => (
            <li key={list.id} className="rounded-sm border border-lbd-border bg-lbd-panel p-4">
              <Link href={`/list/${list.id}`} className="text-lg font-bold text-white hover:text-lbd-green">
                {list.title}
              </Link>
              <p className="text-xs text-lbd-muted">
                by{" "}
                <Link href={`/member/${list.user.username}`} className="text-lbd-green hover:underline">
                  {list.user.displayName ?? list.user.username}
                </Link>{" "}
                · {list._count.items} shows · {list._count.likes} likes
              </p>
              {list.description && <p className="mt-2 text-sm text-lbd-text">{list.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lbd-muted">No public lists yet — be the first to create one.</p>
      )}
    </div>
  );
}
