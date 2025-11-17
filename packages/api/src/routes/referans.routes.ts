import { Router } from 'express';
import { ReferansService } from '../services/referans.service';

const router = Router();
const referansService = new ReferansService();

/**
 * GET /api/referans
 * Get all referans
 */
router.get('/', async (req, res) => {
  try {
    const referanslar = await referansService.getAllReferans();
    res.json(referanslar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/referans/:id
 * Get referans by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const referans = await referansService.getReferansById(id);
    if (!referans) {
      return res.status(404).json({ error: 'Referans not found' });
    }
    res.json(referans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/referans/search/:term
 * Search referans by name
 */
router.get('/search/:term', async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const referanslar = await referansService.searchReferans(searchTerm);
    res.json(referanslar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/referans
 * Create new referans
 */
router.post('/', async (req, res) => {
  try {
    const referans = await referansService.createReferans(req.body);
    res.status(201).json(referans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/referans/:id
 * Update referans
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const referans = await referansService.updateReferans(id, req.body);
    res.json(referans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/referans/:id
 * Delete referans
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await referansService.deleteReferans(id);
    res.json({ message: 'Referans deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/referans/:id/rapor
 * Get referans report
 */
router.get('/:id/rapor', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rapor = await referansService.getReferansRaporu(id);
    if (!rapor) {
      return res.status(404).json({ error: 'Referans not found' });
    }
    res.json(rapor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/referans/rapor/tum
 * Get all referans reports
 */
router.get('/rapor/tum', async (req, res) => {
  try {
    const raporlar = await referansService.getAllReferansRaporu();
    res.json(raporlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

