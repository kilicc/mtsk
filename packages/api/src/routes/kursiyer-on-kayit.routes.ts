import { Router } from 'express';
import { KursiyerOnKayitService } from '../services/kursiyer-on-kayit.service';

const router = Router();
const onKayitService = new KursiyerOnKayitService();

/**
 * GET /api/kursiyer-on-kayit
 * Get all pre-registrations with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const filters = req.query as any;
    const onKayitlar = await onKayitService.getAllOnKayit(filters);
    res.json(onKayitlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer-on-kayit/pending
 * Get pending pre-registrations
 */
router.get('/pending', async (req, res) => {
  try {
    const onKayitlar = await onKayitService.getPendingOnKayit();
    res.json(onKayitlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer-on-kayit/:id
 * Get pre-registration by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const onKayit = await onKayitService.getOnKayitById(id);
    if (!onKayit) {
      return res.status(404).json({ error: 'Pre-registration not found' });
    }
    res.json(onKayit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/kursiyer-on-kayit
 * Create new pre-registration
 */
router.post('/', async (req, res) => {
  try {
    const onKayit = await onKayitService.createOnKayit(req.body);
    res.status(201).json(onKayit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/kursiyer-on-kayit/:id
 * Update pre-registration
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const onKayit = await onKayitService.updateOnKayit(id, req.body);
    res.json(onKayit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/kursiyer-on-kayit/:id
 * Delete pre-registration (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await onKayitService.deleteOnKayit(id);
    res.json({ message: 'Pre-registration deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/kursiyer-on-kayit/:id/convert
 * Convert pre-registration to full registration (Kesin Kayıt)
 */
router.post('/:id/convert', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const additionalData = req.body; // Additional data to add to kursiyer
    const kursiyer = await onKayitService.convertToKesinKayit(id, additionalData);
    res.status(201).json({ 
      message: 'Pre-registration converted to full registration successfully',
      kursiyer 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer-on-kayit/search/:term
 * Search pre-registrations
 */
router.get('/search/:term', async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const onKayitlar = await onKayitService.searchOnKayit(searchTerm);
    res.json(onKayitlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

