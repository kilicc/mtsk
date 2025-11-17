import { Router } from 'express';
import { CariFirmaService } from '../services/cari-firma.service';

const router = Router();
const cariFirmaService = new CariFirmaService();

/**
 * GET /api/cari-firma
 * Get all firms
 */
router.get('/', async (req, res) => {
  try {
    const firmalar = await cariFirmaService.getAllFirmalar();
    res.json(firmalar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/cari-firma/:id
 * Get firm by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid firm ID' });
    }

    const firma = await cariFirmaService.getFirmaById(id);
    if (!firma) {
      return res.status(404).json({ error: 'Firm not found' });
    }

    res.json(firma);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/cari-firma
 * Create new firm
 */
router.post('/', async (req, res) => {
  try {
    const firma = await cariFirmaService.createFirma(req.body);
    res.status(201).json(firma);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/cari-firma/:id
 * Update firm
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid firm ID' });
    }

    const firma = await cariFirmaService.updateFirma(id, req.body);
    res.json(firma);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/cari-firma/:id
 * Delete firm (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid firm ID' });
    }

    await cariFirmaService.deleteFirma(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

