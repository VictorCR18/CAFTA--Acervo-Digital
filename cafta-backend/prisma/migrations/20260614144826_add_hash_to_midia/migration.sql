-- AlterTable
ALTER TABLE "midias" ADD COLUMN     "hash" TEXT;

-- CreateIndex
CREATE INDEX "midia_hash_idx" ON "midias"("hash");
