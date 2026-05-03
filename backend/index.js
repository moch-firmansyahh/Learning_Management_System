import express from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from "./src/interfaces/routes/userRoutes.js";
import mataKuliahRoutes from "./src/interfaces/routes/mataKuliahRoutes.js";
import nilaiRoutes from "./src/interfaces/routes/nilaiRoutes.js";
import { AuthUseCase } from "./src/usecases/AuthUseCase.js";
import { PrismaUserRepository } from "./src/infrastucture/repositories/PrismaUserRepository.js";
import { authMiddleware } from "./src/interfaces/middlewares/authMiddleware.js";
import authRoutes from "./src/interfaces/routes/authRoutes.js";
import presensiRoutes from "./src/interfaces/routes/presensiRoutes.js";
import dashboardRoutes from "./src/interfaces/routes/dashboardRoutes.js";
import forumRoutes from "./src/interfaces/routes/forumRoutes.js";
import kuisRoutes from "./src/interfaces/routes/kuisRoutes.js";
import dashboardDosenRoutes from "./src/interfaces/routes/dashboardDosenRoutes.js";
import dosenForumRoutes from "./src/interfaces/routes/dosenForumRoutes.js";
import kelompokRoutes from "./src/interfaces/routes/kelompokRoutes.js";
import modulAjarRoutes from "./src/interfaces/routes/modulAjarRoutes.js";
import presensiDosenRoutes from "./src/interfaces/routes/presensiDosenRoutes.js";
import dosenProfileRoutes from "./src/interfaces/routes/dosenProfileRoutes.js";
import tugasDosenRoutes from "./src/interfaces/routes/tugasDosenRoutes.js";
import tugasMahasiswaRoutes from "./src/interfaces/routes/tugasMahasiswaRoutes.js";

const app = express();
const PORT = process.env["PORT_APP"];

const userRepository = new PrismaUserRepository();
const authUseCase = new AuthUseCase(userRepository);

// CORS Configuration - Allow all localhost ports
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow localhost dan 127.0.0.1 pada port apapun
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow semua origin untuk development
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// 1. Endpoint Selamat Datang (Root)
app.get("/", (req, res) => {
  res.send("Selamat datang di LMS API! Server berjalan dengan baik.");
});

// 2. Endpoint Ping (Health Check)
app.get("/ping", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API bisa digunakan",
    timestamp: new Date().toISOString(),
  });
});

app.use(express.static("public"));

// --- UNPROTECTED ROUTES ---
// Auth routes harus SEBELUM userRoutes agar /api/auth/login tidak tertangkap /api route
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// --- PROTECTED ROUTES ---
// Semua route setelah baris ini akan melewati authMiddleware
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/mata-kuliah", authMiddleware, mataKuliahRoutes);
app.use("/api/presensi", authMiddleware, presensiRoutes);
app.use("/api/forum", authMiddleware, forumRoutes);
app.use("/api/kuis", authMiddleware, kuisRoutes);
app.use("/api/nilai", authMiddleware, nilaiRoutes);
app.use("/api/dosen/dashboard", authMiddleware, dashboardDosenRoutes);
app.use("/api/dosen/forum", authMiddleware, dosenForumRoutes);
app.use("/api/kelompok", authMiddleware, kelompokRoutes);
app.use("/api/modul-ajar", authMiddleware, modulAjarRoutes);
app.use("/api/dosen/presensi", authMiddleware, presensiDosenRoutes);
app.use("/api/dosen/profile", authMiddleware, dosenProfileRoutes);
app.use("/api/dosen/tugas", authMiddleware, tugasDosenRoutes);
app.use("/api/tugas", authMiddleware, tugasMahasiswaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
