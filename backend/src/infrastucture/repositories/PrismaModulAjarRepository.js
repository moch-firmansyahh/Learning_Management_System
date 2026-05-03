import { prisma } from "../../prismaClient.js";
export class PrismaModulAjarRepository {
async findAllByDosen(filterMatkul, filterTipe) {
    const where = {};
    if (filterMatkul && filterMatkul !== "Semua") {
        where.idMataKuliah = parseInt(filterMatkul);
    }
    if (filterTipe && filterTipe !== "Semua") {
        where.tipe_modul = filterTipe;
    }

    return await prisma.modulAjar.findMany({
        where,
        include: { mataKuliah: true },
        orderBy: { tanggal: 'desc' }
    });
}

async create(data) {
    return await prisma.modulAjar.create({
        data: {
            idMataKuliah: parseInt(data.idMataKuliah),
            judul: data.judul,
            tipe_modul: data.tipe_modul,
            deskripsi: data.deskripsi,
            url: data.url,
            fileUrl: data.fileUrl,
            ukuran: data.ukuran,
            diunduh: 0,
            canDownload: data.canDownload === 'true' || data.canDownload === true,
        }
    });
}

async update(id, data) {
    return await prisma.modulAjar.update({
        where: { idModulAjar: parseInt(id) },
        data
    });
}

async delete(id) {
    return await prisma.modulAjar.delete({
        where: { idModulAjar: parseInt(id) }
    });
}

async incrementDownload(id) {
    return await prisma.modulAjar.update({
        where: { idModulAjar: parseInt(id) },
        data: { diunduh: { increment: 1 } }
        });
    }
}