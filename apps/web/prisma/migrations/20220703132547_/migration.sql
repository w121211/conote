/*
  Warnings:

  - You are about to drop the column `draftId` on the `NoteDoc` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "NoteDoc_draftId_key";

-- AlterTable
ALTER TABLE "NoteDoc" DROP COLUMN "draftId";
