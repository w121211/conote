-- CreateEnum
CREATE TYPE "EmojiCode" AS ENUM ('UP', 'DOWN', 'PIN', 'REPORT');

-- CreateEnum
CREATE TYPE "LikeChoice" AS ENUM ('UP', 'DOWN', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "PollFailReason" AS ENUM ('MIN_VOTES', 'MIN_JUDGMENTS', 'MAJOR_VERDICT', 'VERDICT_AS_FAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('OPEN', 'JUDGE', 'CLOSE_SUCCESS', 'CLOSE_FAIL');

-- CreateEnum
CREATE TYPE "PollType" AS ENUM ('FIXED', 'ADD', 'ADD_BY_POST');

-- CreateEnum
CREATE TYPE "RateChoice" AS ENUM ('LONG', 'SHORT', 'HOLD');

-- CreateEnum
CREATE TYPE "SymType" AS ENUM ('TICKER', 'TOPIC', 'URL');

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bullet" (
    "id" TEXT NOT NULL,
    "cardStateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bullet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletEmoji" (
    "id" TEXT NOT NULL,
    "bulletId" TEXT NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletEmojiCount" (
    "id" SERIAL NOT NULL,
    "bulletEmojiId" TEXT NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulletEmojiLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bulletEmojiId" TEXT NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulletEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "symId" TEXT NOT NULL,
    "linkId" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardEmoji" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardEmojiCount" (
    "id" SERIAL NOT NULL,
    "cardEmojiId" TEXT NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardEmojiLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "cardEmojiId" TEXT NOT NULL,
    "choice" "LikeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardState" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "commitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "body" JSONB NOT NULL,
    "prevId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "scraped" JSONB NOT NULL DEFAULT '{}',
    "authorId" TEXT,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PollType" NOT NULL DEFAULT E'FIXED',
    "status" "PollStatus" NOT NULL DEFAULT E'OPEN',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "choices" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollCount" (
    "id" SERIAL NOT NULL,
    "pollId" TEXT NOT NULL,
    "nVotes" INTEGER[],
    "nJudgments" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" TEXT NOT NULL,
    "linkId" TEXT,
    "userId" TEXT NOT NULL,
    "authorId" TEXT,
    "symId" TEXT NOT NULL,
    "choice" "RateChoice" NOT NULL,
    "body" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sym" (
    "id" TEXT NOT NULL,
    "type" "SymType" NOT NULL,
    "symbol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "choiceIdx" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BulletEmoji_bulletId_code_key" ON "BulletEmoji"("bulletId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "BulletEmojiCount_bulletEmojiId_key" ON "BulletEmojiCount"("bulletEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "BulletEmojiLike_userId_bulletEmojiId_key" ON "BulletEmojiLike"("userId", "bulletEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_symId_key" ON "Card"("symId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_linkId_key" ON "Card"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "CardEmoji_cardId_code_key" ON "CardEmoji"("cardId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "CardEmojiCount_cardEmojiId_key" ON "CardEmojiCount"("cardEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "CardEmojiLike_userId_cardEmojiId_key" ON "CardEmojiLike"("userId", "cardEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "CardState_prevId_key" ON "CardState"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");

-- CreateIndex
CREATE UNIQUE INDEX "PollCount_pollId_key" ON "PollCount"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "Sym_symbol_key" ON "Sym"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bullet" ADD CONSTRAINT "Bullet_cardStateId_fkey" FOREIGN KEY ("cardStateId") REFERENCES "CardState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmoji" ADD CONSTRAINT "BulletEmoji_bulletId_fkey" FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiCount" ADD CONSTRAINT "BulletEmojiCount_bulletEmojiId_fkey" FOREIGN KEY ("bulletEmojiId") REFERENCES "BulletEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiLike" ADD CONSTRAINT "BulletEmojiLike_bulletEmojiId_fkey" FOREIGN KEY ("bulletEmojiId") REFERENCES "BulletEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiLike" ADD CONSTRAINT "BulletEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_symId_fkey" FOREIGN KEY ("symId") REFERENCES "Sym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmoji" ADD CONSTRAINT "CardEmoji_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmojiCount" ADD CONSTRAINT "CardEmojiCount_cardEmojiId_fkey" FOREIGN KEY ("cardEmojiId") REFERENCES "CardEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmojiLike" ADD CONSTRAINT "CardEmojiLike_cardEmojiId_fkey" FOREIGN KEY ("cardEmojiId") REFERENCES "CardEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardEmojiLike" ADD CONSTRAINT "CardEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "CardState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardState" ADD CONSTRAINT "CardState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poll" ADD CONSTRAINT "Poll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollCount" ADD CONSTRAINT "PollCount_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_symId_fkey" FOREIGN KEY ("symId") REFERENCES "Sym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
