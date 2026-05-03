import express from 'express';
import { NilaiController } from '../controllers/NilaiController.js';
import { NilaiUseCase } from '../../usecases/NilaiUseCase.js';
import { PrismaNilaiRepository } from '../../infrastucture/repositories/PrismaNilaiRepository.js';
import { GetTranskripUsecase } from '../../usecases/GetTranskripUsecase.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
const repo = new PrismaNilaiRepository();
const nilaiUseCase = new NilaiUseCase(repo);
const transkripUseCase = new GetTranskripUsecase(repo);
const controller = new NilaiController(nilaiUseCase, transkripUseCase);

router.post('/', (req, res) => controller.create(req, res));
router.get('/:nomorInduk', (req, res) => controller.getByMahasiswa(req, res));
router.patch('/:id', (req, res) => controller.update(req, res));
router.get('/transkrip/mahasiswa', authMiddleware, (req, res) => controller.getTranskrip(req, res));

export default router;