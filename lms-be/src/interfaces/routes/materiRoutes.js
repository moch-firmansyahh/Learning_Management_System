import express from 'express';
import { MateriUseCase } from '../../usecases/MateriUseCase.js';
import { MateriController } from '../controllers/MateriController.js';
import { prisma } from '../../../src/prismaClient.js';

const router = express.Router();
const materiUseCase = new MateriUseCase(prisma);
const materiController = new MateriController(materiUseCase);

// Get materi with progress status
router.get('/mata-kuliah/:idMataKuliah', (req, res) => 
  materiController.getMateriWithProgress(req, res)
);

// Mark materi as accessed (download/view)
router.post('/:idModulAjar/access', (req, res) => 
  materiController.markAsAccessed(req, res)
);

// Get progress summary
router.get('/mata-kuliah/:idMataKuliah/progress', (req, res) => 
  materiController.getProgressSummary(req, res)
);

export default router;
