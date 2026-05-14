import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { prisma } from '../../../lib/prisma.ts';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    if (!req.user.mahasiswa?.nim) {
      return res.json([]);
    }
    const notifikasi = await prisma.notifikasi.findMany({
      where: { nim: req.user.mahasiswa.nim },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifikasi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    if (!req.user.mahasiswa?.nim) return res.json({ count: 0 });
    const count = await prisma.notifikasi.count({
      where: { nim: req.user.mahasiswa.nim, isRead: false }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:idNotifikasi/read', async (req, res) => {
  try {
    const { idNotifikasi } = req.params;
    const updated = await prisma.notifikasi.update({
      where: { idNotifikasi: parseInt(idNotifikasi) },
      data: { isRead: true }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/read-all', async (req, res) => {
  try {
    if (!req.user.mahasiswa?.nim) return res.json({ message: 'Tidak ada notifikasi' });
    await prisma.notifikasi.updateMany({
      where: { nim: req.user.mahasiswa.nim, isRead: false },
      data: { isRead: true }
    });
    res.json({ message: 'Semua notifikasi telah dibaca' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
