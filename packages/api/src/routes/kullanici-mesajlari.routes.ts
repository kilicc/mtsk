import { Router } from 'express';
import { KullaniciMesajlariService } from '../services/kullanici-mesajlari.service';

const router = Router();
const mesajService = new KullaniciMesajlariService();

/**
 * GET /api/kullanici-mesajlari/user/:idAlici
 * Get messages for a user
 */
router.get('/user/:idAlici', async (req, res) => {
  try {
    const idAlici = parseInt(req.params.idAlici);
    const mesajlar = await mesajService.getMessagesForUser(idAlici);
    res.json(mesajlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kullanici-mesajlari/user/:idAlici/unread
 * Get unread messages for a user
 */
router.get('/user/:idAlici/unread', async (req, res) => {
  try {
    const idAlici = parseInt(req.params.idAlici);
    const mesajlar = await mesajService.getUnreadMessages(idAlici);
    res.json(mesajlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kullanici-mesajlari/user/:idAlici/unread-count
 * Get unread message count
 */
router.get('/user/:idAlici/unread-count', async (req, res) => {
  try {
    const idAlici = parseInt(req.params.idAlici);
    const count = await mesajService.getUnreadCount(idAlici);
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kullanici-mesajlari/sent/:idGonderen
 * Get messages sent by a user
 */
router.get('/sent/:idGonderen', async (req, res) => {
  try {
    const idGonderen = parseInt(req.params.idGonderen);
    const mesajlar = await mesajService.getSentMessages(idGonderen);
    res.json(mesajlar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kullanici-mesajlari/:id
 * Get message by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const mesaj = await mesajService.getMessageById(id);
    if (!mesaj) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(mesaj);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/kullanici-mesajlari
 * Create new message
 */
router.post('/', async (req, res) => {
  try {
    const mesaj = await mesajService.createMessage(req.body);
    res.status(201).json(mesaj);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/kullanici-mesajlari/:id/read
 * Mark message as read
 */
router.put('/:id/read', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const mesaj = await mesajService.markAsRead(id);
    res.json(mesaj);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/kullanici-mesajlari/:id
 * Delete message (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await mesajService.deleteMessage(id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

