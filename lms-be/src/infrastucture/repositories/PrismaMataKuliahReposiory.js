import { prisma } from "../../../lib/prisma.ts";

export class PrismaMataKuliahRepository {
  async create(data) {
    // Hapus idMataKuliah dari data agar auto-increment berjalan
    const { idMataKuliah, ...createData } = data;
    return await prisma.mataKuliah.create({ data: createData });
  }

  async findAll() {
    return await prisma.mataKuliah.findMany({
      include: {
        dosen: {
          include: { user: { select: { nama: true } } }
        }
      },
      orderBy: { idMataKuliah: 'asc' }
    });
  }

  async findByDosen(nipDosen) {
    return await prisma.mataKuliah.findMany({
      where: { nipDosen },
      include: {
        dosen: {
          include: { user: { select: { nama: true } } }
        }
      },
      orderBy: { idMataKuliah: 'asc' }
    });
  }

  async findByNim(nim) {
    // Mata kuliah yang diikuti mahasiswa, melalui relasi Nilai, Presensi, Tugas, atau Kelompok
    const courses = await prisma.mataKuliah.findMany({
      where: {
        OR: [
          { nilai: { some: { nomorInduk: nim } } },
          { presensi: { some: { nim: nim } } },
          { tugas: { some: { nim: nim } } },
          { kelompok: { some: { anggota: { some: { nim: nim } } } } }
        ],
      },
      include: {
        dosen: {
          include: { user: { select: { nama: true } } }
        }
      },
      orderBy: { idMataKuliah: "asc" },
    });

    if (courses.length === 0) return [];

    // Filter hanya semester terakhir (semester aktif)
    const maxSemester = Math.max(...courses.map(c => c.semester));
    return courses.filter(c => c.semester === maxSemester);
  }

  async findById(id) {
    return await prisma.mataKuliah.findUnique({
      where: { idMataKuliah: parseInt(id) },
      include: {
        dosen: {
          include: { user: { select: { nama: true, email: true } } }
        }
      }
    });
  }

  async update(id, data) {
    return await prisma.mataKuliah.update({
      where: { idMataKuliah: parseInt(id) },
      data,
    });
  }

  async delete(id) {
    return await prisma.mataKuliah.delete({
      where: { idMataKuliah: parseInt(id) },
    });
  }
}
