import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { KuisUseCase } from '../../usecases/KuisUseCase.js';
import { PrismaKuisRepository } from '../../infrastucture/repositories/PrismaKuisRepository.js';
import { PrismaNilaiRepository } from '../../infrastucture/repositories/PrismaNilaiRepository.js';
import { KuisController } from '../controllers/KuisController.js';

const router = express.Router();
const kuisRepo = new PrismaKuisRepository();
const nilaiRepo = new PrismaNilaiRepository();
const kuisUseCase = new KuisUseCase(kuisRepo, nilaiRepo);
const kuisController = new KuisController(kuisUseCase);

router.use(authMiddleware);

router.get('/:idKuis/soal', (req, res) => kuisController.getSoal(req, res));
router.post('/:idKuis/submit', (req, res) => kuisController.submit(req, res));

export default router;