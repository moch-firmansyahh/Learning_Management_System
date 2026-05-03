import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async login(identifier, password, expectedRole) {
    // 1. Detect identifier type dan cari user
    console.log('🔍 Login attempt with identifier:', identifier);
    
    let user;
    if (identifier.includes('@')) {
      // Email format: contains @
      console.log('📧 Searching by email...');
      user = await this.userRepository.findByEmail(identifier);
    } else if (identifier.match(/^U\d+$/)) {
      // nomorInduk format: U followed by digits (U001, U002)
      console.log('🆔 Searching by nomorInduk...');
      user = await this.userRepository.findByNomorInduk(identifier);
    } else if (identifier.match(/^\d{7}$/)) {
      // NIM format: 7 digits (2021001, 2021002)
      console.log('🎓 Searching by NIM...');
      user = await this.userRepository.findByNim(identifier);
    } else if (identifier.match(/^\d{18}$/)) {
      // NIP format: 18 digits (197803252005012002)
      console.log('👨‍🏫 Searching by NIP...');
      user = await this.userRepository.findByNip(identifier);
    } else {
      // Try default search (fallback)
      console.log('❓ Trying default search...');
      user = await this.userRepository.findByNomorInduk(identifier);
    }
    
    console.log('👤 User found:', user);
    if (!user) throw new Error('Pengguna tidak ditemukan.');
    if (!user.role) throw new Error('Role user tidak ditemukan.');

    // 2. Validasi Role (Opsional - hanya jika expectedRole diberikan)
    if (expectedRole && user.role.nama.toUpperCase() !== expectedRole.toUpperCase()) {
      throw new Error(`Akses ditolak. Anda tidak terdaftar sebagai ${expectedRole}.`);
    }

    // 3. Verifikasi Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Kata sandi salah.');

    // 4. Generate Token JWT
    const token = jwt.sign(
      { nomorInduk: user.nomorInduk, role: user.role.nama },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        nomorInduk: user.nomorInduk,
        nama: user.nama,
        email: user.email,
        role: user.role.nama
      }
    };
  }
}