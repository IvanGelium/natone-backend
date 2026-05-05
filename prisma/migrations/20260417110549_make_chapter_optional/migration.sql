/*
  Warnings:

  - You are about to drop the column `practice` on the `conspect` table. All the data in the column will be lost.
  - You are about to drop the column `deletedA` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chapter" DROP CONSTRAINT "chapter_stageId_fkey";

-- DropForeignKey
ALTER TABLE "conspect" DROP CONSTRAINT "conspect_chapterId_fkey";

-- AlterTable
ALTER TABLE "chapter" ALTER COLUMN "stageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "conspect" DROP COLUMN "practice",
ALTER COLUMN "chapterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "deletedA",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "practice" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "conspectId" INTEGER,

    CONSTRAINT "practice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conspect" ADD CONSTRAINT "conspect_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice" ADD CONSTRAINT "practice_conspectId_fkey" FOREIGN KEY ("conspectId") REFERENCES "conspect"("id") ON DELETE SET NULL ON UPDATE CASCADE;
