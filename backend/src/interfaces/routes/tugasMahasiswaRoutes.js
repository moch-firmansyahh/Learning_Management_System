import express from "express";
import { TugasMahasiswaController } from "../controllers/TugasMahasiswaController.js";
import { TugasMahasiswaUseCase } from "../../usecases/TugasMahasiswaUseCase.js";
import { PrismaTugasMahasiswaRepository } from "../../infrastucture/repositories/PrismaTugasMahasiswaRepository.js";

const router = express.Router();
const repository = new PrismaTugasMahasiswaRepository();
const useCase = new TugasMahasiswaUseCase(repository);
const controller = new TugasMahasiswaController(useCase);

router.get("/", (req, res) => controller.getMyTasks(req, res));
router.post("/:id/submit", (req, res) => controller.submitTask(req, res));

export default router;
