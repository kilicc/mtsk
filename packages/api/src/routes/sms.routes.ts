import { Router } from 'express';
import { SMSService } from '../services/sms.service';

const router = Router();
const smsService = new SMSService();

/**
 * POST /api/sms/send
 * Send SMS to a single phone number
 */
router.post('/send', async (req, res) => {
  try {
    const { telefon, mesaj } = req.body;

    if (!telefon || !mesaj) {
      return res.status(400).json({ error: 'Telefon ve mesaj zorunludur' });
    }

    if (mesaj.length > 160) {
      return res.status(400).json({ error: 'Mesaj 160 karakterden uzun olamaz' });
    }

    const result = await smsService.sendSMS(telefon, mesaj);
    
    if (result.success) {
      res.json({ success: true, messageId: result.messageId });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sms/bulk
 * Send bulk SMS to multiple phone numbers
 */
router.post('/bulk', async (req, res) => {
  try {
    const { telefonlar, mesaj } = req.body;

    if (!telefonlar || !Array.isArray(telefonlar) || telefonlar.length === 0) {
      return res.status(400).json({ error: 'Telefon listesi zorunludur' });
    }

    if (!mesaj) {
      return res.status(400).json({ error: 'Mesaj zorunludur' });
    }

    if (mesaj.length > 160) {
      return res.status(400).json({ error: 'Mesaj 160 karakterden uzun olamaz' });
    }

    const result = await smsService.sendBulkSMS(telefonlar, mesaj);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sms/debt-reminder
 * Send debt reminder SMS to all kursiyerler with overdue payments
 */
router.post('/debt-reminder', async (req, res) => {
  try {
    const { kursiyer_ids } = req.body;
    const result = await smsService.sendDebtReminderSMS(kursiyer_ids);
    res.json({
      success: result.success,
      failed: result.failed,
      message: `${result.success} SMS başarıyla gönderildi, ${result.failed} SMS gönderilemedi`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== SMS Şablon Routes ==========

/**
 * GET /api/sms/sablonlar
 * Get all SMS templates
 */
router.get('/sablonlar', async (req, res) => {
  try {
    const templates = await smsService.getAllTemplates();
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sms/sablonlar/aktif
 * Get active SMS templates
 */
router.get('/sablonlar/aktif', async (req, res) => {
  try {
    const templates = await smsService.getActiveTemplates();
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sms/sablonlar/:id
 * Get SMS template by ID
 */
router.get('/sablonlar/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const template = await smsService.getTemplateById(id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sms/sablonlar
 * Create SMS template
 */
router.post('/sablonlar', async (req, res) => {
  try {
    const template = await smsService.createTemplate(req.body);
    res.status(201).json(template);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/sms/sablonlar/:id
 * Update SMS template
 */
router.put('/sablonlar/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const template = await smsService.updateTemplate(id, req.body);
    res.json(template);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/sms/sablonlar/:id
 * Delete SMS template
 */
router.delete('/sablonlar/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await smsService.deleteTemplate(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ========== SMS Rapor Routes ==========

/**
 * GET /api/sms/raporlar
 * Get all SMS reports
 */
router.get('/raporlar', async (req, res) => {
  try {
    const { id_kursiyer, durum, baslangic_tarihi, bitis_tarihi } = req.query;
    const filters: any = {};
    
    if (id_kursiyer) filters.id_kursiyer = parseInt(id_kursiyer as string);
    if (durum) filters.durum = parseInt(durum as string);
    if (baslangic_tarihi) filters.baslangic_tarihi = baslangic_tarihi as string;
    if (bitis_tarihi) filters.bitis_tarihi = bitis_tarihi as string;

    const reports = await smsService.getAllReports(filters);
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

