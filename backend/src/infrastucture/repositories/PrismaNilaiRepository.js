import { prisma } from '../../../lib/prisma.ts';

export class PrismaNilaiRepository {

  async create(data) {
    return await prisma.nilai.create({ 
      data,
      include: { user: true, mataKuliah: true }
    });
  }

  async findAll() {
    return await prisma.nilai.findMany({
      include: { user: { select: { nama: true } }, mataKuliah: true }
    });
  }

  async findByMahasiswa(nomorInduk) {
    return await prisma.nilai.findMany({
      where: { nomorInduk },
      include: { mataKuliah: true }
    });
  }

  async findById(id) {
    return await prisma.nilai.findUnique({
      where: { idNilai: parseInt(id) }
    });
  }

  async update(id, data) {
    return await prisma.nilai.update({
      where: { idNilai: parseInt(id) },
      data: data,
      include: { user: { select: { nama: true } }, mataKuliah: true }
    });
  }

  async delete(id) {
    return await prisma.nilai.delete({
      where: { idNilai: parseInt(id) }
    });
  }

  async getNilaiByNomorInduk(nomorInduk) {
    return await prisma.nilai.findMany({
      where: { nomorInduk: nomorInduk },
      include: { mataKuliah: true }
    });
  }

  async upsertNilaiKuis(nomorInduk, idKuis, nilaiKuis) {
    const kuis = await prisma.kuis.findUnique({
      where: { idKuis: parseInt(idKuis) },
      select: { idMataKuliah: true },
    });
    if (!kuis) {
      throw new Error("Kuis tidak ditemukan");
    }

    const existing = await prisma.nilai.findFirst({
      where: {
        nomorInduk,
        idMataKuliah: kuis.idMataKuliah,
      },
    });

    if (existing) {
      const nilaiTugas = Number(existing.nilaiTugas || 0);
      const finalScore = (nilaiTugas + Number(nilaiKuis)) / 2;
      return await prisma.nilai.update({
        where: { idNilai: existing.idNilai },
        data: {
          nilaiKuis: Number(nilaiKuis),
          nilaiAkhir: finalScore,
        },
      });
    }

    return await prisma.nilai.create({
      data: {
        nomorInduk,
        idMataKuliah: kuis.idMataKuliah,
        nilaiKuis: Number(nilaiKuis),
        nilaiAkhir: Number(nilaiKuis),
      },
    });
  }
}