/*
  Warnings:

  - You are about to drop the column `authorId` on the `Link` table. All the data in the column will be lost.
  - The `status` column on the `NoteDoc` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `NoteDraft` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Bullet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BulletEmoji` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BulletEmojiCount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BulletEmojiLike` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[linkId]` on the table `Sym` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NoteDocStatus" AS ENUM ('CANDIDATE', 'MERGE', 'REJECT');

-- CreateEnum
CREATE TYPE "NoteDraftStatus" AS ENUM ('EDIT', 'COMMIT', 'DROP');

-- DropForeignKey
ALTER TABLE "Bullet" DROP CONSTRAINT "Bullet_docId_fkey";

-- DropForeignKey
ALTER TABLE "BulletEmoji" DROP CONSTRAINT "BulletEmoji_bulletId_fkey";

-- DropForeignKey
ALTER TABLE "BulletEmojiCount" DROP CONSTRAINT "BulletEmojiCount_bulletEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "BulletEmojiLike" DROP CONSTRAINT "BulletEmojiLike_bulletEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "BulletEmojiLike" DROP CONSTRAINT "BulletEmojiLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_authorId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "NoteDoc" DROP COLUMN "status",
ADD COLUMN     "status" "NoteDocStatus" NOT NULL DEFAULT E'CANDIDATE';

-- AlterTable
ALTER TABLE "NoteDraft" DROP COLUMN "status",
ADD COLUMN     "status" "NoteDraftStatus" NOT NULL DEFAULT E'EDIT';

-- AlterTable
ALTER TABLE "Sym" ADD COLUMN     "linkId" TEXT;

-- DropTable
DROP TABLE "Bullet";

-- DropTable
DROP TABLE "BulletEmoji";

-- DropTable
DROP TABLE "BulletEmojiCount";

-- DropTable
DROP TABLE "BulletEmojiLike";

-- DropEnum
DROP TYPE "DocStatus";

-- DropEnum
DROP TYPE "DraftStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Sym_linkId_key" ON "Sym"("linkId");

-- AddForeignKey
ALTER TABLE "Sym" ADD CONSTRAINT "Sym_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;
