/*
  Warnings:

  - Added the required column `nomorInduk` to the `ForumDiskusi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForumDiskusi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nomorInduk" VARCHAR(20) NOT NULL;

-- AddForeignKey
ALTER TABLE "ForumDiskusi" ADD CONSTRAINT "ForumDiskusi_nomorInduk_fkey" FOREIGN KEY ("nomorInduk") REFERENCES "User"("nomorInduk") ON DELETE RESTRICT ON UPDATE CASCADE;
