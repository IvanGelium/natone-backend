/*
  Warnings:

  - You are about to drop the column `conspects` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `chapters` on the `stage` table. All the data in the column will be lost.
  - Added the required column `stageId` to the `chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `conspect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chapter" DROP COLUMN "conspects",
ADD COLUMN     "stageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "conspect" ADD COLUMN     "chapterId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "stage" DROP COLUMN "chapters";

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conspect" ADD CONSTRAINT "conspect_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
