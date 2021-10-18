/*
  Warnings:

  - You are about to drop the column `sourceId` on the `Shot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shot" DROP CONSTRAINT "Shot_sourceId_fkey";

-- AlterTable
ALTER TABLE "Shot" DROP COLUMN "sourceId",
ADD COLUMN     "linkId" TEXT;

-- AddForeignKey
ALTER TABLE "Shot" ADD FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;
