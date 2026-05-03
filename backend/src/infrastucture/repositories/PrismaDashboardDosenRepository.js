import { prisma } from "../../../lib/prisma.ts";
export class PrismaDashboardDosenRepository {
  async getDosenInfo(nomorInduk) {
    return await prisma.dosen.findUnique({
      where: { nomorInduk },
      include: {
        user: true,
      }
    });
  }

  async getPendingTasks(nipDosen) {
    // Since MataKuliah doesn't have a direct nipDosen relation in the schema,
    // we fetch all tugas and return recent submissions as pending.
    try {
      return await prisma.pengumpulanTugas.findMany({
        include: {
          tugas: { include: { mataKuliah: true } },
          mahasiswa: { include: { user: true } },
          kelompok: true
        },
        orderBy: { deadlineTugas: 'asc' },
        take: 5
      });
    } catch (error) {
      console.error("getPendingTasks error:", error.message);
      return [];
    }
  }

  async getSchedule(nipDosen) {
    // Return all mata kuliah as schedule since no nipDosen relation exists
    try {
      return await prisma.mataKuliah.findMany({
        take: 5
      });
    } catch (error) {
      console.error("getSchedule error:", error.message);
      return [];
    }
  }

  async getTotalMahasiswa(nipDosen) {
    // Count unique students with nilai records
    try {
      const result = await prisma.nilai.groupBy({
        by: ['nomorInduk'],
      });
      return result.length;
    } catch (error) {
      console.error("getTotalMahasiswa error:", error.message);
      return 0;
    }
  }
}