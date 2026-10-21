import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/queries/user";
import { ProfileNav } from "@/components/member/ProfileNav";
import { FollowButton } from "@/components/member/FollowButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type Props = {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
};

export default async function MemberLayout({ children, params }: Props) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const session = await getServerSession(authOptions);
  let isFollowing = false;
  if (session?.user?.id && session.user.id !== user.id) {
    const follow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  return (
    <div>
      <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{user.displayName ?? user.username}</h1>
          <p className="text-sm text-lbd-muted">@{user.username}</p>
          {user.bio && <p className="mt-2 max-w-xl text-sm text-lbd-text">{user.bio}</p>}
          <p className="mt-2 text-xs text-lbd-muted">
            {user._count.watchEntries} shows · {user._count.watchlist} watchlist ·{" "}
            {user._count.followers} followers · {user._count.following} following
          </p>
        </div>
        <FollowButton
          username={user.username}
          isFollowing={isFollowing}
          isSelf={session?.user?.id === user.id}
        />
      </header>
      <ProfileNav username={user.username} />
      {children}
    </div>
  );
}
