import { Router } from 'express';
import { AracYakitService } from '../services/arac-yakit.service';

const router = Router();
const yakitService = new AracYakitService();

/**
 * GET /api/arac-yakit
 * Get all fuel records with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const filters = req.query as any;
    const yakitlar = await yakitService.getAllYakit(filters);
    res.json(yakitlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-yakit/:id
 * Get fuel record by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const yakit = await yakitService.getYakitById(id);
    if (!yakit) {
      return res.status(404).json({ error: 'Fuel record not found' });
    }
    res.json(yakit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-yakit/arac/:idArac
 * Get fuel history for a vehicle
 */
router.get('/arac/:idArac', async (req, res) => {
  try {
    const idArac = parseInt(req.params.idArac);
    const yakitlar = await yakitService.getYakitGecmisi(idArac);
    res.json(yakitlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-yakit/arac/:idArac/rapor
 * Get fuel report for a vehicle
 */
router.get('/arac/:idArac/rapor', async (req, res) => {
  try {
    const idArac = parseInt(req.params.idArac);
    const rapor = await yakitService.getYakitRaporu(idArac);
    if (!rapor) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(rapor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-yakit/rapor/tum
 * Get fuel reports for all vehicles
 */
router.get('/rapor/tum', async (req, res) => {
  try {
    const raporlar = await yakitService.getAllYakitRaporu();
    res.json(raporlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/arac-yakit
 * Create new fuel record
 */
router.post('/', async (req, res) => {
  try {
    const yakit = await yakitService.createYakit(req.body);
    res.status(201).json(yakit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/arac-yakit/:id
 * Update fuel record
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const yakit = await yakitService.updateYakit(id, req.body);
    res.json(yakit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/arac-yakit/:id
 * Delete fuel record
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await yakitService.deleteYakit(id);
    res.json({ message: 'Fuel record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

