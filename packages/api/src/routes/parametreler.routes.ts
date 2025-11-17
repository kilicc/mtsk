import { Router } from 'express';
import { ParametrelerService } from '../services/parametreler.service';
import { YetkilendirmeService } from '../services/yetkilendirme.service';

const router = Router();
const parametrelerService = new ParametrelerService();
const yetkilendirmeService = new YetkilendirmeService();

// ==================== PARAMETRELER ROUTES ====================

/**
 * GET /api/parametreler/genel
 * Get genel parametreler
 */
router.get('/genel', async (req, res) => {
  try {
    const parametreler = await parametrelerService.getGenelParametreler();
    res.json(parametreler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/parametreler/genel
 * Update genel parametreler
 */
router.put('/genel', async (req, res) => {
  try {
    const parametreler = await parametrelerService.updateGenelParametreler(req.body);
    res.json(parametreler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/parametreler/sms
 * Get SMS parametreleri
 */
router.get('/sms', async (req, res) => {
  try {
    const parametreler = await parametrelerService.getSMSParametreleri();
    res.json(parametreler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/parametreler/sms
 * Update SMS parametreleri
 */
router.put('/sms', async (req, res) => {
  try {
    const parametreler = await parametrelerService.updateSMSParametreleri(req.body);
    res.json(parametreler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== YETKİLENDİRME ROUTES ====================

/**
 * GET /api/parametreler/kullanici
 * Get all kullanici
 */
router.get('/kullanici', async (req, res) => {
  try {
    const kullanicilar = await yetkilendirmeService.getAllKullanici();
    res.json(kullanicilar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/parametreler/kullanici/:id
 * Get kullanici by ID
 */
router.get('/kullanici/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const kullanici = await yetkilendirmeService.getKullaniciById(id);
    if (!kullanici) {
      return res.status(404).json({ error: 'Kullanici not found' });
    }
    res.json(kullanici);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/parametreler/kullanici/:id/yetkiler
 * Get kullanici yetkileri
 */
router.get('/kullanici/:id/yetkiler', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const yetkiler = await yetkilendirmeService.getKullaniciYetkileri(id);
    res.json(yetkiler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/parametreler/kullanici/:id/yetkiler
 * Update kullanici yetkileri
 */
router.put('/kullanici/:id/yetkiler', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await yetkilendirmeService.updateKullaniciYetkileri(id, req.body);
    res.json({ message: 'Yetkiler updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/parametreler/kullanici/:id/permission/:parentid
 * Check if kullanici has permission
 */
router.get('/kullanici/:id/permission/:parentid', async (req, res) => {
  try {
    const idKullanici = parseInt(req.params.id);
    const parentid = parseInt(req.params.parentid);
    const hasPermission = await yetkilendirmeService.hasPermission(idKullanici, parentid);
    res.json({ hasPermission });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

