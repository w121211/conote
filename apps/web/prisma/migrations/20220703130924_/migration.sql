/*
  Warnings:

  - A unique constraint covering the columns `[draftId]` on the table `NoteDoc` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `draftId` to the `NoteDoc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NoteDoc" ADD COLUMN     "draftId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NoteDoc_draftId_key" ON "NoteDoc"("draftId");

-- AddForeignKey
ALTER TABLE "NoteDoc" ADD CONSTRAINT "NoteDoc_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "NoteDraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
