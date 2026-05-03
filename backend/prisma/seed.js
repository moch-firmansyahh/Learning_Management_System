import { prisma } from "../lib/prisma.ts";  
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Memulai proses seeding data...');

  // 1. SEED ROLES
  const roles = [
    { id: 1, nama: 'ADMIN' },
    { id: 2, nama: 'MAHASISWA' },
    { id: 3, nama: 'DOSEN' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }


  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. SEED USERS & MAHASISWA (10 Data)
  const mahasiswaData = Array.from({ length: 10 }).map((_, i) => ({
    ni: `U00${i + 1}`.slice(-4),
    nama: `Mahasiswa ${i + 1}`,
    email: `mahasiswa${i + 1}@kampus.ac.id`,
    nim: `20260${i + 1}`.slice(-7)
  }));

  for (let i = 0; i < mahasiswaData.length; i++) {
    const m = mahasiswaData[i];
    await prisma.user.upsert({
      where: { nomorInduk: m.ni },
      update: {},
      create: {
        nomorInduk: m.ni,
        nama: m.nama,
        email: m.email,
        password: hashedPassword,
        telepon: `0812345678${i}`,
        roleId: 2,
        mahasiswa: { create: { nim: m.nim } }
      }
    });
  }

  // 3. SEED DOSEN (10 Data)
  const dosenData = Array.from({ length: 10 }).map((_, i) => ({
    ni: `D00${i + 1}`.slice(-4),
    nama: `Dr. Dosen ${i + 1}, M.Kom`,
    email: `dosen${i + 1}@kampus.ac.id`,
    nip: `1980010120100110${i + 1}`.slice(-18),
    nidn: `040101800${i + 1}`,
    bidang: 'Ilmu Komputer',
    ruangKantor: `Gedung A Ruang ${i + 1}`
  }));

  for (let i = 0; i < dosenData.length; i++) {
    const d = dosenData[i];
    await prisma.user.upsert({
      where: { nomorInduk: d.ni },
      update: {},
      create: {
        nomorInduk: d.ni,
        nama: d.nama,
        email: d.email,
        password: hashedPassword,
        telepon: `0819876543${d.ni.slice(-1)}`,
        roleId: 3,
        dosen: { 
          create: { 
            nip: d.nip, 
            nidn: d.nidn, 
            bidang: d.bidang, 
            ruangKantor: d.ruangKantor 
          } 
        }
      }
    });
  }

  // 4. SEED MATA KULIAH (10 Data)
  const matkul = [
    { id: 1, nama: 'Basis Data' },
    { id: 2, nama: 'Pemrograman Web' },
    { id: 3, nama: 'Kecerdasan Buatan' },
    { id: 4, nama: 'Jaringan Komputer' },
    { id: 5, nama: 'Algoritma dan Struktur Data' },
    { id: 6, nama: 'Sistem Operasi' },
    { id: 7, nama: 'Rekayasa Perangkat Lunak' },
    { id: 8, nama: 'Pemrograman Mobile' },
    { id: 9, nama: 'Keamanan Informasi' },
    { id: 10, nama: 'Machine Learning' },
  ];

  for (const mk of matkul) {
    await prisma.mataKuliah.upsert({
      where: { idMataKuliah: mk.id },
      update: {},
      create: { idMataKuliah: mk.id, namaMataKuliah: mk.nama }
    });
  }

  // 5. SEED NILAI (10 Data)
  const nilaiData = mahasiswaData.map((m, i) => ({
    nomorInduk: m.ni,
    idMataKuliah: (i % 10) + 1,
    nilaiTugas: 80 + i,
    nilaiKuis: 75 + i,
    nilaiAkhir: 77.5 + i,
    semester: 3
  }));
  await prisma.nilai.createMany({ data: nilaiData, skipDuplicates: true });

  // 6. SEED KUIS (10 Data)
  const kuisData = matkul.map((mk, i) => ({
    idMataKuliah: mk.id,
    judul: `Kuis ${mk.nama}`,
    deadlineKuis: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    skor: 100
  }));
  await prisma.kuis.createMany({ data: kuisData, skipDuplicates: true });

  // Ambil ID Kuis yang baru dibuat
  const kuisList = await prisma.kuis.findMany();

  // 7. SEED SOAL (10 Data)
  const soalData = kuisList.slice(0, 10).map((k, i) => ({
    idKuis: k.idKuis,
    pertanyaan: `Pertanyaan nomor 1 untuk kuis ${k.judul}?`,
    kunciJawaban: 'A',
    skor: 10
  }));
  await prisma.soal.createMany({ data: soalData, skipDuplicates: true });

  // Ambil ID Soal yang baru dibuat
  const soalList = await prisma.soal.findMany();

  // 8. SEED PILIHAN JAWABAN (10 Data)
  const pilihanData = soalList.slice(0, 10).map((s, i) => ({
    idSoal: s.idSoal,
    teksJawaban: `Pilihan A untuk soal ${s.idSoal}`
  }));
  await prisma.pilihanJawaban.createMany({ data: pilihanData, skipDuplicates: true });

  // 9. SEED FORUM DISKUSI (10 Data)
  const forumData = matkul.map((mk, i) => ({
    idMataKuliah: mk.id,
    judul: `Diskusi Minggu 1: ${mk.nama}`,
    isiForum: `Mari kita diskusikan materi pertama dari ${mk.nama}.`,
    nomorInduk: dosenData[i % 10].ni
  }));
  await prisma.forumDiskusi.createMany({ data: forumData, skipDuplicates: true });

  // Ambil ID Forum
  const forumList = await prisma.forumDiskusi.findMany();

  // 10. SEED KOMENTAR FORUM (10 Data)
  const komentarData = forumList.slice(0, 10).map((f, i) => ({
    nomorInduk: mahasiswaData[i % 10].ni,
    idForum: f.idForumDiskusi,
    isiKomentar: `Terima kasih Pak/Bu, materinya sangat jelas.`
  }));
  await prisma.komentarForum.createMany({ data: komentarData, skipDuplicates: true });

  // 11. SEED LIKE FORUM (10 Data)
  const likeData = forumList.slice(0, 10).map((f, i) => ({
    nomorInduk: mahasiswaData[(i + 1) % 10].ni,
    idForum: f.idForumDiskusi
  }));
  await prisma.likeForum.createMany({ data: likeData, skipDuplicates: true });

  // 12. SEED MODUL AJAR (10 Data)
  const modulData = matkul.map((mk, i) => ({
    idMataKuliah: mk.id,
    judul: `Modul Pengantar ${mk.nama}`,
    tipe_modul: i % 2 === 0 ? 'PDF' : 'Video',
    deskripsi: `Modul pengenalan untuk mata kuliah ${mk.nama}.`,
    url: i % 2 !== 0 ? 'https://youtube.com/link' : null,
    fileUrl: i % 2 === 0 ? '/uploads/modul1.pdf' : null,
    ukuran: '2MB',
    canDownload: true
  }));
  await prisma.modulAjar.createMany({ data: modulData, skipDuplicates: true });

  // 13. SEED KELOMPOK (10 Data)
  const kelompokData = matkul.map((mk, i) => ({
    idMataKuliah: mk.id,
    namaKelompok: `Kelompok ${i + 1} - ${mk.nama}`,
    warna: '#4b53bc',
    tugasName: `Proyek Akhir ${mk.nama}`,
    progress: 50,
    status: 'In Progress',
    submitted: false
  }));
  await prisma.kelompok.createMany({ data: kelompokData, skipDuplicates: true });

  const kelompokList = await prisma.kelompok.findMany();

  // Ambil data Mahasiswa yang sudah dibuat dari database
  const mahasiswaListFromDB = await prisma.mahasiswa.findMany();

  // 14. SEED ANGGOTA KELOMPOK (10 Data)
  const anggotaKelompokData = kelompokList.slice(0, 10).map((k, i) => ({
    idKelompok: k.idKelompok,
    nim: mahasiswaListFromDB[i % mahasiswaListFromDB.length].nim,
    nilaiTugas: 85.5
  }));
  await prisma.anggotaKelompok.createMany({ data: anggotaKelompokData, skipDuplicates: true });

  // 15. SEED TUGAS (10 Data)
  const tugasData = matkul.map((mk, i) => ({
    idMataKuliah: mk.id,
    nim: mahasiswaListFromDB[i % mahasiswaListFromDB.length].nim,
    judul: `Tugas Mandiri ${mk.nama}`,
    detailTugas: `Kerjakan latihan soal bab 1-3.`,
    deadlineTugas: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
  }));
  await prisma.tugas.createMany({ data: tugasData, skipDuplicates: true });

  const tugasList = await prisma.tugas.findMany();

  // 16. SEED PRESENSI (10 Data)
  const presensiData = mahasiswaListFromDB.slice(0, 10).map((m, i) => ({
    nim: m.nim,
    idMataKuliah: (i % 10) + 1,
    tanggalPertemuan: new Date(),
    statusKehadiran: 'Hadir'
  }));
  await prisma.presensi.createMany({ data: presensiData, skipDuplicates: true });

  // 17. SEED PROGRESS TUGAS (10 Data)
  const progressData = tugasList.slice(0, 10).map((t, i) => ({
    idMataKuliah: t.idMataKuliah,
    nim: t.nim,
    judul: `Progress - ${t.judul}`,
    detailTugas: `Sudah mengerjakan 50% bagian frontend.`,
    deadlineTugas: t.deadlineTugas
  }));
  await prisma.progressTugas.createMany({ data: progressData, skipDuplicates: true });

  // 18. SEED PENGUMPULAN TUGAS (10 Data)
  const pengumpulanData = tugasList.slice(0, 10).map((t, i) => ({
    idKelompok: kelompokList[i % 10].idKelompok,
    idTugas: t.idTugas,
    nim: t.nim,
    judul: `Submission: ${t.judul}`,
    detailTugas: `Berikut terlampir file jawaban.`,
    fileJawaban: `/uploads/jawaban_${t.nim}.pdf`
  }));
  await prisma.pengumpulanTugas.createMany({ data: pengumpulanData, skipDuplicates: true });

  console.log('✅ Seeding Selesai! Minimal 10 entri untuk setiap model (User, Mahasiswa, Dosen, Matkul, Kuis, Soal, Forum, Kelompok, Tugas, dll) telah terisi.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });