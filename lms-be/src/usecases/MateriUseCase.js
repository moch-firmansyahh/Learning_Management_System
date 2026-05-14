export class MateriUseCase {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Get all materi with progress status for a student
  async getMateriWithProgress(idMataKuliah, nim) {
    const materiList = await this.prisma.modulAjar.findMany({
      where: { idMataKuliah },
      orderBy: { tanggal: 'desc' },
    });

    const progressList = await this.prisma.progressMateri.findMany({
      where: { nim },
    });

    const progressMap = new Map(progressList.map(p => [p.idModulAjar, p.status]));

    return materiList.map(m => ({
      id: m.idModulAjar,
      judul: m.judul,
      tipe: m.tipe_modul,
      deskripsi: m.deskripsi,
      url: m.url,
      fileUrl: m.fileUrl,
      ukuran: m.ukuran,
      tanggal: m.tanggal,
      sudahAkses: progressMap.get(m.idModulAjar) === 'sudah',
    }));
  }

  // Mark materi as accessed (download PDF or view video)
  async markAsAccessed(idModulAjar, nim) {
    const existing = await this.prisma.progressMateri.findUnique({
      where: {
        idModulAjar_nim: {
          idModulAjar,
          nim,
        },
      },
    });

    if (existing) {
      // Already marked, update timestamp
      return await this.prisma.progressMateri.update({
        where: { idProgress: existing.idProgress },
        data: {
          status: 'sudah',
          tanggalAkses: new Date(),
        },
      });
    }

    // Create new progress record
    return await this.prisma.progressMateri.create({
      data: {
        idModulAjar,
        nim,
        status: 'sudah',
        tanggalAkses: new Date(),
      },
    });
  }

  // Get progress count for a course
  async getProgressSummary(idMataKuliah, nim) {
    const totalMateri = await this.prisma.modulAjar.count({
      where: { idMataKuliah },
    });

    const completedMateri = await this.prisma.progressMateri.count({
      where: {
        nim,
        status: 'sudah',
        modulAjar: {
          idMataKuliah,
        },
      },
    });

    return {
      total: totalMateri,
      completed: completedMateri,
      percentage: totalMateri > 0 ? Math.round((completedMateri / totalMateri) * 100) : 0,
    };
  }
}
