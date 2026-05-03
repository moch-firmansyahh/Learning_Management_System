export class NilaiController {

  constructor(nilaiUseCase, transkripUseCase) {
    this.nilaiUseCase = nilaiUseCase;
    this.transkripUseCase = transkripUseCase;
  }

  async create(req, res) {
    try {
      const result = await this.nilaiUseCase.inputNilai(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByMahasiswa(req, res) {
    try {
      const result = await this.nilaiUseCase.getNilaiMahasiswa(req.params.nomorInduk);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await this.nilaiUseCase.updateNilai(id, req.body);
      
      res.json({
        message: "Nilai berhasil diperbarui dan dikalkulasi ulang",
        data: result
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async getTranskrip(req, res) {
    try {
      const nomorInduk = req.user.nomorInduk; 
      const transkrip = await this.transkripUseCase.execute(nomorInduk);
      res.status(200).json({ status: 'success', data: transkrip });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}