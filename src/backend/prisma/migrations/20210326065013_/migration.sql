-- CreateEnum
CREATE TYPE "PostCat" AS ENUM ('LINK', 'REPLY');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETED', 'REPORTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PollCat" AS ENUM ('FIXED', 'ADD', 'ADD_BY_POST');

-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('OPEN', 'JUDGE', 'CLOSE_SUCCESS', 'CLOSE_FAIL');

-- CreateEnum
CREATE TYPE "PollFailReason" AS ENUM ('MIN_VOTES', 'MIN_JUDGMENTS', 'MAJOR_VERDICT', 'VERDICT_AS_FAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "NoticeCat" AS ENUM ('POLL_REVOTE', 'POLL_START_JUDGE', 'POLL_INVITE_JUDGE', 'POLL_VERDICT', 'SIGNAL');

-- CreateEnum
CREATE TYPE "NoticeStatus" AS ENUM ('OPEN', 'READ');

-- CreateEnum
CREATE TYPE "SymbolCat" AS ENUM ('TICKER', 'TOPIC');

-- CreateEnum
CREATE TYPE "SymbolStatus" AS ENUM ('ACTIVE', 'REPORTED', 'ARCHIVED', 'DUPLICATED');

-- CreateEnum
CREATE TYPE "CommitStatus" AS ENUM ('REVIEW', 'PASS', 'REJECT');

-- CreateEnum
CREATE TYPE "CommitAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'MERGE');

-- CreateEnum
CREATE TYPE "LikeChoice" AS ENUM ('UP', 'DOWN', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "SrcType" AS ENUM ('VIDEO', 'POST', 'AUTHOR', 'OTHER');

-- CreateEnum
CREATE TYPE "CardTemplate" AS ENUM ('TICKER', 'TOPIC', 'WEBPAGE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

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
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "srcType" "SrcType" NOT NULL DEFAULT E'OTHER',
    "srcId" TEXT,
    "extra" JSONB,
    "oauthorName" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symbol" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cat" "SymbolCat" NOT NULL,
    "status" "SymbolStatus" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollCount" (
    "id" SERIAL NOT NULL,
    "pollId" INTEGER NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "nComments" INTEGER NOT NULL DEFAULT 0,
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
    "commentId" INTEGER NOT NULL,
    "cat" "PollCat" NOT NULL DEFAULT E'FIXED',
    "status" "PollStatus" NOT NULL DEFAULT E'OPEN',
    "choices" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "oauthorName" TEXT,
    "pollId" INTEGER NOT NULL,
    "choiceIdx" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplyLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "replyId" INTEGER NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplyCount" (
    "id" SERIAL NOT NULL,
    "replyId" INTEGER NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commentId" INTEGER NOT NULL,

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
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnchorLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "anchorId" INTEGER NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnchorCount" (
    "id" SERIAL NOT NULL,
    "anchorId" INTEGER NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anchor" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "path" TEXT,
    "cocardId" INTEGER,
    "ocardId" INTEGER,
    "selfcardId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardBody" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prevId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cocard" (
    "id" SERIAL NOT NULL,
    "template" "CardTemplate" NOT NULL,
    "meta" JSONB NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bodyId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ocard" (
    "id" SERIAL NOT NULL,
    "template" "CardTemplate" NOT NULL,
    "meta" JSONB,
    "oauthorName" TEXT NOT NULL,
    "symbolName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bodyId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Selfcard" (
    "id" SERIAL NOT NULL,
    "template" "CardTemplate" NOT NULL,
    "meta" JSONB,
    "userId" TEXT NOT NULL,
    "symbolName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bodyId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tick" (
    "id" SERIAL NOT NULL,
    "symbolId" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "_CommentToSymbol" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Oauthor.name_unique" ON "Oauthor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Link.url_unique" ON "Link"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Symbol.name_unique" ON "Symbol"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PollCount.pollId_unique" ON "PollCount"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "Poll_commentId_unique" ON "Poll"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReplyLike.userId_replyId_unique" ON "ReplyLike"("userId", "replyId");

-- CreateIndex
CREATE UNIQUE INDEX "ReplyCount.replyId_unique" ON "ReplyCount"("replyId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike.userId_commentId_unique" ON "CommentLike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentCount.commentId_unique" ON "CommentCount"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "AnchorLike.userId_anchorId_unique" ON "AnchorLike"("userId", "anchorId");

-- CreateIndex
CREATE UNIQUE INDEX "AnchorCount.anchorId_unique" ON "AnchorCount"("anchorId");

-- CreateIndex
CREATE UNIQUE INDEX "CardBody_prevId_unique" ON "CardBody"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "Cocard.linkUrl_unique" ON "Cocard"("linkUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Cocard_bodyId_unique" ON "Cocard"("bodyId");

-- CreateIndex
CREATE UNIQUE INDEX "Ocard.oauthorName_symbolName_unique" ON "Ocard"("oauthorName", "symbolName");

-- CreateIndex
CREATE UNIQUE INDEX "Ocard_bodyId_unique" ON "Ocard"("bodyId");

-- CreateIndex
CREATE UNIQUE INDEX "Selfcard.userId_symbolName_unique" ON "Selfcard"("userId", "symbolName");

-- CreateIndex
CREATE UNIQUE INDEX "Selfcard_bodyId_unique" ON "Selfcard"("bodyId");

-- CreateIndex
CREATE UNIQUE INDEX "_CommentToSymbol_AB_unique" ON "_CommentToSymbol"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentToSymbol_B_index" ON "_CommentToSymbol"("B");

-- AddForeignKey
ALTER TABLE "Link" ADD FOREIGN KEY ("oauthorName") REFERENCES "Oauthor"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollCount" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("oauthorName") REFERENCES "Oauthor"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyLike" ADD FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyCount" ADD FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentCount" ADD FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnchorLike" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnchorLike" ADD FOREIGN KEY ("anchorId") REFERENCES "Anchor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnchorCount" ADD FOREIGN KEY ("anchorId") REFERENCES "Anchor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anchor" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anchor" ADD FOREIGN KEY ("cocardId") REFERENCES "Cocard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anchor" ADD FOREIGN KEY ("ocardId") REFERENCES "Ocard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anchor" ADD FOREIGN KEY ("selfcardId") REFERENCES "Selfcard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBody" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardBody" ADD FOREIGN KEY ("prevId") REFERENCES "CardBody"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cocard" ADD FOREIGN KEY ("linkUrl") REFERENCES "Link"("url") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cocard" ADD FOREIGN KEY ("bodyId") REFERENCES "CardBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocard" ADD FOREIGN KEY ("oauthorName") REFERENCES "Oauthor"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocard" ADD FOREIGN KEY ("symbolName") REFERENCES "Symbol"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocard" ADD FOREIGN KEY ("bodyId") REFERENCES "CardBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selfcard" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selfcard" ADD FOREIGN KEY ("symbolName") REFERENCES "Symbol"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selfcard" ADD FOREIGN KEY ("bodyId") REFERENCES "CardBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tick" ADD FOREIGN KEY ("symbolId") REFERENCES "Symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentToSymbol" ADD FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentToSymbol" ADD FOREIGN KEY ("B") REFERENCES "Symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
