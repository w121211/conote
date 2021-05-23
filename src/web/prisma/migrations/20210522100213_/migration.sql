/*
  Warnings:

  - You are about to drop the column `oauthorId` on the `Link` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_oauthorId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "oauthorId",
ADD COLUMN     "oauthorName" TEXT;

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("oauthorName") REFERENCES "Oauthor"("name") ON DELETE SET NULL ON UPDATE CASCADE;
