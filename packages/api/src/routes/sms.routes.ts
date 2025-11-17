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
    const result = await smsService.sendDebtReminderSMS();
    res.json({
      success: result.success,
      failed: result.failed,
      message: `${result.success} SMS başarıyla gönderildi, ${result.failed} SMS gönderilemedi`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

