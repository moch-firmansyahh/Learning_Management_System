export class TugasMahasiswaController {
  constructor(useCase) {
    this.useCase = useCase;
  }

  async getMyTasks(req, res) {
    try {
      const nomorInduk = req.user?.nomorInduk;
      const { idMataKuliah } = req.query;
      const data = await this.useCase.getMyTasks(nomorInduk, idMataKuliah);
      res.status(200).json({ status: "success", data });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async submitTask(req, res) {
    try {
      const nomorInduk = req.user?.nomorInduk;
      const { id } = req.params;
      const { fileJawaban } = req.body;
      const data = await this.useCase.submitTugas(id, nomorInduk, fileJawaban);
      res.status(200).json({ status: "success", message: "Tugas berhasil dikumpulkan", data });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}
