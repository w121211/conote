/*
  Warnings:

  - You are about to drop the column `oauthorName` on the `Reply` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reply" DROP CONSTRAINT "Reply_oauthorName_fkey";

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "oauthorName",
ADD COLUMN     "oauthorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Reply" ADD FOREIGN KEY ("oauthorId") REFERENCES "Oauthor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
