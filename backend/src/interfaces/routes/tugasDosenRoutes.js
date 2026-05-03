import express from 'express';
import { TugasDosenController } from '../controllers/TugasDosenController.js';
import { TugasDosenUseCase } from '../../usecases/TugasDosenUseCase.js';
import { PrismaTugasDosenRepository } from '../../infrastucture/repositories/PrismaTugasDosenRepository.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

const repository = new PrismaTugasDosenRepository();
const usecase = new TugasDosenUseCase(repository);
const controller = new TugasDosenController(usecase);

router.use(authMiddleware);

router.get('/', (req, res) => controller.getAllTugas(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.delete('/:id', (req, res) => controller.destroy(req, res));
router.post('/grades', (req, res) => controller.submitGrades(req, res));

export default router;