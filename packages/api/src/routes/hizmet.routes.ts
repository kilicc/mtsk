import { Router } from 'express';
import { HizmetService } from '../services/hizmet.service';

const router = Router();
const hizmetService = new HizmetService();

/**
 * GET /api/hizmet
 * Get all services
 */
router.get('/', async (req, res) => {
  try {
    const hizmetler = await hizmetService.getAllHizmetler();
    res.json(hizmetler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/hizmet/:id
 * Get service by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid service ID' });
    }

    const hizmet = await hizmetService.getHizmetById(id);
    if (!hizmet) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(hizmet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/hizmet
 * Create new service
 */
router.post('/', async (req, res) => {
  try {
    const hizmet = await hizmetService.createHizmet(req.body);
    res.status(201).json(hizmet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/hizmet/:id
 * Update service
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid service ID' });
    }

    const hizmet = await hizmetService.updateHizmet(id, req.body);
    res.json(hizmet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/hizmet/:id
 * Delete service (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid service ID' });
    }

    await hizmetService.deleteHizmet(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

