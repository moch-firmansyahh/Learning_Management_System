import { IdGenerator } from '../infrastucture/utils/idGenerator.js';
import bcrypt from 'bcrypt';

export class UserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(data) {
    const role = await this.userRepository.findRoleById(data.roleId);
    if (!role) throw new Error("Role tidak ditemukan");

    // 1. Tentukan Prefix & Generate nomorInduk Otomatis
    let prefix = '';
    if (role.nama === 'MAHASISWA') prefix = 'U';
    else if (role.nama === 'DOSEN') prefix = 'D';
    else if (role.nama === 'ADMIN') prefix = 'P';

    const lastCount = await this.userRepository.countByRoleId(data.roleId);
    const generatedNomorInduk = IdGenerator.generateNomorInduk(prefix, lastCount);

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userCoreData = {
      nomorInduk: generatedNomorInduk, // ID Otomatis
      nama: data.nama,
      email: data.email,
      password: hashedPassword,
      roleId: data.roleId
    };

    // 3. Logika Spesifik Profil
    if (role.nama === 'MAHASISWA') {
      const currentYear = new Date().getFullYear();
      const lastMhsCount = await this.userRepository.countMahasiswa();
      const generatedNIM = IdGenerator.generateNIM(currentYear, lastMhsCount);

      return await this.userRepository.createWithProfile(
        userCoreData, 
        { nim: generatedNIM }, // NIM Otomatis
        'MAHASISWA'
      );
    }

    if (role.nama === 'DOSEN') {
      if (!data.nip) throw new Error("NPWP wajib diisi untuk Dosen");
      return await this.userRepository.createWithProfile(
        userCoreData, 
        { nip: data.nip }, // Gunakan NPWP sebagai NIP (sesuai permintaanmu)
        'DOSEN'
      );
    }

    return await this.userRepository.create(userCoreData);
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getAllUsersRole() {
    return await this.userRepository.findAllRoles();
  }

  async getUserDetail(nomorInduk) {
    return await this.userRepository.findById(nomorInduk);
  }

  async updateUser(nomorInduk, updateData) {
    // 1. Cek apakah user ada
    const existingUser = await this.userRepository.findById(nomorInduk);
    if (!existingUser) throw new Error("User tidak ditemukan");

    const finalUpdateData = { ...updateData };

    // 2. Jika password diubah, hash ulang
    if (updateData.password) {
      finalUpdateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // 3. Jalankan update di repository
    return await this.userRepository.update(nomorInduk, finalUpdateData);
  }

  async deleteUser(nomorInduk) {
    // 1. Cek apakah user ada
    const existingUser = await this.userRepository.findById(nomorInduk);
    if (!existingUser) {
      throw new Error("User tidak ditemukan, penghapusan gagal");
    }

    // 2. Jika ada, hapus
    return await this.userRepository.delete(nomorInduk);
  }
}