export class KelompokController {
constructor(kelompokUseCase) {
    this.kelompokUseCase = kelompokUseCase;
}

async getKelompok(req, res) {
    try {
        const { idMataKuliah } = req.params;
        const data = await this.kelompokUseCase.getDaftarKelompok(idMataKuliah);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async createKelompok(req, res) {
    try {
        const result = await this.kelompokUseCase.createNewGroup(req.body);
        res.status(201).json({ message: "Kelompok berhasil dibuat", data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async addMember(req, res) {
    try {
        const { idKelompok } = req.params;
        const { nim } = req.body;
        await this.kelompokUseCase.addMember(idKelompok, nim);
        res.status(200).json({ message: "Anggota berhasil ditambahkan" });
    } catch (error) {
        res.status(400).json({ error: "Gagal menambah anggota (Mungkin sudah ada)" });
    }
}

async removeMember(req, res) {
    try {
        const { idKelompok, nim } = req.params;
        await this.kelompokUseCase.removeMember(idKelompok, nim);
        res.status(200).json({ message: "Anggota dikeluarkan" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async saveGrades(req, res) {
    try {
        const { idKelompok } = req.params;
        const { grades } = req.body; // Expects object: { "S1": "85", "S2": "90" }
        await this.kelompokUseCase.saveGrades(idKelompok, grades);
        res.status(200).json({ message: "Nilai berhasil disimpan" });
    } catch (error) {
        res.status(400).json({ error: error.message });
        }
    }
}