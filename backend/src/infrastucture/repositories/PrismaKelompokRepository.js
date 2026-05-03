import { prisma } from "../../../lib/prisma.ts";

export class PrismaKelompokRepository {
async findByMataKuliah(idMataKuliah) {
    return await prisma.kelompok.findMany({
        where: { idMataKuliah: parseInt(idMataKuliah) },
        include: {
            anggota: {
            include: {
            mahasiswa: {
            include: { user: true }
            }
            }
        }
        }
    });
}

async createKelompok(data) {
    return await prisma.kelompok.create({
        data: {
            namaKelompok: data.name,
            warna: data.color,
            tugasName: data.task,
            progress: data.progress,
            status: data.status,
            submitted: data.submitted,
            idMataKuliah: parseInt(data.idMataKuliah)
        }
    });
}

async addMember(idKelompok, nim) {
    return await prisma.anggotaKelompok.create({
        data: {
            idKelompok: parseInt(idKelompok),
            nim: nim
        }
    });
}

async removeMember(idKelompok, nim) {
    return await prisma.anggotaKelompok.delete({
        where: {
        idKelompok_nim: {
            idKelompok: parseInt(idKelompok),
            nim: nim
            }
        }
    });
}

async updateGrades(idKelompok, gradesObj) {
    // gradesObj bentuknya { "S1": "85", "S2": "88" } -> key: nim, value: nilai
    const updates = Object.entries(gradesObj).map(([nim, nilai]) => {
        return prisma.anggotaKelompok.update({
            where: { idKelompok_nim: { idKelompok: parseInt(idKelompok), nim: nim } },
            data: { nilaiTugas: nilai === "" ? null : parseFloat(nilai) }
        });
    });
    return await prisma.$transaction(updates);
    }
}