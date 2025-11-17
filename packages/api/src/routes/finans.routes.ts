import { Router } from 'express';
import { FinansService } from '../services/finans.service';

const router = Router();
const finansService = new FinansService();

// ========== Muhasebe (Ödeme) Routes ==========

/**
 * GET /api/finans/muhasebe
 * Get all muhasebe records
 */
router.get('/muhasebe', async (req, res) => {
  try {
    const { id_kursiyer, kayit_durumu } = req.query;
    const filters: any = {};
    
    if (id_kursiyer) filters.id_kursiyer = parseInt(id_kursiyer as string);
    if (kayit_durumu !== undefined) filters.kayit_durumu = parseInt(kayit_durumu as string);

    const records = await finansService.getAllMuhasebe(filters);
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/finans/muhasebe/kursiyer/:id
 * Get muhasebe by kursiyer
 */
router.get('/muhasebe/kursiyer/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid kursiyer ID' });
    }

    const records = await finansService.getMuhasebeByKursiyer(id);
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/finans/muhasebe/overdue
 * Get overdue payments
 */
router.get('/muhasebe/overdue', async (req, res) => {
  try {
    const records = await finansService.getOverduePayments();
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/finans/muhasebe/kursiyer/:id/debt
 * Get total debt for kursiyer
 */
router.get('/muhasebe/kursiyer/:id/debt', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid kursiyer ID' });
    }

    const totalDebt = await finansService.getTotalDebt(id);
    res.json({ id_kursiyer: id, toplam_borc: totalDebt });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/finans/muhasebe
 * Create payment record
 */
router.post('/muhasebe', async (req, res) => {
  try {
    const record = await finansService.createOdeme(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /api/finans/muhasebe/:id/pay
 * Mark payment as paid
 */
router.post('/muhasebe/:id/pay', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const { odeme_tarihi } = req.body;
    const record = await finansService.markAsPaid(id, odeme_tarihi);
    res.json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ========== Fatura Routes ==========

/**
 * GET /api/finans/fatura
 * Get all invoices
 */
router.get('/fatura', async (req, res) => {
  try {
    const { id_kursiyer } = req.query;
    const filters: any = {};
    
    if (id_kursiyer) filters.id_kursiyer = parseInt(id_kursiyer as string);

    const invoices = await finansService.getAllFatura(filters);
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/finans/fatura/kursiyer/:id
 * Get invoices by kursiyer
 */
router.get('/fatura/kursiyer/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid kursiyer ID' });
    }

    const invoices = await finansService.getFaturaByKursiyer(id);
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/finans/fatura
 * Create invoice
 */
router.post('/fatura', async (req, res) => {
  try {
    const invoice = await finansService.createFatura(req.body);
    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ========== Kasa Raporları ==========

/**
 * GET /api/finans/kasa/daily?tarih=YYYY-MM-DD
 * Get daily cash report
 */
router.get('/kasa/daily', async (req, res) => {
  try {
    const { tarih } = req.query;
    const date = tarih ? new Date(tarih as string) : new Date();
    
    const report = await finansService.getDailyCashReport(date);
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== Borç Raporları ==========

/**
 * GET /api/finans/borc
 * Get debt report for all kursiyerler
 */
router.get('/borc', async (req, res) => {
  try {
    const report = await finansService.getDebtReport();
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

