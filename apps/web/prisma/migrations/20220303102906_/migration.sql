/*
  Warnings:

  - The primary key for the `NoteEmoji` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `NoteEmoji` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[noteEmojiId]` on the table `NoteEmojiCount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,noteEmojiId]` on the table `NoteEmojiLike` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `noteEmojiId` on the `NoteEmojiCount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `noteEmojiId` on the `NoteEmojiLike` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "NoteEmojiCount" DROP CONSTRAINT "NoteEmojiCount_noteEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "NoteEmojiLike" DROP CONSTRAINT "NoteEmojiLike_noteEmojiId_fkey";

-- AlterTable
ALTER TABLE "NoteEmoji" DROP CONSTRAINT "NoteEmoji_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "NoteEmoji_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "NoteEmojiCount" DROP COLUMN "noteEmojiId",
ADD COLUMN     "noteEmojiId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "NoteEmojiLike" DROP COLUMN "noteEmojiId",
ADD COLUMN     "noteEmojiId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmojiCount_noteEmojiId_key" ON "NoteEmojiCount"("noteEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmojiLike_userId_noteEmojiId_key" ON "NoteEmojiLike"("userId", "noteEmojiId");

-- AddForeignKey
ALTER TABLE "NoteEmojiCount" ADD CONSTRAINT "NoteEmojiCount_noteEmojiId_fkey" FOREIGN KEY ("noteEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmojiLike" ADD CONSTRAINT "NoteEmojiLike_noteEmojiId_fkey" FOREIGN KEY ("noteEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
