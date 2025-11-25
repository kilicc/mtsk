import { Router } from 'express';
import { DersProgramiService } from '../services/ders-programi.service';

const router = Router();
const dersProgramiService = new DersProgramiService();

// ========== Direksiyon Programı Routes ==========

/**
 * GET /api/ders-programi/direksiyon
 * Get all direksiyon programs
 */
router.get('/direksiyon', async (req, res) => {
  try {
    const { id_grup, id_personel } = req.query;
    const filters: any = {};
    
    if (id_grup) filters.id_grup = parseInt(id_grup as string);
    if (id_personel) filters.id_personel = parseInt(id_personel as string);

    const programs = await dersProgramiService.getAllDireksiyon(filters);
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ders-programi/direksiyon/:id
 * Get direksiyon program by ID
 */
router.get('/direksiyon/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const program = await dersProgramiService.getDireksiyonById(id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json(program);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ders-programi/direksiyon/kursiyer/:id
 * Get direksiyon programs by kursiyer
 */
router.get('/direksiyon/kursiyer/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid kursiyer ID' });
    }

    const programs = await dersProgramiService.getDireksiyonByKursiyer(id);
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ders-programi/direksiyon
 * Create direksiyon program
 */
router.post('/direksiyon', async (req, res) => {
  try {
    const program = await dersProgramiService.createDireksiyon(req.body);
    res.status(201).json(program);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/ders-programi/direksiyon/:id
 * Update direksiyon program
 */
router.put('/direksiyon/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const program = await dersProgramiService.updateDireksiyon(id, req.body);
    res.json(program);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/ders-programi/direksiyon/:id
 * Delete direksiyon program
 */
router.delete('/direksiyon/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await dersProgramiService.deleteDireksiyon(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== Teori Programı Routes ==========

/**
 * GET /api/ders-programi/teori
 * Get all teori programs
 */
router.get('/teori', async (req, res) => {
  try {
    const { id_grup_karti } = req.query;
    const filters: any = {};
    
    if (id_grup_karti) filters.id_grup_karti = parseInt(id_grup_karti as string);

    const programs = await dersProgramiService.getAllTeori(filters);
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ders-programi/teori/grup/:id
 * Get teori programs by grup
 */
router.get('/teori/grup/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid grup ID' });
    }

    const programs = await dersProgramiService.getTeoriByGrup(id);
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ders-programi/teori
 * Create teori program
 */
router.post('/teori', async (req, res) => {
  try {
    const program = await dersProgramiService.createTeori(req.body);
    res.status(201).json(program);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ========== MEBBİS Routes ==========

/**
 * GET /api/ders-programi/mebbis
 * Get MEBBİS programs
 */
router.get('/mebbis', async (req, res) => {
  try {
    const { ge_id_grup } = req.query;
    const filters: any = {};
    
    if (ge_id_grup) filters.ge_id_grup = parseInt(ge_id_grup as string);

    const programs = await dersProgramiService.getMebbisPrograms(filters);
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ders-programi/mebbis/export/:grupId
 * Export direksiyon programs to MEBBİS format
 */
router.post('/mebbis/export/:grupId', async (req, res) => {
  try {
    const grupId = parseInt(req.params.grupId);
    if (isNaN(grupId)) {
      return res.status(400).json({ error: 'Invalid grup ID' });
    }

    const mebbisPrograms = await dersProgramiService.exportToMebbis(grupId);
    res.status(201).json(mebbisPrograms);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/ders-programi/mebbis/:id/transferred
 * Mark MEBBİS program as transferred
 */
router.post('/mebbis/:id/transferred', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const program = await dersProgramiService.markMebbisAsTransferred(id);
    res.json(program);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ========== Otomatik Ders Programı Oluşturma ==========

/**
 * POST /api/ders-programi/otomatik/teorik
 * Otomatik teorik ders programı oluştur
 */
router.post('/otomatik/teorik', async (req, res) => {
  try {
    const { mebbisDonemi, grupBaslangicTarihi, egitimTuru } = req.body;

    if (!mebbisDonemi || !grupBaslangicTarihi) {
      return res.status(400).json({ error: 'MEBBİS dönemi ve grup başlangıç tarihi zorunludur' });
    }

    const result = await dersProgramiService.otomatikTeorikDersProgramiOlustur({
      mebbisDonemi,
      grupBaslangicTarihi,
      egitimTuru: egitimTuru || 'normal',
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/ders-programi/otomatik/uygulama
 * Otomatik uygulama ders programı oluştur (E-sınavdan geçenler için)
 */
router.post('/otomatik/uygulama', async (req, res) => {
  try {
    const { esinavTarihi, mebbisDonemi, programBaslamaTarihi } = req.body;

    if (!esinavTarihi || !programBaslamaTarihi) {
      return res.status(400).json({ error: 'E-sınav tarihi ve program başlama tarihi zorunludur' });
    }

    const result = await dersProgramiService.otomatikUygulamaDersProgramiOlustur({
      esinavTarihi,
      mebbisDonemi,
      programBaslamaTarihi,
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/ders-programi/esinav/tarihler
 * E-sınav tarihlerini getir
 */
router.get('/esinav/tarihler', async (req, res) => {
  try {
    const tarihler = await dersProgramiService.getESinavTarihleri();
    res.json(tarihler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/ders-programi/esinav/:tarih/gecenler
 * Belirli bir e-sınav tarihinde geçen kursiyerleri getir
 */
router.get('/esinav/:tarih/gecenler', async (req, res) => {
  try {
    const { tarih } = req.params;
    const kursiyerler = await dersProgramiService.getESinavGecenKursiyerler(tarih);
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

