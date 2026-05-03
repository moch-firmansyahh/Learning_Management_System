import express from 'express';
import { DashboardMahasiswaUseCase } from '../../usecases/DashboardMahasiswaUseCase.js';
import { DashboardController } from '../controllers/DashboardController.js';
import { PrismaMataKuliahRepository } from '../../infrastucture/repositories/PrismaMataKuliahReposiory.js';
import { PrismaForumRepository } from '../../infrastucture/repositories/PrismaForumRepository.js';

const router = express.Router();
const mataKuliahRepo = new PrismaMataKuliahRepository();
const forumRepo = new PrismaForumRepository();
const dashboardUseCase = new DashboardMahasiswaUseCase(mataKuliahRepo, forumRepo);
const dashboardController = new DashboardController(dashboardUseCase);

router.get('/mahasiswa', (req, res) => dashboardController.getMahasiswaDashboard(req, res));

export default router;