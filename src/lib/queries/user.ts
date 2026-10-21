import { db } from "@/lib/db";

export async function getUserByUsername(username: string) {
  return db.user.findUnique({
    where: { username },
    include: {
      favoriteShows: { orderBy: { position: "asc" } },
      _count: {
        select: {
          watchEntries: true,
          watchlist: true,
          lists: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}

export async function getUserWatchEntries(userId: string, options?: { diaryOnly?: boolean }) {
  return db.watchEntry.findMany({
    where: {
      userId,
      ...(options?.diaryOnly ? { watchedAt: { not: null } } : {}),
    },
    orderBy: options?.diaryOnly ? { watchedAt: "desc" } : { updatedAt: "desc" },
    include: {
      likes: true,
      user: { select: { username: true, displayName: true, avatarUrl: true } },
    },
  });
}

export async function getWatchlist(userId: string) {
  return db.watchlistItem.findMany({
    where: { userId },
    orderBy: { addedAt: "desc" },
  });
}

export async function getUserLists(userId: string, publicOnly = false) {
  return db.list.findMany({
    where: { userId, ...(publicOnly ? { isPublic: true } : {}) },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { items: true, likes: true } },
      user: { select: { username: true, displayName: true } },
    },
  });
}

export async function getListById(id: string) {
  return db.list.findUnique({
    where: { id },
    include: {
      items: { orderBy: { position: "asc" } },
      user: { select: { username: true, displayName: true } },
      _count: { select: { likes: true } },
    },
  });
}

export async function getActivityFeed(userId: string, limit = 30) {
  const following = await db.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const ids = [userId, ...following.map((f) => f.followingId)];

  return db.watchEntry.findMany({
    where: {
      userId: { in: ids },
      OR: [{ review: { not: null } }, { rating: { not: null } }, { watchedAt: { not: null } }],
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      user: { select: { username: true, displayName: true, avatarUrl: true } },
      likes: true,
    },
  });
}

export async function getShowUserState(userId: string | undefined, tmdbId: number) {
  if (!userId) return null;
  const [entry, watchlist] = await Promise.all([
    db.watchEntry.findUnique({ where: { userId_tmdbId: { userId, tmdbId } } }),
    db.watchlistItem.findUnique({ where: { userId_tmdbId: { userId, tmdbId } } }),
  ]);
  return { entry, onWatchlist: !!watchlist };
}

export async function getRecentReviews(limit = 12) {
  return db.watchEntry.findMany({
    where: { review: { not: null } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      user: { select: { username: true, displayName: true, avatarUrl: true } },
      likes: true,
    },
  });
}

export async function getPopularLists(limit = 12) {
  return db.list.findMany({
    where: { isPublic: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      user: { select: { username: true, displayName: true } },
      _count: { select: { items: true, likes: true } },
    },
  });
}
