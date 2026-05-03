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
    // 1. Validasi format token frontend
    if (!tokenScan.startsWith("LeMaS-")) {
        throw new Error("Kode QR tidak valid.");
    }

    // 2. Cek apakah sesi presensi ada untuk mata kuliah ini di database
    // (Asumsi implementasi pengecekan sesi aktif)
    
    // 3. Update status mahasiswa menjadi Hadir
    return await this.presensiRepository.markAsHadir(nim, idMataKuliah);
    }
}