import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { PrismaPresensiRepository } from '../../infrastucture/repositories/PrismaPresensiRepository.js';
import { PresensiUseCase } from '../../usecases/PresensiUseCase.js';
import { PresensiController } from '../controllers/PresensiController.js';

const router = express.Router();
const presensiRepo = new PrismaPresensiRepository();
const presensiUseCase = new PresensiUseCase(presensiRepo, null);
const controller = new PresensiController(presensiUseCase);

// Lindungi rute dengan token JWT
router.use(authMiddleware);

// Rute untuk Dosen
router.get('/mata-kuliah/:idMataKuliah', (req, res) => controller.getDaftarHadir(req, res));

// Rute untuk Mahasiswa (Scan)
router.post('/scan', (req, res) => controller.scanQR(req, res));

export default router;