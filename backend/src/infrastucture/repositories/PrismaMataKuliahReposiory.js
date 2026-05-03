import { prisma } from "../../../lib/prisma.ts";

export class PrismaMataKuliahRepository {
  async create(data) {
    return await prisma.mataKuliah.create({ data });
  }

  async findAll() {
    return await prisma.mataKuliah.findMany({
      include: {
        modulAjar: {
          select: {
            tipe_modul: true,
            fileUrl: true,
          },
        },
        _count: {
          select: {
            tugas: true,
            kuis: true,
          },
        },
      },
    });
  }

  async findById(id) {
    return await prisma.mataKuliah.findUnique({
      where: { idMataKuliah: parseInt(id) }
    });
  }

  async update(id, data) {
    return await prisma.mataKuliah.update({
      where: { idMataKuliah: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.mataKuliah.delete({
      where: { idMataKuliah: parseInt(id) }
    });
  }

  async getDetailWithModules(id) {
    return await prisma.mataKuliah.findUnique({
      where: { idMataKuliah: parseInt(id) },
      include: {
        modulAjar: {
          orderBy: { tanggal: "desc" },
          select: {
            idModulAjar: true,
            judul: true,
            tipe_modul: true,
            fileUrl: true,
            url: true,
            deskripsi: true,
            tanggal: true,
            ukuran: true,
            diunduh: true,
            canDownload: true,
          },
        },
        tugas: {
          orderBy: { deadlineTugas: "asc" },
          select: {
            idTugas: true,
            judul: true,
            detailTugas: true,
            deadlineTugas: true,
          },
        },
        kuis: {
          orderBy: { deadlineKuis: "asc" },
          select: {
            idKuis: true,
            judul: true,
            deadlineKuis: true,
          },
        },
      },
    });
  }
}