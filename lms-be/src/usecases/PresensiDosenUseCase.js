export class PresensiDosenUseCase {
constructor(presensiRepository) {
    this.presensiRepository = presensiRepository;
}

async getDaftarHadir(idMataKuliah) {
    if (!idMataKuliah) {
        throw new Error("ID Mata Kuliah diperlukan");
    }
    return await this.presensiRepository.getMahasiswaByMatkul(idMataKuliah);
}

async ubahStatusMahasiswa(idPresensi, statusKehadiran) {
    const validStatus = ["Hadir", "Sakit", "Izin", "Alpa"];
    if (!validStatus.includes(statusKehadiran)) {
        throw new Error("Status kehadiran tidak valid");
    }
    return await this.presensiRepository.updateStatusPresensi(idPresensi, statusKehadiran);
}

async ubahStatusByNim(nim, idMataKuliah, statusKehadiran) {
    const validStatus = ["Hadir", "Sakit", "Izin", "Alpa"];
    if (!validStatus.includes(statusKehadiran)) {
        throw new Error("Status kehadiran tidak valid");
    }
    return await this.presensiRepository.updateStatusByNim(nim, idMataKuliah, statusKehadiran);
}

async getDaftarHadirByTanggal(idMataKuliah, tanggal) {
    if (!idMataKuliah) {
        throw new Error("ID Mata Kuliah diperlukan");
    }
    if (!tanggal) {
        throw new Error("Tanggal diperlukan");
    }
    return await this.presensiRepository.getDaftarHadirByTanggal(idMataKuliah, tanggal);
}

async getAllPresensiDates(idMataKuliah) {
    if (!idMataKuliah) {
        throw new Error("ID Mata Kuliah diperlukan");
    }
    return await this.presensiRepository.getAllPresensiDates(idMataKuliah);
}
}