export class DashboardDosenUseCase {
  constructor(dosenRepository) {
    this.dosenRepository = dosenRepository;
  }

  async getDashboardData(nomorInduk, hariDariClient) {
    const dosen = await this.dosenRepository.getDosenInfo(nomorInduk);
    if (!dosen) throw new Error("Data dosen tidak ditemukan");

    const nip = dosen.nip;

    // Ambil semua data secara paralel agar respons API lebih cepat
    const [materiList, totalMahasiswa, submissionStats, scheduleList] = await Promise.all([
      this.dosenRepository.getMateriList(nip),
      this.dosenRepository.getTotalMahasiswa(nip),
      this.dosenRepository.getSubmissionStats(nip),
      this.dosenRepository.getSchedule(nip)
    ]);

    // Format daftar materi
    const formattedMateri = (materiList || []).map(m => ({
      id: m.idModulAjar,
      judul: m.judul,
      tipe: m.tipe_modul || "Dokumen",
      mataKuliah: m.mataKuliah?.namaMataKuliah || "-",
      tanggal: m.tanggal ? new Date(m.tanggal).toLocaleDateString('id-ID') : "-",
      ukuran: m.ukuran || "-"
    }));

    const jadwalData = await this.getJadwalMataKuliah(scheduleList || [], hariDariClient);

    return {
      lecturerName: dosen?.user?.nama || "Dosen",
      stats: {
        totalMahasiswa: totalMahasiswa || 0,
        tugasIndividu: submissionStats?.individu || 0,
        tugasKelompok: submissionStats?.kelompok || 0
      },
      daftarMateri: formattedMateri,
      jadwal: jadwalData
    };
  }

  async getJadwalMataKuliah(mataKuliahList, hariDariClient) {
    const daysMap = {
      minggu: 0,
      senin: 1,
      selasa: 2,
      rabu: 3,
      kamis: 4,
      jumat: 5,
      sabtu: 6,
    };

    let todayName = hariDariClient ? hariDariClient.toLowerCase().trim() : null;
    if (!todayName) {
      const todayIndex = new Date().getDay();
      todayName = Object.keys(daysMap).find((k) => daysMap[k] === todayIndex);
    }

    if (!todayName) return [];

    const jadwalList = [];

    for (const mk of mataKuliahList) {
      if (!mk.jadwal) continue;
      const hariList = mk.jadwal.split(",").map((h) => h.trim().toLowerCase());
      if (hariList.includes(todayName)) {
        const hariDisplay = todayName.charAt(0).toUpperCase() + todayName.slice(1);
        jadwalList.push({
          idMataKuliah: mk.idMataKuliah,
          mataKuliah: mk.namaMataKuliah,
          hari: hariDisplay,
          waktu: mk.waktu || "-",
          ruang: mk.ruang || "Ruang Kelas"
        });
      }
    }

    return jadwalList;
  }
}