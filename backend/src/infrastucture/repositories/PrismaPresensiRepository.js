import { prisma } from '../../../lib/prisma.ts';

export class PrismaPresensiRepository {
  
  /**
   * Mengambil daftar hadir mahasiswa untuk ditampilkan di Dashboard Dosen (presensi.jsx)
   * @param {number} idMataKuliah 
   */
  async getDaftarHadirMahasiswa(idMataKuliah) {
    // 1. Ambil data presensi dari database, gabungkan (include) data mahasiswa dan user
    const presensiList = await prisma.presensi.findMany({
      where: {
        idMataKuliah: idMataKuliah,
        // (Opsional) Tambahkan filter tanggal jika ingin spesifik mengambil sesi hari ini:
        // tanggalPertemuan: { gte: new Date(new Date().setHours(0,0,0,0)) } 
      },
      include: {
        mahasiswa: {
          include: {
            user: {
              select: { nama: true } // Hanya ambil nama untuk efisiensi
            }
          }
        }
      },
      orderBy: {
        mahasiswa: { nim: 'asc' } // Urutkan berdasarkan NIM
      }
    });

    // 2. Mapping data mentah database menjadi format yang siap dikonsumsi oleh INITIAL_STUDENTS di React
    return presensiList.map((p, index) => {
      // Membuat inisial nama (Misal: "Budi Santoso" -> "BU")
      const initials = p.mahasiswa.user.nama.substring(0, 2).toUpperCase();
      
      // Warna acak (Mockup) untuk avatar frontend seperti pada kode Anda
      const colors = ["#8991fe", "#f59e0b", "#10b981", "#ec4899", "#6366f1"];
      const randomColor = colors[index % colors.length];

      return {
        id: p.idPresensi,
        nim: p.nim,
        name: p.mahasiswa.user.nama,
        initials: initials,
        color: randomColor,
        status: p.statusKehadiran, // Berupa Enum: 'Hadir', 'Izin', 'Sakit', 'Alpha'
      };
    });
  }

  /**
   * Mengubah status absensi mahasiswa secara manual (Dosen mengubah lewat UI)
   * @param {number} idPresensi 
   * @param {string} statusKehadiran ('Hadir', 'Izin', 'Sakit', 'Alpha')
   */
  async updateStatus(idPresensi, statusKehadiran) {
    return await prisma.presensi.update({
      where: { idPresensi: idPresensi },
      data: { statusKehadiran: statusKehadiran }
    });
  }

  /**
   * Menandai status kehadiran menjadi "Hadir" saat Mahasiswa melakukan Scan QR Code
   * @param {string} nim 
   * @param {number} idMataKuliah 
   */
  async markAsHadir(nim, idMataKuliah) {
    // 1. Tentukan range tanggal hari ini (00:00 - 23:59)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 2. Cari record presensi HARI INI untuk mahasiswa tersebut di mata kuliah terkait
    const presensiSesiIni = await prisma.presensi.findFirst({
      where: {
        nim: nim,
        idMataKuliah: idMataKuliah,
        tanggalPertemuan: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        tanggalPertemuan: 'desc' // Jika multiple sessions hari ini, ambil yang paling baru
      }
    });

    // Jika kelas/sesinya belum dibuat oleh dosen, tolak
    if (!presensiSesiIni) {
      throw new Error('Sesi presensi tidak ditemukan untuk mata kuliah ini hari ini.');
    }

    // Jika sudah hadir, tidak perlu update lagi
    if (presensiSesiIni.statusKehadiran === 'Hadir') {
      throw new Error('Anda sudah tercatat Hadir pada sesi ini.');
    }

    // 3. Update status menjadi Hadir
    return await prisma.presensi.update({
      where: { idPresensi: presensiSesiIni.idPresensi },
      data: { statusKehadiran: 'Hadir' }
    });
  }
}