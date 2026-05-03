export class DashboardDosenUseCase {
  constructor(dosenRepository) {
    this.dosenRepository = dosenRepository;
  }

  async getDashboardData(nomorInduk) {
    const dosen = await this.dosenRepository.getDosenInfo(nomorInduk);
    if (!dosen) throw new Error("Data dosen tidak ditemukan");

    const nip = dosen.nip;

    // Ambil semua data secara paralel agar respons API lebih cepat
    const [pendingTasks, schedule, totalMahasiswa] = await Promise.all([
      this.dosenRepository.getPendingTasks(nip),
      this.dosenRepository.getSchedule(nip),
      this.dosenRepository.getTotalMahasiswa(nip)
    ]);

    // Format data sesuai dengan kebutuhan state di dashboardDosen.jsx
    const formattedPending = (pendingTasks || []).map(pt => {
      const nama = pt?.mahasiswa?.user?.nama || "Mahasiswa";
      return {
        code: pt?.kelompok ? "K" : nama.substring(0, 2).toUpperCase(),
        name: pt?.kelompok ? pt.kelompok.namaKelompok : nama,
        type: pt?.kelompok ? "Kelompok" : "Individu",
        task: pt?.tugas?.judul || "-",
        course: pt?.tugas?.mataKuliah?.namaMataKuliah || "-",
        date: pt?.deadlineTugas ? new Date(pt.deadlineTugas).toLocaleDateString('id-ID') : "-",
        timeStatus: "Menunggu Penilaian",
        late: false,
        av: pt?.kelompok ? "av-blue" : "av-teal"
      };
    });

    const formattedSchedule = (schedule || []).map(mk => ({
      time: "08:00",
      color: "var(--color-secondary)",
      subject: mk.namaMataKuliah,
      room: "Ruang Kelas",
      matkul: `MK${mk.idMataKuliah}`
    }));

    return {
      lecturerName: dosen?.user?.nama || "Dosen",
      stats: {
        totalMahasiswa: totalMahasiswa || 0,
        tugasPending: (pendingTasks || []).length,
        rataPresensi: "94.2%"
      },
      pendingTasks: formattedPending,
      jadwal: formattedSchedule
    };
  }
}