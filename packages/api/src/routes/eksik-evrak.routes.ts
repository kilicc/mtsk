import { Router } from 'express';
import { EksikEvrakService } from '../services/eksik-evrak.service';

const router = Router();
const eksikEvrakService = new EksikEvrakService();

/**
 * GET /api/eksik-evrak
 * Get all kursiyers with missing documents
 */
router.get('/', async (req, res) => {
  try {
    const eksikEvraklar = await eksikEvrakService.getEksikEvraklar();
    res.json(eksikEvraklar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/eksik-evrak/rapor
 * Get detailed evrak status report for all kursiyers
 */
router.get('/rapor', async (req, res) => {
  try {
    const raporlar = await eksikEvrakService.getAllEvrakDurumRaporu();
    res.json(raporlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/eksik-evrak/kursiyer/:id
 * Get evrak status report for a specific kursiyer
 */
router.get('/kursiyer/:id', async (req, res) => {
  try {
    const idKursiyer = parseInt(req.params.id);
    const rapor = await eksikEvrakService.getEvrakDurumRaporu(idKursiyer);
    if (!rapor) {
      return res.status(404).json({ error: 'Kursiyer not found' });
    }
    res.json(rapor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

