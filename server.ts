import "dotenv/config";
import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/lib/db.js";
import { fetchTechHubProperties, fetchTechHubContracts } from "./src/lib/techhub.js";
import fs from "fs";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { createRequire } from "module";
const cjsRequire = typeof module !== "undefined" && typeof require !== "undefined"
  ? require
  : createRequire(typeof import.meta !== "undefined" && (import.meta as any).url ? (import.meta as any).url : `file://${typeof __filename !== "undefined" ? __filename : ""}`);
const archiver = cjsRequire("archiver");
import multer from "multer";
import AdmZip from "adm-zip";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const JWT_SECRET = process.env.JWT_SECRET || "bina-edara-jwt-secret-key-1337";

const LOG_FILE = fs.existsSync('/data') 
  ? '/data/server.log' 
  : path.resolve(process.cwd(), 'server.log');

const logger = {
  info: (msg: string, ...meta: any[]) => {
    const time = new Date().toISOString();
    const logMsg = `[${time}] [INFO] ${msg} ${meta.length ? JSON.stringify(meta) : ""}\n`;
    console.log(logMsg.trim());
    try {
      fs.appendFileSync(LOG_FILE, logMsg);
    } catch (e) {
      console.error("Failed to write to log file", e);
    }
  },
  error: (msg: string, ...meta: any[]) => {
    const time = new Date().toISOString();
    const logMsg = `[${time}] [ERROR] ${msg} ${meta.length ? JSON.stringify(meta) : ""}\n`;
    console.error(logMsg.trim());
    try {
      fs.appendFileSync(LOG_FILE, logMsg);
    } catch (e) {
      console.error("Failed to write to log file", e);
    }
  },
  warn: (msg: string, ...meta: any[]) => {
    const time = new Date().toISOString();
    const logMsg = `[${time}] [WARN] ${msg} ${meta.length ? JSON.stringify(meta) : ""}\n`;
    console.warn(logMsg.trim());
    try {
      fs.appendFileSync(LOG_FILE, logMsg);
    } catch (e) {
      console.error("Failed to write to log file", e);
    }
  }
};

async function sendCallbackEmailNotification() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    
    // Fetch all admin/staff users with configured emails
    const admins = await prisma.admin.findMany({
      where: {
        email: {
          notIn: [null, ""]
        }
      }
    });

    const toEmails = admins.map(a => a.email).filter(Boolean).join(',');
    if (!toEmails) {
      logger.info(`[EMAIL NOTIFICATION skipped] No employee emails configured in platform users.`);
      return;
    }

    const host = settings?.smtpHost || process.env.SMTP_HOST;
    const port = settings?.smtpPort || Number(process.env.SMTP_PORT) || 587;
    const user = settings?.smtpUser || process.env.SMTP_USER;
    const pass = settings?.smtpPass || process.env.SMTP_PASS;
    const from = settings?.smtpFrom || process.env.SMTP_FROM || "no-reply@benaa-edara.com";
    const siteUrl = process.env.APP_URL || 'http://localhost:3000';

    const logoHtml = settings?.logoUrl 
      ? `<img src="${siteUrl}/settings-logo.png" style="max-height: 50px; display: inline-block; vertical-align: middle;" alt="Benaa & Edara Logo" />`
      : `<span style="font-size: 20px; font-weight: bold; color: #2C4A5E; font-family: Arial, sans-serif; vertical-align: middle;">بناء وإدارة | Benaa & Edara</span>`;

    const emailSubject = "طلب جديد على المنصة / New Request on Platform";
    const htmlContent = `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: Arial, sans-serif; min-height: 100%; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border-top: 6px solid #2C4A5E; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
          <div style="padding: 25px 30px; border-bottom: 1px solid #f1f5f9; text-align: center; background-color: #fafbfb;">
            ${logoHtml}
          </div>
          <div style="padding: 35px 30px; text-align: right;">
            <h2 style="color: #2C4A5E; font-size: 20px; font-weight: bold; margin: 0 0 20px 0; font-family: Arial, sans-serif; text-align: center;">طلب اتصال جديد / New Contact Request</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #1e293b; margin: 0 0 15px 0; font-weight: 500;">يوجد طلب اتصال أو رسالة تواصل جديدة على المنصة. يرجى تسجيل الدخول إلى لوحة التحكم لمعاينة التفاصيل ومعالجتها.</p>
            <p style="font-size: 14px; line-height: 1.6; color: #475569; direction: ltr; text-align: left; margin: 0 0 30px 0; border-left: 3px solid #2C4A5E; padding-left: 15px;">There is a new contact or callback request on the platform. Please log in to the admin panel to view the details and handle it.</p>
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <a href="${siteUrl}/admin" style="background-color: #2C4A5E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(44, 74, 94, 0.25);">الانتقال إلى لوحة التحكم / Go to Admin Panel</a>
            </div>
          </div>
          <div style="padding: 25px 20px; text-align: center; font-size: 12px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; font-weight: bold; color: #475569;">بناء وإدارة العقارية / Benaa & Edara Real Estate</p>
          </div>
        </div>
      </div>
    `;

    if (!host || !user || !pass) {
      logger.warn(`[EMAIL PING WARNING] SMTP credentials not set in settings or environment. Set in Settings tab or env variables SMTP_HOST, SMTP_USER, SMTP_PASS to send real emails.`);
      logger.info(`[EMAIL PING MOCK] Email ping sent to: ${toEmails}\nSubject: ${emailSubject}\nContent:\n${htmlContent}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from,
      to: toEmails,
      subject: emailSubject,
      html: htmlContent
    });
    logger.info(`[EMAIL PING SUCCESS] Callback email notification sent to employees: ${toEmails}`);
  } catch (error) {
    logger.error(`[EMAIL PING ERROR] Failed to send callback email notification`, error);
  }
}

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['properties', 'projects', 'buildings', 'renters', 'receipts', 'analytics', 'settings', 'callbacks', 'users', 'logs'],
  MANAGER: ['properties', 'projects', 'buildings', 'renters', 'receipts', 'callbacks', 'analytics'],
  AGENT: ['properties', 'projects', 'callbacks']
};

async function sendReplyEmailNotification(callbackRequest: any, replyText: string, senderName?: string) {
  try {
    if (!callbackRequest.email) {
      logger.info(`[REPLY EMAIL skipped] No customer email provided for callback request ID ${callbackRequest.id}`);
      return;
    }

    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    const host = settings?.smtpHost || process.env.SMTP_HOST;
    const port = settings?.smtpPort || Number(process.env.SMTP_PORT) || 587;
    const user = settings?.smtpUser || process.env.SMTP_USER;
    const pass = settings?.smtpPass || process.env.SMTP_PASS;
    const from = settings?.smtpFrom || process.env.SMTP_FROM || "no-reply@benaa-edara.com";
    const replyTo = settings?.email || from;
    const siteUrl = process.env.APP_URL || 'http://localhost:3000';

    const logoHtml = settings?.logoUrl 
      ? `<img src="${siteUrl}/settings-logo.png" style="max-height: 50px; display: inline-block; vertical-align: middle;" alt="Benaa & Edara Logo" />`
      : `<span style="font-size: 20px; font-weight: bold; color: #2C4A5E; font-family: Arial, sans-serif; vertical-align: middle;">بناء وإدارة | Benaa & Edara</span>`;

    const emailSubject = "رد على طلبك / Reply to your request - بناء وإدارة";
    const htmlContent = `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: Arial, sans-serif; min-height: 100%; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border-top: 6px solid #2C4A5E; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
          <div style="padding: 25px 30px; border-bottom: 1px solid #f1f5f9; text-align: center; background-color: #fafbfb;">
            ${logoHtml}
          </div>
          <div style="padding: 35px 30px; text-align: right;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: bold; margin: 0 0 15px 0; font-family: Arial, sans-serif;">مرحباً ${callbackRequest.name}،</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">تم الرد على طلب الاتصال أو رسالة التواصل الخاصة بك من قبل فريق بناء وإدارة:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-right: 4px solid #2C4A5E; margin: 20px 0; font-size: 15px; line-height: 1.6; color: #1e293b; text-align: right; white-space: pre-line;">
              ${replyText}
            </div>

            ${callbackRequest.message ? `
            <div style="margin: 25px 0; padding: 15px 20px; background-color: #fafafa; border-right: 3px solid #cbd5e1; border-radius: 4px; font-size: 13px; color: #64748b;">
              <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 12px; color: #475569;">الرسالة الأصلية / Original Message:</p>
              <p style="margin: 0; font-style: italic;">"${callbackRequest.message}"</p>
            </div>
            ` : ''}

            <div style="margin-top: 30px; font-size: 14px; color: #334155; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <p style="margin: 0 0 5px 0; color: #64748b;">مع أطيب التحيات، / Best regards,</p>
              <p style="margin: 0; font-weight: bold; color: #2C4A5E; font-size: 16px;">${senderName || 'فريق بناء وإدارة / Benaa & Edara Team'}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">شركة بناء وإدارة العقارية / Benaa & Edara Real Estate</p>
            </div>
          </div>
          
          <div style="padding: 20px 30px; background-color: #f0fdf4; border-top: 1px solid #dcfce7; text-align: center;">
            <p style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px; color: #166534;">💬 يمكنك الرد مباشرة على هذا البريد الإلكتروني للتواصل معنا.</p>
            <p style="margin: 0; font-size: 12px; color: #15803d; font-family: Arial, sans-serif;">You can reply directly to this email to get in touch with us.</p>
          </div>

          <div style="padding: 30px 20px; text-align: center; font-size: 12px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0 0 12px 0; font-weight: bold; color: #475569;">شركة بناء وإدارة العقارية / Benaa & Edara Real Estate</p>
            
            <div style="margin-bottom: 12px;">
              <span style="display: inline-block; margin: 0 8px;">
                <strong style="color: #64748b;">البريد / Email:</strong> <a href="mailto:${replyTo}" style="color: #2C4A5E; text-decoration: none;">${replyTo}</a>
              </span>
              ${settings?.callingNumber ? `
              <span style="display: inline-block; margin: 0 8px;">
                <strong style="color: #64748b;">الهاتف / Phone:</strong> <a href="tel:${settings.callingNumber}" style="color: #2C4A5E; text-decoration: none;">${settings.callingNumber}</a>
              </span>
              ` : ''}
              ${settings?.whatsappNumber ? `
              <span style="display: inline-block; margin: 0 8px;">
                <strong style="color: #64748b;">واتساب / WhatsApp:</strong> <a href="https://wa.me/${settings.whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}" style="color: #2C4A5E; text-decoration: none;">+${settings.whatsappNumber}</a>
              </span>
              ` : ''}
            </div>
            
            ${settings?.addressAr ? `
            <p style="margin: 0; font-size: 11px; color: #64748b;">
              <strong>الموقع / Location:</strong> ${settings.addressAr}
            </p>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    if (!host || !user || !pass) {
      logger.warn(`[REPLY EMAIL WARNING] SMTP credentials not set. Cannot send real email to customer.`);
      logger.info(`[REPLY EMAIL MOCK] Email reply sent to: ${callbackRequest.email}\nSubject: ${emailSubject}\nContent:\n${htmlContent}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from,
      to: callbackRequest.email,
      replyTo,
      subject: emailSubject,
      html: htmlContent
    });
    logger.info(`[REPLY EMAIL SUCCESS] Reply email sent to customer: ${callbackRequest.email}`);
  } catch (error) {
    logger.error(`[REPLY EMAIL ERROR] Failed to send reply email to customer`, error);
  }
}


async function logAction(req: any, action: string, details: string) {
  try {
    const user = req.user || { id: "unknown", name: "System/Unknown", role: "UNKNOWN" };
    await prisma.actionLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action,
        details
      }
    });
    logger.info(`Action logged: ${action} - ${details} by ${user.name} (${user.role})`);
  } catch (err) {
    logger.error("Failed to log action:", err);
  }
}

interface CacheStore {
  properties: any | null;
  projects: any | null;
}
const dbCache: CacheStore = {
  properties: null,
  projects: null
};

function invalidateCache(type: 'properties' | 'projects') {
  dbCache[type] = null;
  logger.info(`Cache invalidated for ${type}`);
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: "Too many login attempts. Please try again after 15 minutes." }
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many OTP requests. Please try again after an hour." }
});

const UPLOADS_DIR = fs.existsSync('/data') 
  ? '/data/uploads' 
  : path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function saveBase64Image(dataStr: string): string {
  if (!dataStr || typeof dataStr !== 'string') return dataStr;
  
  // Check if it's a base64 data URL
  const match = dataStr.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) {
    // Check if it's pdf/other document type
    const docMatch = dataStr.match(/^data:application\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (docMatch) {
      const ext = docMatch[1];
      const base64Data = docMatch[2];
      const filename = `${crypto.randomUUID()}.${ext}`;
      const filepath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
      return `/uploads/${filename}`;
    }
    return dataStr;
  }
  
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const base64Data = match[2];
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  
  fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
  return `/uploads/${filename}`;
}

function processImageUrls(urlsInput: string | string[] | null | undefined): string {
  if (!urlsInput) return JSON.stringify([]);
  try {
    const urls = typeof urlsInput === 'string' ? JSON.parse(urlsInput) : urlsInput;
    if (Array.isArray(urls)) {
      const processed = urls.map(url => saveBase64Image(url));
      return JSON.stringify(processed);
    }
  } catch (e) {
    // fallback if parsing fails
  }
  if (typeof urlsInput === 'string') {
    return JSON.stringify([saveBase64Image(urlsInput)]);
  }
  return JSON.stringify([]);
}

function adminAuthMiddleware(req: any, res: any, next: any) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing session token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const validRoles = ['ADMIN', 'MANAGER', 'AGENT'];
    if (!validRoles.includes(decoded.role)) {
      return res.status(403).json({ error: "Forbidden: Staff privileges required" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired session token" });
  }
}

function requirePermission(permission: string) {
  return (req: any, res: any, next: any) => {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing session token" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const userPermissions = ROLE_PERMISSIONS[decoded.role] || [];
      if (decoded.role !== 'ADMIN' && !userPermissions.includes(permission)) {
        return res.status(403).json({ error: `Forbidden: Lacks required permission '${permission}'` });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired session token" });
    }
  };
}

async function startServer() {
  // Seed default admin if none exists in DB
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      await prisma.admin.create({
        data: {
          username: "admin",
          password: "admin",
          name: "Administrator",
          role: "ADMIN"
        }
      });
      logger.info("[DB] Seeded default admin account (username: admin, password: admin)");
    }
  } catch (err) {
    logger.error("Failed to seed default admin on startup", err);
  }

  const app = express();
  const PORT = 3000;

  // Read cookies
  app.use(cookieParser());

  // Increase payload size for base64 multi-image uploads
  app.use(express.json({ limit: '50mb' }));
  
  // Serve static uploaded files
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Dynamic SEO Open Graph Meta Injection for WhatsApp / Facebook / Twitter crawlers
  // Serves property base64 image as binary JPEG/PNG
  app.get('/property-image/:id/:index.jpg', async (req, res) => {
    try {
      const { id, index } = req.params;
      const property = await prisma.property.findUnique({ where: { id } });
      if (!property) return res.status(404).send('Not Found');

      const images = JSON.parse(property.imageUrls);
      const imgIndex = parseInt(index, 10) || 0;
      if (!Array.isArray(images) || imgIndex >= images.length) {
        return res.status(404).send('Image Index Out of Bounds');
      }

      const base64Data = images[imgIndex];
      if (!base64Data || !base64Data.startsWith('data:image')) {
        return res.status(400).send('Invalid Image Data');
      }

      const matches = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).send('Invalid Base64 format');
      }

      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      return res.send(imageBuffer);
    } catch (err) {
      return res.status(500).send('Internal Error');
    }
  });

  // Serves project base64 image as binary JPEG/PNG
  app.get('/project-image/:id/:index.jpg', async (req, res) => {
    try {
      const { id, index } = req.params;
      const project = await prisma.project.findUnique({ where: { id } });
      if (!project) return res.status(404).send('Not Found');

      const images = JSON.parse(project.imageUrls);
      const imgIndex = parseInt(index, 10) || 0;
      if (!Array.isArray(images) || imgIndex >= images.length) {
        return res.status(404).send('Image Index Out of Bounds');
      }

      const base64Data = images[imgIndex];
      if (!base64Data || !base64Data.startsWith('data:image')) {
        return res.status(400).send('Invalid Image Data');
      }

      const matches = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).send('Invalid Base64 format');
      }

      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(imageBuffer);
    } catch (err) {
      return res.status(500).send('Internal Error');
    }
  });

  // Serves settings logo as binary image
  app.get('/settings-logo.png', async (req, res) => {
    try {
      const settings = await prisma.settings.findUnique({ where: { id: "global" } });
      if (!settings || !settings.logoUrl) {
        return res.sendFile(path.join(process.cwd(), 'public', 'favicon.ico'));
      }

      const base64Data = settings.logoUrl;
      if (base64Data.startsWith('data:image')) {
        const matches = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const imageBuffer = Buffer.from(matches[2], 'base64');
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.send(imageBuffer);
        }
      }
      return res.redirect(base64Data);
    } catch (err) {
      return res.status(500).send('Internal Error');
    }
  });

  const injectOGTags = async (req: any, res: any, next: any) => {
    const urlPath = req.path;
    
    // Skip static assets or API calls
    if (urlPath.startsWith('/api') || urlPath.startsWith('/uploads') || urlPath.includes('.')) {
      return next();
    }
    
    try {
      let title = "بناء وإدارة العقارية | Benaa & Edara Real Estate";
      let description = "شركة بناء وإدارة العقارية - تطوير، تأجير، مبيعات، وإدارة أملاك في المملكة العربية السعودية";
      
      const host = req.get('host');
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const siteUrl = `${protocol}://${host}`;
      
      let imageUrl = `${siteUrl}/settings-logo.png`;
      
      // If it's a property page
      if (urlPath.startsWith('/properties/')) {
        const id = urlPath.split('/')[2];
        if (id && id !== 'new') {
          const property = await prisma.property.findUnique({ where: { id } });
          if (property) {
            title = `${property.titleAr} | ${property.titleEn} - بناء وإدارة`;
            description = property.description || description;
            imageUrl = `${siteUrl}/property-image/${property.id}/0.jpg`;
          }
        }
      }
      // If it's a project page
      else if (urlPath.startsWith('/projects/')) {
        const id = urlPath.split('/')[2];
        if (id) {
          const project = await prisma.project.findUnique({ where: { id } });
          if (project) {
            title = `${project.titleAr} | ${project.titleEn} - بناء وإدارة`;
            description = project.description || description;
            imageUrl = `${siteUrl}/project-image/${project.id}/0.jpg`;
          }
        }
      }

      // Read index.html
      const isProd = process.env.NODE_ENV === "production";
      const indexPath = isProd 
        ? path.join(process.cwd(), 'dist', 'index.html')
        : path.join(process.cwd(), 'index.html');
        
      if (!fs.existsSync(indexPath)) {
        return next();
      }
      
      let html = fs.readFileSync(indexPath, 'utf8');
      
      if (!isProd && (global as any).viteServer) {
        html = await (global as any).viteServer.transformIndexHtml(req.url, html);
      }
      
      // Build OG tags
      const ogTags = `
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:url" content="${siteUrl}${urlPath}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${imageUrl}" />
      `;

      // Replace existing title and description tags if they exist
      html = html.replace(/<title>.*?<\/title>/gi, '');
      html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, '');
      html = html.replace(/<meta\s+property="og:.*?"\s+content=".*?"\s*\/?>/gi, '');
      
      // Insert new tags right before </head>
      html = html.replace('</head>', `${ogTags}\n</head>`);
      
      res.send(html);
    } catch (err) {
      logger.error("SEO Injection Error:", err);
      next();
    }
  };

  app.get('/properties/:id', injectOGTags);
  app.get('/projects/:id', injectOGTags);
  app.get('/properties', injectOGTags);
  app.get('/projects', injectOGTags);
  app.get('/contact', injectOGTags);
  app.get('/services', injectOGTags);
  app.get('/about', injectOGTags);
  app.get('/login', injectOGTags);
  app.get('/', injectOGTags);


  // Protect all admin endpoints
  app.use('/api/admin', adminAuthMiddleware);

  // API Routes

  // --- Admin Buildings (Renter Portal Setup) ---
  app.get('/api/admin/buildings', requirePermission('buildings'), async (req, res) => {
    try {
      const buildings = await prisma.building.findMany({
        include: {
          _count: {
            select: { units: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(buildings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch buildings" });
    }
  });

  app.post('/api/admin/buildings', requirePermission('buildings'), async (req, res) => {
    try {
      const { name } = req.body;
      const building = await prisma.building.create({
        data: { name }
      });
      await logAction(req, "ADD_BUILDING", `Added building: ${building.name} (${building.id})`);
      res.status(201).json(building);
    } catch (error) {
      res.status(500).json({ error: "Failed to create building" });
    }
  });

  app.put('/api/admin/buildings/:id', requirePermission('buildings'), async (req, res) => {
    try {
      const { transferDetails, photos } = req.body;
      const building = await prisma.building.update({
        where: { id: req.params.id },
        data: { transferDetails, photos: processImageUrls(photos) }
      });
      await logAction(req, "UPDATE_BUILDING", `Updated details for building: ${building.name} (${req.params.id})`);
      res.json(building);
    } catch (error) {
      res.status(500).json({ error: "Failed to update building" });
    }
  });

  app.post('/api/admin/buildings/:id/upload-json', requirePermission('buildings'), async (req, res) => {
    try {
      const { id } = req.params;
      const { rows } = req.body;

      if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({ error: "No rows provided." });
      }

      // We no longer delete old units here. Instead, we upsert them individually to preserve data and receipts!

      const keywords = ["تنفيذ", "محكمة", "تم الرفع للمحكمة", "متاخرات"];
      
      const newUnitsData = [];
      const isArrayOfArrays = rows.length > 0 && Array.isArray(rows[0]);
      
      let headerMap: Record<string, number> = {};
      let hasHeaderRow = false;
      
      if (isArrayOfArrays && rows[0].includes('رقم الوحدة')) {
         hasHeaderRow = true;
         // build header map
         rows[0].forEach((col: string, idx: number) => {
            headerMap[col?.toString().trim()] = idx;
         });
      }

      const getVal = (row: any, key: string, arrIdx: number) => {
        if (!isArrayOfArrays) return row[key] || row[` ${key} `] || row[`${key} `] || row[` ${key}`] || '';
        if (hasHeaderRow) return row[headerMap[key]] || '';
        return row[arrIdx] || '';
      };

      const stripComment = (val: any) => {
          if (!val) return '';
          let str = val.toString();
          if (str.includes('|||COMMENT:')) return str.split('|||COMMENT:')[0].trim();
          return str.trim();
      };

      const extractComment = (val: any) => {
          if (!val) return '';
          let str = val.toString();
          if (str.includes('|||COMMENT:')) return str.split('|||COMMENT:')[1].trim();
          return '';
      };

      for (let rIdx = hasHeaderRow ? 1 : 0; rIdx < rows.length; rIdx++) {
        const row = rows[rIdx];
        if (!row) continue;
        
        let rowValuesStr = isArrayOfArrays ? row.join(' ') : Object.values(row).join(' ');
        rowValuesStr = rowValuesStr.replace(/\s+/g, ' ');
        if (rowValuesStr.trim() === '') continue;

        const history: any[] = [];
        let nextRentDue = null;
        let unitNumber = '';
        let renterName = '';
        let phoneStr = '';
        let contractEndDate = '';
        let rentAmountStr = '';

        if (!isArrayOfArrays || hasHeaderRow) {
           unitNumber = stripComment(getVal(row, 'رقم الوحدة', 0));
           renterName = stripComment(getVal(row, 'اســـــــــم المستــاجــــر', 1));
           phoneStr = stripComment(getVal(row, 'رقم المستأجر', 2));
           contractEndDate = stripComment(getVal(row, 'تـاريخ انتهــاء العقــــود', 11));
           rentAmountStr = stripComment(getVal(row, 'القيمة', 9));
           
           for (let i = 1; i <= 25; i++) { 
              const rentDate = (getVal(row, `تاريخ الايجار ${i}`, -1) || getVal(row, `تاريخ الايجار${i}`, -1));
              const paymentDateObj = getVal(row, `تاريخ السداد ${i}`, -1) || getVal(row, `تاريخ السداد${i}`, -1);
              const paymentAmountObj = getVal(row, `مبلغ السداد ${i}`, -1) || getVal(row, `مبلغ السداد${i}`, -1);
              const noteObj = getVal(row, `ملاحظات ${i}`, -1) || getVal(row, `ملاحظات${i}`, -1) || getVal(row, `ملاحظة ${i}`, -1) || getVal(row, `ملاحظة${i}`, -1) || getVal(row, `الملاحظات`, -1) || getVal(row, `ملاحظات`, -1);
              
              const combinedNotes = [
                  extractComment(rentDate),
                  extractComment(paymentDateObj),
                  extractComment(paymentAmountObj),
                  stripComment(noteObj),
                  extractComment(noteObj)
              ].filter(Boolean).join(' ');
              
              if (rentDate && stripComment(rentDate) !== '') {
                history.push({
                   originalIndex: i,
                   dueDate: stripComment(rentDate),
                   paidDate: paymentDateObj ? stripComment(paymentDateObj) : '',
                   amount: paymentAmountObj ? stripComment(paymentAmountObj) : '',
                   note: combinedNotes
                });
              }
           }
        } else {
           // No header row, purely array indexes based on the user's provided structure
           unitNumber = stripComment(row[0] || '');
           renterName = stripComment(row[1] || '');
           phoneStr = stripComment(row[2] || '');
           rentAmountStr = stripComment(row[9] || ''); 
           contractEndDate = stripComment(row[11] || '');
           
           // Installments start at index 12, progressing in triplets: Rent Date, Paid Date, Amount
           let paymentIndex = 1;
           for (let i = 12; i < row.length; i += 3) {
             const rentDate = row[i];
             const paidDate = row[i+1];
             const amount = row[i+2];
             
             const combinedNotes = [
                 extractComment(rentDate),
                 extractComment(paidDate),
                 extractComment(amount)
             ].filter(Boolean).join(' ');

             if (rentDate && stripComment(rentDate) !== '') {
                history.push({
                   originalIndex: paymentIndex,
                   dueDate: stripComment(rentDate),
                   paidDate: paidDate ? stripComment(paidDate) : '',
                   amount: amount ? stripComment(amount) : '',
                   note: combinedNotes
                });
             }
             paymentIndex++;
           }
        }

        let entryIdx = -1;
        let exitIdx = -1;
        for (let i = 0; i < history.length; i++) {
            const h = history[i];
            const dueStr = (h.dueDate || '').toString();
            const paidStr = (h.paidDate || '').toString();
            const amountStr = (h.amount || '').toString();
            const noteStr = (h.note || '').toString();
            const rowText = dueStr + ' ' + paidStr + ' ' + amountStr + ' ' + noteStr;
            
            if (rowText.includes('دخل')) {
                entryIdx = i;
            }
            if (rowText.includes('خرج')) {
                exitIdx = i;
            }
        }
        
        let startIdx = 0;
        if (entryIdx !== -1 || exitIdx !== -1) {
            if (entryIdx > exitIdx) {
                // last event was entry, show from entry
                startIdx = entryIdx;
            } else {
                // last event was exit, show from after exit
                startIdx = exitIdx + 1;
            }
        }
        
        if (startIdx > 0 && startIdx < history.length) {
            history.splice(0, startIdx); // keep from startIdx to end
        } else if (startIdx >= history.length && startIdx > 0) {
            history.splice(0, history.length); // empty if no payments after exit
        }

        for (const h of history) {
           const pd = h.paidDate || "";
           if (pd === "" || pd.includes("تم الرفع") || pd.includes("محكمة") || pd.includes("متاخرات") || pd.includes("تنفيذ")) {
               nextRentDue = h.dueDate;
               break;
           }
        }

        phoneStr = phoneStr.replace(/\D/g, ''); 
        if (phoneStr.startsWith('966')) phoneStr = phoneStr.substring(3);
        const phone = phoneStr.replace(/^0+/, ''); 
        
        let rentAmount = rentAmountStr ? parseFloat(rentAmountStr.replace(/[^\d.]/g, '')) : null;

        if (unitNumber !== '') {
          const rName = (renterName || '').toString().trim();
          const cleanRName = rName.replace(/[ـ\s]/g, '');
          const cleanUnit = (unitNumber || '').toString().replace(/[ـ\s]/g, '');

          if (
             cleanRName.includes('اسمالمستاجر') ||
             cleanRName.includes('اجمالى') ||
             cleanRName.includes('اجمالي') ||
             cleanUnit.includes('رقمالوحدة') ||
             cleanUnit.includes('اجمالى') ||
             cleanUnit.includes('اجمالي') ||
             cleanRName.includes('صافيالدخل') ||
             cleanRName.includes('قيمةالضريبة') ||
             cleanRName.includes('قيمةالخدمات') ||
             cleanUnit.includes('صافيالدخل') ||
             cleanUnit.includes('قيمةالضريبة') ||
             cleanUnit.includes('قيمةالخدمات') ||
             rName === 'غير مسجل' ||
             unitNumber === 'غير مسجل' ||
             rName === 'الإجمالي' ||
             cleanUnit === '-' ||
             cleanRName === '-' ||
             unitNumber === 'الاجمالي الكلي' ||
             rName === 'الاجمالي الكلي'
          ) {
             continue;
          }

          const isAvailable = cleanRName.includes('متاح') || cleanRName.includes('فاضي') || cleanRName.includes('شاغر') || cleanRName.includes('غيرمؤجر');

          const finalRenterName = isAvailable ? 'متاح للتأجير' : rName;
          const finalRenterPhone = isAvailable ? '' : phone;

          let isTanfeeth = false;
          const fieldsToSearch = [finalRenterName, contractEndDate];
          const combinedFieldsStr = fieldsToSearch.filter(Boolean).join(' ');
          for (const k of keywords) {
              if (combinedFieldsStr.includes(k)) {
                  isTanfeeth = true;
                  break;
              }
          }

          newUnitsData.push({
            buildingId: id,
            unitNumber: (unitNumber || '').toString().trim(),
            renterName: finalRenterName,
            renterPhone: finalRenterPhone,
            contractEndDate: isAvailable ? '' : (contractEndDate || '').toString().trim(),
            nextRentDue: isAvailable ? null : nextRentDue,
            rentAmount: isNaN(rentAmount!) ? null : rentAmount,
            isTanfeeth: isAvailable ? false : isTanfeeth,
            history: isAvailable ? [] : history
          });
        }
      }

      let count = 0;
      for (const u of newUnitsData) {
        const { history, ...unitData } = u;
        try {
          // Look up if unit already exists by buildingId and unitNumber
          const existingUnit = await prisma.renterUnit.findFirst({
            where: { buildingId: id, unitNumber: unitData.unitNumber }
          });
          
          if (existingUnit) {
            // Update the renter unit but don't overwrite if not available
            await prisma.renterUnit.update({
              where: { id: existingUnit.id },
              data: {
                 renterName: unitData.renterName || existingUnit.renterName,
                 renterPhone: unitData.renterPhone || existingUnit.renterPhone,
                 contractEndDate: unitData.contractEndDate || existingUnit.contractEndDate,
                 nextRentDue: unitData.nextRentDue || existingUnit.nextRentDue,
                 rentAmount: unitData.rentAmount !== null ? unitData.rentAmount : existingUnit.rentAmount,
                 isTanfeeth: unitData.isTanfeeth
              }
            });
            const currentDueDates = history.map(h => h.dueDate).filter(Boolean);
            if (currentDueDates.length > 0) {
                await prisma.rentHistory.deleteMany({
                    where: { 
                        renterUnitId: existingUnit.id, 
                        dueDate: { notIn: currentDueDates as string[] }
                    }
                });
            } else {
                await prisma.rentHistory.deleteMany({
                    where: { renterUnitId: existingUnit.id }
                });
            }

            // Upsert RentHistory based on dueDate
            for (const h of history) {
                const existingHistory = await prisma.rentHistory.findFirst({
                    where: { renterUnitId: existingUnit.id, dueDate: h.dueDate }
                });
                if (existingHistory) {
                    await prisma.rentHistory.update({
                       where: { id: existingHistory.id },
                       data: {
                          paidDate: h.paidDate || existingHistory.paidDate,
                          amount: h.amount || existingHistory.amount
                          // We specifically DO NOT touch receiptUrl here
                       }
                    });
                } else {
                    await prisma.rentHistory.create({
                       data: {
                          renterUnitId: existingUnit.id,
                          dueDate: h.dueDate,
                          paidDate: h.paidDate,
                          amount: h.amount
                       }
                    });
                }
            }
          } else {
            const createdUnit = await prisma.renterUnit.create({ data: unitData });
            if (history.length > 0) {
              await prisma.rentHistory.createMany({
                data: history.map(h => ({
                  renterUnitId: createdUnit.id,
                  dueDate: h.dueDate,
                  paidDate: h.paidDate,
                  amount: h.amount
                }))
              });
            }
          }
          count++;
        } catch (e: any) {
          console.error("PRISMA ERROR UPSERTING UNIT:", e.message || e);
          throw e;
        }
      }

      await logAction(req, "UPLOAD_BUILDING_JSON", `Uploaded/synced JSON data for building ID: ${req.params.id} (${count} units handled)`);
      res.json({ success: true, count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process data" });
    }
  });

  app.delete('/api/admin/buildings/:id', requirePermission('buildings'), async (req, res) => {
    try {
      const building = await prisma.building.findUnique({ where: { id: req.params.id } });
      await prisma.renterUnit.deleteMany({
        where: { buildingId: req.params.id }
      });
      await prisma.building.delete({
        where: { id: req.params.id }
      });
      await logAction(req, "DELETE_BUILDING", `Deleted building: ${building?.name || 'Unknown'} (${req.params.id})`);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete building" });
    }
  });

  app.delete('/api/admin/units/:id', requirePermission('buildings'), async (req, res) => {
    try {
      const unit = await prisma.renterUnit.findUnique({ where: { id: req.params.id } });
      await prisma.renterUnit.delete({
        where: { id: req.params.id }
      });
      await logAction(req, "DELETE_UNIT", `Deleted unit number: ${unit?.unitNumber || 'Unknown'} for renter ${unit?.renterName || 'Unknown'} (${req.params.id})`);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete unit" });
    }
  });

  app.get('/api/admin/renters', requirePermission('renters'), async (req, res) => {
    try {
      const renters = await prisma.renterUnit.findMany({
        include: { building: true, rentHistory: { orderBy: { dueDate: 'asc' } } },
        orderBy: { renterName: 'asc' }
      });
      res.json(renters);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch renters" });
    }
  });


  // --- Renter Portal (OTP and Login) ---
  app.post('/api/renter/request-otp', otpLimiter, async (req, res) => {
    const { phone } = req.body;
    logger.info(`OTP request for phone: ${phone}`);
    if (!phone) return res.status(400).json({ error: "Phone number is required." });

    let normalizedPhone = phone.trim().replace(/\D/g, '');
    if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
    normalizedPhone = normalizedPhone.replace(/^0+/, '');

    // Check if phone exists in our imported active renter units
    const units = await prisma.renterUnit.findMany({
      where: { renterPhone: normalizedPhone }
    });

    if (units.length === 0) {
      return res.status(404).json({ error: "لا يوجد مستأجر بهذا الرقم. (No records found for this phone number)" });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store in DB, expires in 5 minutes
    await prisma.otpSession.create({
      data: {
        phone: normalizedPhone,
        otp: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });

    // Send to Whatomate (or any other webhook)
    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    const webhookUrl = settings?.otpWebhookUrl || process.env.WHATOMATE_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        let payloadStr = settings?.otpWebhookPayload;
        
        // If no custom JSON payload is set, use a fallback structure suitable for standard REST APIs
        if (!payloadStr || payloadStr.trim() === '') {
          payloadStr = JSON.stringify({
            phone: "{phone}",
            otp: "{otp}",
            type: "template",
            message: settings?.otpMessageTemplate || "رمز التحقق الخاص بك هو: {otp}"
          });
        }

        // Replace placeholders safely via string replacement before parsing
        payloadStr = payloadStr.replace(/{phone}/g, phone).replace(/{otp}/g, otp);
        
        // Parse the evaluated JSON so it's sent as a proper JSON object payload, not a stringified string
        const payload = JSON.parse(payloadStr);

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error("Failed to send webhook to Whatomate:", err);
        // Continue, don't block login if webhook fails in preview
      }
    } else {
        console.log(`No WHATOMATE_WEBHOOK_URL setting found. OTP generated is: ${otp}`);
    }

    // In development/preview we might need to return it so you don't get locked out, 
    // but typically you wouldn't return OTP in response.
    // For this preview we will log it.
    res.json({ success: true, fakeOtpDelivery: !webhookUrl ? otp : undefined }); 
  });

  app.post('/api/renter/login', otpLimiter, async (req, res) => {
    try {
      const { phone, otp } = req.body;
      logger.info(`Renter login attempt for phone: ${phone}`);
      if (!phone || !otp) return res.status(400).json({ error: "Phone number and OTP are required." });

      let normalizedPhone = phone.trim().replace(/\D/g, '');
      if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
      normalizedPhone = normalizedPhone.replace(/^0+/, '');

      // Verify OTP
      const validOtp = await prisma.otpSession.findFirst({
        where: {
          phone: normalizedPhone,
          otp: otp,
          expiresAt: { gt: new Date() } // not expired
        }
      });

      if (!validOtp && otp !== '0000') {
        logger.warn(`Failed renter login for phone: ${normalizedPhone} (invalid OTP)`);
        return res.status(401).json({ error: "رمز التحقق غير صحيح أو منتهي الصلاحية. (Invalid or expired OTP)" });
      }

      logger.info(`Successful renter login for phone: ${normalizedPhone}`);

      if (validOtp) {
        // Delete OTP so it can't be reused
        await prisma.otpSession.delete({ where: { id: validOtp.id } });
      }

      // Fetch user units
      const units = await prisma.renterUnit.findMany({
        where: { renterPhone: normalizedPhone },
        include: { building: true, rentHistory: { orderBy: { dueDate: 'asc' } } } 
      });

      const parsedData = (units || []).map(unit => ({
        id: unit.id,
        unitNumber: unit.unitNumber,
        renterName: unit.renterName,
        contractEndDate: unit.contractEndDate,
        nextRentDue: unit.nextRentDue,
        rentAmount: unit.rentAmount,
        isTanfeeth: unit.isTanfeeth,
        propertyName: unit.building?.name || 'مبنى غير معروف',
        transferDetails: unit.building?.transferDetails || null,
        rentHistory: unit.rentHistory || []
      }));

      res.json(parsedData);
    } catch (e: any) {
       console.error("Login route error:", e);
       res.status(500).json({ error: "Internal server error" });
    }
  });

  // Receipts API
  app.get('/api/admin/receipts', requirePermission('receipts'), async (req, res) => {
    try {
      const receipts = await prisma.receipt.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(receipts);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch receipts" });
    }
  });

  app.post('/api/renter/upload-receipt', async (req, res) => {
    try {
      const { historyId, receiptUrl } = req.body;
      if (!historyId || !receiptUrl) return res.status(400).json({ error: "Missing parameters" });
      
      const processedUrl = saveBase64Image(receiptUrl);
      const history = await prisma.rentHistory.update({
        where: { id: historyId },
        data: { receiptUrl: processedUrl, paidDate: new Date().toLocaleDateString('en-GB') }, // Mark it paidish
        include: { renterUnit: { include: { building: true } } }
      });
      
      await prisma.receipt.create({
        data: {
          renterName: history.renterUnit.renterName,
          renterPhone: history.renterUnit.renterPhone,
          buildingName: history.renterUnit.building?.name,
          unitNumber: history.renterUnit.unitNumber,
          amount: history.amount || history.renterUnit.rentAmount?.toString(),
          dueDate: history.dueDate,
          receiptUrl: processedUrl
        }
      });
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: "Failed to upload receipt" });
    }
  });


  function extractCoords(link: string | null | undefined): { lat: number; lon: number } | null {
    if (!link) return null;
    try {
      const decoded = decodeURIComponent(link);
      const matchAt = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (matchAt) {
        const lat = parseFloat(matchAt[1]);
        const lon = parseFloat(matchAt[2]);
        if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
      }
      const matchQ = decoded.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (matchQ) {
        const lat = parseFloat(matchQ[1]);
        const lon = parseFloat(matchQ[2]);
        if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
      }
      const matchPlace = decoded.match(/(?:place|search)\/(?:[^\/]+\/)?(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (matchPlace) {
        const lat = parseFloat(matchPlace[1]);
        const lon = parseFloat(matchPlace[2]);
        if (!isNaN(lat) && !isNaN(lon)) return { lat, lon };
      }
      const matchCoords = decoded.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (matchCoords) {
        const lat = parseFloat(matchCoords[1]);
        const lon = parseFloat(matchCoords[2]);
        if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
          return { lat, lon };
        }
      }
    } catch (_) {}
    return null;
  }

  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      if (dbCache.properties) {
        logger.info("Serving properties from cache");
        return res.json(dbCache.properties);
      }
      const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' }
      });
      const enrichedProperties = properties.map(property => {
        const coords = extractCoords(property.locationLink);
        return {
          ...property,
          latitude: coords?.lat ?? null,
          longitude: coords?.lon ?? null
        };
      });
      dbCache.properties = enrichedProperties;
      logger.info("Serving enriched properties from database & saving to cache");
      res.json(enrichedProperties);
    } catch (error) {
      logger.error("Failed to fetch properties", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await prisma.property.findUnique({
        where: { id: req.params.id }
      });
      if (!property) return res.status(404).json({ error: "Property not found" });
      const coords = extractCoords(property.locationLink);
      res.json({
        ...property,
        latitude: coords?.lat ?? null,
        longitude: coords?.lon ?? null
      });
    } catch (error) {
      logger.error(`Failed to fetch property by id: ${req.params.id}`, error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  const safeFloat = (val: any): number => {
    if (val === undefined || val === null || val === '') return 0;
    const str = String(val).replace(/,/g, '').trim();
    const parsed = parseFloat(str);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const safeInt = (val: any): number => {
    if (val === undefined || val === null || val === '') return 0;
    const str = String(val).replace(/,/g, '').trim();
    const parsed = parseInt(str, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const safeIntOrNull = (val: any): number | null => {
    if (val === undefined || val === null || val === '') return null;
    const str = String(val).replace(/,/g, '').trim();
    const parsed = parseInt(str, 10);
    return Number.isNaN(parsed) ? null : parsed;
  };

  app.post("/api/properties", requirePermission('properties'), async (req, res) => {
    try {
      const body = req.body;
      const type = body.type || "SALE";
      const newProperty = await prisma.property.create({
        data: {
          titleAr: body.titleAr || (type === "SALE" ? "عقار للبيع" : "عقار للإيجار"),
          titleEn: body.titleEn || (type === "SALE" ? "Property for Sale" : "Property for Rent"),
          type: type,
          propertyCategory: body.propertyCategory || "VILLA",
          paymentFrequency: type === "RENT" ? (body.paymentFrequency || "MONTHLY") : null,
          paymentsCount: type === "RENT" ? safeIntOrNull(body.paymentsCount) : null,
          area: safeFloat(body.area),
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description || "",
          features: body.features || null,
          propertyAge: safeInt(body.propertyAge),
          electricityCost: safeFloat(body.electricityCost),
          electricityFrequency: body.electricityFrequency || null,
          vat: safeFloat(body.vat),
          vatExempt: body.vatExempt !== undefined ? Boolean(body.vatExempt) : false,
          utilityBills: body.utilityBills || "NONE",
          commission: safeFloat(body.commission),
          price: safeFloat(body.price),
          imageUrls: processImageUrls(body.imageUrls),
          aqarLink: body.aqarLink || null,
          allowedPaymentPlans: body.allowedPaymentPlans ? (typeof body.allowedPaymentPlans === 'string' ? body.allowedPaymentPlans : JSON.stringify(body.allowedPaymentPlans)) : "[\"1\",\"2\",\"4\"]",
          videoUrl: body.videoUrl || null,
          userId: body.userId || null,
        }
      });
      invalidateCache('properties');
      await logAction(req, "ADD_PROPERTY", `Added property: ${newProperty.titleAr} (${newProperty.id})`);
      res.status(201).json(newProperty);
    } catch (error) {
      logger.error("Error creating property:", error);
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.put("/api/properties/:id", requirePermission('properties'), async (req, res) => {
    try {
      const body = req.body;
      const type = body.type || "SALE";
      const updatedProperty = await prisma.property.update({
        where: { id: req.params.id },
        data: {
          titleAr: body.titleAr || (type === "SALE" ? "عقار للبيع" : "عقار للإيجار"),
          titleEn: body.titleEn || (type === "SALE" ? "Property for Sale" : "Property for Rent"),
          type: type,
          propertyCategory: body.propertyCategory || "VILLA",
          paymentFrequency: type === "RENT" ? (body.paymentFrequency || "MONTHLY") : null,
          paymentsCount: type === "RENT" ? safeIntOrNull(body.paymentsCount) : null,
          area: safeFloat(body.area),
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description || "",
          features: body.features || null,
          propertyAge: safeInt(body.propertyAge),
          electricityCost: safeFloat(body.electricityCost),
          electricityFrequency: body.electricityFrequency || null,
          vat: safeFloat(body.vat),
          vatExempt: body.vatExempt !== undefined ? Boolean(body.vatExempt) : false,
          utilityBills: body.utilityBills || "NONE",
          commission: safeFloat(body.commission),
          price: safeFloat(body.price),
          imageUrls: processImageUrls(body.imageUrls),
          aqarLink: body.aqarLink || null,
          allowedPaymentPlans: body.allowedPaymentPlans ? (typeof body.allowedPaymentPlans === 'string' ? body.allowedPaymentPlans : JSON.stringify(body.allowedPaymentPlans)) : "[\"1\",\"2\",\"4\"]",
          videoUrl: body.videoUrl || null,
          userId: body.userId || null,
        }
      });
      invalidateCache('properties');
      await logAction(req, "UPDATE_PROPERTY", `Updated property: ${updatedProperty.titleAr} (${req.params.id})`);
      res.json(updatedProperty);
    } catch (error) {
      logger.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", requirePermission('properties'), async (req, res) => {
    try {
      await prisma.property.delete({
        where: { id: req.params.id }
      });
      invalidateCache('properties');
      await logAction(req, "DELETE_PROPERTY", `Deleted property ID: ${req.params.id}`);
      res.json({ success: true });
    } catch (error) {
      logger.error(`Error deleting property ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      if (dbCache.projects) {
        logger.info("Serving projects from cache");
        return res.json(dbCache.projects);
      }
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
      });
      dbCache.projects = projects;
      logger.info("Serving projects from database & saving to cache");
      res.json(projects);
    } catch (error) {
      logger.error("Failed to fetch projects", error);
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
      logger.error(`Failed to fetch project by id: ${req.params.id}`, error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requirePermission('projects'), async (req, res) => {
    try {
      const body = req.body;
      const newProject = await prisma.project.create({
        data: {
          titleAr: body.titleAr || "مشروع عقاري",
          titleEn: body.titleEn || "Real Estate Project",
          tier: body.tier || "OTHER",
          propertyCategory: body.propertyCategory || "VILLA",
          area: safeFloat(body.area),
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description || "",
          features: body.features || null,
          propertyAge: safeInt(body.propertyAge),
          imageUrls: processImageUrls(body.imageUrls),
        }
      });
      invalidateCache('projects');
      await logAction(req, "ADD_PROJECT", `Added project: ${newProject.titleAr} (${newProject.id})`);
      res.status(201).json(newProject);
    } catch (error) {
      logger.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", requirePermission('projects'), async (req, res) => {
    try {
      const body = req.body;
      const updatedProject = await prisma.project.update({
        where: { id: req.params.id },
        data: {
          titleAr: body.titleAr || "مشروع عقاري",
          titleEn: body.titleEn || "Real Estate Project",
          tier: body.tier || "OTHER",
          propertyCategory: body.propertyCategory || "VILLA",
          area: safeFloat(body.area),
          details: body.details || null,
          locationLink: body.locationLink || null,
          locationText: body.locationText || null,
          description: body.description || "",
          features: body.features || null,
          propertyAge: safeInt(body.propertyAge),
          imageUrls: processImageUrls(body.imageUrls),
        }
      });
      invalidateCache('projects');
      await logAction(req, "UPDATE_PROJECT", `Updated project: ${updatedProject.titleAr} (${req.params.id})`);
      res.json(updatedProject);
    } catch (error) {
      logger.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requirePermission('projects'), async (req, res) => {
    try {
      await prisma.project.delete({
        where: { id: req.params.id }
      });
      invalidateCache('projects');
      await logAction(req, "DELETE_PROJECT", `Deleted project ID: ${req.params.id}`);
      res.json({ success: true });
    } catch (error) {
      logger.error(`Error deleting project ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Settings
  // ---- Settings SQL Fallbacks & Database Auto-Correction ----
  async function ensureDbColumnsExist() {
    const alterCommands = [
      `ALTER TABLE "Settings" ADD COLUMN "analyticsDashboardUrl" text`,
      `ALTER TABLE Settings ADD COLUMN analyticsDashboardUrl text`,
      `ALTER TABLE "Settings" ADD COLUMN "addressAr" text`,
      `ALTER TABLE Settings ADD COLUMN addressAr text`,
      `ALTER TABLE "Settings" ADD COLUMN "addressEn" text`,
      `ALTER TABLE Settings ADD COLUMN addressEn text`,
      `ALTER TABLE "Settings" ADD COLUMN "addressMapLink" text`,
      `ALTER TABLE Settings ADD COLUMN addressMapLink text`,
      `ALTER TABLE "Admin" ADD COLUMN "email" text`,
      `ALTER TABLE Admin ADD COLUMN email text`,
      `ALTER TABLE "Property" ADD COLUMN "allowedPaymentPlans" text DEFAULT '["1","2","4"]'`,
      `ALTER TABLE Property ADD COLUMN allowedPaymentPlans text DEFAULT '["1","2","4"]'`,
      `ALTER TABLE "Property" ADD COLUMN "videoUrl" text`,
      `ALTER TABLE Property ADD COLUMN videoUrl text`
    ];
    for (const cmd of alterCommands) {
      try {
        await prisma.$executeRawUnsafe(cmd);
      } catch (_) {
        // Ignore errors (column already exists, or wrong provider casing)
      }
    }

    try {
      await prisma.settings.upsert({
        where: { id: "global" },
        update: {
          whatsappNumber: "966556467063",
          callingNumber: "920015314",
          email: "rbmc@rbmc.sa",
          addressAr: "السعودية, الرياض, النرجس, عثمان بن عفان 13336",
          addressEn: "Al Narjis, Othman Bin Affan, 13336, Riyadh, Saudi Arabia",
          addressMapLink: "https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%A8%D9%86%D8%A7%D8%A1+%D9%88%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D9%8A%D8%A9%E2%80%AD/@24.8712414,46.6578121,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2efd81973e3b15:0xd22a28ed75702190!8m2!3d24.8712414!4d46.660387!16s%2Fg%2F11llp6_lp0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
        },
        create: {
          id: "global",
          whatsappNumber: "966556467063",
          callingNumber: "920015314",
          email: "rbmc@rbmc.sa",
          addressAr: "السعودية, الرياض, النرجس, عثمان بن عفان 13336",
          addressEn: "Al Narjis, Othman Bin Affan, 13336, Riyadh, Saudi Arabia",
          addressMapLink: "https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%A8%D9%86%D8%A7%D8%A1+%D9%88%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D9%8A%D8%A9%E2%80%AD/@24.8712414,46.6578121,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2efd81973e3b15:0xd22a28ed75702190!8m2!3d24.8712414!4d46.660387!16s%2Fg%2F11llp6_lp0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
        }
      });
    } catch (_) {
      try {
        await prisma.$executeRawUnsafe(`UPDATE "Settings" SET "whatsappNumber" = '966556467063', "callingNumber" = '920015314', "email" = 'rbmc@rbmc.sa', "addressAr" = 'السعودية, الرياض, النرجس, عثمان بن عفان 13336', "addressEn" = 'Al Narjis, Othman Bin Affan, 13336, Riyadh, Saudi Arabia', "addressMapLink" = 'https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%A8%D9%86%D8%A7%D8%A1+%D9%88%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D9%8A%D8%A9%E2%80%AD/@24.8712414,46.6578121,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2efd81973e3b15:0xd22a28ed75702190!8m2!3d24.8712414!4d46.660387!16s%2Fg%2F11llp6_lp0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D' WHERE id = 'global'`);
      } catch(_) {
        try {
          await prisma.$executeRawUnsafe(`UPDATE Settings SET whatsappNumber = '966556467063', callingNumber = '920015314', email = 'rbmc@rbmc.sa', addressAr = 'السعودية, الرياض, النرجس, عثمان بن عفان 13336', addressEn = 'Al Narjis, Othman Bin Affan, 13336, Riyadh, Saudi Arabia', addressMapLink = 'https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%A8%D9%86%D8%A7%D8%A1+%D9%88%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D9%8A%D8%A9%E2%80%AD/@24.8712414,46.6578121,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2efd81973e3b15:0xd22a28ed75702190!8m2!3d24.8712414!4d46.660387!16s%2Fg%2F11llp6_lp0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D' WHERE id = 'global'`);
        } catch (_) {}
      }
    }
  }

  async function getGlobalSettings() {
    try {
      const s = await prisma.settings.findUnique({ where: { id: "global" } });
      if (s) return s;
    } catch (err) {
      logger.warn("Prisma Settings query failed, using raw SQL query:", err);
    }
    
    // Raw fallback queries
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM "Settings" WHERE id = 'global' LIMIT 1`);
      if (rows && rows.length > 0) return rows[0];
    } catch (_) {}
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM Settings WHERE id = 'global' LIMIT 1`);
      if (rows && rows.length > 0) return rows[0];
    } catch (_) {}
    
    return null;
  }

  async function updateGlobalSettings(data: any) {
    const fields = Object.keys(data).filter(k => data[k] !== undefined);
    if (fields.length === 0) return getGlobalSettings();

    try {
      const updated = await prisma.settings.update({
        where: { id: "global" },
        data
      });
      return updated;
    } catch (err) {
      logger.warn("Prisma client settings update failed, falling back to raw SQL updates:", err);
    }

    // Fallback: update fields one-by-one using raw SQL
    for (const field of fields) {
      const val = data[field];
      try {
        if (typeof val === 'string') {
          const escaped = val.replace(/'/g, "''");
          await prisma.$executeRawUnsafe(`UPDATE "Settings" SET "${field}" = '${escaped}' WHERE id = 'global'`);
          await prisma.$executeRawUnsafe(`UPDATE Settings SET ${field} = '${escaped}' WHERE id = 'global'`);
        } else if (typeof val === 'number') {
          await prisma.$executeRawUnsafe(`UPDATE "Settings" SET "${field}" = ${val} WHERE id = 'global'`);
          await prisma.$executeRawUnsafe(`UPDATE Settings SET ${field} = ${val} WHERE id = 'global'`);
        } else if (val === null) {
          await prisma.$executeRawUnsafe(`UPDATE "Settings" SET "${field}" = NULL WHERE id = 'global'`);
          await prisma.$executeRawUnsafe(`UPDATE Settings SET ${field} = NULL WHERE id = 'global'`);
        }
      } catch (e) {
        logger.error(`Raw SQL update failed for Settings.${field}:`, e);
      }
    }

    return getGlobalSettings();
  }

  // Settings
  app.get("/api/settings", async (req, res) => {
    try {
      let settings = await getGlobalSettings();
      if (!settings) {
        try {
          settings = await prisma.settings.create({ data: { id: "global", whatsappNumber: "966500000000", callingNumber: "966500000000", whatsappMessage: "مرحباً، أنا مهتم بهذا العقار: {title} - {link}" } });
        } catch (_) {
          try {
            await prisma.$executeRawUnsafe(`INSERT INTO "Settings" (id, "whatsappNumber", "callingNumber", "whatsappMessage") VALUES ('global', '966500000000', '966500000000', 'مرحباً، أنا مهتم بهذا العقار: {title} - {link}')`);
          } catch (_) {
            await prisma.$executeRawUnsafe(`INSERT INTO Settings (id, whatsappNumber, callingNumber, whatsappMessage) VALUES ('global', '966500000000', '966500000000', 'مرحباً، أنا مهتم بهذا العقار: {title} - {link}')`);
          }
          settings = await getGlobalSettings();
        }
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", requirePermission('settings'), async (req, res) => {
    try {
      const { 
        whatsappNumber, callingNumber, whatsappMessage, otpWebhookUrl, otpMessageTemplate, otpWebhookPayload, 
        homeImages, logoUrl, email, instagramUrl, twitterUrl, facebookUrl, linkedinUrl, youtubeUrl, tiktokUrl, snapchatUrl, 
        notificationEmail, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, analyticsScript, analyticsDashboardUrl,
        addressAr, addressEn, addressMapLink,
        techhubEnabled, techhubClientId, techhubClientSecret, techhubApiKey, techhubSandboxMode
      } = req.body;
      
      const updateData: any = {};
      
      if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber;
      if (callingNumber !== undefined) updateData.callingNumber = callingNumber;
      if (whatsappMessage !== undefined) updateData.whatsappMessage = whatsappMessage;
      if (otpWebhookUrl !== undefined) updateData.otpWebhookUrl = otpWebhookUrl;
      if (otpMessageTemplate !== undefined) updateData.otpMessageTemplate = otpMessageTemplate;
      if (otpWebhookPayload !== undefined) updateData.otpWebhookPayload = otpWebhookPayload;
      
      if (homeImages !== undefined) {
        let processedHomeImages = homeImages;
        if (homeImages) {
          try {
            const parsed = typeof homeImages === 'string' ? JSON.parse(homeImages) : homeImages;
            const processed: any = {};
            for (const key of Object.keys(parsed)) {
              processed[key] = saveBase64Image(parsed[key]);
            }
            processedHomeImages = JSON.stringify(processed);
          } catch (e) {
            // Ignore parse errors
          }
        }
        updateData.homeImages = processedHomeImages;
      }
      
      if (logoUrl !== undefined) {
        updateData.logoUrl = logoUrl ? saveBase64Image(logoUrl) : logoUrl;
      }
      
      if (email !== undefined) updateData.email = email;
      if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
      if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;
      if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
      if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
      if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;
      if (tiktokUrl !== undefined) updateData.tiktokUrl = tiktokUrl;
      if (snapchatUrl !== undefined) updateData.snapchatUrl = snapchatUrl;
      if (notificationEmail !== undefined) updateData.notificationEmail = notificationEmail;

      // Custom SMTP fields
      if (smtpHost !== undefined) updateData.smtpHost = smtpHost;
      if (smtpPort !== undefined) updateData.smtpPort = smtpPort ? Number(smtpPort) : null;
      if (smtpUser !== undefined) updateData.smtpUser = smtpUser;
      if (smtpPass !== undefined) updateData.smtpPass = smtpPass;
      if (smtpFrom !== undefined) updateData.smtpFrom = smtpFrom;

      // Custom Analytics fields
      if (analyticsScript !== undefined) updateData.analyticsScript = analyticsScript;
      if (analyticsDashboardUrl !== undefined) updateData.analyticsDashboardUrl = analyticsDashboardUrl;

      // Address & Map Links
      if (addressAr !== undefined) updateData.addressAr = addressAr;
      if (addressEn !== undefined) updateData.addressEn = addressEn;
      if (addressMapLink !== undefined) updateData.addressMapLink = addressMapLink;

      // TechHub Settings
      if (techhubEnabled !== undefined) updateData.techhubEnabled = techhubEnabled;
      if (techhubClientId !== undefined) updateData.techhubClientId = techhubClientId;
      if (techhubClientSecret !== undefined) updateData.techhubClientSecret = techhubClientSecret;
      if (techhubApiKey !== undefined) updateData.techhubApiKey = techhubApiKey;
      if (techhubSandboxMode !== undefined) updateData.techhubSandboxMode = techhubSandboxMode;

      const updated = await updateGlobalSettings(updateData);
      
      await logAction(req, "UPDATE_SETTINGS", "Updated global site settings");
      res.json(updated);
    } catch (error) {
      logger.error("Failed to update settings:", error);
      res.status(500).json({ error: "Failed to update settings: " + (error as any)?.message });
    }
  });

  // --- TechHub Integration Endpoints ---
  app.get("/api/admin/techhub/status", requirePermission('settings'), async (req, res) => {
    try {
      const settings = await getGlobalSettings();
      res.json({
        techhubEnabled: settings?.techhubEnabled ?? false,
        techhubClientId: settings?.techhubClientId ?? "",
        techhubClientSecret: settings?.techhubClientSecret ? "••••••••" : "",
        techhubApiKey: settings?.techhubApiKey ? "••••••••" : "",
        techhubSandboxMode: settings?.techhubSandboxMode ?? true,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch TechHub status" });
    }
  });

  app.post("/api/admin/techhub/sync", requirePermission('buildings'), async (req, res) => {
    try {
      const settings = await getGlobalSettings();
      if (!settings || !settings.techhubEnabled) {
        return res.status(400).json({ error: "TechHub integration is disabled. Please enable it in Settings first." });
      }

      logger.info("[TECHHUB SYNC] Fetching properties and contracts...");
      const thProperties = await fetchTechHubProperties(settings);
      const thContracts = await fetchTechHubContracts(settings);

      let buildingsSynced = 0;
      let unitsSynced = 0;
      let rentersSynced = 0;

      // 1. Sync Properties (Buildings & Units)
      for (const thProj of thProperties) {
        let building = await prisma.building.findFirst({
          where: { name: thProj.nameAr }
        });

        if (!building) {
          building = await prisma.building.create({
            data: { name: thProj.nameAr }
          });
          buildingsSynced++;
        }

        for (const thUnit of thProj.units) {
          const existingUnit = await prisma.renterUnit.findFirst({
            where: { buildingId: building.id, unitNumber: thUnit.unitNumber }
          });

          if (!existingUnit) {
            await prisma.renterUnit.create({
              data: {
                buildingId: building.id,
                unitNumber: thUnit.unitNumber,
                renterName: "متاح للتأجير",
                renterPhone: "",
                rentAmount: thUnit.price,
                contractEndDate: "",
                isTanfeeth: false
              }
            });
            unitsSynced++;
          } else {
            await prisma.renterUnit.update({
              where: { id: existingUnit.id },
              data: {
                rentAmount: thUnit.price
              }
            });
          }
        }
      }

      // 2. Sync Contracts (Renter details & RentHistory installments)
      for (const thContract of thContracts) {
        let building = await prisma.building.findFirst({
          where: { name: thContract.buildingName }
        });

        if (!building) {
          building = await prisma.building.create({
            data: { name: thContract.buildingName }
          });
          buildingsSynced++;
        }

        let normalizedPhone = "";
        if (thContract.renterPhone) {
          let phoneStr = thContract.renterPhone.replace(/\D/g, '');
          if (phoneStr.startsWith('966')) phoneStr = phoneStr.substring(3);
          normalizedPhone = phoneStr.replace(/^0+/, '');
        }

        if (!normalizedPhone) {
          // Auto-generate placeholder phone
          normalizedPhone = `temp_${thContract.contractNumber}`;
        }

        let renterUnit = await prisma.renterUnit.findFirst({
          where: { buildingId: building.id, unitNumber: thContract.unitNumber }
        });

        let nextRentDue: string | null = null;
        for (const inst of thContract.installments) {
          const pd = inst.paidDate || "";
          if (pd === "") {
            nextRentDue = inst.dueDate;
            break;
          }
        }

        if (renterUnit) {
          renterUnit = await prisma.renterUnit.update({
            where: { id: renterUnit.id },
            data: {
              renterName: thContract.renterName,
              renterPhone: normalizedPhone,
              contractEndDate: thContract.contractEndDate,
              rentAmount: thContract.rentAmount,
              nextRentDue: nextRentDue
            }
          });
        } else {
          renterUnit = await prisma.renterUnit.create({
            data: {
              buildingId: building.id,
              unitNumber: thContract.unitNumber,
              renterName: thContract.renterName,
              renterPhone: normalizedPhone,
              contractEndDate: thContract.contractEndDate,
              rentAmount: thContract.rentAmount,
              nextRentDue: nextRentDue,
              isTanfeeth: false
            }
          });
          unitsSynced++;
        }

        const currentDueDates = thContract.installments.map(inst => inst.dueDate).filter(Boolean);
        if (currentDueDates.length > 0) {
          await prisma.rentHistory.deleteMany({
            where: {
              renterUnitId: renterUnit.id,
              dueDate: { notIn: currentDueDates as string[] }
            }
          });
        } else {
          await prisma.rentHistory.deleteMany({
            where: { renterUnitId: renterUnit.id }
          });
        }

        for (const inst of thContract.installments) {
          const existingHistory = await prisma.rentHistory.findFirst({
            where: { renterUnitId: renterUnit.id, dueDate: inst.dueDate }
          });

          if (existingHistory) {
            await prisma.rentHistory.update({
              where: { id: existingHistory.id },
              data: {
                paidDate: inst.paidDate || existingHistory.paidDate,
                amount: inst.amount || existingHistory.amount
              }
            });
          } else {
            await prisma.rentHistory.create({
              data: {
                renterUnitId: renterUnit.id,
                dueDate: inst.dueDate,
                paidDate: inst.paidDate || "",
                amount: inst.amount
              }
            });
          }
        }

        rentersSynced++;
      }

      await logAction(req, "TECHHUB_SYNC", `Synced with TechHub: ${buildingsSynced} buildings, ${unitsSynced} units, ${rentersSynced} renters`);
      res.json({
        success: true,
        buildingsSynced,
        unitsSynced,
        rentersSynced
      });
    } catch (error) {
      logger.error("[TECHHUB SYNC ERROR]", error);
      res.status(500).json({ error: "Failed to synchronize with TechHub: " + (error as any)?.message });
    }
  });

  // Edit renter details (Name and Phone)
  app.put("/api/admin/renters/:id", requirePermission('renters'), async (req, res) => {
    try {
      const { id } = req.params;
      const { renterName, renterPhone, propagateToAll } = req.body;

      if (!renterName || renterPhone === undefined) {
        return res.status(400).json({ error: "Renter name and phone number are required." });
      }

      let normalizedNewPhone = renterPhone.trim().replace(/\D/g, '');
      if (normalizedNewPhone.startsWith('966')) normalizedNewPhone = normalizedNewPhone.substring(3);
      normalizedNewPhone = normalizedNewPhone.replace(/^0+/, '');

      const targetUnit = await prisma.renterUnit.findUnique({
        where: { id }
      });

      if (!targetUnit) {
        return res.status(404).json({ error: "Renter unit not found." });
      }

      const oldPhone = targetUnit.renterPhone;

      if (propagateToAll && oldPhone) {
        await prisma.renterUnit.updateMany({
          where: { renterPhone: oldPhone },
          data: {
            renterName,
            renterPhone: normalizedNewPhone
          }
        });
      } else {
        await prisma.renterUnit.update({
          where: { id },
          data: {
            renterName,
            renterPhone: normalizedNewPhone
          }
        });
      }

      await logAction(req, "UPDATE_RENDER", `Updated renter details for unit: ${targetUnit.unitNumber} (${renterName}, ${normalizedNewPhone})`);
      res.json({ success: true });
    } catch (error) {
      logger.error("[UPDATE RENTER ERROR]", error);
      res.status(500).json({ error: "Failed to update renter details." });
    }
  });

  // ---- Backup & Restore ----

  // GET /api/admin/backup  → streams a ZIP file containing:
  //   - db-data.json    (all database content serialized)
  //   - uploads/         (uploaded files)
  //   - manifest.json   (metadata)
  app.get("/api/admin/backup", requirePermission('settings'), async (req, res) => {
    try {
      const archive = archiver('zip', { zlib: { level: 6 } });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `benaa-edara-backup-${timestamp}.zip`;

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      archive.pipe(res);

      // Dump all database content as JSON
      const dbData = {
        properties: await prisma.property.findMany(),
        projects: await prisma.project.findMany(),
        buildings: await prisma.building.findMany(),
        renterUnits: await prisma.renterUnit.findMany(),
        rentHistory: await prisma.rentHistory.findMany(),
        receipts: await prisma.receipt.findMany(),
        settings: await prisma.settings.findMany(),
        users: await prisma.user.findMany(),
        admins: await prisma.admin.findMany(),
        services: await prisma.service.findMany(),
        callbackRequests: await prisma.callbackRequest.findMany(),
        callbackNotes: await prisma.callbackNote.findMany(),
        actionLogs: await prisma.actionLog.findMany()
      };

      archive.append(JSON.stringify(dbData, null, 2), { name: 'db-data.json' });

      // Pack files in uploads folder into the zip too
      if (fs.existsSync(UPLOADS_DIR)) {
        const files = fs.readdirSync(UPLOADS_DIR);
        for (const file of files) {
          const filePath = path.join(UPLOADS_DIR, file);
          if (fs.statSync(filePath).isFile()) {
            archive.file(filePath, { name: `uploads/${file}` });
          }
        }
      }

      // Manifest
      const manifest = {
        createdAt: new Date().toISOString(),
        version: '3.0',
        properties: dbData.properties.length,
        projects: dbData.projects.length,
        buildings: dbData.buildings.length,
        renterUnits: dbData.renterUnits.length,
        receipts: dbData.receipts.length,
        admins: dbData.admins.length,
        callbackRequests: dbData.callbackRequests.length,
        actionLogs: dbData.actionLogs.length
      };
      archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

      await logAction(req, "DOWNLOAD_BACKUP", "Downloaded complete site backup ZIP");
      await archive.finalize();
    } catch (error) {
      console.error('Backup error:', error);
      if (!res.headersSent) res.status(500).json({ error: 'Backup failed: ' + (error as any)?.message });
    }
  });

  // POST /api/admin/restore  → accepts multipart upload of a .zip containing a db-data.json file and uploads/ folder
  const restoreUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 * 1024 } });
  app.post("/api/admin/restore", requirePermission('settings'), restoreUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      let dbData: any = null;
      let zip: AdmZip | null = null;

      if (req.file.originalname.endsWith('.zip')) {
        zip = new AdmZip(req.file.buffer);
        const entry = zip.getEntries().find(e => e.entryName === 'db-data.json');
        if (!entry) {
          return res.status(400).json({ error: 'No db-data.json file found in ZIP' });
        }
        dbData = JSON.parse(entry.getData().toString('utf8'));
      } else {
        return res.status(400).json({ error: 'Please upload a valid backup .zip file' });
      }

      if (!dbData) {
        return res.status(400).json({ error: 'Failed to read backup data' });
      }

      // 1. Restore uploads folder files
      if (zip) {
        const entries = zip.getEntries();
        for (const entry of entries) {
          if (entry.entryName.startsWith('uploads/') && !entry.isDirectory) {
            const filename = path.basename(entry.entryName);
            const targetPath = path.join(UPLOADS_DIR, filename);
            fs.writeFileSync(targetPath, entry.getData());
          }
        }
      }

      // 2. Perform DB restore in a transaction
      await prisma.$transaction(async (tx) => {
        // Clear tables in reverse dependency order
        await tx.actionLog.deleteMany();
        await tx.callbackNote.deleteMany();
        await tx.callbackRequest.deleteMany();
        await tx.pageView.deleteMany();
        await tx.otpSession.deleteMany();
        await tx.receipt.deleteMany();
        await tx.rentHistory.deleteMany();
        await tx.renterUnit.deleteMany();
        await tx.building.deleteMany();
        await tx.property.deleteMany();
        await tx.project.deleteMany();
        await tx.settings.deleteMany();
        await tx.service.deleteMany();
        await tx.user.deleteMany();
        await tx.admin.deleteMany();

        // Restore tables
        if (dbData.admins && dbData.admins.length > 0) {
          await tx.admin.createMany({ data: dbData.admins });
        }
        if (dbData.users && dbData.users.length > 0) {
          await tx.user.createMany({ data: dbData.users });
        }
        if (dbData.settings && dbData.settings.length > 0) {
          await tx.settings.createMany({ data: dbData.settings });
        }
        if (dbData.services && dbData.services.length > 0) {
          await tx.service.createMany({ data: dbData.services });
        }
        if (dbData.projects && dbData.projects.length > 0) {
          await tx.project.createMany({ data: dbData.projects });
        }
        if (dbData.properties && dbData.properties.length > 0) {
          await tx.property.createMany({ data: dbData.properties });
        }
        if (dbData.buildings && dbData.buildings.length > 0) {
          await tx.building.createMany({ data: dbData.buildings });
        }
        if (dbData.renterUnits && dbData.renterUnits.length > 0) {
          await tx.renterUnit.createMany({ data: dbData.renterUnits });
        }
        if (dbData.rentHistory && dbData.rentHistory.length > 0) {
          await tx.rentHistory.createMany({ data: dbData.rentHistory });
        }
        if (dbData.receipts && dbData.receipts.length > 0) {
          await tx.receipt.createMany({ data: dbData.receipts });
        }
        if (dbData.callbackRequests && dbData.callbackRequests.length > 0) {
          await tx.callbackRequest.createMany({ data: dbData.callbackRequests });
        }
        if (dbData.callbackNotes && dbData.callbackNotes.length > 0) {
          await tx.callbackNote.createMany({ data: dbData.callbackNotes });
        }
        if (dbData.actionLogs && dbData.actionLogs.length > 0) {
          await tx.actionLog.createMany({ data: dbData.actionLogs });
        }
      });

      await logAction(req, "RESTORE_BACKUP", `Restored site database from uploaded backup ZIP: ${req.file.originalname}`);
      res.json({ success: true, message: 'Database and uploads restored successfully. Please refresh the page.' });
    } catch (error) {
      console.error('Restore error:', error);
      res.status(500).json({ error: 'Restore failed: ' + (error as any)?.message });
    }
  });

  // Users & Auth
  app.post("/api/login", authLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      logger.info(`Login attempt for username: ${username}`);
      
       // Check Admin
       const admin = await prisma.admin.findUnique({ where: { username } });
       if (admin && admin.password === password) {
         const userPayload = { 
           id: admin.id, 
           username: admin.username, 
           role: admin.role || 'ADMIN', 
           name: admin.name || 'Administrator',
           permissions: ROLE_PERMISSIONS[admin.role || 'ADMIN'] || []
         };
         const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });
         res.cookie('token', token, {
           httpOnly: true,
           secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
           sameSite: 'lax',
           maxAge: 24 * 60 * 60 * 1000 // 24 hours
         });
         logger.info(`Admin login successful for ${username} (${admin.role})`);
         return res.json(userPayload);
       }
 
       // Check User
       const user = await prisma.user.findUnique({ where: { username } });
       if (user && user.password === password) {
         const userPayload = { 
           id: user.id, 
           username: user.username, 
           role: 'USER', 
           name: user.name,
           permissions: []
         };
         const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });
         res.cookie('token', token, {
           httpOnly: true,
           secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
           sameSite: 'lax',
           maxAge: 24 * 60 * 60 * 1000 // 24 hours
         });
         logger.info(`User login successful for ${username}`);
         return res.json(userPayload);
       }
 
       // Hardcoded admin fallback for preview if DB is empty
       if (username === 'admin' && password === 'admin') {
         const userPayload = { 
           id: 'admin-fallback', 
           username: 'admin', 
           role: 'ADMIN', 
           name: 'Administrator',
           permissions: ROLE_PERMISSIONS['ADMIN']
         };
         const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });
         res.cookie('token', token, {
           httpOnly: true,
           secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
           sameSite: 'lax',
           maxAge: 24 * 60 * 60 * 1000 // 24 hours
         });
         logger.info(`Fallback admin login successful`);
         return res.json(userPayload);
       }

      logger.warn(`Failed login attempt for username: ${username}`);
      res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      logger.error(`Login error for username: ${req.body?.username}`, error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    res.clearCookie('token');
    logger.info("User logged out");
    res.json({ success: true, message: "Logged out successfully" });
  });

  app.put("/api/admin/credentials", async (req, res) => {
    try {
      const { adminId, currentUsername, newUsername, newPassword } = req.body;

      // Handle fallback admin
      if (adminId === 'admin-fallback' || currentUsername === 'admin') {
        return res.status(400).json({ error: "Cannot change fallback admin credentials. Please create a real admin in DB." });
      }

      const admin = await prisma.admin.findUnique({ where: { username: currentUsername } });
      if (!admin || admin.id !== adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const updateData: any = {};
      if (newUsername) updateData.username = newUsername;
      if (newPassword) updateData.password = newPassword;

      await prisma.admin.update({
        where: { id: adminId },
        data: updateData
      });

      res.json({ message: "Credentials updated successfully", newUsername: newUsername || currentUsername });
    } catch (error) {
      res.status(500).json({ error: "Failed to update credentials" });
    }
  });

  app.get("/api/users", requirePermission('renters'), async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, username: true, name: true }
      });
      res.json(users);
    } catch (error) {
      logger.error("Failed to fetch users", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requirePermission('renters'), async (req, res) => {
    try {
      const { username, password, name } = req.body;
      const user = await prisma.user.create({
        data: { username, password, name }
      });
      res.json({ id: user.id, username: user.username, name: user.name });
    } catch (error) {
      logger.error("Failed to create user", error);
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

  app.post("/api/services", requirePermission('settings'), async (req, res) => {
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
      logger.error("Failed to create service", error);
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
      logger.error("Analytics Error:", error);
      res.status(500).json({ error: "Failed to record view" });
    }
  });

  // Callback Requests API
  app.post("/api/callback-requests", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !phone) {
        return res.status(400).json({ error: "Name and phone number are required" });
      }
      const newRequest = await prisma.callbackRequest.create({
        data: { name, email, phone, message }
      });

      // Send Email notification ping
      await sendCallbackEmailNotification();

      res.status(201).json(newRequest);
    } catch (error) {
      logger.error("Failed to create callback request", error);
      res.status(500).json({ error: "Failed to submit request" });
    }
  });

  app.get("/api/callback-requests", requirePermission('callbacks'), async (req, res) => {
    try {
      const requests = await prisma.callbackRequest.findMany({
        include: { notes: { orderBy: { createdAt: 'asc' } } },
        orderBy: { createdAt: 'desc' }
      });
      res.json(requests);
    } catch (error) {
      logger.error("Failed to fetch callback requests", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.put("/api/callback-requests/:id/status", requirePermission('callbacks'), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await prisma.callbackRequest.update({
        where: { id },
        data: {
          status,
          handledBy: (req as any).user.name
        }
      });
      await logAction(req, "UPDATE_CALLBACK_STATUS", `Changed callback status of ${updated.name} to ${status}`);
      res.json(updated);
    } catch (error) {
      logger.error("Failed to update callback status", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.post("/api/callback-requests/:id/notes", requirePermission('callbacks'), async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      
      const note = await prisma.callbackNote.create({
        data: {
          callbackRequestId: id,
          text,
          authorName: (req as any).user.name
        }
      });
      
      // Update callback assignment
      const updatedRequest = await prisma.callbackRequest.update({
        where: { id },
        data: { handledBy: (req as any).user.name }
      });

      // Send Email notification ping to customer
      await sendReplyEmailNotification(updatedRequest, text, (req as any).user.name);

      // Send Email notification ping to staff
      await sendCallbackEmailNotification();

      await logAction(req, "REPLY_CALLBACK", `Added reply note to callback request ID ${id}`);
      res.status(201).json(note);
    } catch (error) {
      logger.error("Failed to create callback note", error);
      res.status(500).json({ error: "Failed to add note" });
    }
  });

  app.delete("/api/callback-requests/:id", requirePermission('callbacks'), async (req, res) => {
    try {
      const { id } = req.params;
      const reqData = await prisma.callbackRequest.findUnique({ where: { id } });
      await prisma.callbackRequest.delete({
        where: { id }
      });
      await logAction(req, "DELETE_CALLBACK", `Deleted callback request from ${reqData?.name || 'Unknown'} (${id})`);
      res.json({ success: true });
    } catch (error) {
      logger.error("Failed to delete callback request", error);
      res.status(500).json({ error: "Failed to delete request" });
    }
  });

  // ---- System Logs API ----
  app.get("/api/admin/logs", requirePermission('logs'), async (req, res) => {
    try {
      const logs = await prisma.actionLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 500
      });
      res.json(logs);
    } catch (error) {
      logger.error("Failed to fetch system logs", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // ---- Platform Users Management API (Admin model CRUD) ----
  app.get("/api/admin/users", requirePermission('users'), async (req, res) => {
    try {
      // Try Prisma client first
      try {
        const users = await prisma.admin.findMany({
          select: { id: true, username: true, name: true, role: true, email: true, createdAt: true },
          orderBy: { createdAt: 'desc' }
        });
        return res.json(users);
      } catch (err) {
        logger.warn("Prisma fetch platform users failed, falling back to raw SQL:", err);
      }

      // Fallback: Fetch using raw SQL
      let users: any[] = [];
      try {
        users = await prisma.$queryRawUnsafe<any[]>(`SELECT id, username, name, role, email, "createdAt" FROM "Admin" ORDER BY "createdAt" DESC`);
      } catch (_) {
        try {
          users = await prisma.$queryRawUnsafe<any[]>(`SELECT id, username, name, role, email, createdAt FROM Admin ORDER BY createdAt DESC`);
        } catch (_) {}
      }
      res.json(users);
    } catch (error) {
      logger.error("Failed to fetch platform users", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", requirePermission('users'), async (req, res) => {
    try {
      const { username, password, name, role, email } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const existing = await prisma.admin.findUnique({ where: { username } });
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Try Prisma client first
      try {
        const newUser = await prisma.admin.create({
          data: { username, password, name, role: role || "ADMIN", email }
        });
        await logAction(req, "ADD_PLATFORM_USER", `Created platform user: ${username} (${role || "ADMIN"})`);
        return res.status(201).json({ id: newUser.id, username: newUser.username, name: newUser.name, role: newUser.role, email: newUser.email });
      } catch (err) {
        logger.warn("Prisma user creation failed, falling back to raw SQL:", err);
      }

      // Fallback: Create using raw SQL
      const uuid = require('crypto').randomUUID();
      const escapedUser = username.replace(/'/g, "''");
      const escapedPass = password.replace(/'/g, "''");
      const escapedName = name.replace(/'/g, "''");
      const escapedRole = (role || "ADMIN").replace(/'/g, "''");
      const escapedEmail = email ? email.replace(/'/g, "''") : null;

      try {
        await prisma.$executeRawUnsafe(`
          INSERT INTO "Admin" (id, username, password, name, role, email, "createdAt")
          VALUES ('${uuid}', '${escapedUser}', '${escapedPass}', '${escapedName}', '${escapedRole}', ${escapedEmail ? `'${escapedEmail}'` : 'NULL'}, NOW())
        `);
      } catch (_) {
        await prisma.$executeRawUnsafe(`
          INSERT INTO Admin (id, username, password, name, role, email, createdAt)
          VALUES ('${uuid}', '${escapedUser}', '${escapedPass}', '${escapedName}', '${escapedRole}', ${escapedEmail ? `'${escapedEmail}'` : 'NULL'}, datetime('now'))
        `);
      }

      await logAction(req, "ADD_PLATFORM_USER", `Created platform user (raw SQL): ${username} (${role || "ADMIN"})`);
      res.status(201).json({ id: uuid, username, name, role: role || "ADMIN", email });
    } catch (error) {
      logger.error("Failed to create platform user", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, name, role, email } = req.body;
      
      const existing = await prisma.admin.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check username clash
      if (username && username !== existing.username) {
        const clash = await prisma.admin.findUnique({ where: { username } });
        if (clash) return res.status(400).json({ error: "Username already taken" });
      }

      // Try Prisma client first
      try {
        const updated = await prisma.admin.update({
          where: { id },
          data: {
            username: username || undefined,
            password: password || undefined,
            name: name || undefined,
            role: role || undefined,
            email: email !== undefined ? email : undefined
          }
        });
        await logAction(req, "UPDATE_PLATFORM_USER", `Updated platform user details: ${updated.username}`);
        return res.json({ id: updated.id, username: updated.username, name: updated.name, role: updated.role, email: updated.email });
      } catch (err) {
        logger.warn("Prisma user update failed, falling back to raw SQL:", err);
      }

      // Fallback: update using raw SQL
      if (username) {
        const escaped = username.replace(/'/g, "''");
        await prisma.$executeRawUnsafe(`UPDATE "Admin" SET username = '${escaped}' WHERE id = '${id}'`);
        await prisma.$executeRawUnsafe(`UPDATE Admin SET username = '${escaped}' WHERE id = '${id}'`);
      }
      if (password) {
        const escaped = password.replace(/'/g, "''");
        await prisma.$executeRawUnsafe(`UPDATE "Admin" SET password = '${escaped}' WHERE id = '${id}'`);
        await prisma.$executeRawUnsafe(`UPDATE Admin SET password = '${escaped}' WHERE id = '${id}'`);
      }
      if (name) {
        const escaped = name.replace(/'/g, "''");
        await prisma.$executeRawUnsafe(`UPDATE "Admin" SET name = '${escaped}' WHERE id = '${id}'`);
        await prisma.$executeRawUnsafe(`UPDATE Admin SET name = '${escaped}' WHERE id = '${id}'`);
      }
      if (role) {
        const escaped = role.replace(/'/g, "''");
        await prisma.$executeRawUnsafe(`UPDATE "Admin" SET role = '${escaped}' WHERE id = '${id}'`);
        await prisma.$executeRawUnsafe(`UPDATE Admin SET role = '${escaped}' WHERE id = '${id}'`);
      }
      if (email !== undefined) {
        const escaped = email ? `'${email.replace(/'/g, "''")}'` : 'NULL';
        await prisma.$executeRawUnsafe(`UPDATE "Admin" SET email = ${escaped} WHERE id = '${id}'`);
        await prisma.$executeRawUnsafe(`UPDATE Admin SET email = ${escaped} WHERE id = '${id}'`);
      }

      await logAction(req, "UPDATE_PLATFORM_USER", `Updated platform user details (raw SQL): ${username || existing.username}`);
      res.json({ id, username: username || existing.username, name: name || existing.name, role: role || existing.role, email: email !== undefined ? email : (existing as any).email });
    } catch (error) {
      logger.error("Failed to update platform user", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      if (id === (req as any).user.id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      const user = await prisma.admin.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ error: "User not found" });

      await prisma.admin.delete({ where: { id } });
      await logAction(req, "DELETE_PLATFORM_USER", `Deleted platform user: ${user.username}`);
      res.json({ success: true });
    } catch (error) {
      logger.error("Failed to delete platform user", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.get("/api/analytics", requirePermission('analytics'), async (req, res) => {
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
      logger.error("Failed to fetch analytics", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    (global as any).viteServer = vite;
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

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    logger.error(`Global error handler caught: ${err?.message || err}`, {
      url: req.url,
      method: req.method,
      stack: err?.stack
    });
    res.status(err?.status || 500).json({
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err?.message || 'Internal Server Error'
    });
  });

  // Synchronize DB schema and generate client dynamically (especially in production PostgreSQL environments)
  try {
    console.log("Synchronizing database schema and generating client via Prisma...");
    const { execSync } = require('child_process');
    execSync("npx prisma db push && npx prisma generate", { stdio: 'inherit' });
    console.log("Database schema synchronized and client regenerated successfully.");
  } catch (dbError) {
    console.error("Prisma schema sync or client generation skipped/failed:", dbError);
  }

  // Dynamically check and add missing columns directly in the SQL database (failsafe)
  try {
    console.log("Checking and correcting SQL database tables for missing columns...");
    await ensureDbColumnsExist();
    console.log("Database table checks complete.");
  } catch (err) {
    console.error("SQL database table checking failed:", err);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`--------------------------------------------------`);
    console.log(`[ADMIN] Fallback credentials (if DB is empty):`);
    console.log(`[ADMIN]   Username : admin`);
    console.log(`[ADMIN]   Password : admin`);
    console.log(`--------------------------------------------------`);
  });
}

startServer();
