/*
  Warnings:

  - You are about to drop the column `symbol` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `CardState` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Shot` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `Shot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbolId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `symbolId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `CardState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbolId` to the `Shot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SymbolType" AS ENUM ('TICKER', 'TOPIC', 'URL');

-- DropForeignKey
ALTER TABLE "Shot" DROP CONSTRAINT "Shot_targetId_fkey";

-- DropIndex
DROP INDEX "Card_symbol_key";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "symbol",
DROP COLUMN "type",
ADD COLUMN     "symbolId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CardState" DROP COLUMN "content",
ADD COLUMN     "body" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Shot" DROP COLUMN "content",
DROP COLUMN "targetId",
ADD COLUMN     "body" JSONB NOT NULL DEFAULT E'{}',
ADD COLUMN     "symbolId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CardType";

-- CreateTable
CREATE TABLE "Symbol" (
    "id" TEXT NOT NULL,
    "type" "SymbolType" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Symbol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_name_key" ON "Symbol"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Card_symbolId_key" ON "Card"("symbolId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_symbolId_fkey" FOREIGN KEY ("symbolId") REFERENCES "Symbol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shot" ADD CONSTRAINT "Shot_symbolId_fkey" FOREIGN KEY ("symbolId") REFERENCES "Symbol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
