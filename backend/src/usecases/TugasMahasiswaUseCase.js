export class TugasMahasiswaUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async getMyTasks(nomorInduk, idMataKuliah) {
    const user = await this.repository.findMahasiswaByNomorInduk(nomorInduk);
    const nim = user?.mahasiswa?.nim;
    if (!nim) {
      throw new Error("Profil mahasiswa tidak ditemukan");
    }

    const tasks = await this.repository.findTasksByNim(nim, idMataKuliah);
    const now = new Date();

    return tasks.map((task) => {
      const deadline = task.deadlineTugas ? new Date(task.deadlineTugas) : null;
      const isSubmitted = Boolean(task.fileJawaban);
      const isLate = deadline ? deadline < now : false;

      let status = "belum_dikerjakan";
      if (isSubmitted) {
        status = "selesai";
      } else if (isLate) {
        status = "terlambat";
      } else if (deadline) {
        status = "sedang_berjalan";
      }

      return {
        id: task.idTugas,
        idMataKuliah: task.idMataKuliah,
        mataKuliah: task.mataKuliah?.namaMataKuliah || "-",
        judul: task.judul,
        detailTugas: task.detailTugas,
        deadlineTugas: task.deadlineTugas,
        status,
        progress: isSubmitted ? 100 : 0,
        fileJawaban: task.fileJawaban,
      };
    });
  }

  async submitTugas(idTugas, nomorInduk, fileJawaban) {
    if (!fileJawaban || !String(fileJawaban).trim()) {
      throw new Error("Link atau path jawaban wajib diisi");
    }

    const user = await this.repository.findMahasiswaByNomorInduk(nomorInduk);
    const nim = user?.mahasiswa?.nim;
    if (!nim) {
      throw new Error("Profil mahasiswa tidak ditemukan");
    }

    return await this.repository.submitTugas(idTugas, nim, String(fileJawaban).trim());
  }
}
