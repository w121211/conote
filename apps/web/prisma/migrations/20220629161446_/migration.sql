-- DropForeignKey
ALTER TABLE "Discuss" DROP CONSTRAINT "Discuss_draftId_fkey";

-- AddForeignKey
ALTER TABLE "Discuss" ADD CONSTRAINT "Discuss_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "NoteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
