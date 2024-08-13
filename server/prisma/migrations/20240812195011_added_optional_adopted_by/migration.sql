-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_adoptedById_fkey";

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "adoptedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_adoptedById_fkey" FOREIGN KEY ("adoptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
