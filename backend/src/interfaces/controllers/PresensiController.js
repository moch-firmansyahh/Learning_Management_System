export class PresensiController {
  constructor(presensiUseCase) {
    this.presensiUseCase = presensiUseCase;
  }

  async getDaftarHadir(req, res) {
    try {
      const { idMataKuliah } = req.params;
      const data = await this.presensiUseCase.getDaftarHadir(parseInt(idMataKuliah));
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async scanQR(req, res) {
    try {
      const nim = req.user.nomorInduk; // Didapat dari authMiddleware
      const { idMataKuliah, token } = req.body;
      
      const result = await this.presensiUseCase.scanKehadiran(nim, parseInt(idMataKuliah), token);
      res.status(200).json({ status: 'success', message: 'Absen Berhasil!' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}