import { prisma } from "../../lib/prisma.ts";

export class DashboardMahasiswaUseCase {
constructor(mataKuliahRepository, forumRepository) {
    this.mataKuliahRepository = mataKuliahRepository;
    this.forumRepository = forumRepository;
    }

async getDashboardData(nim) {
    try {
    // 1. Ambil semua mata kuliah
    const mataKuliah = await this.mataKuliahRepository.findAll();
    
    // 2. Ambil forum threads terbaru
    const threads = await this.forumRepository.getRecentThreads
      ? await this.forumRepository.getRecentThreads(3)
      : [];

    // 3. Hitung progress tugas berdasarkan data mahasiswa login
    const user = await prisma.user.findUnique({
      where: { nomorInduk: nim },
      include: { mahasiswa: true },
    });
    const mahasiswaNim = user?.mahasiswa?.nim;

    let totalTugas = 0;
    let tugasSelesai = 0;
    if (mahasiswaNim) {
      const myTasks = await prisma.tugas.findMany({
        where: { nim: mahasiswaNim },
        select: { fileJawaban: true },
      });
      totalTugas = myTasks.length;
      tugasSelesai = myTasks.filter((t) => Boolean(t.fileJawaban)).length;
    }
    const persentase = totalTugas > 0 ? Math.round((tugasSelesai / totalTugas) * 100) : 0;

    return {
        progress: {
        persentase,
        tugasSelesai,
        totalTugas,
    },
    mataKuliah: mataKuliah.slice(0, 5).map(mk => ({
        id: mk.idMataKuliah,
        nama: mk.namaMataKuliah
    })),
    threads: threads.slice(0, 3).map(t => ({
        id: t.idForumDiskusi,
        judul: t.judul || "Thread",
        authorName: t.user?.nama || "Pengguna"
    }))
    };
    } catch (error) {
        throw new Error('Dashboard data gagal dimuat: ' + error.message);
    }
}
}