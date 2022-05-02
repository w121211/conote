/*
  Warnings:

  - You are about to drop the column `branchId` on the `NoteEmoji` table. All the data in the column will be lost.
  - You are about to drop the column `symId` on the `NoteEmoji` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code,noteId]` on the table `NoteEmoji` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `noteId` to the `NoteEmoji` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NoteEmoji" DROP CONSTRAINT "NoteEmoji_branchId_symId_fkey";

-- DropIndex
DROP INDEX "NoteEmoji_branchId_symId_code_key";

-- AlterTable
ALTER TABLE "NoteEmoji" DROP COLUMN "branchId",
DROP COLUMN "symId",
ADD COLUMN     "noteId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmoji_code_noteId_key" ON "NoteEmoji"("code", "noteId");

-- AddForeignKey
ALTER TABLE "NoteEmoji" ADD CONSTRAINT "NoteEmoji_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
