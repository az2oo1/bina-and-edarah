import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/lib/db.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size for base64 multi-image uploads
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  
  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await prisma.property.findUnique({
        where: { id: req.params.id }
      });
      if (!property) return res.status(404).json({ error: "Property not found" });
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const body = req.body;
      const newProperty = await prisma.property.create({
        data: {
          titleAr: body.titleAr,
          titleEn: body.titleEn,
          type: body.type,
          propertyCategory: body.propertyCategory || "VILLA",
          paymentFrequency: body.paymentFrequency || null,
          paymentsCount: body.paymentsCount ? parseInt(body.paymentsCount) : null,
          area: parseFloat(body.area) || 0,
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description,
          features: body.features || null,
          propertyAge: parseInt(body.propertyAge) || 0,
          electricityCost: parseFloat(body.electricityCost) || 0,
          electricityFrequency: body.electricityFrequency || null,
          vat: parseFloat(body.vat) || 0,
          commission: parseFloat(body.commission) || 0,
          price: parseFloat(body.price),
          imageUrls: body.imageUrls || "[]",
          aqarLink: body.aqarLink,
          userId: body.userId || null,
        }
      });
      res.status(201).json(newProperty);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const body = req.body;
      const updatedProperty = await prisma.property.update({
        where: { id: req.params.id },
        data: {
          titleAr: body.titleAr,
          titleEn: body.titleEn,
          type: body.type,
          propertyCategory: body.propertyCategory || "VILLA",
          paymentFrequency: body.paymentFrequency || null,
          paymentsCount: body.paymentsCount ? parseInt(body.paymentsCount) : null,
          area: parseFloat(body.area) || 0,
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description,
          features: body.features || null,
          propertyAge: parseInt(body.propertyAge) || 0,
          electricityCost: parseFloat(body.electricityCost) || 0,
          electricityFrequency: body.electricityFrequency || null,
          vat: parseFloat(body.vat) || 0,
          commission: parseFloat(body.commission) || 0,
          price: parseFloat(body.price),
          imageUrls: body.imageUrls || "[]",
          aqarLink: body.aqarLink,
          userId: body.userId || null,
        }
      });
      res.json(updatedProperty);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      await prisma.property.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await prisma.project.findUnique({
        where: { id: req.params.id }
      });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const body = req.body;
      const newProject = await prisma.project.create({
        data: {
          titleAr: body.titleAr,
          titleEn: body.titleEn,
          tier: body.tier || "OTHER",
          propertyCategory: body.propertyCategory || "VILLA",
          area: parseFloat(body.area) || 0,
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description,
          features: body.features || null,
          propertyAge: parseInt(body.propertyAge) || 0,
          imageUrls: body.imageUrls || "[]",
        }
      });
      res.status(201).json(newProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const body = req.body;
      const updatedProject = await prisma.project.update({
        where: { id: req.params.id },
        data: {
          titleAr: body.titleAr,
          titleEn: body.titleEn,
          tier: body.tier || "OTHER",
          propertyCategory: body.propertyCategory || "VILLA",
          area: parseFloat(body.area) || 0,
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description,
          features: body.features || null,
          propertyAge: parseInt(body.propertyAge) || 0,
          imageUrls: body.imageUrls || "[]",
        }
      });
      res.json(updatedProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      await prisma.project.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Settings
  app.get("/api/settings", async (req, res) => {
    try {
      let settings = await prisma.settings.findUnique({ where: { id: "global" } });
      if (!settings) {
        settings = await prisma.settings.create({ data: { id: "global", whatsappNumber: "966500000000", callingNumber: "966500000000", whatsappMessage: "مرحباً، أنا مهتم بهذا العقار: {title} - {link}" } });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const { whatsappNumber, callingNumber, whatsappMessage } = req.body;
      const settings = await prisma.settings.upsert({
        where: { id: "global" },
        update: { whatsappNumber, callingNumber, whatsappMessage },
        create: { id: "global", whatsappNumber, callingNumber, whatsappMessage }
      });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Users & Auth
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check Admin
      const admin = await prisma.admin.findUnique({ where: { username } });
      if (admin && admin.password === password) {
        return res.json({ id: admin.id, username: admin.username, role: 'ADMIN', name: 'Administrator' });
      }

      // Check User
      const user = await prisma.user.findUnique({ where: { username } });
      if (user && user.password === password) {
        return res.json({ id: user.id, username: user.username, role: 'USER', name: user.name });
      }

      // Hardcoded admin fallback for preview if DB is empty
      if (username === 'admin' && password === 'admin') {
        return res.json({ id: 'admin-fallback', username: 'admin', role: 'ADMIN', name: 'Administrator' });
      }

      res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, username: true, name: true }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { username, password, name } = req.body;
      const user = await prisma.user.create({
        data: { username, password, name }
      });
      res.json({ id: user.id, username: user.username, name: user.name });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await prisma.service.findMany();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const body = req.body;
      const newService = await prisma.service.create({
        data: {
          nameAr: body.nameAr,
          nameEn: body.nameEn,
          description: body.description,
        }
      });
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  // Analytics
  app.post("/api/analytics", async (req, res) => {
    try {
      const { path, propertyId } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || "").toString();

      if (ipAddress) {
        const existingView = await prisma.pageView.findFirst({
          where: {
            path,
            ipAddress
          }
        });
        if (existingView) {
          return res.json({ success: true, duplicate: true });
        }
      }

      await prisma.pageView.create({
        data: { path, propertyId, ipAddress }
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Analytics Error:", error);
      res.status(500).json({ error: "Failed to record view" });
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      const totalViews = await prisma.pageView.count();
      
      const propertiesViews = await prisma.pageView.groupBy({
        by: ['propertyId'],
        _count: {
          propertyId: true
        },
        where: {
          propertyId: {
            not: null
          }
        },
        orderBy: {
          _count: {
            propertyId: 'desc'
          }
        },
        take: 10
      });

      const pathsViews = await prisma.pageView.groupBy({
        by: ['path'],
        _count: {
          path: true
        },
        orderBy: {
          _count: {
            path: 'desc'
          }
        },
        take: 10
      });

      res.json({ totalViews, propertiesViews, pathsViews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
