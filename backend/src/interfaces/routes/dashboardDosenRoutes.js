import express from 'express';
import { PrismaDashboardDosenRepository } from '../../infrastucture/repositories/PrismaDashboardDosenRepository.js';
import { DashboardDosenUseCase } from '../../usecases/DashboardDosenUseCase.js';
import { DashboardDosenController } from '../controllers/DashboardDosenController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // Pastikan path sesuai

const router = express.Router();

// Dependency Injection
const repository = new PrismaDashboardDosenRepository();
const useCase = new DashboardDosenUseCase(repository);
const controller = new DashboardDosenController(useCase);

// Endpoint Terlindungi: Hanya Dosen yang login yang bisa akses
router.get('/', authMiddleware, controller.getDashboard);

export default router;