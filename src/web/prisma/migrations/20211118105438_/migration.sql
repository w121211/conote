-- RenameIndex
ALTER INDEX "Author.name_unique" RENAME TO "Author_name_key";

-- RenameIndex
ALTER INDEX "BulletEmoji.bulletId_code_unique" RENAME TO "BulletEmoji_bulletId_code_key";

-- RenameIndex
ALTER INDEX "BulletEmojiCount.bulletEmojiId_unique" RENAME TO "BulletEmojiCount_bulletEmojiId_key";

-- RenameIndex
ALTER INDEX "BulletEmojiLike.userId_bulletEmojiId_unique" RENAME TO "BulletEmojiLike_userId_bulletEmojiId_key";

-- RenameIndex
ALTER INDEX "Card.linkId_unique" RENAME TO "Card_linkId_key";

-- RenameIndex
ALTER INDEX "Card.symId_unique" RENAME TO "Card_symId_key";

-- RenameIndex
ALTER INDEX "CardEmoji.cardId_code_unique" RENAME TO "CardEmoji_cardId_code_key";

-- RenameIndex
ALTER INDEX "CardEmojiCount.cardEmojiId_unique" RENAME TO "CardEmojiCount_cardEmojiId_key";

-- RenameIndex
ALTER INDEX "CardEmojiLike.userId_cardEmojiId_unique" RENAME TO "CardEmojiLike_userId_cardEmojiId_key";

-- RenameIndex
ALTER INDEX "CardState.prevId_unique" RENAME TO "CardState_prevId_key";

-- RenameIndex
ALTER INDEX "Link.url_unique" RENAME TO "Link_url_key";

-- RenameIndex
ALTER INDEX "PollCount.pollId_unique" RENAME TO "PollCount_pollId_key";

-- RenameIndex
ALTER INDEX "Sym.symbol_unique" RENAME TO "Sym_symbol_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
