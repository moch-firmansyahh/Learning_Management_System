export class KuisUseCase {
constructor(kuisRepository, nilaiRepository) {
    this.kuisRepository = kuisRepository;
    this.nilaiRepository = nilaiRepository;
}

async getQuestions(idKuis) {
    const kuis = await this.kuisRepository.getQuestionsById(idKuis);
    if (!kuis) throw new Error("Kuis tidak ditemukan");

    return {
      idKuis: kuis.idKuis,
      judul: kuis.judul,
      questions: kuis.soal.map((s) => ({
        id: s.idSoal,
        question: s.pertanyaan,
        options: s.pilihanJawaban.map((pilihan) => ({
          id: pilihan.idPilihan,
          text: pilihan.teksJawaban,
        })),
      })),
    };
}

async submitAnswers(nomorInduk, idKuis, studentAnswers) {
    const kuis = await this.kuisRepository.getQuestionsById(idKuis);
    if (!kuis) throw new Error("Kuis tidak ditemukan");
    if (!Array.isArray(studentAnswers)) {
      throw new Error("Format jawaban tidak valid");
    }

    const answerMap = new Map(
      studentAnswers.map((a) => [Number(a.questionId), Number(a.selectedOptionId)]),
    );

    let correctCount = 0;
    let answeredCount = 0;

    kuis.soal.forEach((soal) => {
      const selectedOptionId = answerMap.get(soal.idSoal);
      if (!selectedOptionId) return;
      answeredCount++;
      const selected = soal.pilihanJawaban.find((opt) => opt.idPilihan === selectedOptionId);
      if (selected && selected.teksJawaban === soal.kunciJawaban) {
        correctCount++;
      }
    });

    const totalQuestions = kuis.soal.length;
    const nilaiAkhir = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    await this.nilaiRepository.upsertNilaiKuis(nomorInduk, idKuis, nilaiAkhir);

    return {
        score: Math.round(nilaiAkhir),
        correctCount,
        wrongCount: Math.max(answeredCount - correctCount, 0),
        answeredCount,
        totalQuestions
    };
    }
}