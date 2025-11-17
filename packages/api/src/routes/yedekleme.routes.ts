import { Router } from 'express';
import { YedeklemeService } from '../services/yedekleme.service';

const router = Router();
const yedeklemeService = new YedeklemeService();

/**
 * GET /api/yedekleme/ayarlar
 * Get yedekleme ayarları
 */
router.get('/ayarlar', async (req, res) => {
  try {
    const ayarlar = await yedeklemeService.getYedeklemeAyarlari();
    res.json(ayarlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/yedekleme/ayarlar
 * Update yedekleme ayarları
 */
router.put('/ayarlar', async (req, res) => {
  try {
    const ayarlar = await yedeklemeService.updateYedeklemeAyarlari(req.body);
    res.json(ayarlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/yedekleme/yap
 * Perform backup
 */
router.post('/yap', async (req, res) => {
  try {
    const yedeklemeTipi = req.body.tip || 'full';
    const yedekleme = await yedeklemeService.yedeklemeYap(yedeklemeTipi);
    res.status(201).json(yedekleme);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/yedekleme/gecmis
 * Get yedekleme geçmişi
 */
router.get('/gecmis', async (req, res) => {
  try {
    const gecmis = await yedeklemeService.getYedeklemeGecmisi();
    res.json(gecmis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/yedekleme/zamanlanmis-gorevler
 * Get zamanlanmış görevler
 */
router.get('/zamanlanmis-gorevler', async (req, res) => {
  try {
    const gorevler = await yedeklemeService.getZamanlanmisGorevler();
    res.json(gorevler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

