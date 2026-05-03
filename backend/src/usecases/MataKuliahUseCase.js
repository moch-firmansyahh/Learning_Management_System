export class MataKuliahUseCase {

  constructor(mataKuliahRepository) {
    this.mataKuliahRepository = mataKuliahRepository;
  }

  async addMataKuliah(data) {
    if (!data.namaMataKuliah) throw new Error("Nama Mata Kuliah wajib diisi");
    return await this.mataKuliahRepository.create(data);
  }

  async getAll() {
    const courses = await this.mataKuliahRepository.findAll();
    return courses.map((course) => {
      const modulPdf = (course.modulAjar || []).filter((modul) => {
        const tipe = (modul.tipe_modul || "").toLowerCase();
        const fileUrl = (modul.fileUrl || "").toLowerCase();
        return tipe.includes("pdf") || fileUrl.endsWith(".pdf");
      }).length;

      const modulVideo = (course.modulAjar || []).filter((modul) => {
        const tipe = (modul.tipe_modul || "").toLowerCase();
        const fileUrl = (modul.fileUrl || "").toLowerCase();
        const url = (modul.url || "").toLowerCase();
        return (
          tipe.includes("video") ||
          fileUrl.endsWith(".mp4") ||
          fileUrl.endsWith(".mov") ||
          fileUrl.endsWith(".webm") ||
          url.includes("youtube.com") ||
          url.includes("youtu.be")
        );
      }).length;

      return {
        idMataKuliah: course.idMataKuliah,
        namaMataKuliah: course.namaMataKuliah,
        statistik: {
          modulPdf,
          videoAjar: modulVideo,
          tugas: course._count?.tugas || 0,
          kuis: course._count?.kuis || 0,
        },
      };
    });
  }

  async getById(id) {
    const mk = await this.mataKuliahRepository.findById(id);
    if (!mk) throw new Error("Mata Kuliah tidak ditemukan");
    return mk;
  }

  async updateMataKuliah(id, data) {
    return await this.mataKuliahRepository.update(id, data);
  }

  async deleteMataKuliah(id) {
    return await this.mataKuliahRepository.delete(id);
  }
  
  async getDetailMataKuliah(idMataKuliah) {
    const course = await this.mataKuliahRepository.getDetailWithModules
      ? await this.mataKuliahRepository.getDetailWithModules(idMataKuliah)
      :
      await this.mataKuliahRepository.findById(idMataKuliah);

    if (!course) throw new Error("Mata kuliah tidak ditemukan");

    const modules = (course.modulAjar || []).map((modul) => ({
      idModulAjar: modul.idModulAjar,
      judul: modul.judul,
      tipe_modul: modul.tipe_modul,
      fileUrl: modul.fileUrl,
      url: modul.url,
      deskripsi: modul.deskripsi,
      tanggal: modul.tanggal,
      ukuran: modul.ukuran,
      diunduh: modul.diunduh,
      canDownload: modul.canDownload,
    }));

    const modulPdf = modules.filter((modul) => {
      const tipe = (modul.tipe_modul || "").toLowerCase();
      const fileUrl = (modul.fileUrl || "").toLowerCase();
      return tipe.includes("pdf") || fileUrl.endsWith(".pdf");
    }).length;

    const videoAjar = modules.filter((modul) => {
      const tipe = (modul.tipe_modul || "").toLowerCase();
      const fileUrl = (modul.fileUrl || "").toLowerCase();
      const url = (modul.url || "").toLowerCase();
      return (
        tipe.includes("video") ||
        fileUrl.endsWith(".mp4") ||
        fileUrl.endsWith(".mov") ||
        fileUrl.endsWith(".webm") ||
        url.includes("youtube.com") ||
        url.includes("youtu.be")
      );
    }).length;

    return {
      id: course.idMataKuliah,
      nama: course.namaMataKuliah,
      statistik: {
        modulPdf,
        videoAjar,
        tugas: (course.tugas || []).length,
        kuis: (course.kuis || []).length,
      },
      modulAjar: modules,
      tugas: (course.tugas || []).map((tugas) => ({
        idTugas: tugas.idTugas,
        judul: tugas.judul,
        detailTugas: tugas.detailTugas,
        deadlineTugas: tugas.deadlineTugas,
      })),
      kuis: (course.kuis || []).map((kuis) => ({
        idKuis: kuis.idKuis,
        judul: kuis.judul,
        deadlineKuis: kuis.deadlineKuis,
      })),
    };
  }
}