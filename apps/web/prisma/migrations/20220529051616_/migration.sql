-- AlterTable
ALTER TABLE "Poll" ALTER COLUMN "meta" DROP DEFAULT;

-- DropEnum
DROP TYPE "PollFailReason";
