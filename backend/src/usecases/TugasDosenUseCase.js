import { TugasDosen } from '../domain/entities/TugasDosen.js';

export class TugasDosenUseCase {
constructor(tugasRepository) {
    this.tugasRepository = tugasRepository;
}

async getDaftarTugas(dosenIdMataKuliahList) {
    const rawData = await this.tugasRepository.findAllByDosen(dosenIdMataKuliahList);
    
    // Mapping data agar sesuai dengan state INITIAL_TASKS di frontend
    const formatTugas = rawData.tugas.map(t => ({
        id: t.idTugas,
        title: t.judul,
        matkul: t.mataKuliah.namaMataKuliah,
        desc: t.detailTugas,
        type: "Tugas", // Bisa disesuaikan Individu/Kelompok dari tabel lain
        deadline: t.deadlineTugas.toISOString().split('T')[0],
        submitted: t.pengumpulanTugas.length,
        total: 41, // Bisa dikalkulasi dari total mahasiswa di matkul tersebut
        status: new Date(t.deadlineTugas) < new Date() ? "Selesai" : "Aktif"
    }));

    return [...formatTugas]; // Gabungkan dengan mapping kuis jika diperlukan
}

async createTugasAtauKuis(payload) {
    const tugas = new TugasDosen(payload);
    tugas.isValid();

    if (payload.tipe === "Kuis") {
        return await this.tugasRepository.createKuis(payload, payload.quizData);
    } else {
        return await this.tugasRepository.createTugas(payload);
    }
}

async deleteTugas(id) {
    return await this.tugasRepository.deleteTugas(id);
}

async gradeTugas(grades) {
    // Format input { "1301210001": 80, "1301210002": 90 }
    const gradesData = Object.entries(grades.gradeInputs).map(([nomorInduk, nilai]) => ({
        nomorInduk,
        idMataKuliah: grades.idMataKuliah,
        nilaiTugas: nilai
    }));
    return await this.tugasRepository.saveGrades(gradesData);
    }
}