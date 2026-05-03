export class KelompokUseCase {
constructor(kelompokRepository) {
    this.kelompokRepository = kelompokRepository;
}

async getDaftarKelompok(idMataKuliah) {
    const kelompokData = await this.kelompokRepository.findByMataKuliah(idMataKuliah);
    
    // Formatting data agar sesuai dengan array INITIAL_GROUPS di frontend
    return kelompokData.map(k => {
        const membersArr = [];
        const nilaiObj = {};
        k.anggota.forEach(ang => {
        membersArr.push(ang.nim); // Simpan ID/NIM mahasiswa
        nilaiObj[ang.nim] = ang.nilaiTugas ? ang.nilaiTugas.toString() : "";
        });

    return {
        id: k.idKelompok,
        name: k.namaKelompok,
        color: k.warna,
        task: k.tugasName || "–",
        progress: k.progress,
        status: k.status,
        submitted: k.submitted,
        members: membersArr,
        nilai: nilaiObj
        };
    });
}

async createNewGroup(data) {
    if (!data.name || !data.idMataKuliah) throw new Error("Nama kelompok dan ID Mata Kuliah wajib diisi");
    return await this.kelompokRepository.createKelompok(data);
}

async addMember(idKelompok, nim) {
    return await this.kelompokRepository.addMember(idKelompok, nim);
}

async removeMember(idKelompok, nim) {
    return await this.kelompokRepository.removeMember(idKelompok, nim);
}

async saveGrades(idKelompok, grades) {
    return await this.kelompokRepository.updateGrades(idKelompok, grades);
}
}