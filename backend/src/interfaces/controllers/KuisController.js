export class KuisController {
  constructor(kuisUseCase) {
    this.kuisUseCase = kuisUseCase;
  }

  async getSoal(req, res) {
    try {
      const { idKuis } = req.params;
      const data = await this.kuisUseCase.getQuestions(idKuis);
      res.status(200).json({ status: "success", data });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  async submit(req, res) {
    try {
      const { idKuis } = req.params;
      const nomorInduk = req.user?.nomorInduk;
      const answers = req.body?.answers || [];
      const data = await this.kuisUseCase.submitAnswers(nomorInduk, idKuis, answers);
      res.status(200).json({ status: "success", data });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}
