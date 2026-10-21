import Link from "next/link";
import { notFound } from "next/navigation";
import { getListById } from "@/lib/queries/user";
import { getShowsByIds } from "@/lib/tmdb";
import { PosterGrid } from "@/components/show/PosterGrid";
import { AddToListForm } from "@/components/list/AddToListForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const list = await getListById(id);
  return { title: list?.title ?? "List" };
}

export default async function ListPage({ params }: Props) {
  const { id } = await params;
  const list = await getListById(id);
  if (!list) notFound();
  if (!list.isPublic) notFound();

  const showMap = await getShowsByIds(list.items.map((i) => i.tmdbId));
  const shows = list.items
    .map((i) => showMap.get(i.tmdbId))
    .filter(Boolean) as NonNullable<ReturnType<typeof showMap.get>>[];

  return (
    <div>
      <p className="text-sm text-lbd-muted">
        List by{" "}
        <Link href={`/member/${list.user.username}`} className="text-lbd-green hover:underline">
          {list.user.displayName ?? list.user.username}
        </Link>
      </p>
      <h1 className="mt-1 text-3xl font-bold text-white">{list.title}</h1>
      {list.description && <p className="mt-3 text-lbd-text">{list.description}</p>}
      <p className="mt-2 text-xs text-lbd-muted">
        {list._count.likes} likes · {shows.length} shows
      </p>

      <AddToListForm listId={list.id} />

      <div className="mt-8">
        {shows.length > 0 ? (
          <PosterGrid shows={shows} />
        ) : (
          <p className="text-lbd-muted">This list is empty — add shows below if you own it.</p>
        )}
      </div>
    </div>
  );
}
