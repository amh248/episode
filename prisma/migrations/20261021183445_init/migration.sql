-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "website" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WatchEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "watchedAt" DATETIME,
    "rating" REAL,
    "review" TEXT,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WatchEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isRanked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "note" TEXT,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FavoriteShow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "FavoriteShow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReviewLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "watchEntryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReviewLike_watchEntryId_fkey" FOREIGN KEY ("watchEntryId") REFERENCES "WatchEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ListLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListLike_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "WatchEntry_userId_watchedAt_idx" ON "WatchEntry"("userId", "watchedAt");

-- CreateIndex
CREATE INDEX "WatchEntry_tmdbId_idx" ON "WatchEntry"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchEntry_userId_tmdbId_key" ON "WatchEntry"("userId", "tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_tmdbId_key" ON "WatchlistItem"("userId", "tmdbId");

-- CreateIndex
CREATE INDEX "ListItem_listId_position_idx" ON "ListItem"("listId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ListItem_listId_tmdbId_key" ON "ListItem"("listId", "tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteShow_userId_position_key" ON "FavoriteShow"("userId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteShow_userId_tmdbId_key" ON "FavoriteShow"("userId", "tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewLike_userId_watchEntryId_key" ON "ReviewLike"("userId", "watchEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "ListLike_userId_listId_key" ON "ListLike"("userId", "listId");
