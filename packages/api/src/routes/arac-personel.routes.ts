import { Router } from 'express';
import { AracService, PersonelService } from '../services/arac-personel.service';

const router = Router();
const aracService = new AracService();
const personelService = new PersonelService();

// ==================== ARAÇ ROUTES ====================

/**
 * GET /api/arac-personel/arac
 * Get all vehicles with optional filters
 */
router.get('/arac', async (req, res) => {
  try {
    const filters = req.query as any;
    const vehicles = await aracService.getAllVehicles(filters);
    res.json(vehicles);
  } catch (error: any) {
    console.error('Arac getAll error:', error.message);
    res.json([]);
  }
});

/**
 * GET /api/arac-personel/arac/:id
 * Get vehicle by ID
 */
router.get('/arac/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await aracService.getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/arac/plaka/:plaka
 * Get vehicle by plaka
 */
router.get('/arac/plaka/:plaka', async (req, res) => {
  try {
    const vehicle = await aracService.getVehicleByPlaka(req.params.plaka);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/arac-personel/arac
 * Create new vehicle
 */
router.post('/arac', async (req, res) => {
  try {
    const vehicle = await aracService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/arac-personel/arac/:id
 * Update vehicle
 */
router.put('/arac/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await aracService.updateVehicle(id, req.body);
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/arac-personel/arac/:id
 * Delete vehicle (soft delete)
 */
router.delete('/arac/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await aracService.deleteVehicle(id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/arac/maintenance/due
 * Get vehicles needing maintenance
 */
router.get('/arac/maintenance/due', async (req, res) => {
  try {
    const daysAhead = req.query.days ? parseInt(req.query.days as string) : 30;
    const vehicles = await aracService.getMaintenanceDue(daysAhead);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/arac/insurance/expiring
 * Get vehicles with insurance expiring
 */
router.get('/arac/insurance/expiring', async (req, res) => {
  try {
    const daysAhead = req.query.days ? parseInt(req.query.days as string) : 30;
    const vehicles = await aracService.getInsuranceExpiring(daysAhead);
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/arac/status/report
 * Get vehicle status report
 */
router.get('/arac/status/report', async (req, res) => {
  try {
    const report = await aracService.getVehicleStatusReport();
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/arac/:id/maintenance
 * Get maintenance history for vehicle
 */
router.get('/arac/:id/maintenance', async (req, res) => {
  try {
    const idArac = parseInt(req.params.id);
    const history = await aracService.getMaintenanceHistory(idArac);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/arac-personel/arac/maintenance
 * Add maintenance record
 */
router.post('/arac/maintenance', async (req, res) => {
  try {
    const bakim = await aracService.addMaintenance(req.body);
    res.status(201).json(bakim);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/arac/maintenance/upcoming
 * Get upcoming maintenance
 */
router.get('/arac/maintenance/upcoming', async (req, res) => {
  try {
    const daysAhead = req.query.days ? parseInt(req.query.days as string) : 30;
    const bakim = await aracService.getUpcomingMaintenance(daysAhead);
    res.json(bakim);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PERSONEL ROUTES ====================

/**
 * GET /api/arac-personel/personel
 * Get all personnel with optional filters
 */
router.get('/personel', async (req, res) => {
  try {
    const filters = req.query as any;
    const personnel = await personelService.getAllPersonnel(filters);
    res.json(personnel);
  } catch (error: any) {
    console.error('Personel getAll error:', error.message);
    res.json([]);
  }
});

/**
 * GET /api/arac-personel/personel/:id
 * Get personnel by ID
 */
router.get('/personel/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const personel = await personelService.getPersonnelById(id);
    if (!personel) {
      return res.status(404).json({ error: 'Personnel not found' });
    }
    res.json(personel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/personel/search
 * Search personnel by name
 */
router.get('/personel/search', async (req, res) => {
  try {
    const searchTerm = req.query.q as string;
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term required' });
    }
    const personnel = await personelService.searchPersonnel(searchTerm);
    res.json(personnel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/arac-personel/personel
 * Create new personnel
 */
router.post('/personel', async (req, res) => {
  try {
    const personel = await personelService.createPersonnel(req.body);
    res.status(201).json(personel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/arac-personel/personel/:id
 * Update personnel
 */
router.put('/personel/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const personel = await personelService.updatePersonnel(id, req.body);
    res.json(personel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/arac-personel/personel/:id
 * Delete personnel (soft delete)
 */
router.delete('/personel/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await personelService.deletePersonnel(id);
    res.json({ message: 'Personnel deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/personel/active
 * Get active personnel
 */
router.get('/personel/active', async (req, res) => {
  try {
    const personnel = await personelService.getActivePersonnel();
    res.json(personnel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/arac-personel/personel/gorev/:gorev
 * Get personnel by gorev
 */
router.get('/personel/gorev/:gorev', async (req, res) => {
  try {
    const personnel = await personelService.getPersonnelByGorev(req.params.gorev);
    res.json(personnel);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

