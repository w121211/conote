/*
  Warnings:

  - The primary key for the `Author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Bullet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `linkUrl` on the `Card` table. All the data in the column will be lost.
  - The `meta` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorName` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `fetchResult` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `Link` table. All the data in the column will be lost.
  - The primary key for the `Poll` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorName` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoardCount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BoardLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BulletCount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BulletLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentCount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hashtag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HashtagCount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HashtagLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tick` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[linkId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `content` on the `CardBody` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShotChoice" AS ENUM ('LONG', 'SHORT', 'HOLD');

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_bulletId_fkey";

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_userId_fkey";

-- DropForeignKey
ALTER TABLE "BoardCount" DROP CONSTRAINT "BoardCount_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardLike" DROP CONSTRAINT "BoardLike_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardLike" DROP CONSTRAINT "BoardLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bullet" DROP CONSTRAINT "Bullet_cardId_fkey";

-- DropForeignKey
ALTER TABLE "BulletCount" DROP CONSTRAINT "BulletCount_bulletId_fkey";

-- DropForeignKey
ALTER TABLE "BulletLike" DROP CONSTRAINT "BulletLike_bulletId_fkey";

-- DropForeignKey
ALTER TABLE "BulletLike" DROP CONSTRAINT "BulletLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_linkUrl_fkey";

-- DropForeignKey
ALTER TABLE "CardBody" DROP CONSTRAINT "CardBody_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorName_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_voteId_fkey";

-- DropForeignKey
ALTER TABLE "CommentCount" DROP CONSTRAINT "CommentCount_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_authorName_fkey";

-- DropForeignKey
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_bulletId_fkey";

-- DropForeignKey
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Hashtag" DROP CONSTRAINT "Hashtag_userId_fkey";

-- DropForeignKey
ALTER TABLE "HashtagCount" DROP CONSTRAINT "HashtagCount_hashtagId_fkey";

-- DropForeignKey
ALTER TABLE "HashtagLike" DROP CONSTRAINT "HashtagLike_hashtagId_fkey";

-- DropForeignKey
ALTER TABLE "HashtagLike" DROP CONSTRAINT "HashtagLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_authorName_fkey";

-- DropForeignKey
ALTER TABLE "PollCount" DROP CONSTRAINT "PollCount_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Tick" DROP CONSTRAINT "Tick_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_authorName_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollId_fkey";

-- DropIndex
DROP INDEX "Card.linkUrl_unique";

-- AlterTable
ALTER TABLE "Author" DROP CONSTRAINT "Author_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Author_id_seq";

-- AlterTable
ALTER TABLE "Bullet" DROP CONSTRAINT "Bullet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cardId" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Bullet_id_seq";

-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
DROP COLUMN "linkUrl",
ADD COLUMN     "linkId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "meta",
ADD COLUMN     "meta" JSONB NOT NULL DEFAULT E'{}',
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Card_id_seq";

-- AlterTable
ALTER TABLE "CardBody" ALTER COLUMN "cardId" SET DATA TYPE TEXT,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Link" DROP CONSTRAINT "Link_pkey",
DROP COLUMN "authorName",
DROP COLUMN "fetchResult",
DROP COLUMN "sourceId",
DROP COLUMN "sourceType",
ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "scrapeData" JSONB,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Link_id_seq";

-- AlterTable
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_pkey",
ADD COLUMN     "meta" JSONB NOT NULL DEFAULT E'{}',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "Poll_id_seq";

-- AlterTable
ALTER TABLE "PollCount" ALTER COLUMN "pollId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "authorName",
ALTER COLUMN "pollId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Board";

-- DropTable
DROP TABLE "BoardCount";

-- DropTable
DROP TABLE "BoardLike";

-- DropTable
DROP TABLE "BulletCount";

-- DropTable
DROP TABLE "BulletLike";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "CommentCount";

-- DropTable
DROP TABLE "CommentLike";

-- DropTable
DROP TABLE "Hashtag";

-- DropTable
DROP TABLE "HashtagCount";

-- DropTable
DROP TABLE "HashtagLike";

-- DropTable
DROP TABLE "Tick";

-- DropEnum
DROP TYPE "SourceType";

-- CreateTable
CREATE TABLE "Shot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT,
    "sourceId" TEXT,
    "targetId" TEXT NOT NULL,
    "choice" "ShotChoice" NOT NULL,
    "content" JSONB NOT NULL DEFAULT E'{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmojiLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "emojiId" TEXT NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmojiCount" (
    "id" SERIAL NOT NULL,
    "emojiId" TEXT NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emoji" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bulletId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmojiLike.userId_emojiId_unique" ON "EmojiLike"("userId", "emojiId");

-- CreateIndex
CREATE UNIQUE INDEX "EmojiCount.emojiId_unique" ON "EmojiCount"("emojiId");

-- CreateIndex
CREATE UNIQUE INDEX "Emoji.bulletId_text_unique" ON "Emoji"("bulletId", "text");

-- CreateIndex
CREATE UNIQUE INDEX "Card.linkId_unique" ON "Card"("linkId");

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shot" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shot" ADD FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shot" ADD FOREIGN KEY ("sourceId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shot" ADD FOREIGN KEY ("targetId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollCount" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmojiLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmojiLike" ADD FOREIGN KEY ("emojiId") REFERENCES "Emoji"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmojiCount" ADD FOREIGN KEY ("emojiId") REFERENCES "Emoji"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emoji" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emoji" ADD FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bullet" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBody" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "CardBody_prevId_unique" RENAME TO "CardBody.prevId_unique";
