/*
  Warnings:

  - You are about to drop the column `cardId` on the `Bullet` table. All the data in the column will be lost.
  - You are about to drop the column `scrapeData` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the `CardBody` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Emoji` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmojiCount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmojiLike` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cardStateId` to the `Bullet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmojiCode" AS ENUM ('UP', 'DOWN', 'PIN', 'REPORT');

-- DropForeignKey
ALTER TABLE "Bullet" DROP CONSTRAINT "Bullet_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardBody" DROP CONSTRAINT "CardBody_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardBody" DROP CONSTRAINT "CardBody_prevId_fkey";

-- DropForeignKey
ALTER TABLE "CardBody" DROP CONSTRAINT "CardBody_userId_fkey";

-- DropForeignKey
ALTER TABLE "Emoji" DROP CONSTRAINT "Emoji_bulletId_fkey";

-- DropForeignKey
ALTER TABLE "Emoji" DROP CONSTRAINT "Emoji_userId_fkey";

-- DropForeignKey
ALTER TABLE "EmojiCount" DROP CONSTRAINT "EmojiCount_emojiId_fkey";

-- DropForeignKey
ALTER TABLE "EmojiLike" DROP CONSTRAINT "EmojiLike_emojiId_fkey";

-- DropForeignKey
ALTER TABLE "EmojiLike" DROP CONSTRAINT "EmojiLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_userId_fkey";

-- DropForeignKey
ALTER TABLE "PollCount" DROP CONSTRAINT "PollCount_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Shot" DROP CONSTRAINT "Shot_targetId_fkey";

-- DropForeignKey
ALTER TABLE "Shot" DROP CONSTRAINT "Shot_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "meta" JSONB NOT NULL DEFAULT E'{}';

-- AlterTable
ALTER TABLE "Bullet" DROP COLUMN "cardId",
ADD COLUMN     "cardStateId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "scrapeData",
ADD COLUMN     "scraped" JSONB NOT NULL DEFAULT E'{}';

-- DropTable
DROP TABLE "CardBody";

-- DropTable
DROP TABLE "Emoji";

-- DropTable
DROP TABLE "EmojiCount";

-- DropTable
DROP TABLE "EmojiLike";

-- CreateTable
CREATE TABLE "BulletEmoji" (
    "id" TEXT NOT NULL,
    "bulletId" TEXT NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletEmojiCount" (
    "id" SERIAL NOT NULL,
    "bulletEmojiId" TEXT NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletEmojiLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bulletEmojiId" TEXT NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardEmoji" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "value" "EmojiCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardEmojiCount" (
    "id" SERIAL NOT NULL,
    "cardEmojiId" TEXT NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardEmojiLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "cardEmojiId" TEXT NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardState" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "commitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "prevId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BulletEmoji_bulletId_code_key" ON "BulletEmoji"("bulletId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "BulletEmojiCount_bulletEmojiId_key" ON "BulletEmojiCount"("bulletEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "BulletEmojiLike_userId_bulletEmojiId_key" ON "BulletEmojiLike"("userId", "bulletEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "CardEmoji_cardId_value_key" ON "CardEmoji"("cardId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "CardEmojiCount_cardEmojiId_key" ON "CardEmojiCount"("cardEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "CardEmojiLike_userId_cardEmojiId_key" ON "CardEmojiLike"("userId", "cardEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "CardState_prevId_key" ON "CardState"("prevId");

-- AddForeignKey
ALTER TABLE "Bullet" ADD CONSTRAINT "Bullet_cardStateId_fkey" FOREIGN KEY ("cardStateId") REFERENCES "CardState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmoji" ADD CONSTRAINT "BulletEmoji_bulletId_fkey" FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiCount" ADD CONSTRAINT "BulletEmojiCount_bulletEmojiId_fkey" FOREIGN KEY ("bulletEmojiId") REFERENCES "BulletEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiLike" ADD CONSTRAINT "BulletEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiLike" ADD CONSTRAINT "BulletEmojiLike_bulletEmojiId_fkey" FOREIGN KEY ("bulletEmojiId") REFERENCES "BulletEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmoji" ADD CONSTRAINT "CardEmoji_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmojiCount" ADD CONSTRAINT "CardEmojiCount_cardEmojiId_fkey" FOREIGN KEY ("cardEmojiId") REFERENCES "CardEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmojiLike" ADD CONSTRAINT "CardEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmojiLike" ADD CONSTRAINT "CardEmojiLike_cardEmojiId_fkey" FOREIGN KEY ("cardEmojiId") REFERENCES "CardEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "CardState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollCount" ADD CONSTRAINT "PollCount_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shot" ADD CONSTRAINT "Shot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shot" ADD CONSTRAINT "Shot_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Author.name_unique" RENAME TO "Author_name_key";

-- RenameIndex
ALTER INDEX "Card.linkId_unique" RENAME TO "Card_linkId_key";

-- RenameIndex
ALTER INDEX "Card.symbol_unique" RENAME TO "Card_symbol_key";

-- RenameIndex
ALTER INDEX "Link.url_unique" RENAME TO "Link_url_key";

-- RenameIndex
ALTER INDEX "PollCount.pollId_unique" RENAME TO "PollCount_pollId_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
