import express from 'express';
import { PrismaPresensiDosenRepository } from '../../infrastucture/repositories/PrismaPresensiDosenRepository.js';
import { PresensiDosenUseCase } from '../../usecases/PresensiDosenUseCase.js';
import { PresensiDosenController } from '../controllers/PresensiDosenController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Dependency Injection
const repository = new PrismaPresensiDosenRepository();
const usecase = new PresensiDosenUseCase(repository);
const controller = new PresensiDosenController(usecase);

// Semua rute presensi dilindungi middleware
router.use(authMiddleware);

router.get('/matkul/:idMataKuliah/daftar-hadir', (req, res) => controller.getDaftarHadir(req, res));
router.put('/:idPresensi/status', (req, res) => controller.updateStatus(req, res));

export default router;