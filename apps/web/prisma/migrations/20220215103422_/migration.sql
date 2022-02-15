/*
  Warnings:

  - The values [DOWN] on the enum `LikeChoice` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "DiscussStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- CreateEnum
CREATE TYPE "DiscussPostStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- AlterEnum
BEGIN;
CREATE TYPE "LikeChoice_new" AS ENUM ('UP', 'NEUTRAL');
ALTER TABLE "BulletEmojiLike" ALTER COLUMN "choice" TYPE "LikeChoice_new" USING ("choice"::text::"LikeChoice_new");
ALTER TABLE "CardEmojiLike" ALTER COLUMN "choice" TYPE "LikeChoice_new" USING ("choice"::text::"LikeChoice_new");
ALTER TYPE "LikeChoice" RENAME TO "LikeChoice_old";
ALTER TYPE "LikeChoice_new" RENAME TO "LikeChoice";
DROP TYPE "LikeChoice_old";
COMMIT;

-- CreateTable
CREATE TABLE "Discuss" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DiscussStatus" NOT NULL DEFAULT E'ACTIVE',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discuss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussCount" (
    "id" SERIAL NOT NULL,
    "discussId" TEXT NOT NULL,
    "nPosts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussEmoji" (
    "id" SERIAL NOT NULL,
    "discussId" TEXT NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "nLikes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussEmojiCount" (
    "id" SERIAL NOT NULL,
    "discussEmojiId" INTEGER NOT NULL,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussEmojiLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "discussEmojiId" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPost" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "discussId" TEXT NOT NULL,
    "status" "DiscussPostStatus" NOT NULL DEFAULT E'ACTIVE',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPostEmoji" (
    "id" SERIAL NOT NULL,
    "discussPostId" INTEGER NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "nLikes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPostEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPostEmojiCount" (
    "id" SERIAL NOT NULL,
    "discussPostEmojiId" INTEGER NOT NULL,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPostEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPostEmojiLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "discussPostEmojiId" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPostEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CardToDiscuss" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscussCount_discussId_key" ON "DiscussCount"("discussId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmoji_discussId_code_key" ON "DiscussEmoji"("discussId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmojiCount_discussEmojiId_key" ON "DiscussEmojiCount"("discussEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmojiLike_discussEmojiId_key" ON "DiscussEmojiLike"("discussEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmojiLike_userId_discussEmojiId_key" ON "DiscussEmojiLike"("userId", "discussEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmoji_discussPostId_code_key" ON "DiscussPostEmoji"("discussPostId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmojiCount_discussPostEmojiId_key" ON "DiscussPostEmojiCount"("discussPostEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmojiLike_discussPostEmojiId_key" ON "DiscussPostEmojiLike"("discussPostEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmojiLike_userId_discussPostEmojiId_key" ON "DiscussPostEmojiLike"("userId", "discussPostEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToDiscuss_AB_unique" ON "_CardToDiscuss"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToDiscuss_B_index" ON "_CardToDiscuss"("B");

-- AddForeignKey
ALTER TABLE "Discuss" ADD CONSTRAINT "Discuss_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussCount" ADD CONSTRAINT "DiscussCount_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmoji" ADD CONSTRAINT "DiscussEmoji_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiCount" ADD CONSTRAINT "DiscussEmojiCount_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiLike" ADD CONSTRAINT "DiscussEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiLike" ADD CONSTRAINT "DiscussEmojiLike_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmoji" ADD CONSTRAINT "DiscussPostEmoji_discussPostId_fkey" FOREIGN KEY ("discussPostId") REFERENCES "DiscussPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiCount" ADD CONSTRAINT "DiscussPostEmojiCount_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiLike" ADD CONSTRAINT "DiscussPostEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiLike" ADD CONSTRAINT "DiscussPostEmojiLike_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToDiscuss" ADD FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToDiscuss" ADD FOREIGN KEY ("B") REFERENCES "Discuss"("id") ON DELETE CASCADE ON UPDATE CASCADE;
