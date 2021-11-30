-- RenameIndex
ALTER INDEX "Author_name_key" RENAME TO "Author.name_unique";

-- RenameIndex
ALTER INDEX "BulletEmoji_bulletId_code_key" RENAME TO "BulletEmoji.bulletId_code_unique";

-- RenameIndex
ALTER INDEX "BulletEmojiCount_bulletEmojiId_key" RENAME TO "BulletEmojiCount.bulletEmojiId_unique";

-- RenameIndex
ALTER INDEX "BulletEmojiLike_userId_bulletEmojiId_key" RENAME TO "BulletEmojiLike.userId_bulletEmojiId_unique";

-- RenameIndex
ALTER INDEX "Card_linkId_key" RENAME TO "Card.linkId_unique";

-- RenameIndex
ALTER INDEX "Card_symId_key" RENAME TO "Card.symId_unique";

-- RenameIndex
ALTER INDEX "CardEmoji_cardId_code_key" RENAME TO "CardEmoji.cardId_code_unique";

-- RenameIndex
ALTER INDEX "CardEmojiCount_cardEmojiId_key" RENAME TO "CardEmojiCount.cardEmojiId_unique";

-- RenameIndex
ALTER INDEX "CardEmojiLike_userId_cardEmojiId_key" RENAME TO "CardEmojiLike.userId_cardEmojiId_unique";

-- RenameIndex
ALTER INDEX "CardState_prevId_key" RENAME TO "CardState.prevId_unique";

-- RenameIndex
ALTER INDEX "Link_url_key" RENAME TO "Link.url_unique";

-- RenameIndex
ALTER INDEX "PollCount_pollId_key" RENAME TO "PollCount.pollId_unique";

-- RenameIndex
ALTER INDEX "Sym_symbol_key" RENAME TO "Sym.symbol_unique";

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "User.email_unique";
