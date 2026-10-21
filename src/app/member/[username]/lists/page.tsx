import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByUsername, getUserLists } from "@/lib/queries/user";

type Props = { params: Promise<{ username: string }> };

export default async function MemberListsPage({ params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const session = await getServerSession(authOptions);
  const isSelf = session?.user?.id === user.id;
  const lists = await getUserLists(user.id, !isSelf);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Lists</h2>
        {isSelf && (
          <Link href="/lists/new" className="text-sm font-bold uppercase text-lbd-green hover:text-white">
            + New list
          </Link>
        )}
      </div>
      {lists.length > 0 ? (
        <ul className="space-y-3">
          {lists.map((list) => (
            <li key={list.id} className="rounded-sm border border-lbd-border bg-lbd-panel p-4">
              <Link href={`/list/${list.id}`} className="font-bold text-white hover:text-lbd-green">
                {list.title}
              </Link>
              {list.description && <p className="mt-1 text-sm text-lbd-muted">{list.description}</p>}
              <p className="mt-2 text-xs text-lbd-muted">
                {list._count.items} shows · {list._count.likes} likes
                {!list.isPublic && isSelf && " · Private"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lbd-muted">No lists yet.</p>
      )}
    </div>
  );
}
