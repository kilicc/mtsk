import { Router } from 'express';
import multer from 'multer';
import { KursiyerService } from '../services/kursiyer.service';
import { supabase } from '../db/supabase';
import { subeMiddleware, SubeRequest } from '../middleware/sube.middleware';

const router = Router();
const kursiyerService = new KursiyerService();
const upload = multer({ storage: multer.memoryStorage() });

// Şube middleware'i tüm route'lara ekle
router.use(subeMiddleware);

/**
 * GET /api/kursiyer
 * Get all kursiyerler with optional filters
 */
router.get('/', async (req: SubeRequest, res) => {
  try {
    const { durum, id_grup } = req.query;
    const filters: any = {};
    
    if (durum) filters.durum = parseInt(durum as string);
    if (id_grup) filters.id_grup = parseInt(id_grup as string);

    const kursiyerler = await kursiyerService.getAll(filters, req.subeId);
    res.json(kursiyerler);
  } catch (error: any) {
    // Temporary: Return empty array if database error
    console.error('Kursiyer getAll error:', error.message);
    res.json([]);
  }
});

/**
 * GET /api/kursiyer/search?q=...
 * Search kursiyer by name
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const kursiyerler = await kursiyerService.search(q as string);
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer/active
 * Get active kursiyerler
 */
router.get('/active', async (req, res) => {
  try {
    const kursiyerler = await kursiyerService.getActive();
    res.json(kursiyerler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/kursiyer/:id
 * Get kursiyer by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const kursiyer = await kursiyerService.getById(id);
    if (!kursiyer) {
      return res.status(404).json({ error: 'Kursiyer not found' });
    }

    res.json(kursiyer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/kursiyer
 * Create new kursiyer
 */
router.post('/', async (req: SubeRequest, res) => {
  try {
    const kursiyer = await kursiyerService.create(req.body, req.subeId);
    res.status(201).json(kursiyer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/kursiyer/:id
 * Update kursiyer
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const kursiyer = await kursiyerService.update(id, req.body);
    res.json(kursiyer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/kursiyer/:id
 * Delete kursiyer (soft delete)
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    await kursiyerService.delete(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/kursiyer/photo
 * Upload kursiyer photo
 */
router.post('/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const kursiyerId = req.body.kursiyerId;
    
    // Generate unique filename
    const fileExt = file.originalname.split('.').pop();
    const fileName = kursiyerId 
      ? `kursiyer-${kursiyerId}-${Date.now()}.${fileExt}`
      : `kursiyer-temp-${Date.now()}.${fileExt}`;
    const filePath = `kursiyer-fotograflar/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('kursiyer-fotograflar')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Fotoğraf yükleme hatası: ' + error.message });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('kursiyer-fotograflar')
      .getPublicUrl(filePath);

    const photoUrl = urlData.publicUrl;

    // If kursiyerId provided, update kursiyer record
    if (kursiyerId) {
      try {
        await kursiyerService.update(parseInt(kursiyerId), { foto_url: photoUrl, foto: photoUrl });
      } catch (updateError) {
        console.error('Error updating kursiyer photo URL:', updateError);
        // Continue even if update fails
      }
    }

    res.json({ 
      url: photoUrl,
      path: filePath,
      message: 'Fotoğraf başarıyla yüklendi'
    });
  } catch (error: any) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: error.message || 'Fotoğraf yükleme hatası' });
  }
});

export default router;

