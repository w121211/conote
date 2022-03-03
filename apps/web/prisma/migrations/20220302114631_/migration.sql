/*
  Warnings:

  - The values [DOWN] on the enum `LikeChoice` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LikeChoice_new" AS ENUM ('UP', 'NEUTRAL');
ALTER TABLE "BulletEmojiLike" ALTER COLUMN "choice" TYPE "LikeChoice_new" USING ("choice"::text::"LikeChoice_new");
ALTER TABLE "NoteEmojiLike" ALTER COLUMN "choice" TYPE "LikeChoice_new" USING ("choice"::text::"LikeChoice_new");
ALTER TYPE "LikeChoice" RENAME TO "LikeChoice_old";
ALTER TYPE "LikeChoice_new" RENAME TO "LikeChoice";
DROP TYPE "LikeChoice_old";
COMMIT;
