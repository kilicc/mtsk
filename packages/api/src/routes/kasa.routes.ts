import { Router } from 'express';
import { KasaService } from '../services/kasa.service';

const router = Router();
const kasaService = new KasaService();

// Kasa CRUD
router.get('/', async (req, res) => {
  try {
    const kasas = await kasaService.getAllKasas();
    res.json(kasas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const kasa = await kasaService.getKasaById(Number(req.params.id));
    if (!kasa) {
      return res.status(404).json({ error: 'Kasa bulunamadı' });
    }
    res.json(kasa);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const kasa = await kasaService.createKasa(req.body);
    res.status(201).json(kasa);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const kasa = await kasaService.updateKasa(Number(req.params.id), req.body);
    res.json(kasa);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await kasaService.deleteKasa(Number(req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Kasa İşlemleri
router.post('/islemi', async (req, res) => {
  try {
    const islem = await kasaService.createIslem(req.body);
    res.status(201).json(islem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/islemi', async (req, res) => {
  try {
    const { baslangic, bitis } = req.query;
    const islemler = await kasaService.getIslemlerByKasa(
      Number(req.params.id),
      baslangic as string,
      bitis as string
    );
    res.json(islemler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/gunluk-toplam', async (req, res) => {
  try {
    const { tarih } = req.query;
    const toplam = await kasaService.getDailyTotals(
      Number(req.params.id),
      (tarih as string) || new Date().toISOString().split('T')[0]
    );
    res.json(toplam);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Kasa Transfer
router.post('/transfer', async (req, res) => {
  try {
    const transfer = await kasaService.createTransfer(req.body);
    res.status(201).json(transfer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transfer/liste', async (req, res) => {
  try {
    const transfers = await kasaService.getTransfers();
    res.json(transfers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Kasa Toplamları
router.get('/rapor/toplamlar', async (req, res) => {
  try {
    const { tarih } = req.query;
    const toplamlar = await kasaService.getKasaToplamlari(tarih as string);
    res.json(toplamlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

