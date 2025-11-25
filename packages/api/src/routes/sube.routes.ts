import { Router, Request, Response } from 'express';
import { SubeService } from '../services/sube.service';

const router = Router();
const subeService = new SubeService();

/**
 * GET /api/sube
 * Get all subeler
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const subeler = await subeService.getAllSubeler();
    res.json(subeler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sube/:id
 * Get sube by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const sube = await subeService.getSubeById(id);
    if (!sube) {
      return res.status(404).json({ error: 'Sube not found' });
    }

    res.json(sube);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sube/kullanici/:kullaniciId
 * Get kullanici's subeler
 */
router.get('/kullanici/:kullaniciId', async (req: Request, res: Response) => {
  try {
    const kullaniciId = parseInt(req.params.kullaniciId);
    if (isNaN(kullaniciId)) {
      return res.status(400).json({ error: 'Invalid kullanici ID' });
    }

    const subeler = await subeService.getKullaniciSubeleri(kullaniciId);
    res.json(subeler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sube
 * Create sube
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const sube = await subeService.createSube(req.body);
    res.status(201).json(sube);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/sube/:id
 * Update sube
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const sube = await subeService.updateSube(id, req.body);
    res.json(sube);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/sube/:id
 * Delete sube
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await subeService.deleteSube(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

