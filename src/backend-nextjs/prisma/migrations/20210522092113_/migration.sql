/*
  Warnings:

  - You are about to drop the column `oauthorName` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `oauthorName` on the `Vote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_oauthorName_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_oauthorName_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "oauthorName",
ADD COLUMN     "oauthorId" INTEGER;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "oauthorName",
ADD COLUMN     "oauthorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("oauthorId") REFERENCES "Oauthor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("oauthorId") REFERENCES "Oauthor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
