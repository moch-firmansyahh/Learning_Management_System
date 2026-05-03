export class NilaiUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async inputNilai(data) {
    if (!data.nomorInduk || !data.idMataKuliah) {
      throw new Error("Nomor Induk dan ID Mata Kuliah wajib diisi");
    }

    // Validasi tipe data dan range nilai
    const nilaiTugas = parseFloat(data.nilaiTugas || 0);
    const nilaiKuis = parseFloat(data.nilaiKuis || 0);

    if (isNaN(nilaiTugas) || isNaN(nilaiKuis)) {
      throw new Error("Nilai harus berupa angka yang valid");
    }

    if (nilaiTugas < 0 || nilaiTugas > 100 || nilaiKuis < 0 || nilaiKuis > 100) {
      throw new Error("Nilai harus antara 0-100");
    }

    // Hitung otomatis jika nilaiAkhir tidak disediakan
    if (!data.nilaiAkhir) {
      data.nilaiAkhir = (nilaiTugas + nilaiKuis) / 2;
    }

    return await this.repository.create(data);
  }

  async getNilaiMahasiswa(nomorInduk) {
    return await this.repository.findByMahasiswa(nomorInduk);
  }

  async updateNilai(id, updateData) {
    // 1. Cek apakah data nilai tersebut ada
    const existingNilai = await this.repository.findById(id);
    if (!existingNilai) throw new Error("Data nilai tidak ditemukan");

    // 2. Siapkan data baru
    const finalUpdateData = { ...updateData };

    // 3. Logika Hitung Ulang: Jika nilai tugas atau kuis diubah, hitung ulang nilai akhir
    const nTugas = updateData.nilaiTugas !== undefined ? updateData.nilaiTugas : existingNilai.nilaiTugas;
    const nKuis = updateData.nilaiKuis !== undefined ? updateData.nilaiKuis : existingNilai.nilaiKuis;
    
    // Validasi nilai yang diinput
    const parsedTugas = parseFloat(nTugas);
    const parsedKuis = parseFloat(nKuis);

    if (isNaN(parsedTugas) || isNaN(parsedKuis)) {
      throw new Error("Nilai harus berupa angka yang valid");
    }

    if (parsedTugas < 0 || parsedTugas > 100 || parsedKuis < 0 || parsedKuis > 100) {
      throw new Error("Nilai harus antara 0-100");
    }

    finalUpdateData.nilaiAkhir = (parsedTugas + parsedKuis) / 2;

    // 4. Kirim ke repository
    return await this.repository.update(id, finalUpdateData);
  }
}