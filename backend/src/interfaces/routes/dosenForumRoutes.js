import express from 'express';
import { PrismaForumDosenRepository } from '../../infrastucture/repositories/PrismaForumDosenRepository.js';
import { DosenForumUseCase } from '../../usecases/DosenForumUseCase.js';
import { DosenForumController } from '../controllers/DosenForumController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

// Setup file upload (opsional, jika Anda menggunakan multer)
// import multer from 'multer';
// const upload = multer({ dest: 'uploads/' }); 

const router = express.Router();
const repository = new PrismaForumDosenRepository();
const useCase = new DosenForumUseCase(repository);
const controller = new DosenForumController(useCase);

router.use(authMiddleware);

router.get('/mata-kuliah/:idMataKuliah', (req, res) => controller.getThreads(req, res));
router.post('/', /* upload.single('lampiran'), */ (req, res) => controller.createThread(req, res));
router.post('/:idForum/reply', (req, res) => controller.addReply(req, res));
router.post('/:idForum/like', (req, res) => controller.toggleLike(req, res));

export default router;