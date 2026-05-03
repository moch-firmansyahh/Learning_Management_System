import { prisma } from '../../prismaClient.js';
export class PrismaDosenProfileRepository {
async getProfile(nomorInduk) {
    return await prisma.user.findUnique({
        where: { nomorInduk },
        include: {
            dosen: true,
        },
    });
}

async updateProfile(nomorInduk, data) {
    // Memperbarui User (email, telepon) dan Dosen (bidang, ruangKantor) sekaligus
    return await prisma.user.update({
        where: { nomorInduk },
        data: {
        email: data.email,
        telepon: data.telepon,
        dosen: {
            update: {
            bidang: data.bidang,
            ruangKantor: data.officeRoom,
            }
        }
    },
        include: { dosen: true }
    });
}

async updatePassword(nomorInduk, newHashedPassword) {
    return await prisma.user.update({
        where: { nomorInduk },
        data: { password: newHashedPassword }
    });
    }
}