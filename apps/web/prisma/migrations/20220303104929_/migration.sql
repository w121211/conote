/*
  Warnings:

  - You are about to drop the column `choice` on the `NoteEmojiLike` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code,discussId]` on the table `DiscussEmoji` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discussEmojiId,userId]` on the table `DiscussEmojiLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,discussPostId]` on the table `DiscussPostEmoji` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[noteEmojiId,userId]` on the table `NoteEmojiLike` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `liked` to the `NoteEmojiLike` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DiscussEmoji_discussId_code_key";

-- DropIndex
DROP INDEX "DiscussEmojiLike_userId_discussEmojiId_key";

-- DropIndex
DROP INDEX "DiscussPostEmoji_discussPostId_code_key";

-- DropIndex
DROP INDEX "NoteEmojiLike_userId_noteEmojiId_key";

-- AlterTable
ALTER TABLE "NoteEmojiLike" DROP COLUMN "choice",
ADD COLUMN     "liked" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmoji_code_discussId_key" ON "DiscussEmoji"("code", "discussId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmojiLike_discussEmojiId_userId_key" ON "DiscussEmojiLike"("discussEmojiId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmoji_code_discussPostId_key" ON "DiscussPostEmoji"("code", "discussPostId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmojiLike_noteEmojiId_userId_key" ON "NoteEmojiLike"("noteEmojiId", "userId");
