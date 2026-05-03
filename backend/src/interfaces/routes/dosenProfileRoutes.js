import express from 'express';
import { PrismaDosenProfileRepository } from '../../infrastucture/repositories/PrismaDosenProfileRepository.js';
import { DosenProfileUseCase } from '../../usecases/DosenProfileUseCase.js';
import { DosenProfileController } from '../controllers/DosenProfileController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

const repository = new PrismaDosenProfileRepository();
const useCase = new DosenProfileUseCase(repository);
const controller = new DosenProfileController(useCase);

// Semua route di bawah authMiddleware wajib menyertakan header otorisasi [cite: 627]
router.use(authMiddleware);

router.get('/profile', (req, res) => controller.getProfile(req, res));
router.put('/profile', (req, res) => controller.updateProfile(req, res));
router.post('/profile/change-password', (req, res) => controller.changePassword(req, res));

export default router;