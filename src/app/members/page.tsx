import Link from "next/link";
import { db } from "@/lib/db";

export const metadata = { title: "Members" };

export default async function MembersPage() {
  const members = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      _count: { select: { watchEntries: true, followers: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Members</h1>
      <p className="mt-1 text-sm text-lbd-muted">Find people to follow and see what they&apos;re watching.</p>
      <ul className="mt-6 divide-y divide-lbd-border">
        {members.map((m) => (
          <li key={m.id} className="flex items-center justify-between py-3">
            <div>
              <Link href={`/member/${m.username}`} className="font-bold text-lbd-green hover:text-white">
                {m.displayName ?? m.username}
              </Link>
              <p className="text-xs text-lbd-muted">
                @{m.username} · {m._count.watchEntries} shows · {m._count.followers} followers
              </p>
            </div>
          </li>
        ))}
      </ul>
      {members.length === 0 && <p className="mt-4 text-lbd-muted">No members yet.</p>}
    </div>
  );
}
