import express from 'express';
import { PrismaForumRepository } from '../../infrastucture/repositories/PrismaForumRepository.js';
import { ForumUseCase } from '../../usecases/ForumUseCase.js';
import { ForumController } from '../controllers/ForumController.js';

const router = express.Router();
const forumRepo = new PrismaForumRepository();
const forumUseCase = new ForumUseCase(forumRepo);
const controller = new ForumController(forumUseCase);

router.get('/mata-kuliah/:idMataKuliah', (req, res) => controller.getThreads(req, res));
router.post('/create', (req, res) => controller.createThread(req, res));
router.post('/:idForum/reply', (req, res) => controller.addComment(req, res));

export default router;