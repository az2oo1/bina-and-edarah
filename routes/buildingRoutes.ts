import { Router } from 'express';
import { prisma, buildingService, auditService } from '../services/dbServices.js';

export const buildingRouter = Router();

// GET /api/admin/buildings
buildingRouter.get('/', async (req, res) => {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        units: {
          include: {
            rentHistory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(buildings);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch buildings' });
  }
});

// POST /api/admin/buildings
buildingRouter.post('/', async (req, res) => {
  try {
    const building = await buildingService.createBuilding(req.body);
    res.status(201).json(building);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create building' });
  }
});

// PUT /api/admin/buildings/:id
buildingRouter.put('/:id', async (req, res) => {
  try {
    const building = await buildingService.updateBuilding(req.params.id, req.body);
    res.json(building);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update building' });
  }
});

// DELETE /api/admin/buildings/:id
buildingRouter.delete('/:id', async (req, res) => {
  try {
    await buildingService.deleteBuilding(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete building' });
  }
});

// POST /api/admin/buildings/:id/sync-units
buildingRouter.post('/:id/sync-units', async (req, res) => {
  try {
    const { units } = req.body;
    if (!Array.isArray(units)) {
      return res.status(400).json({ error: 'units must be an array' });
    }
    const unitIds = await buildingService.syncBuildingUnits(req.params.id, units);
    res.json({ success: true, count: unitIds.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to sync building units' });
  }
});
