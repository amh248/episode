"use client";

import { useTransition } from "react";
import { followUser, unfollowUser } from "@/lib/actions/shows";

export function FollowButton({
  username,
  isFollowing,
  isSelf,
}: {
  username: string;
  isFollowing: boolean;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  if (isSelf) return null;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(() => {
          void (isFollowing ? unfollowUser(username) : followUser(username));
        })
      }
      className="rounded-sm border border-lbd-border px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white hover:border-lbd-green hover:text-lbd-green disabled:opacity-60"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
