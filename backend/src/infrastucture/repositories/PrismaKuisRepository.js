import { prisma } from "../../../lib/prisma.ts";

export class PrismaKuisRepository {
  async getQuestionsById(idKuis) {
    return await prisma.kuis.findUnique({
      where: { idKuis: parseInt(idKuis, 10) },
      include: {
        soal: {
          include: {
            pilihanJawaban: true,
          },
          orderBy: { idSoal: "asc" },
        },
      },
    });
  }
}
