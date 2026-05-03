import { prisma } from "../../prismaClient.js";

export class PrismaTugasMahasiswaRepository {
  async findMahasiswaByNomorInduk(nomorInduk) {
    return await prisma.user.findUnique({
      where: { nomorInduk },
      include: { mahasiswa: true },
    });
  }

  async findTasksByNim(nim, idMataKuliah) {
    const where = { nim };
    if (idMataKuliah) {
      where.idMataKuliah = parseInt(idMataKuliah, 10);
    }

    return await prisma.tugas.findMany({
      where,
      include: {
        mataKuliah: true,
      },
      orderBy: { deadlineTugas: "asc" },
    });
  }

  async submitTugas(idTugas, nim, fileJawaban) {
    const result = await prisma.tugas.updateMany({
      where: {
        idTugas: parseInt(idTugas, 10),
        nim,
      },
      data: {
        fileJawaban,
      },
    });

    if (result.count === 0) {
      throw new Error("Tugas tidak ditemukan untuk mahasiswa ini");
    }

    return await prisma.tugas.findUnique({
      where: { idTugas: parseInt(idTugas, 10) },
      include: { mataKuliah: true },
    });
  }
}
