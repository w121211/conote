ALTER TABLE "Card" RENAME TO "Note";

ALTER TABLE "CardEmoji" RENAME TO "NoteEmoji";;

ALTER TABLE "CardEmojiCount" RENAME TO "NoteEmojiCount";;

ALTER TABLE "CardEmojiLike" RENAME TO "NoteEmojiLike";;

ALTER TABLE "CardState" RENAME TO "NoteState";;


-- /*
--   Warnings:

--   - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
--   - You are about to drop the `CardEmoji` table. If the table is not empty, all the data it contains will be lost.
--   - You are about to drop the `CardEmojiCount` table. If the table is not empty, all the data it contains will be lost.
--   - You are about to drop the `CardEmojiLike` table. If the table is not empty, all the data it contains will be lost.
--   - You are about to drop the `CardState` table. If the table is not empty, all the data it contains will be lost.

-- */
-- -- DropForeignKey
-- ALTER TABLE "Bullet" DROP CONSTRAINT "Bullet_cardStateId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "Card" DROP CONSTRAINT "Card_linkId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "Card" DROP CONSTRAINT "Card_symId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardEmoji" DROP CONSTRAINT "CardEmoji_cardId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardEmojiCount" DROP CONSTRAINT "CardEmojiCount_cardEmojiId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardEmojiLike" DROP CONSTRAINT "CardEmojiLike_cardEmojiId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardEmojiLike" DROP CONSTRAINT "CardEmojiLike_userId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardState" DROP CONSTRAINT "CardState_cardId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardState" DROP CONSTRAINT "CardState_commitId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardState" DROP CONSTRAINT "CardState_prevId_fkey";

-- -- DropForeignKey
-- ALTER TABLE "CardState" DROP CONSTRAINT "CardState_userId_fkey";

-- -- DropTable
-- DROP TABLE "Card";

-- -- DropTable
-- DROP TABLE "CardEmoji";

-- -- DropTable
-- DROP TABLE "CardEmojiCount";

-- -- DropTable
-- DROP TABLE "CardEmojiLike";

-- -- DropTable
-- DROP TABLE "CardState";

-- -- CreateTable
-- CREATE TABLE "Note" (
--     "id" TEXT NOT NULL,
--     "symId" TEXT NOT NULL,
--     "linkId" TEXT,
--     "meta" JSONB NOT NULL DEFAULT '{}',
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "NoteEmoji" (
--     "id" TEXT NOT NULL,
--     "cardId" TEXT NOT NULL,
--     "code" "EmojiCode" NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "NoteEmoji_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "NoteEmojiCount" (
--     "id" SERIAL NOT NULL,
--     "cardEmojiId" TEXT NOT NULL,
--     "nViews" INTEGER NOT NULL DEFAULT 0,
--     "nUps" INTEGER NOT NULL DEFAULT 0,
--     "nDowns" INTEGER NOT NULL DEFAULT 0,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "NoteEmojiCount_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "NoteEmojiLike" (
--     "id" SERIAL NOT NULL,
--     "userId" TEXT NOT NULL,
--     "cardEmojiId" TEXT NOT NULL,
--     "choice" "LikeChoice" NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "NoteEmojiLike_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "NoteState" (
--     "id" TEXT NOT NULL,
--     "cardId" TEXT NOT NULL,
--     "commitId" TEXT NOT NULL,
--     "userId" TEXT NOT NULL,
--     "body" JSONB NOT NULL,
--     "prevId" TEXT,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "NoteState_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Note_symId_key" ON "Note"("symId");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Note_linkId_key" ON "Note"("linkId");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "NoteEmoji_cardId_code_key" ON "NoteEmoji"("cardId", "code");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "NoteEmojiCount_cardEmojiId_key" ON "NoteEmojiCount"("cardEmojiId");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "NoteEmojiLike_userId_cardEmojiId_key" ON "NoteEmojiLike"("userId", "cardEmojiId");

-- -- CreateIndex
-- CREATE UNIQUE INDEX "NoteState_prevId_key" ON "NoteState"("prevId");

-- -- AddForeignKey
-- ALTER TABLE "Bullet" ADD CONSTRAINT "Bullet_cardStateId_fkey" FOREIGN KEY ("cardStateId") REFERENCES "NoteState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Note" ADD CONSTRAINT "Note_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "Note" ADD CONSTRAINT "Note_symId_fkey" FOREIGN KEY ("symId") REFERENCES "Sym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteEmoji" ADD CONSTRAINT "NoteEmoji_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteEmojiCount" ADD CONSTRAINT "NoteEmojiCount_cardEmojiId_fkey" FOREIGN KEY ("cardEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteEmojiLike" ADD CONSTRAINT "NoteEmojiLike_cardEmojiId_fkey" FOREIGN KEY ("cardEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteEmojiLike" ADD CONSTRAINT "NoteEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteState" ADD CONSTRAINT "NoteState_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteState" ADD CONSTRAINT "NoteState_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "NoteState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteState" ADD CONSTRAINT "NoteState_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- -- AddForeignKey
-- ALTER TABLE "NoteState" ADD CONSTRAINT "NoteState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
