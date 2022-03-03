-- AlterTable
ALTER TABLE "Note" RENAME CONSTRAINT "Card_pkey" TO "Note_pkey";

-- AlterTable
ALTER TABLE "NoteEmoji" RENAME CONSTRAINT "CardEmoji_pkey" TO "NoteEmoji_pkey";

-- AlterTable
ALTER TABLE "NoteEmojiCount" RENAME CONSTRAINT "CardEmojiCount_pkey" TO "NoteEmojiCount_pkey";

-- AlterTable
ALTER TABLE "NoteEmojiLike" RENAME CONSTRAINT "CardEmojiLike_pkey" TO "NoteEmojiLike_pkey";

-- AlterTable
ALTER TABLE "NoteState" RENAME CONSTRAINT "CardState_pkey" TO "NoteState_pkey";

-- RenameForeignKey
ALTER TABLE "Note" RENAME CONSTRAINT "Card_linkId_fkey" TO "Note_linkId_fkey";

-- RenameForeignKey
ALTER TABLE "Note" RENAME CONSTRAINT "Card_symId_fkey" TO "Note_symId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteEmoji" RENAME CONSTRAINT "CardEmoji_cardId_fkey" TO "NoteEmoji_cardId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteEmojiCount" RENAME CONSTRAINT "CardEmojiCount_cardEmojiId_fkey" TO "NoteEmojiCount_cardEmojiId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteEmojiLike" RENAME CONSTRAINT "CardEmojiLike_cardEmojiId_fkey" TO "NoteEmojiLike_cardEmojiId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteEmojiLike" RENAME CONSTRAINT "CardEmojiLike_userId_fkey" TO "NoteEmojiLike_userId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteState" RENAME CONSTRAINT "CardState_cardId_fkey" TO "NoteState_cardId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteState" RENAME CONSTRAINT "CardState_commitId_fkey" TO "NoteState_commitId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteState" RENAME CONSTRAINT "CardState_prevId_fkey" TO "NoteState_prevId_fkey";

-- RenameForeignKey
ALTER TABLE "NoteState" RENAME CONSTRAINT "CardState_userId_fkey" TO "NoteState_userId_fkey";

-- RenameIndex
ALTER INDEX "Card_linkId_key" RENAME TO "Note_linkId_key";

-- RenameIndex
ALTER INDEX "Card_symId_key" RENAME TO "Note_symId_key";

-- RenameIndex
ALTER INDEX "CardEmoji_cardId_code_key" RENAME TO "NoteEmoji_cardId_code_key";

-- RenameIndex
ALTER INDEX "CardEmojiCount_cardEmojiId_key" RENAME TO "NoteEmojiCount_cardEmojiId_key";

-- RenameIndex
ALTER INDEX "CardEmojiLike_userId_cardEmojiId_key" RENAME TO "NoteEmojiLike_userId_cardEmojiId_key";

-- RenameIndex
ALTER INDEX "CardState_prevId_key" RENAME TO "NoteState_prevId_key";
