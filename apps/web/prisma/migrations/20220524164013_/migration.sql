/*
  Warnings:

  - A unique constraint covering the columns `[mergePollId]` on the table `NoteDoc` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discussPostId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DiscussType" AS ENUM ('DISCUSS', 'MERGE');

-- AlterTable
ALTER TABLE "Discuss" ADD COLUMN     "type" "DiscussType" NOT NULL DEFAULT E'DISCUSS';

-- AlterTable
ALTER TABLE "NoteDoc" ADD COLUMN     "mergePollId" TEXT;

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "discussId" TEXT;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "discussPostId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "NoteDoc_mergePollId_key" ON "NoteDoc"("mergePollId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_discussPostId_key" ON "Vote"("discussPostId");

-- AddForeignKey
ALTER TABLE "NoteDoc" ADD CONSTRAINT "NoteDoc_mergePollId_fkey" FOREIGN KEY ("mergePollId") REFERENCES "Poll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_discussPostId_fkey" FOREIGN KEY ("discussPostId") REFERENCES "DiscussPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
