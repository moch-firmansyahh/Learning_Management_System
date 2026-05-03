import bcrypt from 'bcrypt';

export class DosenProfileUseCase {
constructor(profileRepository) {
    this.profileRepository = profileRepository;
}

async getDosenProfile(nomorInduk) {
    const user = await this.profileRepository.getProfile(nomorInduk);
    if (!user || !user.dosen) throw new Error("Profil Dosen tidak ditemukan");

    // Simulasi atau mapping data agar sesuai UI
    return {
        nama: user.nama,
        nidn: user.dosen.nidn || "-",
        email: user.email,
        telepon: user.telepon || "-",
        bidang: user.dosen.bidang || "-",
        officeRoom: user.dosen.ruangKantor || "-",
      // Mata Kuliah & Statistik dapat di-query terpisah dari repository lain jika diperlukan
    };
}

async updateDosenProfile(nomorInduk, data) {
    return await this.profileRepository.updateProfile(nomorInduk, data);
}

async changePassword(nomorInduk, oldPassword, newPassword) {
    const user = await this.profileRepository.getProfile(nomorInduk);
    if (!user) throw new Error("User tidak ditemukan");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Kata sandi lama salah");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.profileRepository.updatePassword(nomorInduk, hashedPassword);
    return { message: "Kata sandi berhasil diubah" };
    }
}