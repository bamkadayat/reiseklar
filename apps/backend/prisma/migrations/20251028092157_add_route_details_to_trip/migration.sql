-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "routeData" JSONB,
ADD COLUMN     "routeHash" TEXT;

-- CreateIndex
CREATE INDEX "Trip_userId_routeHash_idx" ON "Trip"("userId", "routeHash");
