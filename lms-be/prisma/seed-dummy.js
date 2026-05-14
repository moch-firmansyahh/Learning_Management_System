// Seed file untuk dummy data Materi dan Kuis
// Jalankan: node prisma/seed-dummy.js

import { prisma } from '../src/prismaClient.js';

async function main() {
  console.log('🌱 Membuat dummy data...');

  // ID mata kuliah dari semester aktif (sesuaikan dengan database)
  const mataKuliahIds = [13, 14, 15, 16]; // Pemrograman Web, Kecerdasan Buatan, RPL, IMK

  // ====== DUMMY MATERI PDF ======
  console.log('📄 Membuat materi PDF...');
  
  const pdfMaterials = [
    {
      idMataKuliah: 13, // Pemrograman Web
      judul: 'Pengenalan HTML & CSS',
      tipe_modul: 'PDF',
      deskripsi: 'Modul dasar pembelajaran HTML dan CSS untuk pemula',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Dummy PDF dari W3C
      ukuran: '12 KB',
    },
    {
      idMataKuliah: 13,
      judul: 'JavaScript Fundamental',
      tipe_modul: 'PDF',
      deskripsi: 'Konsep dasar JavaScript modern (ES6+)',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      ukuran: '12 KB',
    },
    {
      idMataKuliah: 15, // Rekayasa Perangkat Lunak
      judul: 'UML Diagram Lengkap',
      tipe_modul: 'PDF',
      deskripsi: 'Panduan lengkap membuat diagram UML',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      ukuran: '12 KB',
    },
    {
      idMataKuliah: 14, // Kecerdasan Buatan
      judul: 'Machine Learning Basics',
      tipe_modul: 'PDF',
      deskripsi: 'Pengenalan konsep machine learning',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      ukuran: '12 KB',
    },
  ];

  for (const materi of pdfMaterials) {
    await prisma.modulAjar.upsert({
      where: { 
        idModulAjar: await getOrCreateId(prisma.modulAjar, { url: materi.url }, materi) 
      },
      update: materi,
      create: materi,
    });
  }

  // ====== DUMMY MATERI VIDEO ======
  console.log('🎥 Membuat materi Video...');
  
  const videoMaterials = [
    {
      idMataKuliah: 13,
      judul: 'Tutorial React.js Dasar',
      tipe_modul: 'Video',
      deskripsi: 'Video tutorial membuat aplikasi React dari nol',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      ukuran: 'N/A (Streaming)',
    },
    {
      idMataKuliah: 15,
      judul: 'Cara Membuat Use Case Diagram',
      tipe_modul: 'Video',
      deskripsi: 'Penjelasan lengkap use case diagram dengan contoh',
      url: 'https://www.youtube.com/embed/OkC7i2Xqx8o',
      ukuran: 'N/A (Streaming)',
    },
    {
      idMataKuliah: 14,
      judul: 'Neural Networks Explained',
      tipe_modul: 'Video',
      deskripsi: 'Penjelasan konsep neural network dengan animasi',
      url: 'https://www.youtube.com/embed/aircAruvnKk',
      ukuran: 'N/A (Streaming)',
    },
    {
      idMataKuliah: 16, // IMK
      judul: 'User Experience Design Principles',
      tipe_modul: 'Video',
      deskripsi: 'Prinsip dasar desain UX untuk aplikasi mobile',
      url: 'https://www.youtube.com/embed/QbTBoR7v9gg',
      ukuran: 'N/A (Streaming)',
    },
  ];

  for (const materi of videoMaterials) {
    await prisma.modulAjar.upsert({
      where: { 
        idModulAjar: await getOrCreateId(prisma.modulAjar, { url: materi.url }, materi) 
      },
      update: materi,
      create: materi,
    });
  }

  // ====== DUMMY KUIS DENGAN SOAL ======
  console.log('📝 Membuat Kuis dan Soal...');

  // Kuis 1: Pemrograman Web
  const kuis1 = await prisma.kuis.upsert({
    where: { idKuis: 1 },
    update: {},
    create: {
      idKuis: 1,
      idMataKuliah: 13,
      judul: 'Kuis HTML & CSS Dasar',
      deadlineKuis: new Date('2025-12-31T23:59:59'),
      skor: 100,
    },
  });

  // Soal untuk Kuis 1
  const soalKuis1 = [
    {
      pertanyaan: 'Tag HTML apa yang digunakan untuk membuat heading terbesar?',
      kunciJawaban: 'A',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: '<h1>' },
        { teksJawaban: '<h6>' },
        { teksJawaban: '<head>' },
        { teksJawaban: '<header>' },
      ],
    },
    {
      pertanyaan: 'Property CSS apa yang digunakan untuk mengubah warna teks?',
      kunciJawaban: 'B',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'text-color' },
        { teksJawaban: 'color' },
        { teksJawaban: 'font-color' },
        { teksJawaban: 'background-color' },
      ],
    },
    {
      pertanyaan: 'Tag HTML untuk membuat link adalah?',
      kunciJawaban: 'C',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: '<link>' },
        { teksJawaban: '<url>' },
        { teksJawaban: '<a>' },
        { teksJawaban: '<href>' },
      ],
    },
    {
      pertanyaan: 'Apa kepanjangan dari CSS?',
      kunciJawaban: 'A',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Cascading Style Sheets' },
        { teksJawaban: 'Computer Style Sheets' },
        { teksJawaban: 'Creative Style System' },
        { teksJawaban: 'Colorful Style Sheets' },
      ],
    },
  ];

  for (const soalData of soalKuis1) {
    const soal = await prisma.soal.create({
      data: {
        idKuis: kuis1.idKuis,
        pertanyaan: soalData.pertanyaan,
        kunciJawaban: soalData.kunciJawaban,
        skor: soalData.skor,
      },
    });

    for (const pilihan of soalData.pilihanJawaban) {
      await prisma.pilihanJawaban.create({
        data: {
          idSoal: soal.idSoal,
          teksJawaban: pilihan.teksJawaban,
        },
      });
    }
  }

  // Kuis 2: RPL
  const kuis2 = await prisma.kuis.upsert({
    where: { idKuis: 2 },
    update: {},
    create: {
      idKuis: 2,
      idMataKuliah: 15,
      judul: 'Kuis UML Diagram',
      deadlineKuis: new Date('2025-12-31T23:59:59'),
      skor: 100,
    },
  });

  const soalKuis2 = [
    {
      pertanyaan: 'Diagram UML apa yang menggambarkan interaksi aktor dengan sistem?',
      kunciJawaban: 'B',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Class Diagram' },
        { teksJawaban: 'Use Case Diagram' },
        { teksJawaban: 'Sequence Diagram' },
        { teksJawaban: 'Activity Diagram' },
      ],
    },
    {
      pertanyaan: 'Simbol aktor dalam Use Case Diagram digambarkan sebagai?',
      kunciJawaban: 'A',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Orang stick figure' },
        { teksJawaban: 'Kotak persegi' },
        { teksJawaban: 'Lingkaran' },
        { teksJawaban: 'Panah' },
      ],
    },
    {
      pertanyaan: 'Relasi <<include>> dalam Use Case Diagram berarti?',
      kunciJawaban: 'C',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Use case opsional' },
        { teksJawaban: 'Use case alternatif' },
        { teksJawaban: 'Use case wajib dipanggil' },
        { teksJawaban: 'Use case tidak berhubungan' },
      ],
    },
    {
      pertanyaan: 'Diagram apa yang menggambarkan alur aktivitas dalam sistem?',
      kunciJawaban: 'D',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Class Diagram' },
        { teksJawaban: 'Component Diagram' },
        { teksJawaban: 'Deployment Diagram' },
        { teksJawaban: 'Activity Diagram' },
      ],
    },
  ];

  for (const soalData of soalKuis2) {
    const soal = await prisma.soal.create({
      data: {
        idKuis: kuis2.idKuis,
        pertanyaan: soalData.pertanyaan,
        kunciJawaban: soalData.kunciJawaban,
        skor: soalData.skor,
      },
    });

    for (const pilihan of soalData.pilihanJawaban) {
      await prisma.pilihanJawaban.create({
        data: {
          idSoal: soal.idSoal,
          teksJawaban: pilihan.teksJawaban,
        },
      });
    }
  }

  // Kuis 3: Kecerdasan Buatan
  const kuis3 = await prisma.kuis.upsert({
    where: { idKuis: 3 },
    update: {},
    create: {
      idKuis: 3,
      idMataKuliah: 14,
      judul: 'Kuis Machine Learning Basics',
      deadlineKuis: new Date('2025-12-31T23:59:59'),
      skor: 100,
    },
  });

  const soalKuis3 = [
    {
      pertanyaan: 'Apa perbedaan utama supervised dan unsupervised learning?',
      kunciJawaban: 'B',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Jumlah data' },
        { teksJawaban: 'Ada/tidaknya label target' },
        { teksJawaban: 'Kecepatan komputer' },
        { teksJawaban: 'Bahasa pemrograman' },
      ],
    },
    {
      pertanyaan: 'Algoritma apa yang cocok untuk klasifikasi binary?',
      kunciJawaban: 'A',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Logistic Regression' },
        { teksJawaban: 'K-Means' },
        { teksJawaban: 'Apriori' },
        { teksJawaban: 'PCA' },
      ],
    },
    {
      pertanyaan: 'Overfitting terjadi ketika?',
      kunciJawaban: 'C',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Data terlalu sedikit' },
        { teksJawaban: 'Model terlalu sederhana' },
        { teksJawaban: 'Model terlalu kompleks untuk data training' },
        { teksJawaban: 'Tidak ada feature selection' },
      ],
    },
    {
      pertanyaan: 'Neural Network terdiri dari layer apa saja?',
      kunciJawaban: 'B',
      skor: 25,
      pilihanJawaban: [
        { teksJawaban: 'Input dan Output saja' },
        { teksJawaban: 'Input, Hidden, dan Output' },
        { teksJawaban: 'Hidden dan Output saja' },
        { teksJawaban: 'Input, Hidden, Output, dan Feedback' },
      ],
    },
  ];

  for (const soalData of soalKuis3) {
    const soal = await prisma.soal.create({
      data: {
        idKuis: kuis3.idKuis,
        pertanyaan: soalData.pertanyaan,
        kunciJawaban: soalData.kunciJawaban,
        skor: soalData.skor,
      },
    });

    for (const pilihan of soalData.pilihanJawaban) {
      await prisma.pilihanJawaban.create({
        data: {
          idSoal: soal.idSoal,
          teksJawaban: pilihan.teksJawaban,
        },
      });
    }
  }

  console.log('✅ Dummy data berhasil dibuat!');
  console.log(`📄 ${pdfMaterials.length} Materi PDF`);
  console.log(`🎥 ${videoMaterials.length} Materi Video`);
  console.log(`📝 3 Kuis dengan 12 Soal total`);
}

async function getOrCreateId(model, where, data) {
  const existing = await model.findFirst({ where });
  if (existing) return existing.idModulAjar;
  const created = await model.create({ data });
  return created.idModulAjar;
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
