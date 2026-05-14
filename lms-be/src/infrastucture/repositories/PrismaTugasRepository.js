import { prisma } from '../../prismaClient.js';

export class PrismaTugasRepository {
  async findAllTugas(filter = {}) {
    const where = {};
    if (filter.idMataKuliah) {
      if (typeof filter.idMataKuliah === 'object' && filter.idMataKuliah.in) {
        // Array of course IDs: { in: [1, 2, 3] }
        where.idMataKuliah = { in: filter.idMataKuliah.in.map(id => parseInt(id)) };
      } else {
        // Single course ID
        where.idMataKuliah = parseInt(filter.idMataKuliah);
      }
    }
    // Filter by NIM to get only tasks assigned to this specific student
    // (prevents duplicates when same task is assigned to multiple students)
    if (filter.nim) {
      where.nim = filter.nim;
    }
    return await prisma.tugas.findMany({
      where,
      include: { 
        mataKuliah: true, 
        pengumpulanTugas: filter.nim ? {
          where: { nim: filter.nim }
        } : true 
      },
      orderBy: { deadlineTugas: 'asc' }
    });
  }

  async findTugasById(idTugas) {
    return await prisma.tugas.findUnique({
      where: { idTugas: parseInt(idTugas) },
      include: { mataKuliah: true, pengumpulanTugas: { include: { mahasiswa: true } } }
    });
  }

  async findPengumpulanByNimAndTugas(nim, idTugas) {
    return await prisma.pengumpulanTugas.findFirst({
      where: { nim, idTugas: parseInt(idTugas) }
    });
  }

  async createPengumpulan(data) {
    return await prisma.pengumpulanTugas.create({
      data: {
        idTugas: parseInt(data.idTugas),
        nim: data.nim,
        judul: data.judul,
        detailTugas: data.detailTugas,
        fileJawaban: data.fileJawaban,
        deadlineTugas: data.deadlineTugas ? new Date(data.deadlineTugas) : null,
        idKelompok: data.idKelompok ? parseInt(data.idKelompok) : null
      }
    });
  }

  async updatePengumpulan(id, data) {
    return await prisma.pengumpulanTugas.update({
      where: { idPengumpulan: parseInt(id) },
      data: {
        judul: data.judul,
        detailTugas: data.detailTugas,
        fileJawaban: data.fileJawaban,
      }
    });
  }

  async getSubmission(idTugas, nim) {
    return await this.findPengumpulanByNimAndTugas(nim, idTugas);
  }

  async findKelompokByNim(nim, idMataKuliah) {
    return await prisma.anggotaKelompok.findFirst({
      where: {
        nim: nim,
        kelompok: { idMataKuliah: parseInt(idMataKuliah) }
      },
      include: {
        kelompok: {
          include: {
            anggota: { select: { nim: true } }
          }
        }
      }
    });
  }

  async deleteSubmission(idPengumpulan) {
    return await prisma.pengumpulanTugas.delete({
      where: { idPengumpulan: parseInt(idPengumpulan) }
    });
  }
}
