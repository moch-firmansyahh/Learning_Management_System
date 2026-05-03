/*
  Warnings:

  - You are about to drop the column `idMatakuliah` on the `Kelompok` table. All the data in the column will be lost.
  - The primary key for the `ModulAjar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `ModulAjar` table. All the data in the column will be lost.
  - You are about to drop the column `idModul` on the `ModulAjar` table. All the data in the column will be lost.
  - You are about to drop the column `judulModul` on the `ModulAjar` table. All the data in the column will be lost.
  - You are about to drop the column `tipeModul` on the `ModulAjar` table. All the data in the column will be lost.
  - You are about to drop the column `ukuranBite` on the `ModulAjar` table. All the data in the column will be lost.
  - You are about to drop the column `urlFile` on the `ModulAjar` table. All the data in the column will be lost.
  - Added the required column `idMataKuliah` to the `Kelompok` table without a default value. This is not possible if the table is not empty.
  - Added the required column `judul` to the `ModulAjar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kelompok" DROP CONSTRAINT "Kelompok_idMatakuliah_fkey";

-- AlterTable
ALTER TABLE "Dosen" ADD COLUMN     "bidang" VARCHAR(100),
ADD COLUMN     "nidn" VARCHAR(20),
ADD COLUMN     "ruangKantor" VARCHAR(50);

-- AlterTable
ALTER TABLE "ForumDiskusi" ADD COLUMN     "lampiran" VARCHAR(255);

-- AlterTable
ALTER TABLE "Kelompok" DROP COLUMN "idMatakuliah",
ADD COLUMN     "idMataKuliah" INTEGER NOT NULL,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'Not Started',
ADD COLUMN     "submitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tugasName" VARCHAR(200),
ADD COLUMN     "warna" VARCHAR(10);

-- AlterTable
ALTER TABLE "KomentarForum" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ModulAjar" DROP CONSTRAINT "ModulAjar_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "idModul",
DROP COLUMN "judulModul",
DROP COLUMN "tipeModul",
DROP COLUMN "ukuranBite",
DROP COLUMN "urlFile",
ADD COLUMN     "canDownload" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deskripsi" TEXT,
ADD COLUMN     "diunduh" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fileUrl" VARCHAR(255),
ADD COLUMN     "idModulAjar" SERIAL NOT NULL,
ADD COLUMN     "judul" VARCHAR(200) NOT NULL,
ADD COLUMN     "tanggal" DATE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tipe_modul" VARCHAR(50),
ADD COLUMN     "ukuran" VARCHAR(50),
ADD COLUMN     "url" VARCHAR(255),
ADD CONSTRAINT "ModulAjar_pkey" PRIMARY KEY ("idModulAjar");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "telepon" VARCHAR(20);

-- CreateTable
CREATE TABLE "LikeForum" (
    "idLike" SERIAL NOT NULL,
    "nomorInduk" VARCHAR(20) NOT NULL,
    "idForum" INTEGER NOT NULL,

    CONSTRAINT "LikeForum_pkey" PRIMARY KEY ("idLike")
);

-- CreateTable
CREATE TABLE "AnggotaKelompok" (
    "idAnggota" SERIAL NOT NULL,
    "idKelompok" INTEGER NOT NULL,
    "nim" VARCHAR(20) NOT NULL,
    "nilaiTugas" DECIMAL(5,2),

    CONSTRAINT "AnggotaKelompok_pkey" PRIMARY KEY ("idAnggota")
);

-- CreateIndex
CREATE UNIQUE INDEX "LikeForum_nomorInduk_idForum_key" ON "LikeForum"("nomorInduk", "idForum");

-- CreateIndex
CREATE UNIQUE INDEX "AnggotaKelompok_idKelompok_nim_key" ON "AnggotaKelompok"("idKelompok", "nim");

-- AddForeignKey
ALTER TABLE "LikeForum" ADD CONSTRAINT "LikeForum_nomorInduk_fkey" FOREIGN KEY ("nomorInduk") REFERENCES "User"("nomorInduk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeForum" ADD CONSTRAINT "LikeForum_idForum_fkey" FOREIGN KEY ("idForum") REFERENCES "ForumDiskusi"("idForumDiskusi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelompok" ADD CONSTRAINT "Kelompok_idMataKuliah_fkey" FOREIGN KEY ("idMataKuliah") REFERENCES "MataKuliah"("idMataKuliah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaKelompok" ADD CONSTRAINT "AnggotaKelompok_idKelompok_fkey" FOREIGN KEY ("idKelompok") REFERENCES "Kelompok"("idKelompok") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnggotaKelompok" ADD CONSTRAINT "AnggotaKelompok_nim_fkey" FOREIGN KEY ("nim") REFERENCES "Mahasiswa"("nim") ON DELETE CASCADE ON UPDATE CASCADE;
