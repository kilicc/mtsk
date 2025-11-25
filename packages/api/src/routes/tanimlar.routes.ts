import { Router } from 'express';
import { TanimlarService } from '../services/tanimlar.service';

const router = Router();
const tanimlarService = new TanimlarService();

// ==================== DÖNEM ŞUBE ROUTES ====================

/**
 * GET /api/tanimlar/donem-sube
 * Get all donem sube
 */
router.get('/donem-sube', async (req, res) => {
  try {
    const donemSubeler = await tanimlarService.getAllDonemSube();
    res.json(donemSubeler);
  } catch (error: any) {
    console.error('DonemSube getAll error:', error.message);
    res.json([]);
  }
});

/**
 * GET /api/tanimlar/donem-sube/:id
 * Get donem sube by ID
 */
router.get('/donem-sube/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const donemSube = await tanimlarService.getDonemSubeById(id);
    if (!donemSube) {
      return res.status(404).json({ error: 'Donem sube not found' });
    }
    res.json(donemSube);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/tanimlar/donem-sube
 * Create new donem sube
 */
router.post('/donem-sube', async (req, res) => {
  try {
    const donemSube = await tanimlarService.createDonemSube(req.body);
    res.status(201).json(donemSube);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/tanimlar/donem-sube/:id
 * Update donem sube
 */
router.put('/donem-sube/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const donemSube = await tanimlarService.updateDonemSube(id, req.body);
    res.json(donemSube);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/tanimlar/donem-sube/:id
 * Delete donem sube
 */
router.delete('/donem-sube/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await tanimlarService.deleteDonemSube(id);
    if (!success) {
      return res.status(404).json({ error: 'Donem sube not found' });
    }
    res.json({ message: 'Donem sube deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SINAV TARİHİ ROUTES ====================

/**
 * GET /api/tanimlar/sinav-tarihi
 * Get all sinav tarihi
 */
router.get('/sinav-tarihi', async (req, res) => {
  try {
    const sinavTarihleri = await tanimlarService.getAllSinavTarihi();
    res.json(sinavTarihleri);
  } catch (error: any) {
    console.error('SinavTarihi getAll error:', error.message);
    res.json([]);
  }
});

/**
 * GET /api/tanimlar/sinav-tarihi/:id
 * Get sinav tarihi by ID
 */
router.get('/sinav-tarihi/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sinavTarihi = await tanimlarService.getSinavTarihiById(id);
    if (!sinavTarihi) {
      return res.status(404).json({ error: 'Sinav tarihi not found' });
    }
    res.json(sinavTarihi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/tanimlar/sinav-tarihi
 * Create new sinav tarihi
 */
router.post('/sinav-tarihi', async (req, res) => {
  try {
    const sinavTarihi = await tanimlarService.createSinavTarihi(req.body);
    res.status(201).json(sinavTarihi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/tanimlar/sinav-tarihi/:id
 * Update sinav tarihi
 */
router.put('/sinav-tarihi/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sinavTarihi = await tanimlarService.updateSinavTarihi(id, req.body);
    res.json(sinavTarihi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/tanimlar/sinav-tarihi/:id
 * Delete sinav tarihi
 */
router.delete('/sinav-tarihi/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await tanimlarService.deleteSinavTarihi(id);
    if (!success) {
      return res.status(404).json({ error: 'Sinav tarihi not found' });
    }
    res.json({ message: 'Sinav tarihi deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

