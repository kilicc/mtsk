import { Router } from 'express';
import { KurumsalDersProgramiService } from '../services/kurumsal-ders-programi.service';

const router = Router();
const dersService = new KurumsalDersProgramiService();

/**
 * GET /api/kurumsal-ders-programi
 * Get all lessons with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const filters = req.query as any;
    const dersler = await dersService.getAllDersler(filters);
    res.json(dersler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kurumsal-ders-programi/:id
 * Get lesson by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ders = await dersService.getDersById(id);
    if (!ders) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(ders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kurumsal-ders-programi/yaklasan
 * Get upcoming lessons
 */
router.get('/yaklasan', async (req, res) => {
  try {
    const daysAhead = req.query.days ? parseInt(req.query.days as string) : 30;
    const dersler = await dersService.getYaklasanDersler(daysAhead);
    res.json(dersler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/kurumsal-ders-programi
 * Create new lesson
 */
router.post('/', async (req, res) => {
  try {
    const ders = await dersService.createDers(req.body);
    res.status(201).json(ders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/kurumsal-ders-programi/:id
 * Update lesson
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ders = await dersService.updateDers(id, req.body);
    res.json(ders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/kurumsal-ders-programi/:id
 * Delete lesson
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await dersService.deleteDers(id);
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kurumsal-ders-programi/kursiyer/:idKursiyer/rapor
 * Get lesson report for a kursiyer
 */
router.get('/kursiyer/:idKursiyer/rapor', async (req, res) => {
  try {
    const idKursiyer = parseInt(req.params.idKursiyer);
    const rapor = await dersService.getDersRaporu(idKursiyer);
    if (!rapor) {
      return res.status(404).json({ error: 'Kursiyer not found' });
    }
    res.json(rapor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kurumsal-ders-programi/rapor/tum
 * Get lesson reports for all kursiyers
 */
router.get('/rapor/tum', async (req, res) => {
  try {
    const raporlar = await dersService.getAllDersRaporu();
    res.json(raporlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

