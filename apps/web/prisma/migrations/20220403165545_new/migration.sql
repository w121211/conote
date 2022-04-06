-- CreateEnum
CREATE TYPE "DiscussStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- CreateEnum
CREATE TYPE "DiscussPostStatus" AS ENUM ('ACTIVE', 'LOCK', 'DELETE', 'ARCHIVE', 'REPORTED');

-- CreateEnum
CREATE TYPE "EmojiCode" AS ENUM ('UP', 'DOWN', 'PIN', 'REPORT');

-- CreateEnum
CREATE TYPE "LikeChoice" AS ENUM ('UP', 'NEUTRAL');

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

-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('EDIT', 'COMMIT', 'DROP');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('CANDIDATE', 'MERGE', 'REJECT');

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
    "docId" TEXT NOT NULL,
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
CREATE TABLE "Discuss" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DiscussStatus" NOT NULL DEFAULT E'ACTIVE',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discuss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussCount" (
    "id" SERIAL NOT NULL,
    "discussId" TEXT NOT NULL,
    "nPosts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussEmoji" (
    "id" SERIAL NOT NULL,
    "discussId" TEXT NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussEmojiCount" (
    "id" SERIAL NOT NULL,
    "discussEmojiId" INTEGER NOT NULL,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussEmojiLike" (
    "id" SERIAL NOT NULL,
    "discussEmojiId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPost" (
    "id" SERIAL NOT NULL,
    "discussId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "DiscussPostStatus" NOT NULL DEFAULT E'ACTIVE',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPostEmoji" (
    "id" SERIAL NOT NULL,
    "discussPostId" INTEGER NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPostEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPostEmojiCount" (
    "id" SERIAL NOT NULL,
    "discussPostEmojiId" INTEGER NOT NULL,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPostEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscussPostEmojiLike" (
    "id" SERIAL NOT NULL,
    "discussPostEmojiId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscussPostEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteEmoji" (
    "id" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "symId" TEXT NOT NULL,
    "code" "EmojiCode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteEmoji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteEmojiCount" (
    "id" SERIAL NOT NULL,
    "noteEmojiId" INTEGER NOT NULL,
    "nViews" INTEGER NOT NULL DEFAULT 0,
    "nUps" INTEGER NOT NULL DEFAULT 0,
    "nDowns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteEmojiCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteEmojiLike" (
    "id" SERIAL NOT NULL,
    "noteEmojiId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteEmojiLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteDraft" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "symId" TEXT,
    "commitId" TEXT,
    "userId" TEXT NOT NULL,
    "fromDocId" TEXT,
    "domain" TEXT NOT NULL,
    "symName" TEXT NOT NULL,
    "status" "DraftStatus" NOT NULL DEFAULT E'EDIT',
    "noteMeta" JSONB NOT NULL DEFAULT '{}',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "symId" TEXT NOT NULL,
    "linkId" TEXT,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteDoc" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "symId" TEXT NOT NULL,
    "commitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "status" "DocStatus" NOT NULL DEFAULT E'CANDIDATE',
    "domain" TEXT NOT NULL,
    "noteMeta" JSONB NOT NULL DEFAULT '{}',
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteDoc_pkey" PRIMARY KEY ("id")
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
    "name" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "_DiscussToNote" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiscussToNoteDraft" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
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
CREATE UNIQUE INDEX "DiscussCount_discussId_key" ON "DiscussCount"("discussId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmoji_code_discussId_key" ON "DiscussEmoji"("code", "discussId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmojiCount_discussEmojiId_key" ON "DiscussEmojiCount"("discussEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmojiLike_discussEmojiId_key" ON "DiscussEmojiLike"("discussEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussEmojiLike_discussEmojiId_userId_key" ON "DiscussEmojiLike"("discussEmojiId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmoji_code_discussPostId_key" ON "DiscussPostEmoji"("code", "discussPostId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmojiCount_discussPostEmojiId_key" ON "DiscussPostEmojiCount"("discussPostEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmojiLike_discussPostEmojiId_key" ON "DiscussPostEmojiLike"("discussPostEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscussPostEmojiLike_userId_discussPostEmojiId_key" ON "DiscussPostEmojiLike"("userId", "discussPostEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmoji_branchId_symId_code_key" ON "NoteEmoji"("branchId", "symId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmojiCount_noteEmojiId_key" ON "NoteEmojiCount"("noteEmojiId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteEmojiLike_noteEmojiId_userId_key" ON "NoteEmojiLike"("noteEmojiId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteDraft_symName_key" ON "NoteDraft"("symName");

-- CreateIndex
CREATE UNIQUE INDEX "Note_linkId_key" ON "Note"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_branchId_symId_key" ON "Note"("branchId", "symId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteDoc_parentId_key" ON "NoteDoc"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_url_key" ON "Link"("url");

-- CreateIndex
CREATE UNIQUE INDEX "PollCount_pollId_key" ON "PollCount"("pollId");

-- CreateIndex
CREATE UNIQUE INDEX "Sym_name_key" ON "Sym"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscussToNote_AB_unique" ON "_DiscussToNote"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscussToNote_B_index" ON "_DiscussToNote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscussToNoteDraft_AB_unique" ON "_DiscussToNoteDraft"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscussToNoteDraft_B_index" ON "_DiscussToNoteDraft"("B");

-- AddForeignKey
ALTER TABLE "Bullet" ADD CONSTRAINT "Bullet_docId_fkey" FOREIGN KEY ("docId") REFERENCES "NoteDoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmoji" ADD CONSTRAINT "BulletEmoji_bulletId_fkey" FOREIGN KEY ("bulletId") REFERENCES "Bullet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiCount" ADD CONSTRAINT "BulletEmojiCount_bulletEmojiId_fkey" FOREIGN KEY ("bulletEmojiId") REFERENCES "BulletEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiLike" ADD CONSTRAINT "BulletEmojiLike_bulletEmojiId_fkey" FOREIGN KEY ("bulletEmojiId") REFERENCES "BulletEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BulletEmojiLike" ADD CONSTRAINT "BulletEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discuss" ADD CONSTRAINT "Discuss_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussCount" ADD CONSTRAINT "DiscussCount_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmoji" ADD CONSTRAINT "DiscussEmoji_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiCount" ADD CONSTRAINT "DiscussEmojiCount_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiLike" ADD CONSTRAINT "DiscussEmojiLike_discussEmojiId_fkey" FOREIGN KEY ("discussEmojiId") REFERENCES "DiscussEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussEmojiLike" ADD CONSTRAINT "DiscussEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPost" ADD CONSTRAINT "DiscussPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmoji" ADD CONSTRAINT "DiscussPostEmoji_discussPostId_fkey" FOREIGN KEY ("discussPostId") REFERENCES "DiscussPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiCount" ADD CONSTRAINT "DiscussPostEmojiCount_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiLike" ADD CONSTRAINT "DiscussPostEmojiLike_discussPostEmojiId_fkey" FOREIGN KEY ("discussPostEmojiId") REFERENCES "DiscussPostEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussPostEmojiLike" ADD CONSTRAINT "DiscussPostEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmoji" ADD CONSTRAINT "NoteEmoji_branchId_symId_fkey" FOREIGN KEY ("branchId", "symId") REFERENCES "Note"("branchId", "symId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmojiCount" ADD CONSTRAINT "NoteEmojiCount_noteEmojiId_fkey" FOREIGN KEY ("noteEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmojiLike" ADD CONSTRAINT "NoteEmojiLike_noteEmojiId_fkey" FOREIGN KEY ("noteEmojiId") REFERENCES "NoteEmoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteEmojiLike" ADD CONSTRAINT "NoteEmojiLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDraft" ADD CONSTRAINT "NoteDraft_branchId_symId_fkey" FOREIGN KEY ("branchId", "symId") REFERENCES "Note"("branchId", "symId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDraft" ADD CONSTRAINT "NoteDraft_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDraft" ADD CONSTRAINT "NoteDraft_fromDocId_fkey" FOREIGN KEY ("fromDocId") REFERENCES "NoteDoc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDraft" ADD CONSTRAINT "NoteDraft_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDraft" ADD CONSTRAINT "NoteDraft_symId_fkey" FOREIGN KEY ("symId") REFERENCES "Sym"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDraft" ADD CONSTRAINT "NoteDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_symId_fkey" FOREIGN KEY ("symId") REFERENCES "Sym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDoc" ADD CONSTRAINT "NoteDoc_branchId_symId_fkey" FOREIGN KEY ("branchId", "symId") REFERENCES "Note"("branchId", "symId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDoc" ADD CONSTRAINT "NoteDoc_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NoteDoc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDoc" ADD CONSTRAINT "NoteDoc_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDoc" ADD CONSTRAINT "NoteDoc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_DiscussToNote" ADD FOREIGN KEY ("A") REFERENCES "Discuss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscussToNote" ADD FOREIGN KEY ("B") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscussToNoteDraft" ADD FOREIGN KEY ("A") REFERENCES "Discuss"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscussToNoteDraft" ADD FOREIGN KEY ("B") REFERENCES "NoteDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
