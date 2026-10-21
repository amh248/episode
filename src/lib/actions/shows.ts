"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function markWatched(tmdbId: number) {
  const userId = await requireUserId();
  await db.watchEntry.upsert({
    where: { userId_tmdbId: { userId, tmdbId } },
    create: { userId, tmdbId },
    update: {},
  });
  revalidatePath("/");
  revalidatePath(`/show/${tmdbId}`);
}

export async function toggleLike(tmdbId: number) {
  const userId = await requireUserId();
  const entry = await db.watchEntry.findUnique({
    where: { userId_tmdbId: { userId, tmdbId } },
  });
  if (!entry) {
    await db.watchEntry.create({
      data: { userId, tmdbId, liked: true },
    });
  } else {
    await db.watchEntry.update({
      where: { id: entry.id },
      data: { liked: !entry.liked },
    });
  }
  revalidatePath(`/show/${tmdbId}`);
}

export async function setRating(tmdbId: number, rating: number | null) {
  const userId = await requireUserId();
  await db.watchEntry.upsert({
    where: { userId_tmdbId: { userId, tmdbId } },
    create: { userId, tmdbId, rating: rating ?? undefined },
    update: { rating: rating ?? null },
  });
  revalidatePath(`/show/${tmdbId}`);
}

export async function toggleWatchlist(tmdbId: number) {
  const userId = await requireUserId();
  const existing = await db.watchlistItem.findUnique({
    where: { userId_tmdbId: { userId, tmdbId } },
  });
  if (existing) {
    await db.watchlistItem.delete({ where: { id: existing.id } });
  } else {
    await db.watchlistItem.create({ data: { userId, tmdbId } });
  }
  revalidatePath(`/show/${tmdbId}`);
  revalidatePath("/watchlist");
}

export type LogShowInput = {
  tmdbId: number;
  watchedAt?: string;
  rating?: number;
  review?: string;
  liked?: boolean;
  tags?: string;
};

export async function logShow(input: LogShowInput) {
  const userId = await requireUserId();
  const watchedAt = input.watchedAt ? new Date(input.watchedAt) : null;

  await db.watchEntry.upsert({
    where: { userId_tmdbId: { userId, tmdbId: input.tmdbId } },
    create: {
      userId,
      tmdbId: input.tmdbId,
      watchedAt,
      rating: input.rating,
      review: input.review?.trim() || null,
      liked: input.liked ?? false,
      tags: input.tags?.trim() ?? "",
    },
    update: {
      watchedAt,
      rating: input.rating ?? null,
      review: input.review?.trim() || null,
      liked: input.liked ?? false,
      tags: input.tags?.trim() ?? "",
    },
  });

  await db.watchlistItem.deleteMany({
    where: { userId, tmdbId: input.tmdbId },
  });

  revalidatePath("/");
  revalidatePath("/diary");
  revalidatePath(`/show/${input.tmdbId}`);
}

export async function followUser(username: string) {
  const userId = await requireUserId();
  const target = await db.user.findUnique({ where: { username } });
  if (!target || target.id === userId) return;

  await db.follow.upsert({
    where: { followerId_followingId: { followerId: userId, followingId: target.id } },
    create: { followerId: userId, followingId: target.id },
    update: {},
  });
  revalidatePath(`/member/${username}`);
}

export async function unfollowUser(username: string) {
  const userId = await requireUserId();
  const target = await db.user.findUnique({ where: { username } });
  if (!target) return;

  await db.follow.deleteMany({
    where: { followerId: userId, followingId: target.id },
  });
  revalidatePath(`/member/${username}`);
}

export async function likeReview(watchEntryId: string) {
  const userId = await requireUserId();
  const existing = await db.reviewLike.findUnique({
    where: { userId_watchEntryId: { userId, watchEntryId } },
  });
  if (existing) {
    await db.reviewLike.delete({ where: { id: existing.id } });
  } else {
    await db.reviewLike.create({ data: { userId, watchEntryId } });
  }
  revalidatePath("/");
}

export async function createList(title: string, description?: string, isPublic = true) {
  const userId = await requireUserId();
  const list = await db.list.create({
    data: {
      userId,
      title: title.trim(),
      description: description?.trim() || null,
      isPublic,
    },
  });
  revalidatePath("/lists");
  return list.id;
}

export async function addShowToList(listId: string, tmdbId: number) {
  const userId = await requireUserId();
  const list = await db.list.findFirst({ where: { id: listId, userId } });
  if (!list) throw new Error("List not found");

  const count = await db.listItem.count({ where: { listId } });
  await db.listItem.upsert({
    where: { listId_tmdbId: { listId, tmdbId } },
    create: { listId, tmdbId, position: count },
    update: {},
  });
  revalidatePath(`/list/${listId}`);
}
