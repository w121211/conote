-- DropForeignKey
ALTER TABLE "DiscussCount" DROP CONSTRAINT "DiscussCount_discussId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussEmoji" DROP CONSTRAINT "DiscussEmoji_discussId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussEmojiCount" DROP CONSTRAINT "DiscussEmojiCount_discussEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussEmojiLike" DROP CONSTRAINT "DiscussEmojiLike_discussEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussPost" DROP CONSTRAINT "DiscussPost_discussId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussPostEmoji" DROP CONSTRAINT "DiscussPostEmoji_discussPostId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussPostEmojiCount" DROP CONSTRAINT "DiscussPostEmojiCount_discussPostEmojiId_fkey";

-- DropForeignKey
ALTER TABLE "DiscussPostEmojiLike" DROP CONSTRAINT "DiscussPostEmojiLike_discussPostEmojiId_fkey";

-- AddForeignKey
ALTER TABLE "DiscussCount" ADD CONSTRAINT "DiscussCount_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmoji" ADD CONSTRAINT "DiscussEmoji_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiCount" ADD CONSTRAINT "DiscussEmojiCount_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiLike" ADD CONSTRAINT "DiscussEmojiLike_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmoji" ADD CONSTRAINT "DiscussPostEmoji_discussPostId_fkey" FOREIGN KEY ("discussPostId") REFERENCES "DiscussPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiCount" ADD CONSTRAINT "DiscussPostEmojiCount_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiLike" ADD CONSTRAINT "DiscussPostEmojiLike_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE CASCADE ON UPDATE CASCADE;
