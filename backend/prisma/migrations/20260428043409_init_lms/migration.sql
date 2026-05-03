/*
  Warnings:

  - The primary key for the `ModulAjar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idModulAjar` on the `ModulAjar` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `ModulAjar` table. All the data in the column will be lost.
  - You are about to drop the column `tipe_modul` on the `ModulAjar` table. All the data in the column will be lost.
  - Added the required column `judulModul` to the `ModulAjar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipeModul` to the `ModulAjar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlFile` to the `ModulAjar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModulAjar" DROP CONSTRAINT "ModulAjar_pkey",
DROP COLUMN "idModulAjar",
DROP COLUMN "judul",
DROP COLUMN "tipe_modul",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idModul" SERIAL NOT NULL,
ADD COLUMN     "judulModul" VARCHAR(200) NOT NULL,
ADD COLUMN     "tipeModul" VARCHAR(20) NOT NULL,
ADD COLUMN     "ukuranBite" INTEGER,
ADD COLUMN     "urlFile" TEXT NOT NULL,
ADD CONSTRAINT "ModulAjar_pkey" PRIMARY KEY ("idModul");

-- AlterTable
ALTER TABLE "Nilai" ADD COLUMN     "semester" INTEGER;
