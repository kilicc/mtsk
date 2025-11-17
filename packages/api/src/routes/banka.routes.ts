import { Router } from 'express';
import { BankaService } from '../services/banka.service';

const router = Router();
const bankaService = new BankaService();

/**
 * GET /api/banka/hesaplar
 * Get all bank accounts
 */
router.get('/hesaplar', async (req, res) => {
  try {
    const hesaplar = await bankaService.getAllHesaplar();
    res.json(hesaplar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/banka/hesaplar/:id
 * Get bank account by ID
 */
router.get('/hesaplar/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    const hesap = await bankaService.getHesapById(id);
    if (!hesap) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(hesap);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/banka/hesaplar
 * Create new bank account
 */
router.post('/hesaplar', async (req, res) => {
  try {
    const hesap = await bankaService.createHesap(req.body);
    res.status(201).json(hesap);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/banka/islemler
 * Get bank transactions
 */
router.get('/islemler', async (req, res) => {
  try {
    const { id_banka_hesabi, tarih } = req.query;
    const filters: any = {};
    
    if (id_banka_hesabi) filters.id_banka_hesabi = parseInt(id_banka_hesabi as string);
    if (tarih) filters.tarih = tarih as string;

    const islemler = await bankaService.getIslemler(filters);
    res.json(islemler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/banka/islemler
 * Create new bank transaction
 */
router.post('/islemler', async (req, res) => {
  try {
    const islem = await bankaService.createIslem(req.body);
    res.status(201).json(islem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

