/*
  Warnings:

  - You are about to drop the column `cardStateId` on the `Bullet` table. All the data in the column will be lost.
  - You are about to drop the column `cardId` on the `NoteEmoji` table. All the data in the column will be lost.
  - You are about to drop the column `cardEmojiId` on the `NoteEmojiCount` table. All the data in the column will be lost.
  - You are about to drop the column `cardEmojiId` on the `NoteEmojiLike` table. All the data in the column will be lost.
  - You are about to drop the column `cardId` on the `NoteState` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[noteId,code]` on the table `NoteEmoji` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[noteEmojiId]` on the table `NoteEmojiCount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,noteEmojiId]` on the table `NoteEmojiLike` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `noteStateId` to the `Bullet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteId` to the `NoteEmoji` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteEmojiId` to the `NoteEmojiCount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteEmojiId` to the `NoteEmojiLike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteId` to the `NoteState` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscussStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- CreateEnum
CREATE TYPE "DiscussPostStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- DropForeignKey
ALTER TABLE "Bullet" DROP CONSTRAINT "Bullet_cardStateId_fkey";

-- DropForeignKey
ALTER TABLE "NoteEmoji" DROP CONSTRAINT "NoteEmoji_cardId_fkey";

-- DropForeignKey
ALTER TABLE "NoteEmojiCount" DROP CONSTRAINT "NoteEmojiCount_cardEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "NoteEmojiLike" DROP CONSTRAINT "NoteEmojiLike_cardEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "NoteState" DROP CONSTRAINT "NoteState_cardId_fkey";

-- DropIndex
DROP INDEX "NoteEmoji_cardId_code_key";

-- DropIndex
DROP INDEX "NoteEmojiCount_cardEmojiId_key";

-- DropIndex
DROP INDEX "NoteEmojiLike_userId_cardEmojiId_key";

-- AlterTable
-- ALTER TABLE "Bullet" DROP COLUMN "cardStateId",
-- ADD COLUMN     "noteStateId" TEXT NOT NULL;
ALTER TABLE "Bullet"
RENAME COLUMN "cardStateId" TO "noteStateId";

-- AlterTable
-- ALTER TABLE "NoteEmoji" DROP COLUMN "cardId",
-- ADD COLUMN     "noteId" TEXT NOT NULL;
ALTER TABLE "NoteEmoji"
RENAME COLUMN "cardId" TO "noteId";

-- AlterTable
-- ALTER TABLE "NoteEmojiCount" DROP COLUMN "cardEmojiId",
-- ADD COLUMN     "noteEmojiId" TEXT NOT NULL;
ALTER TABLE "NoteEmojiCount"
RENAME COLUMN "cardEmojiId" TO "noteEmojiId";

-- AlterTable
-- ALTER TABLE "NoteEmojiLike" DROP COLUMN "cardEmojiId",
-- ADD COLUMN     "noteEmojiId" TEXT NOT NULL;
ALTER TABLE "NoteEmojiLike"
RENAME COLUMN "cardEmojiId" TO "noteEmojiId";

-- AlterTable
-- ALTER TABLE "NoteState" DROP COLUMN "cardId",
-- ADD COLUMN     "noteId" TEXT NOT NULL;
ALTER TABLE "NoteState"
RENAME COLUMN "cardId" TO "noteId";

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
    "nUps" INTEGER NOT NULL DEFAULT 0,
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
    "nUps" INTEGER NOT NULL DEFAULT 0,
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
CREATE TABLE "_DiscussToNote" (
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
CREATE UNIQUE INDEX "_DiscussToNote_AB_unique" ON "_DiscussToNote"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscussToNote_B_index" ON "_DiscussToNote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmoji_noteId_code_key" ON "NoteEmoji"("noteId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmojiCount_noteEmojiId_key" ON "NoteEmojiCount"("noteEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmojiLike_userId_noteEmojiId_key" ON "NoteEmojiLike"("userId", "noteEmojiId");

-- AddForeignKey
ALTER TABLE "Bullet" ADD CONSTRAINT "Bullet_noteStateId_fkey" FOREIGN KEY ("noteStateId") REFERENCES "NoteState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discuss" ADD CONSTRAINT "Discuss_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussCount" ADD CONSTRAINT "DiscussCount_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmoji" ADD CONSTRAINT "DiscussEmoji_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiCount" ADD CONSTRAINT "DiscussEmojiCount_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiLike" ADD CONSTRAINT "DiscussEmojiLike_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiLike" ADD CONSTRAINT "DiscussEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmoji" ADD CONSTRAINT "DiscussPostEmoji_discussPostId_fkey" FOREIGN KEY ("discussPostId") REFERENCES "DiscussPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiCount" ADD CONSTRAINT "DiscussPostEmojiCount_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiLike" ADD CONSTRAINT "DiscussPostEmojiLike_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiLike" ADD CONSTRAINT "DiscussPostEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmoji" ADD CONSTRAINT "NoteEmoji_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmojiCount" ADD CONSTRAINT "NoteEmojiCount_noteEmojiId_fkey" FOREIGN KEY ("noteEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmojiLike" ADD CONSTRAINT "NoteEmojiLike_noteEmojiId_fkey" FOREIGN KEY ("noteEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteState" ADD CONSTRAINT "NoteState_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscussToNote" ADD FOREIGN KEY ("A") REFERENCES "Discuss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscussToNote" ADD FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
