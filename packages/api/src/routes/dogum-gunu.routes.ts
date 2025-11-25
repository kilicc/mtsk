import { Router } from 'express';
import { DogumGunuService } from '../services/dogum-gunu.service';

const router = Router();
const dogumGunuService = new DogumGunuService();

/**
 * GET /api/dogum-gunu
 * Get all kursiyers with birthday information
 */
router.get('/', async (req, res) => {
  try {
    const kursiyerler = await dogumGunuService.getAllDogumGunuKursiyerler();
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/dogum-gunu/rapor
 * Get birthday report
 */
router.get('/rapor', async (req, res) => {
  try {
    const rapor = await dogumGunuService.getDogumGunuRaporu();
    res.json(rapor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/dogum-gunu/bugun
 * Get kursiyers with birthday today
 */
router.get('/bugun', async (req, res) => {
  try {
    const kursiyerler = await dogumGunuService.getBugunDogumGunu();
    res.json(kursiyerler);
  } catch (error: any) {
    console.error('Dogum gunu bugun error:', error.message);
    res.json([]);
  }
});

/**
 * GET /api/dogum-gunu/yaklasan
 * Get upcoming birthdays (default: 30 days)
 */
router.get('/yaklasan', async (req, res) => {
  try {
    const gunSayisi = req.query.gun ? parseInt(req.query.gun as string) : 30;
    const kursiyerler = await dogumGunuService.getYaklasanDogumGunleri(gunSayisi);
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

