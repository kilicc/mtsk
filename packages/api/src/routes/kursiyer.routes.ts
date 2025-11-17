import { Router } from 'express';
import { KursiyerService } from '../services/kursiyer.service';

const router = Router();
const kursiyerService = new KursiyerService();

/**
 * GET /api/kursiyer
 * Get all kursiyerler with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { durum, id_grup } = req.query;
    const filters: any = {};
    
    if (durum) filters.durum = parseInt(durum as string);
    if (id_grup) filters.id_grup = parseInt(id_grup as string);

    const kursiyerler = await kursiyerService.getAll(filters);
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer/search?q=...
 * Search kursiyer by name
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const kursiyerler = await kursiyerService.search(q as string);
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer/active
 * Get active kursiyerler
 */
router.get('/active', async (req, res) => {
  try {
    const kursiyerler = await kursiyerService.getActive();
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer/:id
 * Get kursiyer by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const kursiyer = await kursiyerService.getById(id);
    if (!kursiyer) {
      return res.status(404).json({ error: 'Kursiyer not found' });
    }

    res.json(kursiyer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/kursiyer
 * Create new kursiyer
 */
router.post('/', async (req, res) => {
  try {
    const kursiyer = await kursiyerService.create(req.body);
    res.status(201).json(kursiyer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/kursiyer/:id
 * Update kursiyer
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const kursiyer = await kursiyerService.update(id, req.body);
    res.json(kursiyer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/kursiyer/:id
 * Delete kursiyer (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await kursiyerService.delete(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

