import { prisma } from '../../prismaClient.js';
export class PrismaTugasDosenRepository {
async findAllByDosen(idMataKuliahList) {
    // Mengambil tugas dan kuis berdasarkan mata kuliah yang diajar dosen
    const tugas = await prisma.tugas.findMany({
        where: { idMataKuliah: { in: idMataKuliahList } },
        include: { mataKuliah: true, pengumpulanTugas: true }
    });
    
    const kuis = await prisma.kuis.findMany({
        where: { idMataKuliah: { in: idMataKuliahList } },
        include: { mataKuliah: true, soal: true }
    });

    return { tugas, kuis };
    }

async createTugas(data) {
    return await prisma.tugas.create({
    data: {
        idMataKuliah: parseInt(data.idMataKuliah),
        nim: data.nim || "system",
        judul: data.judul,
        detailTugas: data.deskripsi || data.detailTugas || "",
        deadlineTugas: new Date(data.deadlineTugas),
        }
    });
}

async createKuis(data, quizData) {
    // Menyimpan Kuis beserta Soal dan Pilihan Jawabannya
    return await prisma.kuis.create({
    data: {
        idMataKuliah: data.idMataKuliah,
        judul: data.judul,
        deadlineKuis: new Date(data.deadlineTugas),
        soal: {
            create: quizData.map((q) => ({
            pertanyaan: q.text,
            kunciJawaban: q.options[q.correctIndex],
            pilihanJawaban: {
                create: q.options.map((opt) => ({
                teksJawaban: opt
                }))
            }
            }))
        }
        }
    });
}

async deleteTugas(idTugas) {
    return await prisma.tugas.delete({
        where: { idTugas: parseInt(idTugas) }
    });
}
async saveGrades(gradesData) {
    // Menyimpan nilai ke tabel Nilai
    // gradesData adalah array objek { nomorInduk, idMataKuliah, nilaiTugas }
    const updates = gradesData.map(grade => 
        prisma.nilai.updateMany({
        where: { nomorInduk: grade.nomorInduk, idMataKuliah: grade.idMataKuliah },
        data: { nilaiTugas: parseFloat(grade.nilaiTugas) }
        })
    );
    return await prisma.$transaction(updates);
    }
}