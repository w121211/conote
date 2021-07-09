-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('VIDEO', 'POST', 'AUTHOR', 'OTHER');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('TICKER', 'TOPIC', 'WEBPAGE');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'ARCHIVE', 'REDIRECT', 'REPORTED', 'DUPLICATED');

-- CreateEnum
CREATE TYPE "BoardStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- CreateEnum
CREATE TYPE "PollType" AS ENUM ('FIXED', 'ADD', 'ADD_BY_POST');

-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('OPEN', 'JUDGE', 'CLOSE_SUCCESS', 'CLOSE_FAIL');

-- CreateEnum
CREATE TYPE "PollFailReason" AS ENUM ('MIN_VOTES', 'MIN_JUDGMENTS', 'MAJOR_VERDICT', 'VERDICT_AS_FAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "LikeChoice" AS ENUM ('UP', 'DOWN', 'NEUTRAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oauthor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "oauthorId" INTEGER,
    "pollId" INTEGER NOT NULL,
    "choiceIdx" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollCount" (
    "id" SERIAL NOT NULL,
    "pollId" INTEGER NOT NULL,
    "nVotes" INTEGER[],
    "nJudgments" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "type" "PollType" NOT NULL DEFAULT E'FIXED',
    "status" "PollStatus" NOT NULL DEFAULT E'OPEN',
    "choices" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" INTEGER NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentCount" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "oauthorName" TEXT,
    "boardId" INTEGER NOT NULL,
    "voteId" INTEGER,
    "status" "CommentStatus" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardCount" (
    "id" SERIAL NOT NULL,
    "boardId" INTEGER NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bulletId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "status" "BoardStatus" NOT NULL DEFAULT E'ACTIVE',
    "hashtag" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bulletId" INTEGER NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletCount" (
    "id" SERIAL NOT NULL,
    "bulletId" INTEGER NOT NULL,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bullet" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" TEXT,
    "fetchResult" JSONB,
    "oauthorName" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardHead" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "prevId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardBody" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "prevId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tick" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Oauthor.name_unique" ON "Oauthor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PollCount.pollId_unique" ON "PollCount"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "Poll_boardId_unique" ON "Poll"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike.userId_commentId_unique" ON "CommentLike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentCount_commentId_unique" ON "CommentCount"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_voteId_unique" ON "Comment"("voteId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardLike.userId_boardId_unique" ON "BoardLike"("userId", "boardId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardCount.boardId_unique" ON "BoardCount"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "Board.bulletId_unique" ON "Board"("bulletId");

-- CreateIndex
CREATE UNIQUE INDEX "Board.cardId_bulletId_hashtag_unique" ON "Board"("cardId", "bulletId", "hashtag");

-- CreateIndex
CREATE UNIQUE INDEX "BulletLike.userId_bulletId_unique" ON "BulletLike"("userId", "bulletId");

-- CreateIndex
CREATE UNIQUE INDEX "BulletCount_bulletId_unique" ON "BulletCount"("bulletId");

-- CreateIndex
CREATE UNIQUE INDEX "Link.url_unique" ON "Link"("url");

-- CreateIndex
CREATE UNIQUE INDEX "CardHead.cardId_timestamp_unique" ON "CardHead"("cardId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "CardHead_prevId_unique" ON "CardHead"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "CardBody.cardId_timestamp_unique" ON "CardBody"("cardId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "CardBody_prevId_unique" ON "CardBody"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "Card.symbol_unique" ON "Card"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Card_linkUrl_unique" ON "Card"("linkUrl");

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("oauthorId") REFERENCES "Oauthor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollCount" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentCount" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("oauthorName") REFERENCES "Oauthor"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("voteId") REFERENCES "Vote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardLike" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardCount" ADD FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletLike" ADD FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletCount" ADD FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bullet" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("oauthorName") REFERENCES "Oauthor"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardHead" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardHead" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardHead" ADD FOREIGN KEY ("prevId") REFERENCES "CardHead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBody" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBody" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBody" ADD FOREIGN KEY ("prevId") REFERENCES "CardBody"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD FOREIGN KEY ("linkUrl") REFERENCES "Link"("url") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tick" ADD FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
