/*
  Warnings:

  - You are about to drop the column `nUps` on the `DiscussEmoji` table. All the data in the column will be lost.
  - You are about to drop the column `nUps` on the `DiscussPostEmoji` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiscussEmoji" DROP COLUMN "nUps";

-- AlterTable
ALTER TABLE "DiscussPostEmoji" DROP COLUMN "nUps";
