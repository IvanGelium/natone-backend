-- AlterTable
ALTER TABLE "chapter" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "conspect" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "stage" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "chapter_orderIndex_idx" ON "chapter"("orderIndex");

-- CreateIndex
CREATE INDEX "conspect_orderIndex_idx" ON "conspect"("orderIndex");

-- CreateIndex
CREATE INDEX "stage_orderIndex_idx" ON "stage"("orderIndex");
