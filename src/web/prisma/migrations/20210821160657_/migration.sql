/*
  Warnings:

  - You are about to drop the column `oauthorName` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `oauthorName` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `boardId` on the `Poll` table. All the data in the column will be lost.
  - You are about to drop the column `oauthorId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `CardHead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Oauthor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pollId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "HashtagStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- DropForeignKey
ALTER TABLE "CardHead" DROP CONSTRAINT "CardHead_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardHead" DROP CONSTRAINT "CardHead_prevId_fkey";

-- DropForeignKey
ALTER TABLE "CardHead" DROP CONSTRAINT "CardHead_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_oauthorName_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_oauthorName_fkey";

-- DropForeignKey
ALTER TABLE "Poll" DROP CONSTRAINT "Poll_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_oauthorId_fkey";

-- DropIndex
DROP INDEX "Poll.boardId_unique";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "pollId" INTEGER;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "oauthorName",
ADD COLUMN     "authorName" TEXT;

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "oauthorName",
ADD COLUMN     "authorName" TEXT;

-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "boardId";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "oauthorId",
ADD COLUMN     "authorName" TEXT;

-- DropTable
DROP TABLE "CardHead";

-- DropTable
DROP TABLE "Oauthor";

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HashtagLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "hashtagId" INTEGER NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HashtagCount" (
    "id" SERIAL NOT NULL,
    "hashtagId" INTEGER NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hashtag" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "authorName" TEXT,
    "bulletId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "pollId" INTEGER,
    "status" "HashtagStatus" NOT NULL DEFAULT E'ACTIVE',
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author.name_unique" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HashtagLike.userId_hashtagId_unique" ON "HashtagLike"("userId", "hashtagId");

-- CreateIndex
CREATE UNIQUE INDEX "HashtagCount.hashtagId_unique" ON "HashtagCount"("hashtagId");

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag.pollId_unique" ON "Hashtag"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "Board_pollId_unique" ON "Board"("pollId");

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("authorName") REFERENCES "Author"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("authorName") REFERENCES "Author"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HashtagLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HashtagLike" ADD FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HashtagCount" ADD FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hashtag" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hashtag" ADD FOREIGN KEY ("authorName") REFERENCES "Author"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hashtag" ADD FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hashtag" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hashtag" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("authorName") REFERENCES "Author"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;
