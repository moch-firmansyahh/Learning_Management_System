export class PresensiUseCase {
constructor(presensiRepository, mataKuliahRepository) {
    this.presensiRepository = presensiRepository;
    this.mataKuliahRepository = mataKuliahRepository;
}

  // Dipanggil Dosen untuk mendapatkan daftar mahasiswa di kelas
async getDaftarHadir(idMataKuliah) {
    return await this.presensiRepository.getDaftarHadirMahasiswa(idMataKuliah);
}

  // Dipanggil Dosen untuk update status manual (Hadir/Izin/Sakit/Alpha)
async updateStatusManual(idPresensi, statusKehadiran) {
    // Normalisasi 'Alpa' dari frontend menjadi 'Alpha' untuk Prisma Enum
    const status = statusKehadiran === 'Alpa' ? 'Alpha' : statusKehadiran;
    return await this.presensiRepository.updateStatus(idPresensi, status);
}

// Dipanggil Mahasiswa saat memindai QR Code
  async scanKehadiran(nim, idMataKuliah, tokenScan) {
    // Validasi dasar - token tidak boleh kosong
    if (!tokenScan || tokenScan.trim().length === 0) {
        throw new Error("Kode tidak boleh kosong.");
    }

    // Update status mahasiswa menjadi Hadir dan kembalikan result
    const result = await this.presensiRepository.markAsHadir(nim, idMataKuliah, tokenScan);
    return result;
  }

  async getRiwayatKehadiran(nim, idMataKuliah) {
    return await this.presensiRepository.getRiwayatKehadiran(nim, idMataKuliah);
  }

  async getSummaryKehadiran(nim, idMataKuliah) {
    const riwayat = await this.presensiRepository.getRiwayatKehadiran(nim, idMataKuliah);
    const summary = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };
    for (const r of riwayat) {
      if (r.statusKehadiran === 'Hadir') summary.hadir++;
      else if (r.statusKehadiran === 'Izin') summary.izin++;
      else if (r.statusKehadiran === 'Sakit') summary.sakit++;
      else if (r.statusKehadiran === 'Alpha' || r.statusKehadiran === 'Alpa') summary.alpha++;
    }
    const total = summary.hadir + summary.izin + summary.sakit + summary.alpha;
    const persentase = total === 0 ? 0 : Math.round((summary.hadir / total) * 100);
    return { summary, persentase, totalPertemuan: total };
  }

  async buatSesi(idMataKuliah) {
    return await this.presensiRepository.buatSesiPresensi(idMataKuliah);
  }
}