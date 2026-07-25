import { Router } from 'express';
import { prisma, propertyService, auditService } from '../services/dbServices.js';

export const propertyRouter = Router();

// Middleware placeholder for permission check (or pass in app context)
const requirePermission = (permission: string) => (req: any, res: any, next: any) => next();

// GET /api/properties
propertyRouter.get('/', async (req, res) => {
  try {
    const { category, type, search, status } = req.query;
    const where: any = {};

    if (category && category !== 'ALL') {
      where.propertyCategory = category as string;
    }
    if (type && type !== 'ALL') {
      where.type = type as string;
    }
    if (status) {
      where.status = status as string;
    }
    if (search) {
      const searchTerm = search as string;
      where.OR = [
        { titleAr: { contains: searchTerm } },
        { titleEn: { contains: searchTerm } },
        { locationText: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ];
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { subProperties: true },
    });

    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id
propertyRouter.get('/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { subProperties: true },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch property' });
  }
});

// POST /api/properties
propertyRouter.post('/', async (req, res) => {
  try {
    const property = await propertyService.createProperty(req.body);
    
    // Audit log
    const user = (req as any).user || { id: 'admin', name: 'Admin', role: 'ADMIN' };
    await auditService.logAction(user.id, user.name, user.role, 'ADD_PROPERTY', `Added property ${property.titleAr || property.id}`);

    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create property' });
  }
});

// PUT /api/properties/:id
propertyRouter.put('/:id', async (req, res) => {
  try {
    const property = await propertyService.updateProperty(req.params.id, req.body);
    
    const user = (req as any).user || { id: 'admin', name: 'Admin', role: 'ADMIN' };
    await auditService.logAction(user.id, user.name, user.role, 'UPDATE_PROPERTY', `Updated property ${property.titleAr || property.id}`);

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update property' });
  }
});

// DELETE /api/properties/:id
propertyRouter.delete('/:id', async (req, res) => {
  try {
    await propertyService.deleteProperty(req.params.id);
    
    const user = (req as any).user || { id: 'admin', name: 'Admin', role: 'ADMIN' };
    await auditService.logAction(user.id, user.name, user.role, 'DELETE_PROPERTY', `Deleted property ${req.params.id}`);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete property' });
  }
});
