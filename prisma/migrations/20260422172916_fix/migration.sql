-- DropForeignKey
ALTER TABLE "practice" DROP CONSTRAINT "practice_conspectId_fkey";

-- AlterTable
ALTER TABLE "conspect" ADD COLUMN     "practiceId" INTEGER;

-- AddForeignKey
ALTER TABLE "conspect" ADD CONSTRAINT "conspect_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "practice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
