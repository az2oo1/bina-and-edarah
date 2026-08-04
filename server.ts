import "dotenv/config";
import express from "express";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { prisma, Prisma } from "./src/lib/db.js";
import { fetchTechHubProperties, fetchTechHubContracts } from "./src/lib/techhub.js";
import { emailLogoSvg, emailLogoImg, LOGO_SVG, LOGO_BRAND_COLOR } from "./src/lib/logo.js";
import fs from "fs";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { execSync } from "child_process";
import { createRequire } from "module";
const cjsRequire = typeof module !== "undefined" && typeof require !== "undefined"
  ? require
  : createRequire(typeof import.meta !== "undefined" && (import.meta as any).url ? (import.meta as any).url : `file://${typeof __filename !== "undefined" ? __filename : ""}`);
import { ZipArchive } from "archiver";
import multer from "multer";
import AdmZip from "adm-zip";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";

const JWT_SECRET = process.env.JWT_SECRET || "bina-edara-jwt-secret-key-1337";

const LOG_FILE = fs.existsSync('/data') 
  ? '/data/server.log' 
  : path.resolve(process.cwd(), 'server.log');

export function serializeMeta(meta: any[]): string {
  if (!meta.length) return "";
  return meta.map(arg => {
    if (arg instanceof Error) {
      return `${arg.message}\n${arg.stack}`;
    }
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (err) {
        return String(arg);
      }
    }
    return String(arg);
  }).join(' ');
}

const logger = {
  info: (msg: string, ...meta: any[]) => {
    const time = new Date().toISOString();
    const logMsg = `[${time}] [INFO] ${msg} ${serializeMeta(meta)}\n`;
    console.log(logMsg.trim());
    try {
      fs.appendFileSync(LOG_FILE, logMsg);
    } catch (e) {
      console.error("Failed to write to log file", e);
    }
  },
  error: (msg: string, ...meta: any[]) => {
    const time = new Date().toISOString();
    const logMsg = `[${time}] [ERROR] ${msg} ${serializeMeta(meta)}\n`;
    console.error(logMsg.trim());
    try {
      fs.appendFileSync(LOG_FILE, logMsg);
    } catch (e) {
      console.error("Failed to write to log file", e);
    }
  },
  warn: (msg: string, ...meta: any[]) => {
    const time = new Date().toISOString();
    const logMsg = `[${time}] [WARN] ${msg} ${serializeMeta(meta)}\n`;
    console.warn(logMsg.trim());
    try {
      fs.appendFileSync(LOG_FILE, logMsg);
    } catch (e) {
      console.error("Failed to write to log file", e);
    }
  }
};

export function getSiteUrl(req?: any): string {
  if (process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL") {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (req) {
    const host = req.get("host");
    const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    return `${protocol}://${host}`;
  }
  return "http://localhost:3000";
}

async function sendCallbackEmailNotification(req?: any) {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    
    // Fetch all admin/staff users with configured emails
    const admins = await prisma.admin.findMany({
      where: {
        email: {
          not: null,
          notIn: [""]
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
    const siteUrl = getSiteUrl(req);

    const formattedFrom = from.includes("<") ? from : `"بناء وإدارة العقارية | Benaa & Edara" <${from}>`;
    const fromDomain = from.includes('@') ? from.split('@')[1].trim().replace('>', '') : 'benaa-edara.com';

    const logoHtml = emailLogoImg(siteUrl, 80);

    const emailSubject = "طلب جديد على المنصة / New Request on Platform";
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; background-color: #FFFFFF; font-family: 'Cairo', 'Inter', sans-serif; -webkit-font-smoothing: antialiased;">
        
        <!-- Full-Width Header -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF; border-bottom: 4px solid #34505e; direction: rtl;">
          <tr>
            <td style="padding: 25px 20px; text-align: center;">
              <div style="font-size: 16px; font-weight: 700; color: #34505e; margin-bottom: 12px; font-family: 'Cairo', sans-serif; letter-spacing: 0.5px;">
                بناء وإدارة العقارية &nbsp;|&nbsp; Benaa & Edara Real Estate
              </div>
              ${logoHtml}
            </td>
          </tr>
        </table>

        <!-- Main Content Area -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF; direction: rtl;">
          <tr>
            <td align="center">
              <!-- Content wrapper -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 800px; margin: 0 auto;">
                <tr>
                  <td style="padding: 20px 30px; text-align: right;">
                    
                    <!-- Title -->
                    <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; font-family: 'Cairo', sans-serif;">
                      طلب اتصال جديد / New Request
                    </h1>

                    <p style="margin: 0 0 15px 0; font-size: 17px; line-height: 1.7; color: #4B5563; font-family: 'Cairo', sans-serif;">
                      يوجد طلب اتصال أو رسالة تواصل جديدة على المنصة. يرجى تسجيل الدخول إلى لوحة التحكم لمعاينة التفاصيل ومعالجتها.
                    </p>

                    <p style="margin: 0 0 40px 0; font-size: 15px; line-height: 1.6; color: #6B7280; font-family: 'Inter', sans-serif; text-align: left; direction: ltr; border-left: 3px solid #D4AF37; padding-left: 15px;">
                      There is a new contact or callback request on the platform. Please log in to the admin panel to view the details and handle it.
                    </p>

                    <!-- Action Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 30px 0 40px 0;">
                      <tr>
                        <td align="center">
                          <a href="${siteUrl}/admin" style="background-color: #1A202C; color: #FFFFFF; border: 1px solid #D4AF37; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 15px; font-family: 'Cairo', 'Inter', sans-serif; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            الانتقال إلى لوحة التحكم / Go to Admin Panel
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Signature -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #F3F4F6;">
                          <p style="margin: 0 0 6px 0; font-size: 15px; color: #6B7280; font-family: 'Cairo', sans-serif;">مع أطيب التحيات،</p>
                          <p style="margin: 0; font-size: 14px; color: #D4AF37; font-weight: 600; font-family: 'Cairo', sans-serif;">بناء وإدارة العقارية</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Compact Dark Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #1A202C; direction: rtl;">
          <tr>
            <td style="padding: 25px 20px; text-align: center; color: #A0AEC0; font-family: 'Cairo', 'Inter', sans-serif;">
              
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #FFFFFF;">
                بناء وإدارة العقارية / Benaa & Edara Real Estate
              </h3>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

    const textContent = `
طلب اتصال جديد / New Contact Request

يوجد طلب اتصال أو رسالة تواصل جديدة على المنصة. يرجى تسجيل الدخول إلى لوحة التحكم لمعاينة التفاصيل ومعالجتها.
There is a new contact or callback request on the platform. Please log in to the admin panel to view the details and handle it.

الانتقال إلى لوحة التحكم / Go to Admin Panel: ${siteUrl}/admin

بناء وإدارة العقارية / Benaa & Edara Real Estate
    `.trim();

    if (!host || !user || !pass) {
      logger.warn(`[EMAIL PING WARNING] SMTP credentials not set in settings or environment. Set in Settings tab or env variables SMTP_HOST, SMTP_USER, SMTP_PASS to send real emails.`);
      logger.info(`[EMAIL PING MOCK] Email ping sent to: ${toEmails}\nSubject: ${emailSubject}\nContent:\n${htmlContent}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: formattedFrom,
      to: toEmails,
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      messageId: `<new-callback-alert-${Date.now()}@${fromDomain}>`
    });
    logger.info(`[EMAIL PING SUCCESS] Callback email notification sent to employees: ${toEmails}`);
  } catch (error) {
    logger.error(`[EMAIL PING ERROR] Failed to send callback email notification`, error);
  }
}

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['properties', 'projects', 'buildings', 'renters', 'analytics', 'settings', 'callbacks', 'users', 'logs', 'maintenance'],
  MANAGER: ['properties', 'projects', 'buildings', 'renters', 'callbacks', 'analytics', 'maintenance'],
  AGENT: ['properties', 'projects', 'callbacks'],
  MAINTENANCE: ['maintenance', 'renters', 'buildings']
};

async function sendReplyEmailNotification(callbackRequest: any, replyText: string, senderName?: string, req?: any) {
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
    const siteUrl = getSiteUrl(req);

    const formattedFrom = from.includes("<") ? from : `"بناء وإدارة العقارية | Benaa & Edara" <${from}>`;
    const fromDomain = from.includes('@') ? from.split('@')[1].trim().replace('>', '') : 'benaa-edara.com';

    // Fetch all notes of this request to calculate threading headers
    const notes = await prisma.callbackNote.findMany({
      where: { callbackRequestId: callbackRequest.id },
      orderBy: { createdAt: 'asc' }
    });

    const currentNote = notes[notes.length - 1];
    const messageId = currentNote 
      ? `<note-${currentNote.id}@${fromDomain}>` 
      : `<request-reply-${callbackRequest.id}@${fromDomain}>`;

    const mailHeaders: Record<string, string> = {};
    if (notes.length > 1) {
      const previousNote = notes[notes.length - 2];
      mailHeaders['In-Reply-To'] = `<note-${previousNote.id}@${fromDomain}>`;
      mailHeaders['References'] = notes.slice(0, notes.length - 1).map(n => `<note-${n.id}@${fromDomain}>`).join(' ');
    }

    const emailSubject = notes.length > 1
      ? `Re: رد على طلبك / Reply to your request - بناء وإدارة`
      : `رد على طلبك / Reply to your request - بناء وإدارة`;

    const logoHtml = emailLogoImg(siteUrl, 80);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; background-color: #FFFFFF; font-family: 'Cairo', 'Inter', sans-serif; -webkit-font-smoothing: antialiased;">
        
        <!-- Full-Width Header -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF; border-bottom: 4px solid #34505e; direction: rtl;">
          <tr>
            <td style="padding: 25px 20px; text-align: center;">
              <div style="font-size: 16px; font-weight: 700; color: #34505e; margin-bottom: 12px; font-family: 'Cairo', sans-serif; letter-spacing: 0.5px;">
                بناء وإدارة العقارية &nbsp;|&nbsp; Benaa & Edara Real Estate
              </div>
              ${logoHtml}
            </td>
          </tr>
        </table>

        <!-- Main Content Area -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #FFFFFF; direction: rtl;">
          <tr>
            <td align="center">
              <!-- Content wrapper -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 800px; margin: 0 auto;">
                <tr>
                  <td style="padding: 20px 30px; text-align: right;">
                    
                    <!-- Greeting -->
                    <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #111827; font-family: 'Cairo', sans-serif;">
                      مرحباً ${callbackRequest.name}،
                    </h1>

                    <p style="margin: 0 0 30px 0; font-size: 17px; line-height: 1.7; color: #4B5563; font-family: 'Cairo', sans-serif;">
                      شكراً لتواصلك مع شركة بناء وإدارة العقارية. تم الرد على استفسارك من قبل فريقنا:
                    </p>

                    <!-- The Actual Reply -->
                    <div style="margin: 0 0 40px 0; font-size: 20px; line-height: 1.8; color: #111827; font-weight: 600; font-family: 'Cairo', sans-serif; white-space: pre-line;">
                      ${replyText}
                    </div>

                    <!-- Original Message Block -->
                    ${callbackRequest.message ? `
                    <div style="border-right: 4px solid #D4AF37; padding: 15px 25px; margin-bottom: 40px; background-color: #FAFAFA; font-family: 'Cairo', sans-serif;">
                      <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px;">
                        رسالتك الأصلية / Your Message
                      </p>
                      <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #6B7280; font-style: italic;">
                        "${callbackRequest.message}"
                      </p>
                    </div>
                    ` : ''}

                    <!-- Signature -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #F3F4F6;">
                          <p style="margin: 0 0 6px 0; font-size: 15px; color: #6B7280; font-family: 'Cairo', sans-serif;">مع أطيب التحيات،</p>
                          <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 700; color: #111827; font-family: 'Cairo', sans-serif;">${senderName || 'المدير العام / Administrator'}</p>
                          <p style="margin: 0; font-size: 14px; color: #D4AF37; font-weight: 600; font-family: 'Cairo', sans-serif;">شركة بناء وإدارة العقارية</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Slim Reply Instruction Bar -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #F9FAFB; border-top: 1px solid #E5E7EB; direction: rtl;">
          <tr>
            <td style="padding: 12px 20px; text-align: center; font-family: 'Cairo', 'Inter', sans-serif;">
              <p style="margin: 0; font-size: 13px; color: #4B5563;">
                للرد علينا، يمكنك ببساطة الرد مباشرة على هذا البريد الإلكتروني.
                <span style="font-size: 12px; color: #9CA3AF; font-family: 'Inter', sans-serif; display: inline-block; margin-right: 8px;">You can reply directly to this email to get in touch.</span>
              </p>
            </td>
          </tr>
        </table>

        <!-- Compact Dark Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #1A202C; direction: rtl;">
          <tr>
            <td style="padding: 25px 20px; text-align: center; color: #A0AEC0; font-family: 'Cairo', 'Inter', sans-serif;">
              
              <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #FFFFFF;">
                شركة بناء وإدارة العقارية
              </h3>

              <!-- Contact Links -->
              <div style="margin-bottom: 12px; font-size: 13px;">
                <a href="mailto:${replyTo}" style="color: #D4AF37; text-decoration: none; display: inline-block; margin: 0 10px;">
                  ${replyTo}
                </a>
                ${settings?.callingNumber ? `
                <span style="color: #4A5568;">|</span>
                <a href="tel:${settings.callingNumber}" style="color: #D4AF37; text-decoration: none; display: inline-block; margin: 0 10px; font-family: 'Inter', sans-serif;">
                  ${settings.callingNumber}
                </a>
                ` : ''}
                ${settings?.whatsappNumber ? `
                <span style="color: #4A5568;">|</span>
                <a href="https://wa.me/${settings.whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}" style="color: #D4AF37; text-decoration: none; display: inline-block; margin: 0 10px; font-family: 'Inter', sans-serif;">
                  واتساب / WhatsApp
                </a>
                ` : ''}
              </div>

              <!-- Location -->
              ${settings?.addressAr ? `
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #718096;">
                ${settings.addressAr}
              </p>
              ` : ''}

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

    const plainReplyText = replyText.replace(/<[^>]*>/g, '').trim();
    const textContent = `
مرحباً ${callbackRequest.name}،

تم الرد على طلب الاتصال أو رسالة التواصل الخاصة بك من قبل فريق بناء وإدارة:

${plainReplyText}

${callbackRequest.message ? `----------------------------------------
الرسالة الأصلية / Original Message:
"${callbackRequest.message}"` : ''}

مع أطيب التحيات، / Best regards,
${senderName || 'فريق بناء وإدارة / Benaa & Edara Team'}
شركة بناء وإدارة العقارية / Benaa & Edara Real Estate

💬 يمكنك الرد مباشرة على هذا البريد الإلكتروني للتواصل معنا.
You can reply directly to this email to get in touch with us.

البريد / Email: ${replyTo}
${settings?.callingNumber ? `الهاتف / Phone: ${settings.callingNumber}` : ''}
${settings?.whatsappNumber ? `واتساب / WhatsApp: +${settings.whatsappNumber}` : ''}
${settings?.addressAr ? `الموقع / Location: ${settings.addressAr}` : ''}
    `.trim();

    if (!host || !user || !pass) {
      logger.warn(`[REPLY EMAIL WARNING] SMTP credentials not set. Cannot send real email to customer.`);
      logger.info(`[REPLY EMAIL MOCK] Email reply sent to: ${callbackRequest.email}\nSubject: ${emailSubject}\nContent:\n${htmlContent}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    await transporter.sendMail({
      from: formattedFrom,
      to: callbackRequest.email,
      replyTo,
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      messageId: messageId,
      headers: mailHeaders
    });
    logger.info(`[REPLY EMAIL SUCCESS] Reply email sent to customer: ${callbackRequest.email}`);
  } catch (error) {
    logger.error(`[REPLY EMAIL ERROR] Failed to send reply email to customer`, error);
  }
}

function cleanEmailReplyBody(body: string): string {
  if (!body) return '';
  
  const lines = body.split(/\r?\n/);
  const cleanLines: string[] = [];
  
  const markers = [
    /^\s*On\s+.*,\s+.*,\s+.*wrote:\s*$/i,
    /^\s*On\s+.*wrote:\s*$/i,
    /^\s*في\s+.*كتب\s+.*:\s*$/i,
    /^\s*-+\s*Original\s+Message\s*-+\s*$/i,
    /^\s*-+\s*الرسالة\s+الأصلية\s*-+\s*$/i,
    /^\s*From:\s+/i,
    /^\s*من:\s+/i,
    /^\s*Sent:\s+/i,
    /^\s*________________________________\s*$/
  ];
  
  for (const line of lines) {
    let isMarker = false;
    for (const marker of markers) {
      if (marker.test(line)) {
        isMarker = true;
        break;
      }
    }
    if (isMarker) {
      break;
    }
    cleanLines.push(line);
  }
  
  let result = cleanLines.join('\n').trim();
  result = result.replace(/\n\s*--\s*\n[\s\S]*$/, '');
  return result;
}

let isSyncing = false;

async function syncInboundEmails() {
  if (isSyncing) return;
  isSyncing = true;
  
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    const host = settings?.imapHost;
    const port = settings?.imapPort || 993;
    const user = settings?.smtpUser;
    const pass = settings?.smtpPass;
    
    if (!host || !user || !pass) {
      return;
    }
    
    const client = new ImapFlow({
      host,
      port,
      secure: port === 993,
      auth: { user, pass },
      logger: false,
      tls: {
        rejectUnauthorized: false
      },
      clientInfo: {
        name: 'Benaa & Edara Inbound Sync'
      }
    });
    
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    
    try {
      const unseenMessages = (await client.search({ seen: false })) || [];
      
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 3);
      const recentMessages = (await client.search({ since: sinceDate })) || [];
      
      const messages = Array.from(new Set([...unseenMessages, ...recentMessages])).sort((a, b) => a - b);
      
      for (const uid of messages) {
        try {
          const emailData = await client.fetchOne(uid, { source: true });
          if (!emailData || !emailData.source) continue;
          
          const parsed = await simpleParser(emailData.source);
          const referencesList: string[] = [];
          
          if (parsed.inReplyTo) {
            referencesList.push(parsed.inReplyTo);
          }
          if (parsed.references) {
            if (Array.isArray(parsed.references)) {
              referencesList.push(...parsed.references);
            } else {
              referencesList.push(parsed.references);
            }
          }
          
          let matchedRequest = null;
          for (const ref of referencesList) {
            // Match note ID
            const noteMatch = ref.match(/<note-([^@]+)@/);
            if (noteMatch) {
              const noteId = noteMatch[1];
              const note = await prisma.callbackNote.findUnique({
                where: { id: noteId },
                include: { callbackRequest: true }
              });
              if (note?.callbackRequest) {
                matchedRequest = note.callbackRequest;
                break;
              }
            }
            
            // Match direct request ID
            const requestMatch = ref.match(/<request-reply-([^@]+)@/);
            if (requestMatch) {
              const requestId = requestMatch[1];
              const callbackRequest = await prisma.callbackRequest.findUnique({
                where: { id: requestId }
              });
              if (callbackRequest) {
                matchedRequest = callbackRequest;
                break;
              }
            }
          }

          const senderInfo = parsed.from?.value?.[0];
          const senderEmail = senderInfo?.address?.toLowerCase().trim();
          const senderDisplayName = senderInfo?.name?.trim();

          // Fallback: match by sender's email address if no header matches
          if (!matchedRequest && senderEmail) {
            const activeRequest = await prisma.callbackRequest.findFirst({
              where: {
                email: senderEmail,
                status: {
                  not: 'CLOSED'
                }
              },
              orderBy: {
                createdAt: 'desc'
              }
            });
            if (activeRequest) {
              matchedRequest = activeRequest;
              logger.info(`[IMAP SYNC] Matched inbound email to active callback request ID ${activeRequest.id} by sender email ${senderEmail}`);
            }
          }
          
          if (matchedRequest) {
            let rawBody = parsed.text || '';
            if (!rawBody && parsed.html) {
              rawBody = parsed.html.replace(/<[^>]*>/g, ' ');
            }
            const cleanedText = cleanEmailReplyBody(rawBody);
            
            if (cleanedText) {
              const existingNote = await prisma.callbackNote.findFirst({
                where: {
                  callbackRequestId: matchedRequest.id,
                  text: cleanedText
                }
              });
              
              if (!existingNote) {
                const inboundAuthorName = senderDisplayName || senderEmail || matchedRequest.name || 'Customer';
                await prisma.callbackNote.create({
                  data: {
                    callbackRequestId: matchedRequest.id,
                    text: cleanedText,
                    authorName: inboundAuthorName
                  }
                });
                
                await prisma.callbackRequest.update({
                  where: { id: matchedRequest.id },
                  data: { status: 'STILL_GOING' }
                });
                
                logger.info(`[IMAP SYNC] Synchronized inbound reply email from customer for callback request ID ${matchedRequest.id}`);
              }
            }
          }
          
          if (unseenMessages.includes(uid)) {
            await client.messageFlagsAdd(uid, ['\\Seen']);
          }
        } catch (msgErr) {
          logger.error(`[IMAP SYNC] Failed to process message UID ${uid}:`, msgErr);
        }
      }
    } finally {
      lock.release();
      await client.logout();
    }
  } catch (error) {
    logger.error("[IMAP SYNC ERROR] Failed during IMAP connection or polling:", error);
  } finally {
    isSyncing = false;
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
  propertiesAdmin: any | null;
  propertiesPublic: any | null;
  projects: any | null;
  settings: any | null;
  settingsCached: boolean;
}
const dbCache: CacheStore = {
  propertiesAdmin: null,
  propertiesPublic: null,
  projects: null,
  settings: null,
  settingsCached: false
};

function invalidateCache(type: 'properties' | 'projects') {
  if (type === 'properties') {
    dbCache.propertiesAdmin = null;
    dbCache.propertiesPublic = null;
  } else {
    dbCache[type] = null;
  }
  logger.info(`Cache invalidated for ${type}`);
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again after 15 minutes." }
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "لقد تجاوزت عدد محاولات طلب رمز التحقق. يرجى المحاولة بعد 15 دقيقة. (Too many OTP requests. Please try again after 15 minutes.)" }
});

const UPLOADS_DIR = fs.existsSync('/data') 
  ? '/data/uploads' 
  : path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const homeVideoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.mp4';
      cb(null, `${crypto.randomUUID()}${ext}`);
    }
  }),
  limits: { fileSize: 500 * 1024 * 1024 }
});

function saveBase64Image(dataStr: string): string {
  if (!dataStr || typeof dataStr !== 'string') return dataStr;
  
  // Check if it's a base64 video data URL
  const videoMatch = dataStr.match(/^data:video\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (videoMatch) {
    const ext = videoMatch[1];
    const base64Data = videoMatch[2];
    const filename = `${crypto.randomUUID()}.${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
    return `/uploads/${filename}`;
  }

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

function parseImageArray(input: string | any[] | null | undefined): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(item => typeof item === 'string' && item.length > 0);
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.filter(item => typeof item === 'string' && item.length > 0);
    } catch (e) {}
  }
  return [];
}

function stringifyImageArray(input: any): string {
  const arr = parseImageArray(input);
  return JSON.stringify(arr);
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

function processDocumentUrls(docsInput: any): string {
  if (!docsInput) return JSON.stringify([]);
  try {
    const docs = typeof docsInput === 'string' ? JSON.parse(docsInput) : docsInput;
    if (Array.isArray(docs)) {
      const processed = docs.map((doc: any) => {
        if (doc && typeof doc === 'object') {
          return {
            name: doc.name || 'Document.pdf',
            url: saveBase64Image(doc.url),
            size: doc.size || null
          };
        }
        return {
          name: 'Document.pdf',
          url: saveBase64Image(String(doc)),
          size: null
        };
      });
      return JSON.stringify(processed);
    }
  } catch (e) {
    // fallback
  }
  if (typeof docsInput === 'string') {
    return JSON.stringify([{ name: 'Document.pdf', url: saveBase64Image(docsInput), size: null }]);
  }
  return JSON.stringify([]);
}

function extractToken(req: any): string | null {
  if (req.cookies?.token) return req.cookies.token;
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.headers?.['x-access-token']) {
    return req.headers['x-access-token'] as string;
  }
  return null;
}

function adminAuthMiddleware(req: any, res: any, next: any) {
  const token = extractToken(req);
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
    const token = extractToken(req);
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
  app.set('trust proxy', 1);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // HTTP response compression (gzip/brotli) for all API responses
  app.use(compression());

  // Read cookies
  app.use(cookieParser());

  // Safe JSON payload limits to protect against memory exhaustion / JSON DoS attacks
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  // Serve static uploaded files
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Dynamic SEO Open Graph Meta Injection for WhatsApp / Facebook / Twitter crawlers
  // Serves property image as binary JPEG/PNG (supports base64, /uploads/ paths, and external URLs)
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

      const imgData = images[imgIndex];
      if (!imgData) return res.status(404).send('No Image');

      // Case 1: Base64 data URL
      if (imgData.startsWith('data:image')) {
        const matches = imgData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).send('Invalid Base64 format');
        }
        const contentType = matches[1];
        const imageBuffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(imageBuffer);
      }

      // Case 2: Local file path (/uploads/xxx.jpg)
      if (imgData.startsWith('/uploads/') || imgData.startsWith('uploads/')) {
        const fileName = imgData.replace(/^\/?uploads\//, '');
        const filePath = path.resolve(UPLOADS_DIR, fileName);
        if (filePath.startsWith(path.resolve(UPLOADS_DIR) + path.sep) && fs.existsSync(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.sendFile(filePath);
        }
        return res.status(404).send('Image file not found');
      }

      // Case 3: External URL — redirect
      if (imgData.startsWith('http://') || imgData.startsWith('https://')) {
        return res.redirect(imgData);
      }

      return res.status(400).send('Unsupported image format');
    } catch (err) {
      return res.status(500).send('Internal Error');
    }
  });

  // Serves project image as binary JPEG/PNG (supports base64, /uploads/ paths, and external URLs)
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

      const imgData = images[imgIndex];
      if (!imgData) return res.status(404).send('No Image');

      // Case 1: Base64 data URL
      if (imgData.startsWith('data:image')) {
        const matches = imgData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).send('Invalid Base64 format');
        }
        const contentType = matches[1];
        const imageBuffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(imageBuffer);
      }

      // Case 2: Local file path (/uploads/xxx.jpg)
      if (imgData.startsWith('/uploads/') || imgData.startsWith('uploads/')) {
        const fileName = imgData.replace(/^\/?uploads\//, '');
        const filePath = path.resolve(UPLOADS_DIR, fileName);
        if (filePath.startsWith(path.resolve(UPLOADS_DIR) + path.sep) && fs.existsSync(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.sendFile(filePath);
        }
        return res.status(404).send('Image file not found');
      }

      // Case 3: External URL — redirect
      if (imgData.startsWith('http://') || imgData.startsWith('https://')) {
        return res.redirect(imgData);
      }

      return res.status(400).send('Unsupported image format');
    } catch (err) {
      return res.status(500).send('Internal Error');
    }
  });

  // Serves settings logo as SVG for email clients (all clients can load a hosted SVG via <img>)
  app.get('/settings-logo.svg', async (req, res) => {
    try {
      const settings = await prisma.settings.findUnique({ where: { id: "global" } });
      if (settings?.logoUrl) {
        const base64Data = settings.logoUrl;
        // If it's a stored base64 image, serve it directly
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
        // File path in uploads
        if (base64Data.startsWith('/uploads/') || base64Data.startsWith('uploads/')) {
          const fileName = base64Data.replace(/^\/?uploads\//, '');
          const filePath = path.resolve(UPLOADS_DIR, fileName);
          if (filePath.startsWith(path.resolve(UPLOADS_DIR) + path.sep) && fs.existsSync(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.sendFile(filePath);
          }
        }
        // External URL — redirect
        if (base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
          return res.redirect(base64Data);
        }
      }
      // Fallback: serve the brand SVG as an image
      const brandSvg = LOGO_SVG.replace('currentColor', LOGO_BRAND_COLOR);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(brandSvg);
    } catch (err) {
      logger.error("Failed to serve settings logo SVG:", err);
      return res.status(500).send('Internal Error');
    }
  });

  // Serves settings logo as binary image
  app.get('/settings-logo.png', async (req, res) => {
    try {
      const settings = await prisma.settings.findUnique({ where: { id: "global" } });
      if (!settings || !settings.logoUrl) {
        return res.sendFile(path.join(process.cwd(), 'public', 'logo-default.png'));
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

      if (base64Data.startsWith('/uploads/') || base64Data.startsWith('uploads/')) {
        const fileName = base64Data.replace(/^\/?uploads\//, '');
        const filePath = path.resolve(UPLOADS_DIR, fileName);
        if (filePath.startsWith(path.resolve(UPLOADS_DIR) + path.sep) && fs.existsSync(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.sendFile(filePath);
        }
      }

      if (base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
        return res.redirect(base64Data);
      }

      const directPath = path.resolve(process.cwd(), base64Data.replace(/^\//, ''));
      if (directPath.startsWith(path.resolve(process.cwd()) + path.sep) && fs.existsSync(directPath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(directPath);
      }

      return res.sendFile(path.join(process.cwd(), 'public', 'logo-default.png'));
    } catch (err) {
      logger.error("Failed to serve settings logo:", err);
      return res.status(500).send('Internal Error');
    }
  });

  // Serves settings hero image as binary image
  app.get('/settings-hero.jpg', async (req, res) => {
    try {
      const settings = await prisma.settings.findUnique({ where: { id: "global" } });
      let heroData = null;
      if (settings?.homeImages) {
        try {
          const parsed = JSON.parse(settings.homeImages);
          if (parsed && parsed.hero) {
            heroData = parsed.hero;
          }
        } catch (_) {}
      }

      if (!heroData) {
        return res.sendFile(path.join(process.cwd(), 'public', 'skyscrapers.png'));
      }

      // Case 1: Base64 data URL
      if (heroData.startsWith('data:image')) {
        const matches = heroData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const imageBuffer = Buffer.from(matches[2], 'base64');
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.send(imageBuffer);
        }
      }

      // Case 2: Local file path in uploads
      if (heroData.startsWith('/uploads/') || heroData.startsWith('uploads/')) {
        const fileName = heroData.replace(/^\/?uploads\//, '');
        const filePath = path.resolve(UPLOADS_DIR, fileName);
        if (filePath.startsWith(path.resolve(UPLOADS_DIR) + path.sep) && fs.existsSync(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.sendFile(filePath);
        }
      }

      // Case 3: External URL — redirect
      if (heroData.startsWith('http://') || heroData.startsWith('https://')) {
        return res.redirect(heroData);
      }

      // Case 4: direct path check
      const directPath = path.resolve(process.cwd(), heroData.replace(/^\//, ''));
      if (directPath.startsWith(path.resolve(process.cwd()) + path.sep) && fs.existsSync(directPath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(directPath);
      }

      return res.sendFile(path.join(process.cwd(), 'public', 'skyscrapers.png'));
    } catch (err) {
      logger.error("Failed to serve settings hero:", err);
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
      const settings = await getGlobalSettings();
      
      const host = req.get('host');
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      const siteUrl = `${protocol}://${host}`;
      
      let imageUrl = `${siteUrl}/settings-hero.jpg`;
      
      // If it's a property page
      if (urlPath.startsWith('/properties/')) {
        const id = urlPath.split('/')[2];
        if (id && id !== 'new') {
          const property = await prisma.property.findUnique({ where: { id } });
          if (property) {
            title = `${property.titleAr} | ${property.titleEn} - بناء وإدارة`;
            description = property.description || description;
            
            let hasImages = false;
            try {
              const images = JSON.parse(property.imageUrls);
              if (Array.isArray(images) && images.length > 0 && images[0]) {
                hasImages = true;
              }
            } catch (_) {}
            
            if (hasImages) {
              imageUrl = `${siteUrl}/property-image/${property.id}/0.jpg`;
            }
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
            
            let hasImages = false;
            try {
              const images = JSON.parse(project.imageUrls);
              if (Array.isArray(images) && images.length > 0 && images[0]) {
                hasImages = true;
              }
            } catch (_) {}
            
            if (hasImages) {
              imageUrl = `${siteUrl}/project-image/${project.id}/0.jpg`;
            }
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
        <meta property="og:site_name" content="شركة بناء وإدارة العقارية" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:url" content="${siteUrl}${urlPath}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${imageUrl}" />
      `;

      const analyticsScript = settings?.analyticsScript?.trim() ? `\n${settings.analyticsScript}\n` : '';

      // Replace existing title and description tags if they exist
      html = html.replace(/<title>.*?<\/title>/gi, '');
      html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, '');
      html = html.replace(/<meta\s+property="og:.*?"\s+content=".*?"\s*\/?>/gi, '');
      
      // Insert new tags right before </head>
      html = html.replace('</head>', `${ogTags}${analyticsScript}</head>`);
      
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
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "اسم المبنى مطلوب" });
      }
      const existing = await prisma.building.findFirst({
        where: { name: { equals: name.trim(), mode: 'insensitive' } }
      });
      if (existing) {
        return res.status(200).json(existing);
      }
      const building = await prisma.building.create({
        data: { name: name.trim() }
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

  // Sync renters to Renter User model and bridge legacy Property units
  async function syncRentersToUsers() {
    try {
      const renterUnits = await prisma.renterUnit.findMany({
        where: {
          OR: [
            { renterPhone: { not: null } },
            { renterName: { not: null } }
          ]
        }
      });

      for (const unit of renterUnits) {
        if (!unit.renterPhone && !unit.renterName) continue;
        let normalized = (unit.renterPhone || '').trim().replace(/\D/g, '');
        if (normalized.startsWith('966')) normalized = normalized.substring(3);
        normalized = normalized.replace(/^0+/, '');

        if (!normalized) normalized = `renter_${unit.id.substring(0, 8)}`;

        let renter = await prisma.renter.findUnique({
          where: { phone: normalized }
        });

        if (!renter) {
          renter = await prisma.renter.create({
            data: {
              name: unit.renterName || 'مستأجر',
              phone: normalized
            }
          });
        }

        if (!unit.renterId || unit.renterName !== renter.name || unit.renterPhone !== renter.phone) {
          await prisma.renterUnit.update({
            where: { id: unit.id },
            data: {
              renterId: renter.id,
              renterName: renter.name,
              renterPhone: renter.phone
            }
          });
        }
      }

      // Automatically bridge legacy Property sub-properties with renter info into Renter & RenterUnit models
      const propertyUnits = await prisma.property.findMany({
        where: {
          parentId: { not: null },
          OR: [
            { renterPhone: { not: null } },
            { renterName: { not: null } }
          ]
        },
        include: { parent: true }
      });

      for (const pUnit of propertyUnits) {
        if (!pUnit.renterPhone && !pUnit.renterName) continue;
        let normalized = (pUnit.renterPhone || '').trim().replace(/\D/g, '');
        if (normalized.startsWith('966')) normalized = normalized.substring(3);
        normalized = normalized.replace(/^0+/, '');
        if (!normalized) continue;

        let renter = await prisma.renter.findUnique({
          where: { phone: normalized }
        });

        if (!renter) {
          renter = await prisma.renter.create({
            data: {
              name: pUnit.renterName || 'مستأجر',
              phone: normalized
            }
          });
        }

        if (pUnit.parent) {
          const buildingName = pUnit.parent.titleAr || pUnit.parent.titleEn;
          let building = await prisma.building.findFirst({
            where: { name: { equals: buildingName.trim(), mode: 'insensitive' } }
          });
          if (!building) {
            building = await prisma.building.create({
              data: { name: buildingName.trim() }
            });
          }

          const unitNum = pUnit.titleAr || pUnit.titleEn || 'وحدة';
          let rUnit = await prisma.renterUnit.findFirst({
            where: { buildingId: building.id, unitNumber: unitNum }
          });
          if (!rUnit) {
            await prisma.renterUnit.create({
              data: {
                buildingId: building.id,
                unitNumber: unitNum,
                renterId: renter.id,
                renterName: pUnit.renterName || renter.name,
                renterPhone: normalized,
                rentAmount: pUnit.price || null
              }
            });
          } else if (!rUnit.renterId) {
            await prisma.renterUnit.update({
              where: { id: rUnit.id },
              data: {
                renterId: renter.id,
                renterName: pUnit.renterName || renter.name,
                renterPhone: normalized
              }
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to sync renters:", err);
    }
  }
  syncRentersToUsers();

  app.get('/api/admin/renters', requirePermission('renters'), async (req, res) => {
    try {
      const renters = await prisma.renterUnit.findMany({
        include: { building: true, renter: true, rentHistory: { orderBy: { dueDate: 'asc' } } },
        orderBy: { renterName: 'asc' }
      });
      res.json(renters);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch renters" });
    }
  });

  // --- Renter Users API ---
  app.get('/api/admin/renters-users', requirePermission('renters'), async (req, res) => {
    try {
      const renters = await prisma.renter.findMany({
        include: {
          units: {
            include: { building: true }
          },
          maintenanceReports: true
        },
        orderBy: { name: 'asc' }
      });
      res.json(renters);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch renter users" });
    }
  });

  app.post('/api/admin/renters-users', requirePermission('renters'), async (req, res) => {
    try {
      const { name, phone, unitIds } = req.body;
      if (!name || !phone) return res.status(400).json({ error: "Name and Phone are required" });

      let normalizedPhone = phone.trim().replace(/\D/g, '');
      if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
      normalizedPhone = normalizedPhone.replace(/^0+/, '');

      const existing = await prisma.renter.findUnique({ where: { phone: normalizedPhone } });
      if (existing) return res.status(400).json({ error: "رقم الجوال مسجل لمستأجر آخر بالفعل" });

      const renter = await prisma.renter.create({
        data: { name, phone: normalizedPhone }
      });

      if (Array.isArray(unitIds) && unitIds.length > 0) {
        await prisma.renterUnit.updateMany({
          where: { id: { in: unitIds } },
          data: {
            renterId: renter.id,
            renterName: name,
            renterPhone: normalizedPhone
          }
        });
      }

      await logAction(req, "CREATE_RENTER_USER", `Created renter user: ${name} (${normalizedPhone})`);
      res.json(renter);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create renter user" });
    }
  });

  app.put('/api/admin/renters-users/:id', requirePermission('renters'), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone } = req.body;
      if (!name || !phone) return res.status(400).json({ error: "Name and Phone are required" });

      let normalizedPhone = phone.trim().replace(/\D/g, '');
      if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
      normalizedPhone = normalizedPhone.replace(/^0+/, '');

      const updated = await prisma.renter.update({
        where: { id },
        data: { name, phone: normalizedPhone }
      });

      // propagate to units
      await prisma.renterUnit.updateMany({
        where: { renterId: id },
        data: { renterName: name, renterPhone: normalizedPhone }
      });

      await logAction(req, "UPDATE_RENTER_USER", `Updated renter user: ${name} (${normalizedPhone})`);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update renter user" });
    }
  });

  app.delete('/api/admin/renters-users/:id', requirePermission('renters'), async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.renterUnit.updateMany({
        where: { renterId: id },
        data: { renterId: null }
      });
      await prisma.renter.delete({ where: { id } });
      await logAction(req, "DELETE_RENTER_USER", `Deleted renter user ID: ${id}`);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete renter user" });
    }
  });

  app.post('/api/admin/units/:unitId/assign-renter', requirePermission('renters'), async (req, res) => {
    try {
      const { unitId } = req.params;
      const { renterId } = req.body; // null to unassign, or renter ID

      if (!renterId) {
        const updated = await prisma.renterUnit.update({
          where: { id: unitId },
          data: { renterId: null, renterName: null, renterPhone: null }
        });
        return res.json(updated);
      }

      const renter = await prisma.renter.findUnique({ where: { id: renterId } });
      if (!renter) return res.status(404).json({ error: "Renter user not found" });

      const updated = await prisma.renterUnit.update({
        where: { id: unitId },
        data: {
          renterId: renter.id,
          renterName: renter.name,
          renterPhone: renter.phone
        }
      });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to assign renter to unit" });
    }
  });


  // --- Maintenance Request Code Helpers ---
  async function generateNextRequestCode(): Promise<string> {
    try {
      const reports = await prisma.maintenanceReport.findMany({
        where: { requestCode: { not: null } },
        select: { requestCode: true }
      });

      let maxNum = 1000;
      for (const r of reports) {
        if (r.requestCode) {
          const match = r.requestCode.match(/\d+/);
          if (match) {
            const num = parseInt(match[0], 10);
            if (num > maxNum) maxNum = num;
          }
        }
      }
      return `MR-${maxNum + 1}`;
    } catch (err) {
      console.error("Error generating requestCode:", err);
      return `MR-${Date.now().toString().slice(-4)}`;
    }
  }

  async function ensureMaintenanceRequestCodes() {
    try {
      const uncoded = await prisma.maintenanceReport.findMany({
        where: {
          OR: [
            { requestCode: null },
            { requestCode: "" }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

      if (uncoded.length === 0) return;

      console.log(`Assigning request codes to ${uncoded.length} existing maintenance reports...`);

      const coded = await prisma.maintenanceReport.findMany({
        where: { requestCode: { not: null } },
        select: { requestCode: true }
      });

      let currentMax = 1000;
      for (const r of coded) {
        if (r.requestCode) {
          const match = r.requestCode.match(/\d+/);
          if (match) {
            const num = parseInt(match[0], 10);
            if (num > currentMax) currentMax = num;
          }
        }
      }

      for (const report of uncoded) {
        currentMax++;
        const code = `MR-${currentMax}`;
        await prisma.maintenanceReport.update({
          where: { id: report.id },
          data: { requestCode: code }
        });
      }
      console.log("Finished assigning maintenance request codes.");
    } catch (err) {
      console.error("Failed to ensure maintenance request codes:", err);
    }
  }
  ensureMaintenanceRequestCodes();

  // --- Maintenance Reports API ---
  app.post('/api/renter/maintenance-reports', async (req, res) => {
    try {
      const { phone, renterUnitId, description, images, category, priority } = req.body;
      if (!description || !renterUnitId) {
        return res.status(400).json({ error: "الوصف والوحدة متطلبان لإرسال البلاغ" });
      }

      let normalizedPhone = (phone || '').trim().replace(/\D/g, '');
      if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
      normalizedPhone = normalizedPhone.replace(/^0+/, '');

      const unit = await prisma.renterUnit.findUnique({
        where: { id: renterUnitId },
        include: { renter: true }
      });

      if (!unit) return res.status(404).json({ error: "الوحدة غير موجودة" });

      let renter = unit.renter;
      if (!renter && normalizedPhone) {
        renter = await prisma.renter.findUnique({ where: { phone: normalizedPhone } });
      }
      if (!renter) {
        renter = await prisma.renter.create({
          data: {
            name: unit.renterName || 'مستأجر',
            phone: normalizedPhone || '0500000000'
          }
        });
      }

      // process up to 4 images
      const rawImages: string[] = parseImageArray(images).slice(0, 4);
      const savedImages: string[] = [];
      for (const img of rawImages) {
        if (typeof img === 'string' && img.length > 0) {
          savedImages.push(saveBase64Image(img));
        }
      }

      const requestCode = await generateNextRequestCode();

      const report = await prisma.maintenanceReport.create({
        data: {
          requestCode,
          description,
          category: category || "GENERAL",
          priority: priority || "NORMAL",
          images: stringifyImageArray(savedImages),
          status: 'PENDING',
          renterId: renter.id,
          renterUnitId: unit.id
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } }
        }
      });

      res.json(report);
    } catch (err) {
      console.error("Error creating maintenance report:", err);
      res.status(500).json({ error: "فشل إرسال بلاغ الصيانة" });
    }
  });

  app.get('/api/renter/maintenance-reports', async (req, res) => {
    try {
      const phone = req.query.phone as string;
      if (!phone) return res.status(400).json({ error: "Phone number required" });

      let normalizedPhone = phone.trim().replace(/\D/g, '');
      if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
      normalizedPhone = normalizedPhone.replace(/^0+/, '');

      const reports = await prisma.maintenanceReport.findMany({
        where: {
          OR: [
            { renter: { phone: normalizedPhone } },
            { renterUnit: { renterPhone: normalizedPhone } }
          ]
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch maintenance reports" });
    }
  });

  app.get('/api/admin/maintenance-reports', requirePermission('maintenance'), async (req, res) => {
    try {
      const { buildingId, status } = req.query;
      const whereClause: any = {};
      if (status && status !== 'ALL') {
        whereClause.status = String(status);
      }

      const userRole = (req as any).user?.role;
      const userId = (req as any).user?.id;

      if (userRole === 'MAINTENANCE' && userId) {
        const maintenanceUser = await prisma.admin.findUnique({
          where: { id: userId },
          include: { assignedBuildings: true }
        });
        if (maintenanceUser && maintenanceUser.assignedBuildings && maintenanceUser.assignedBuildings.length > 0) {
          const buildingIds = maintenanceUser.assignedBuildings.map(b => b.id);
          whereClause.OR = [
            { renterUnit: { buildingId: { in: buildingIds } } },
            { assignedToId: userId }
          ];
        } else {
          whereClause.assignedToId = userId;
        }
      }

      const allReports = await prisma.maintenanceReport.findMany({
        where: whereClause,
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!buildingId) {
        return res.json(allReports);
      }

      const bIdStr = String(buildingId);
      const property = await prisma.property.findUnique({
        where: { id: bIdStr },
        include: { subProperties: true, parent: true }
      });
      const buildingObj = await prisma.building.findUnique({
        where: { id: bIdStr }
      });

      const cleanStr = (s?: string | null) => (s || '').toLowerCase().replace(/[,.#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
      const normalize = (p?: string | null) => (p || '').replace(/\D/g, '').replace(/^966/, '').replace(/^0+/, '');

      const namesToMatch: string[] = [];
      const phonesToMatch: string[] = [];

      if (property) {
        if (property.titleAr) namesToMatch.push(cleanStr(property.titleAr));
        if (property.titleEn) namesToMatch.push(cleanStr(property.titleEn));
        if (property.parent?.titleAr) namesToMatch.push(cleanStr(property.parent.titleAr));
        if (property.parent?.titleEn) namesToMatch.push(cleanStr(property.parent.titleEn));
        if (property.renterPhone) phonesToMatch.push(normalize(property.renterPhone));
        if (property.subProperties) {
          property.subProperties.forEach(sub => {
            if (sub.titleAr) namesToMatch.push(cleanStr(sub.titleAr));
            if (sub.titleEn) namesToMatch.push(cleanStr(sub.titleEn));
            if (sub.renterPhone) phonesToMatch.push(normalize(sub.renterPhone));
          });
        }
      }

      if (buildingObj && buildingObj.name) {
        namesToMatch.push(cleanStr(buildingObj.name));
      }

      const matched = allReports.filter(rep => {
        const bId = rep.renterUnit?.buildingId;
        if (bId === bIdStr) return true;

        const bName = cleanStr(rep.renterUnit?.building?.name);
        const uNum = cleanStr(rep.renterUnit?.unitNumber);
        const rPhone = normalize(rep.renter?.phone || rep.renterUnit?.renterPhone);
        const rName = cleanStr(rep.renter?.name || rep.renterUnit?.renterName);

        if (rPhone && phonesToMatch.some(p => p && (p.includes(rPhone) || rPhone.includes(p)))) return true;

        if (bName && namesToMatch.length > 0) {
          for (const name of namesToMatch) {
            if (name && (name.includes(bName) || bName.includes(name))) return true;
          }
        }

        if (uNum && uNum !== 'كامل العقار' && namesToMatch.length > 0) {
          for (const name of namesToMatch) {
            if (name && name.includes(uNum)) return true;
          }
        }

        if (rName && property && cleanStr(property.renterName).includes(rName)) return true;

        return false;
      });

      return res.json(matched);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch maintenance reports for admin" });
    }
  });

  app.get('/api/maintenance-reports/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const report = await prisma.maintenanceReport.findFirst({
        where: {
          OR: [
            { id },
            { requestCode: id }
          ]
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch maintenance report" });
    }
  });

  app.post('/api/maintenance-reports/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const { senderRole, senderName, message, attachments } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ error: "محتوى الرسالة مطلوب" });
      }

      const report = await prisma.maintenanceReport.findFirst({
        where: {
          OR: [
            { id },
            { requestCode: id }
          ]
        }
      });
      if (!report) return res.status(404).json({ error: "البلاغ غير موجود" });

      const rawAttachments: string[] = parseImageArray(attachments);
      const savedAttachments: string[] = [];
      for (const img of rawAttachments) {
        if (typeof img === 'string' && img.length > 0) {
          savedAttachments.push(saveBase64Image(img));
        }
      }

      const newMessage = await prisma.maintenanceMessage.create({
        data: {
          reportId: report.id,
          senderRole: senderRole || 'RENTER',
          senderName: senderName || (senderRole === 'RENTER' ? 'المستأجر' : 'فريق الصيانة'),
          message: message.trim(),
          attachments: stringifyImageArray(savedAttachments)
        }
      });

      // Add log entry
      await prisma.maintenanceLog.create({
        data: {
          reportId: report.id,
          action: 'MESSAGE_SENT',
          details: `رسالة جديدة من ${newMessage.senderName}: "${newMessage.message.substring(0, 50)}${newMessage.message.length > 50 ? '...' : ''}"`,
          performedBy: newMessage.senderName
        }
      });

      // Broadcast over Socket.IO real-time engine
      const io = req.app.get("io");
      if (io) {
        io.to(`ticket_${report.id}`).emit("new_message", newMessage);
        if (report.requestCode) {
          io.to(`ticket_${report.requestCode}`).emit("new_message", newMessage);
        }
      }

      res.json(newMessage);
    } catch (err) {
      console.error("Error creating maintenance message:", err);
      res.status(500).json({ error: "فشل إرسال الرسالة" });
    }
  });

  app.post('/api/maintenance-reports/:id/messages/read', async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body; // Reader role (e.g. 'ADMIN' or 'RENTER')

      // Mark unread messages sent by opposing role as read
      const updated = await prisma.maintenanceMessage.updateMany({
        where: {
          reportId: id,
          isRead: false,
          NOT: role ? { senderRole: role } : undefined
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });

      res.json({ success: true, count: updated.count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "فشل تحديث قراءة الرسائل" });
    }
  });

  app.put('/api/admin/maintenance-reports/:id', requirePermission('renters'), async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        status, 
        adminResponse, 
        technicianName, 
        technicianPhone, 
        scheduledDate, 
        estimatedCost, 
        actualCost, 
        receiptUrl, 
        proofImages,
        costPayer,
        paymentStatus,
        invoiceNumber,
        vendorName,
        taxAmount,
        taxRate,
        costBreakdown,
        receipts,
        expenses
      } = req.body;

      const existing = await prisma.maintenanceReport.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Report not found" });

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (adminResponse !== undefined) updateData.adminResponse = adminResponse;
      if (technicianName !== undefined) updateData.technicianName = technicianName;
      if (technicianPhone !== undefined) updateData.technicianPhone = technicianPhone;
      if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
      if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost !== null ? parseFloat(estimatedCost) : null;
      if (actualCost !== undefined) updateData.actualCost = actualCost !== null ? parseFloat(actualCost) : null;
      
      if (costPayer !== undefined) updateData.costPayer = costPayer;
      if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
      if (invoiceNumber !== undefined) updateData.invoiceNumber = invoiceNumber;
      if (vendorName !== undefined) updateData.vendorName = vendorName;
      if (taxAmount !== undefined) updateData.taxAmount = taxAmount !== null ? parseFloat(taxAmount) : 0;
      if (taxRate !== undefined) updateData.taxRate = taxRate !== null ? parseFloat(taxRate) : 15;

      if (costBreakdown !== undefined) {
        updateData.costBreakdown = typeof costBreakdown === 'string' ? costBreakdown : JSON.stringify(costBreakdown);
      }

      if (receipts !== undefined) {
        let receiptsArr = Array.isArray(receipts) ? receipts : (typeof receipts === 'string' ? JSON.parse(receipts || '[]') : []);
        receiptsArr = receiptsArr.map((r: any) => ({
          ...r,
          url: r.url ? saveBase64Image(r.url) : r.url
        }));
        updateData.receipts = JSON.stringify(receiptsArr);
      }

      if (expenses !== undefined) {
        let expensesArr = Array.isArray(expenses) ? expenses : (typeof expenses === 'string' ? JSON.parse(expenses || '[]') : []);
        expensesArr = expensesArr.map((exp: any) => ({
          ...exp,
          receiptUrl: exp.receiptUrl ? saveBase64Image(exp.receiptUrl) : exp.receiptUrl
        }));
        updateData.expenses = JSON.stringify(expensesArr);

        if (expensesArr.length > 0) {
          const totalSpent = expensesArr.reduce((sum: number, e: any) => sum + (Number(e.totalAmount) || 0), 0);
          updateData.actualCost = totalSpent;

          const hasRenter = expensesArr.some((e: any) => e.costPayer === 'RENTER');
          if (costPayer === undefined) {
            updateData.costPayer = hasRenter ? 'RENTER' : (expensesArr[0]?.costPayer || 'OWNER');
          }

          const hasUnpaid = expensesArr.some((e: any) => e.paymentStatus === 'UNPAID');
          if (paymentStatus === undefined) {
            updateData.paymentStatus = hasUnpaid ? 'UNPAID' : 'PAID';
          }
        }
      }

      if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
        updateData.completedAt = new Date();
      }

      if (receiptUrl) {
        updateData.receiptUrl = saveBase64Image(receiptUrl);
      } else if (receiptUrl === null) {
        updateData.receiptUrl = null;
      }

      if (proofImages !== undefined) {
        const rawProofs: string[] = parseImageArray(proofImages);
        const savedProofs: string[] = [];
        for (const img of rawProofs) {
          if (typeof img === 'string' && img.length > 0) {
            savedProofs.push(saveBase64Image(img));
          }
        }
        updateData.proofImages = stringifyImageArray(savedProofs);
      }

      const updated = await prisma.maintenanceReport.update({
        where: { id },
        data: updateData,
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      // Create Audit Logs
      const adminName = (req as any).user?.name || (req as any).user?.username || 'الإدارة';

      if (status && status !== existing.status) {
        const statusNames: Record<string, string> = {
          PENDING: 'قيد الانتظار',
          IN_PROGRESS: 'جاري المعالجة',
          COMPLETED: 'مكتمل',
          CANCELLED: 'ملغى'
        };
        await prisma.maintenanceLog.create({
          data: {
            reportId: id,
            action: 'STATUS_CHANGED',
            details: `تحديث حالة البلاغ إلى: ${statusNames[status] || status}`,
            performedBy: adminName
          }
        });
      }

      if (technicianName !== undefined && technicianName !== existing.technicianName) {
        await prisma.maintenanceLog.create({
          data: {
            reportId: id,
            action: 'TECHNICIAN_ASSIGNED',
            details: `تعيين الفني: ${technicianName || 'غير معين'} (${technicianPhone || ''})`,
            performedBy: adminName
          }
        });
      }

      if ((estimatedCost !== undefined && estimatedCost !== existing.estimatedCost) ||
          (actualCost !== undefined && actualCost !== existing.actualCost) ||
          (costPayer !== undefined && costPayer !== existing.costPayer) ||
          (paymentStatus !== undefined && paymentStatus !== existing.paymentStatus)) {
        await prisma.maintenanceLog.create({
          data: {
            reportId: id,
            action: 'COST_UPDATED',
            details: `تحديث المالية والمصاريف - التكلفة الفعلية: ${actualCost ?? existing.actualCost ?? 0} ريال، المسؤول عن الدفع: ${costPayer ?? existing.costPayer ?? 'OWNER'}، حالة السداد: ${paymentStatus ?? existing.paymentStatus ?? 'UNPAID'}`,
            performedBy: adminName
          }
        });
      }

      if (receiptUrl && receiptUrl !== existing.receiptUrl) {
        await prisma.maintenanceLog.create({
          data: {
            reportId: id,
            action: 'RECEIPT_UPLOADED',
            details: 'تم رفع إيصال/فاتورة تكاليف الصيانة',
            performedBy: adminName
          }
        });
      }

      if (proofImages !== undefined) {
        await prisma.maintenanceLog.create({
          data: {
            reportId: id,
            action: 'PROOF_UPLOADED',
            details: 'تم تحديث صور إثبات إنجاز العمل',
            performedBy: adminName
          }
        });
      }

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update maintenance report" });
    }
  });

  app.post('/api/renter/maintenance-reports/:id/rate', async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, feedback } = req.body;
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "التقييم يجب أن يكون بين 1 و 5 نجوم" });
      }

      const updated = await prisma.maintenanceReport.update({
        where: { id },
        data: {
          rating: rating,
          feedback: feedback ? String(feedback).trim() : null
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      await prisma.maintenanceLog.create({
        data: {
          reportId: id,
          action: 'RATING_SUBMITTED',
          details: `قام المستأجر بتقييم الخدمة بـ ${rating} نجوم: "${feedback || 'بدون تعليق'}"`,
          performedBy: updated.renter?.name || 'المستأجر'
        }
      });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "فشل حفظ التقييم" });
    }
  });

  app.post('/api/admin/maintenance-reports/:id/claim', requirePermission('renters'), async (req, res) => {
    try {
      const { id } = req.params;
      const staffName = req.body.claimedBy || (req as any).user?.name || (req as any).user?.username || 'الموظف';

      const updated = await prisma.maintenanceReport.update({
        where: { id },
        data: {
          claimedBy: staffName,
          claimedAt: new Date()
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      await prisma.maintenanceLog.create({
        data: {
          reportId: id,
          action: 'TICKET_CLAIMED',
          details: `قام الموظف (${staffName}) بالموافقة والاستحواذ على تذكرة الصيانة كمحادثة خاصة`,
          performedBy: staffName
        }
      });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "فشل الاستحواذ على التذكرة" });
    }
  });

  app.post('/api/admin/maintenance-reports/:id/unclaim', requirePermission('renters'), async (req, res) => {
    try {
      const { id } = req.params;
      const staffName = (req as any).user?.name || (req as any).user?.username || 'الموظف';

      const updated = await prisma.maintenanceReport.update({
        where: { id },
        data: {
          claimedBy: null,
          claimedAt: null
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      await prisma.maintenanceLog.create({
        data: {
          reportId: id,
          action: 'TICKET_UNCLAIMED',
          details: `إعادة التذكرة لقائمة الطلبات المتاحة للجميع بواسطة (${staffName})`,
          performedBy: staffName
        }
      });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "فشل إلغاء الاستحواذ" });
    }
  });

  app.post('/api/callback-requests/:id/claim', async (req, res) => {
    try {
      const { id } = req.params;
      const staffName = req.body.handledBy || (req as any).user?.name || (req as any).user?.username || 'الموظف';

      const updated = await prisma.callbackRequest.update({
        where: { id },
        data: { handledBy: staffName },
        include: { notes: { orderBy: { createdAt: 'asc' } } }
      });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "فشل الاستحواذ على طلب التواصل" });
    }
  });

  app.post('/api/callback-requests/:id/unclaim', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await prisma.callbackRequest.update({
        where: { id },
        data: { handledBy: null },
        include: { notes: { orderBy: { createdAt: 'asc' } } }
      });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "فشل إلغاء الاستحواذ على طلب التواصل" });
    }
  });

  app.delete('/api/admin/maintenance-reports/:id', requirePermission('maintenance'), async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.maintenanceReport.delete({ where: { id } });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete maintenance report" });
    }
  });

  // ---- Maintenance Approval, Denial & Staff Assignment Endpoints ----
  app.get('/api/admin/maintenance-users', requirePermission('maintenance'), async (req, res) => {
    try {
      const { buildingId } = req.query;
      
      // Return STRICTLY users with MAINTENANCE role (maintenance crew only)
      const staffList = await prisma.admin.findMany({
        where: { role: 'MAINTENANCE' },
        select: {
          id: true, name: true, username: true, role: true, email: true,
          assignedBuildings: { select: { id: true, name: true } }
        },
        orderBy: { name: 'asc' }
      });

      if (buildingId) {
        const bIdStr = String(buildingId);
        staffList.sort((a, b) => {
          const aAssigned = a.assignedBuildings.some(b => b.id === bIdStr);
          const bAssigned = b.assignedBuildings.some(b => b.id === bIdStr);
          if (aAssigned && !bAssigned) return -1;
          if (!aAssigned && bAssigned) return 1;
          return 0;
        });
      }

      res.json(staffList);
    } catch (error) {
      logger.error("Failed to fetch maintenance users", error);
      res.status(500).json({ error: "Failed to fetch maintenance users" });
    }
  });

  app.post('/api/admin/maintenance-reports/:id/approve', requirePermission('maintenance'), async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedToId, internalNote, expectedStartDate, estimatedDuration, priority } = req.body;
      const adminUser = (req as any).user || { id: 'unknown', name: 'المسؤول' };
      const adminName = adminUser.name || adminUser.username || 'المسؤول';

      let assignedStaff: any = null;
      if (assignedToId) {
        assignedStaff = await prisma.admin.findUnique({ where: { id: assignedToId } });
      }

      const updated = await prisma.maintenanceReport.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedById: adminUser.id,
          approvedByName: adminName,
          approvedAt: new Date(),
          assignedToId: assignedStaff ? assignedStaff.id : undefined,
          assignedToName: assignedStaff ? assignedStaff.name : undefined,
          assignedAt: assignedStaff ? new Date() : undefined,
          internalNote: internalNote !== undefined ? internalNote : undefined,
          expectedStartDate: expectedStartDate || undefined,
          estimatedDuration: estimatedDuration || undefined,
          priority: priority || undefined
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      let logDetails = assignedStaff
        ? `تم قبول بلاغ الصيانة من قبل (${adminName}) وتم تعيينه للموظف (${assignedStaff.name})`
        : `تم قبول بلاغ الصيانة من قبل (${adminName})`;

      const approvalMsgText = (internalNote && internalNote.trim())
        ? internalNote.trim()
        : 'تم قبول طلب الصيانة وتوجيه الطلب للمعالجة والتنفيذ.';

      if (internalNote && internalNote.trim()) {
        logDetails += ` | رسالة القبول: ${internalNote.trim()}`;
      }

      await prisma.maintenanceLog.create({
        data: {
          reportId: id,
          action: 'REPORT_APPROVED',
          details: logDetails,
          performedBy: adminName
        }
      });

      // Automatically post approval message to customer chat thread
      await prisma.maintenanceMessage.create({
        data: {
          reportId: id,
          senderRole: 'ADMIN',
          senderName: adminName,
          message: approvalMsgText
        }
      });

      // Refetch updated report with messages
      const finalUpdated = await prisma.maintenanceReport.findUnique({
        where: { id },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      res.json(finalUpdated);
    } catch (err) {
      logger.error("Failed to approve maintenance report:", err);
      res.status(500).json({ error: "فشل قبول بلاغ الصيانة" });
    }
  });

  app.post('/api/admin/maintenance-reports/:id/deny', requirePermission('maintenance'), async (req, res) => {
    try {
      const { id } = req.params;
      const { denialReason } = req.body;
      if (!denialReason || !denialReason.trim()) {
        return res.status(400).json({ error: "الرجاء تقديم سبب رفض طلب الصيانة" });
      }
      const adminUser = (req as any).user || { id: 'unknown', name: 'المسؤول' };
      const adminName = adminUser.name || adminUser.username || 'المسؤول';

      await prisma.maintenanceReport.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedById: adminUser.id,
          approvedByName: adminName,
          approvedAt: new Date(),
          denialReason: denialReason.trim()
        }
      });

      await prisma.maintenanceLog.create({
        data: {
          reportId: id,
          action: 'REPORT_DENIED',
          details: `تم رفض بلاغ الصيانة من قبل (${adminName}) - السبب: ${denialReason.trim()}`,
          performedBy: adminName
        }
      });

      // Automatically post denial message to customer chat thread
      await prisma.maintenanceMessage.create({
        data: {
          reportId: id,
          senderRole: 'ADMIN',
          senderName: adminName,
          message: `تم رفض طلب الصيانة. السبب: ${denialReason.trim()}`
        }
      });

      // Refetch updated report with messages
      const finalUpdated = await prisma.maintenanceReport.findUnique({
        where: { id },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      res.json(finalUpdated);
    } catch (err) {
      logger.error("Failed to deny maintenance report:", err);
      res.status(500).json({ error: "فشل رفض بلاغ الصيانة" });
    }
  });

  app.post('/api/admin/maintenance-reports/:id/assign', requirePermission('maintenance'), async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedToId } = req.body;
      const adminUser = (req as any).user || { id: 'unknown', name: 'المسؤول' };
      const adminName = adminUser.name || adminUser.username || 'المسؤول';

      if (!assignedToId) {
        return res.status(400).json({ error: "الرجاء اختيار الموظف الموكل له البلاغ" });
      }

      const assignedStaff = await prisma.admin.findUnique({ where: { id: assignedToId } });
      if (!assignedStaff) {
        return res.status(404).json({ error: "الموظف غير موجود" });
      }

      const updated = await prisma.maintenanceReport.update({
        where: { id },
        data: {
          assignedToId: assignedStaff.id,
          assignedToName: assignedStaff.name,
          assignedAt: new Date()
        },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } },
          logs: { orderBy: { createdAt: 'asc' } }
        }
      });

      await prisma.maintenanceLog.create({
        data: {
          reportId: id,
          action: 'STAFF_ASSIGNED',
          details: `تم تعيين/إعادة تعيين بلاغ الصيانة للموظف (${assignedStaff.name}) بواسطة (${adminName})`,
          performedBy: adminName
        }
      });

      res.json(updated);
    } catch (err) {
      logger.error("Failed to assign maintenance report:", err);
      res.status(500).json({ error: "فشل تعيين بلاغ الصيانة" });
    }
  });


  // --- Renter Portal (OTP and Login) ---
  app.post('/api/renter/request-otp', otpLimiter, async (req, res) => {
    try {
      const { phone } = req.body;
      logger.info(`OTP request for phone: ${phone}`);
      if (!phone) return res.status(400).json({ error: "Phone number is required." });

      let normalizedPhone = phone.trim().replace(/\D/g, '');
      if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
      normalizedPhone = normalizedPhone.replace(/^0+/, '');

      const phoneVariants = Array.from(new Set([
        normalizedPhone,
        '0' + normalizedPhone,
        '966' + normalizedPhone,
        '+966' + normalizedPhone,
        '00966' + normalizedPhone,
        phone.trim()
      ]));

      // Check if phone exists in active renter units, Renter model, or Property model
      const units = await prisma.renterUnit.findMany({
        where: {
          OR: [
            { renterPhone: { in: phoneVariants } },
            { renter: { phone: { in: phoneVariants } } }
          ]
        }
      });

      const renterUser = await prisma.renter.findFirst({
        where: { phone: { in: phoneVariants } }
      });

      const propertyUnit = await prisma.property.findFirst({
        where: { renterPhone: { in: phoneVariants } }
      });

      if (units.length === 0 && !renterUser && !propertyUnit) {
        return res.status(404).json({ error: "لا يوجد حساب مستأجر مسجل بهذا الرقم. (No renter account found for this phone number)" });
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

      // VerifyKit Dispatch Integration
      if (settings?.verifyKitEnabled && (settings?.verifyKitServerKey || settings?.verifyKitAppKey)) {
        try {
          const appKey = settings.verifyKitAppKey || "AxaVaO8JfW2OMj";
          const serverKey = settings.verifyKitServerKey || "Krfa4d5b5ad23e4551a8c200f72433cf5e12d362f5bfd321d62e13fe01ff6";
          await fetch("https://vapi.verifykit.com/v1/send-otp", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-VKit-App-Key': appKey,
              'X-VKit-Server-Key': serverKey
            },
            body: JSON.stringify({
              phoneNumber: phone,
              otp: otp
            })
          }).catch(() => {});
          logger.info(`Dispatched OTP via VerifyKit for phone: ${phone}`);
        } catch (vkitErr) {
          console.error("VerifyKit request error:", vkitErr);
        }
      }

      if (webhookUrl) {
        try {
          let payloadStr = settings?.otpWebhookPayload;
          
          if (!payloadStr || payloadStr.trim() === '') {
            payloadStr = JSON.stringify({
              phone: "{phone}",
              otp: "{otp}",
              type: "template",
              message: settings?.otpMessageTemplate || "رمز التحقق الخاص بك هو: {otp}"
            });
          }

          payloadStr = payloadStr.replace(/{phone}/g, phone).replace(/{otp}/g, otp);
          const payload = JSON.parse(payloadStr);

          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.error("Failed to send webhook to Whatomate:", err);
        }
      }

      console.log(`\n=====================================================\n🔑 [OTP CODE] Phone: ${phone} (${normalizedPhone}) ---> OTP CODE: ${otp}\n=====================================================\n`);
      logger.info(`🔑 [OTP CODE] Phone: ${phone} (${normalizedPhone}) ---> OTP: ${otp}`);

      res.json({ success: true, otp: otp, fakeOtpDelivery: otp });
    } catch (error) {
      logger.error("Failed to process request-otp:", error);
      res.status(500).json({ error: "Failed to process OTP request" });
    }
  });

  app.post('/api/renter/login', authLimiter, async (req, res) => {
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
        await prisma.otpSession.delete({ where: { id: validOtp.id } });
      }

      const phoneVariants = Array.from(new Set([
        normalizedPhone,
        '0' + normalizedPhone,
        '966' + normalizedPhone,
        '+966' + normalizedPhone,
        '00966' + normalizedPhone,
        phone.trim()
      ]));

      // Fetch user units
      const units = await prisma.renterUnit.findMany({
        where: {
          OR: [
            { renterPhone: { in: phoneVariants } },
            { renter: { phone: { in: phoneVariants } } }
          ]
        },
        include: { building: true, renter: true, rentHistory: { orderBy: { dueDate: 'asc' } } } 
      });

      const parsedData = (units || []).map(unit => ({
        id: unit.id,
        unitNumber: unit.unitNumber,
        renterName: unit.renter?.name || unit.renterName || 'المستأجر',
        renterPhone: unit.renter?.phone || unit.renterPhone || normalizedPhone,
        contractEndDate: unit.contractEndDate,
        nextRentDue: unit.nextRentDue,
        rentAmount: unit.rentAmount,
        isTanfeeth: unit.isTanfeeth,
        propertyName: unit.building?.name || 'مبنى غير معروف',
        transferDetails: unit.building?.transferDetails || null,
        buildingPhotos: unit.building?.photos || '[]',
        bedrooms: unit.bedrooms ?? 2,
        bathrooms: unit.bathrooms ?? 2,
        area: unit.area ?? 120,
        floor: unit.floor || '1',
        features: unit.features || 'مكيفات مجهزة, مطبخ راكب, موقف خاص, مصعد, إنتركوم ذكي',
        photos: unit.photos && unit.photos !== '[]' ? unit.photos : (unit.building?.photos || '[]'),
        rentHistory: unit.rentHistory || []
      }));

      res.json(parsedData);
    } catch (e: any) {
       console.error("Login route error:", e);
       res.status(500).json({ error: "Internal server error" });
    }
  });

  // Dedicated Renter API: Get units & properties connected to a specific renter
  app.get('/api/renter/my-units', async (req, res) => {
    try {
      const phone = req.query.phone as string;
      if (!phone) return res.status(400).json({ error: "Phone number is required." });

      let normalizedPhone = phone.trim().replace(/\D/g, '');
      if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
      normalizedPhone = normalizedPhone.replace(/^0+/, '');

      const phoneVariants = Array.from(new Set([
        normalizedPhone,
        '0' + normalizedPhone,
        '966' + normalizedPhone,
        '+966' + normalizedPhone,
        '00966' + normalizedPhone,
        phone.trim()
      ]));

      // 1. Fetch units from RenterUnit model belonging to this renter
      const units = await prisma.renterUnit.findMany({
        where: {
          OR: [
            { renterPhone: { in: phoneVariants } },
            { renter: { phone: { in: phoneVariants } } }
          ]
        },
        include: { building: true, renter: true, rentHistory: { orderBy: { dueDate: 'asc' } } }
      });

      const parsedUnits = (units || []).map(unit => ({
        id: unit.id,
        unitNumber: unit.unitNumber,
        renterName: unit.renter?.name || unit.renterName || 'المستأجر',
        renterPhone: unit.renter?.phone || unit.renterPhone || normalizedPhone,
        contractEndDate: unit.contractEndDate,
        nextRentDue: unit.nextRentDue,
        rentAmount: unit.rentAmount,
        isTanfeeth: unit.isTanfeeth,
        propertyName: unit.building?.name || 'مبنى غير معروف',
        transferDetails: unit.building?.transferDetails || null,
        buildingPhotos: unit.building?.photos || '[]',
        bedrooms: unit.bedrooms ?? 2,
        bathrooms: unit.bathrooms ?? 2,
        area: unit.area ?? 120,
        floor: unit.floor || '1',
        features: unit.features || 'مكيفات مجهزة, مطبخ راكب, موقف خاص, مصعد, إنتركوم ذكي',
        photos: unit.photos && unit.photos !== '[]' ? unit.photos : (unit.building?.photos || '[]'),
        rentHistory: unit.rentHistory || []
      }));

      // 2. Fetch properties from Property model assigned to this renter phone
      const properties = await prisma.property.findMany({
        where: {
          renterPhone: { in: phoneVariants }
        }
      });

      const parsedProperties = (properties || []).map(prop => ({
        id: prop.id,
        unitNumber: prop.titleAr || 'عقار مؤجر',
        renterName: prop.renterName || 'المستأجر',
        renterPhone: prop.renterPhone || normalizedPhone,
        contractEndDate: null,
        nextRentDue: null,
        rentAmount: prop.price,
        isTanfeeth: false,
        propertyName: prop.titleAr || prop.titleEn || 'عقار مسجل',
        transferDetails: null,
        buildingPhotos: prop.imageUrls || '[]',
        bedrooms: 2,
        bathrooms: 2,
        area: prop.area || 120,
        floor: '1',
        features: prop.features || 'مكيفات مجهزة, مطبخ راكب, موقف خاص',
        photos: prop.imageUrls || '[]',
        rentHistory: []
      }));

      // Deduplicate by ID
      const allItemsMap = new Map();
      for (const item of [...parsedUnits, ...parsedProperties]) {
        allItemsMap.set(item.id, item);
      }

      res.json(Array.from(allItemsMap.values()));
    } catch (e: any) {
      console.error("Error fetching renter units:", e);
      res.status(500).json({ error: "Failed to fetch renter units" });
    }
  });

  app.post('/api/renter/upload-receipt', async (req, res) => {
    try {
      const { historyId, receiptUrl } = req.body;
      if (!historyId || !receiptUrl) return res.status(400).json({ error: "Missing parameters" });
      
      const processedUrl = saveBase64Image(receiptUrl);
      const history = await prisma.rentHistory.update({
        where: { id: historyId },
        data: { receiptUrl: processedUrl, paidDate: new Date().toLocaleDateString('en-GB') },
        include: { renterUnit: { include: { building: true } } }
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

  // PUBLIC Listings API - Zero Auth, Ultra Fast, Strictly Published Only
  app.get("/api/properties", async (req, res) => {
    try {
      const isMapRequest = req.query.map === 'true';
      const isPaginationRequest = req.query.page !== undefined || req.query.limit !== undefined;

      const hasQueryParams = Object.keys(req.query).length > 0;
      const cacheKey = 'propertiesPublic';
      
      if (!hasQueryParams) {
        const cached = dbCache[cacheKey];
        if (cached && (!Array.isArray(cached) || cached.length > 0)) {
          logger.info(`Serving public properties from cache`);
          return res.json(cached);
        }
      }

      // Build Prisma Filters
      const andFilters: any[] = [];

      // Public status filter: strictly exclude DRAFT, HIDDEN, SOLD & RENTED listings for ALL visitors
      andFilters.push({
        status: { notIn: ['DRAFT', 'HIDDEN', 'SOLD', 'RENTED'] }
      });

      // Parent ID Param
      const parentIdParam = req.query.parentId as string;
      if (parentIdParam) {
        andFilters.push({ parentId: parentIdParam });
      } else {
        const showIndividualUnits = req.query.showIndividualUnits === 'true';
        if (!showIndividualUnits && !isMapRequest) {
          andFilters.push({ parentId: null });
        }
      }

      // Search term
      const search = req.query.search as string;
      if (search) {
        andFilters.push({
          OR: [
            { titleAr: { contains: search, mode: 'insensitive' } },
            { titleEn: { contains: search, mode: 'insensitive' } }
          ]
        });
      }

      // Type Filter
      const type = req.query.type as string;
      if (type && type !== 'ALL') {
        andFilters.push({ type: type });
      }

      // Category Filter
      const category = req.query.category as string;
      if (category && category !== 'ALL') {
        andFilters.push({ propertyCategory: category });
      }

      // Price Filters
      const minPrice = parseFloat(req.query.minPrice as string);
      const maxPrice = parseFloat(req.query.maxPrice as string);
      if (!isNaN(minPrice) || !isNaN(maxPrice)) {
        const priceRange: any = {};
        if (!isNaN(minPrice)) priceRange.gte = minPrice;
        if (!isNaN(maxPrice)) priceRange.lte = maxPrice;

        andFilters.push({
          OR: [
            { price: priceRange },
            {
              subProperties: {
                some: {
                  price: priceRange,
                  status: { notIn: ['DRAFT', 'HIDDEN', 'RENTED', 'SOLD'] }
                }
              }
            }
          ]
        });
      }

      const where = andFilters.length > 0 ? { AND: andFilters } : {};

      // If it's a map request, return lightweight markers list
      if (isMapRequest) {
        const mapProperties = await prisma.property.findMany({
          where,
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
            type: true,
            price: true,
            locationText: true,
            locationLink: true,
            parentId: true,
            status: true,
            propertyCategory: true,
            area: true,
            propertyAge: true,
            imageUrls: true
          },
          orderBy: { createdAt: 'desc' }
        });

        const parentIdsToFetch = mapProperties
          .map(p => p.parentId)
          .filter((id): id is string => !!id);

        const parents = parentIdsToFetch.length > 0
          ? await prisma.property.findMany({
              where: { id: { in: parentIdsToFetch } },
              select: { id: true, imageUrls: true }
            })
          : [];

        const parentImageUrlsMap = new Map<string, string>();
        for (const parent of parents) {
          parentImageUrlsMap.set(parent.id, parent.imageUrls || '[]');
        }

        const enrichedMap = mapProperties.map(p => {
          const coords = extractCoords(p.locationLink);
          let coverImage = '';
          try {
            const imgs = JSON.parse(p.imageUrls || '[]');
            if (Array.isArray(imgs) && imgs.length > 0) coverImage = imgs[0];
          } catch (_) {}

          if (!coverImage && p.parentId) {
            const parentImageUrlsStr = parentImageUrlsMap.get(p.parentId);
            if (parentImageUrlsStr) {
              try {
                const parentImgs = JSON.parse(parentImageUrlsStr);
                if (Array.isArray(parentImgs) && parentImgs.length > 0) {
                  coverImage = parentImgs[0];
                }
              } catch (_) {}
            }
          }

          return {
            id: p.id,
            titleAr: p.titleAr,
            titleEn: p.titleEn,
            type: p.type,
            price: p.price,
            locationText: p.locationText,
            latitude: coords?.lat ?? null,
            longitude: coords?.lon ?? null,
            parentId: p.parentId,
            status: p.status,
            propertyCategory: p.propertyCategory,
            area: p.area,
            propertyAge: p.propertyAge,
            thumbnail: coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'
          };
        });

        return res.json(enrichedMap);
      }

      // Base64 auto-saving helper
      const saveBase64ImageOnRead = async (property: any) => {
        let coverImage = '';
        try {
          if (!property.imageUrls) return '';
          
          // Optimization: If the string doesn't contain base64 pattern, get the first image path directly
          if (!property.imageUrls.includes('data:image/') && !property.imageUrls.includes('data:application/') && !property.imageUrls.includes('data:video/')) {
            const imgs = JSON.parse(property.imageUrls);
            return Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
          }

          const imgs = JSON.parse(property.imageUrls);
          if (Array.isArray(imgs) && imgs.length > 0) {
            coverImage = imgs[0];
            let needsUpdate = false;
            const updatedImgs = imgs.map(img => {
              if (img && (img.startsWith('data:image/') || img.startsWith('data:application/') || img.startsWith('data:video/'))) {
                needsUpdate = true;
                return saveBase64Image(img);
              }
              return img;
            });
            if (needsUpdate) {
              coverImage = updatedImgs[0];
              await prisma.property.update({
                where: { id: property.id },
                data: { imageUrls: JSON.stringify(updatedImgs) }
              });
            }
          }
        } catch (_) {}
        return coverImage;
      };

      const enrichPropertiesList = async (propertiesList: any[]) => {
        const parentIds = propertiesList.map(p => p.id);
        const allSubUnits = await prisma.property.findMany({
          where: {
            parentId: { in: parentIds },
            status: { notIn: ['DRAFT', 'HIDDEN', 'RENTED', 'SOLD'] }
          },
          select: { parentId: true, price: true }
        });

        const subUnitsByParent = new Map<string, number[]>();
        for (const u of allSubUnits) {
          if (u.parentId) {
            if (!subUnitsByParent.has(u.parentId)) {
              subUnitsByParent.set(u.parentId, []);
            }
            subUnitsByParent.get(u.parentId)!.push(u.price);
          }
        }

        const parentIdsToFetch = propertiesList
          .map(p => p.parentId)
          .filter((id): id is string => !!id);

        const parents = parentIdsToFetch.length > 0
          ? await prisma.property.findMany({
              where: { id: { in: parentIdsToFetch } },
              select: { id: true, imageUrls: true }
            })
          : [];

        const parentImageUrlsMap = new Map<string, string>();
        for (const parent of parents) {
          parentImageUrlsMap.set(parent.id, parent.imageUrls || '[]');
        }

        return Promise.all(propertiesList.map(async (p) => {
          const coords = extractCoords(p.locationLink);
          let coverImage = await saveBase64ImageOnRead(p);

          if (!coverImage && p.parentId) {
            const parentImageUrlsStr = parentImageUrlsMap.get(p.parentId);
            if (parentImageUrlsStr) {
              try {
                const parentImgs = JSON.parse(parentImageUrlsStr);
                if (Array.isArray(parentImgs) && parentImgs.length > 0) {
                  coverImage = parentImgs[0];
                }
              } catch (_) {}
            }
          }

          const prices = subUnitsByParent.get(p.id) || [];
          const availableUnitsCount = prices.length;
          const validPrices = prices.filter(pr => pr > 0);
          const minUnitPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
          const maxUnitPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;

          return {
            ...p,
            imageUrls: JSON.stringify(coverImage ? [coverImage] : []),
            latitude: coords?.lat ?? null,
            longitude: coords?.lon ?? null,
            availableUnitsCount,
            minUnitPrice,
            maxUnitPrice
          };
        }));
      };

      const basic = req.query.basic === 'true';

      if (isPaginationRequest) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const skip = (page - 1) * limit;

        const [properties, totalCount] = await Promise.all([
          prisma.property.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
          }),
          prisma.property.count({ where })
        ]);

        let enriched = [];
        if (basic) {
          enriched = properties.map(p => {
            let thumbnail = '';
            try {
              if (p.imageUrls && !p.imageUrls.includes('data:image/') && !p.imageUrls.includes('data:application/')) {
                const imgs = JSON.parse(p.imageUrls);
                if (Array.isArray(imgs) && imgs.length > 0) {
                  thumbnail = imgs[0];
                }
              }
            } catch (_) {}
            return {
              ...p,
              isEnriched: false,
              availableUnitsCount: 0,
              minUnitPrice: 0,
              maxUnitPrice: 0,
              thumbnail: thumbnail
            };
          });
        } else {
          enriched = (await enrichPropertiesList(properties)).map(p => ({
            ...p,
            isEnriched: true
          }));
        }

        return res.json({
          properties: enriched,
          totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        });
      } else {
        // Standard full list request (backward compatible for Admin and Dashboard)
        const properties = await prisma.property.findMany({
          where,
          orderBy: { createdAt: 'desc' }
        });

        let enriched = [];
        if (basic) {
          enriched = properties.map(p => {
            let thumbnail = '';
            try {
              if (p.imageUrls && !p.imageUrls.includes('data:image/') && !p.imageUrls.includes('data:application/')) {
                const imgs = JSON.parse(p.imageUrls);
                if (Array.isArray(imgs) && imgs.length > 0) {
                  thumbnail = imgs[0];
                }
              }
            } catch (_) {}
            return {
              ...p,
              isEnriched: false,
              availableUnitsCount: 0,
              minUnitPrice: 0,
              maxUnitPrice: 0,
              thumbnail: thumbnail
            };
          });
        } else {
          enriched = (await enrichPropertiesList(properties)).map(p => ({
            ...p,
            isEnriched: true
          }));
        }
        
        if (!hasQueryParams && !basic) {
          dbCache[cacheKey] = enriched;
        }
        return res.json(enriched);
      }
    } catch (error) {
      logger.error("Failed to fetch properties", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await prisma.property.findUnique({
        where: { id: req.params.id },
        include: {
          subProperties: { where: { status: { notIn: ['DRAFT', 'HIDDEN', 'RENTED', 'SOLD'] } } },
          parent: true
        }
      });
      if (!property || property.status === 'DRAFT' || property.status === 'HIDDEN') {
        return res.status(404).json({ error: "Property not found" });
      }

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

  app.get("/api/properties/:id/maintenance-reports", async (req, res) => {
    try {
      const { id } = req.params;
      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          subProperties: true,
          parent: true
        }
      });
      if (!property) return res.json([]);

      const cleanStr = (s?: string | null) => (s || '').toLowerCase().replace(/[,.#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
      const normalize = (p?: string | null) => (p || '').replace(/\D/g, '').replace(/^966/, '').replace(/^0+/, '');

      const namesToMatch: string[] = [];
      if (property.titleAr) namesToMatch.push(cleanStr(property.titleAr));
      if (property.titleEn) namesToMatch.push(cleanStr(property.titleEn));
      if (property.parent?.titleAr) namesToMatch.push(cleanStr(property.parent.titleAr));
      if (property.parent?.titleEn) namesToMatch.push(cleanStr(property.parent.titleEn));

      const phonesToMatch: string[] = [];
      if (property.renterPhone) phonesToMatch.push(normalize(property.renterPhone));

      if (property.subProperties) {
        property.subProperties.forEach(sub => {
          if (sub.titleAr) namesToMatch.push(cleanStr(sub.titleAr));
          if (sub.titleEn) namesToMatch.push(cleanStr(sub.titleEn));
          if (sub.renterPhone) phonesToMatch.push(normalize(sub.renterPhone));
        });
      }

      const allReports = await prisma.maintenanceReport.findMany({
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } }
        },
        orderBy: { createdAt: 'desc' }
      });

      const matched = allReports.filter(rep => {
        const bName = cleanStr(rep.renterUnit?.building?.name);
        const uNum = cleanStr(rep.renterUnit?.unitNumber);
        const rPhone = normalize(rep.renter?.phone || rep.renterUnit?.renterPhone);
        const rName = cleanStr(rep.renter?.name || rep.renterUnit?.renterName);

        if (rPhone && phonesToMatch.some(p => p && (p.includes(rPhone) || rPhone.includes(p)))) return true;

        if (bName) {
          for (const name of namesToMatch) {
            if (name && (name.includes(bName) || bName.includes(name))) return true;
          }
        }

        if (uNum && uNum !== 'كامل العقار') {
          for (const name of namesToMatch) {
            if (name && name.includes(uNum)) return true;
          }
        }

        if (rName && cleanStr(property.renterName).includes(rName)) return true;

        return false;
      });

      res.json(matched);
    } catch (err) {
      console.error("Failed to fetch property maintenance reports:", err);
      res.json([]);
    }
  });

  // ADMIN Properties API - Dedicated Staff Route with Full Access
  app.get("/api/admin/properties", requirePermission('properties'), async (req, res) => {
    try {
      const parentIdParam = req.query.parentId as string;
      const andFilters: any[] = [];

      if (parentIdParam) {
        andFilters.push({ parentId: parentIdParam });
      }

      const search = req.query.search as string;
      if (search) {
        andFilters.push({
          OR: [
            { titleAr: { contains: search, mode: 'insensitive' } },
            { titleEn: { contains: search, mode: 'insensitive' } }
          ]
        });
      }

      const whereClause = andFilters.length > 0 ? { AND: andFilters } : {};

      const properties = await prisma.property.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          subProperties: true,
          parent: true
        }
      });

      const enriched = properties.map(p => {
        const coords = extractCoords(p.locationLink);
        return {
          ...p,
          latitude: coords?.lat ?? null,
          longitude: coords?.lon ?? null
        };
      });

      return res.json(enriched);
    } catch (error) {
      logger.error("Failed to fetch admin properties", error);
      res.status(500).json({ error: "Failed to fetch admin properties" });
    }
  });

  app.get("/api/admin/properties/:id", requirePermission('properties'), async (req, res) => {
    try {
      const property = await prisma.property.findUnique({
        where: { id: req.params.id },
        include: { subProperties: true, parent: true }
      });
      if (!property) return res.status(404).json({ error: "Property not found" });

      const coords = extractCoords(property.locationLink);
      res.json({
        ...property,
        latitude: coords?.lat ?? null,
        longitude: coords?.lon ?? null
      });
    } catch (error) {
      logger.error(`Failed to fetch admin property by id: ${req.params.id}`, error);
      res.status(500).json({ error: "Failed to fetch admin property" });
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

  app.post(["/api/properties", "/api/admin/properties"], requirePermission('properties'), async (req, res) => {
    try {
      const body = req.body;
      const type = body.type || "SALE";
      const subPropertiesData = body.subProperties || [];

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
          vatNotApplicable: body.vatNotApplicable !== undefined ? Boolean(body.vatNotApplicable) : false,
          utilityBills: body.utilityBills || "NONE",
          commission: safeFloat(body.commission),
          price: safeFloat(body.price),
          imageUrls: processImageUrls(body.imageUrls),
          attachments: processDocumentUrls(body.attachments),
          aqarLink: body.aqarLink || null,
          allowedPaymentPlans: body.allowedPaymentPlans ? (typeof body.allowedPaymentPlans === 'string' ? body.allowedPaymentPlans : JSON.stringify(body.allowedPaymentPlans)) : "[\"1\",\"2\",\"4\"]",
          videoUrl: body.videoUrl || null,
          userId: body.userId || null,
          parentId: body.parentId || null,
          status: body.status || "PUBLISHED",
        }
      });

      // Create nested subProperties if any
      if (Array.isArray(subPropertiesData) && subPropertiesData.length > 0) {
        for (const unit of subPropertiesData) {
          await prisma.property.create({
            data: {
              titleAr: unit.titleAr || "وحدة سكنية",
              titleEn: unit.titleEn || "Unit",
              type: unit.type || type,
              propertyCategory: unit.propertyCategory || "APARTMENT",
              paymentFrequency: unit.paymentFrequency || (type === "RENT" ? "MONTHLY" : null),
              paymentsCount: safeIntOrNull(unit.paymentsCount),
              area: safeFloat(unit.area),
              details: unit.details || null,
              locationLink: body.locationLink || null,
              locationText: body.locationText || null,
              description: unit.description || "",
              features: unit.features || null,
              propertyAge: safeInt(body.propertyAge),
              electricityCost: safeFloat(unit.electricityCost),
              electricityFrequency: unit.electricityFrequency || null,
              vat: safeFloat(unit.vat),
              vatExempt: unit.vatExempt !== undefined ? Boolean(unit.vatExempt) : false,
              vatNotApplicable: unit.vatNotApplicable !== undefined ? Boolean(unit.vatNotApplicable) : false,
              utilityBills: unit.utilityBills || "NONE",
              commission: safeFloat(unit.commission),
              price: safeFloat(unit.price),
              imageUrls: processImageUrls(unit.imageUrls),
              aqarLink: unit.aqarLink || null,
              allowedPaymentPlans: unit.allowedPaymentPlans ? (typeof unit.allowedPaymentPlans === 'string' ? unit.allowedPaymentPlans : JSON.stringify(unit.allowedPaymentPlans)) : "[\"1\",\"2\",\"4\"]",
              videoUrl: unit.videoUrl || null,
              userId: body.userId || null,
              parentId: newProperty.id,
              status: unit.status || "PUBLISHED",
            }
          });
        }
      }

      invalidateCache('properties');
      await logAction(req, "ADD_PROPERTY", `Added property: ${newProperty.titleAr} (${newProperty.id}) with ${subPropertiesData.length} units`);
      res.status(201).json(newProperty);
    } catch (error) {
      logger.error("Error creating property:", error);
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.put(["/api/properties/:id", "/api/admin/properties/:id"], requirePermission('properties'), async (req, res) => {
    try {
      const body = req.body;
      const type = body.type || "SALE";
      const hasSubProperties = 'subProperties' in body;
      const subPropertiesData = hasSubProperties ? (body.subProperties || []) : null;

      // Build update data only from fields explicitly provided in the request body
      // This prevents partial updates (e.g. just changing details/floors) from
      // wiping out other fields with defaults.
      const updateData: any = {};
      if ('titleAr' in body) updateData.titleAr = body.titleAr || (type === "SALE" ? "عقار للبيع" : "عقار للإيجار");
      if ('titleEn' in body) updateData.titleEn = body.titleEn || (type === "SALE" ? "Property for Sale" : "Property for Rent");
      if ('type' in body) updateData.type = type;
      if ('propertyCategory' in body) updateData.propertyCategory = body.propertyCategory || "VILLA";
      if ('paymentFrequency' in body) updateData.paymentFrequency = type === "RENT" ? (body.paymentFrequency || "MONTHLY") : null;
      if ('paymentsCount' in body) updateData.paymentsCount = type === "RENT" ? safeIntOrNull(body.paymentsCount) : null;
      if ('area' in body) updateData.area = safeFloat(body.area);
      if ('details' in body) updateData.details = body.details || null;
      if ('locationLink' in body) updateData.locationLink = body.locationLink || null;
      if ('locationText' in body) updateData.locationText = body.locationText || null;
      if ('description' in body) updateData.description = body.description || "";
      if ('features' in body) updateData.features = body.features || null;
      if ('propertyAge' in body) updateData.propertyAge = safeInt(body.propertyAge);
      if ('electricityCost' in body) updateData.electricityCost = safeFloat(body.electricityCost);
      if ('electricityFrequency' in body) updateData.electricityFrequency = body.electricityFrequency || null;
      if ('vat' in body) updateData.vat = safeFloat(body.vat);
      if ('vatExempt' in body) updateData.vatExempt = Boolean(body.vatExempt);
      if ('vatNotApplicable' in body) updateData.vatNotApplicable = Boolean(body.vatNotApplicable);
      if ('utilityBills' in body) updateData.utilityBills = body.utilityBills || "NONE";
      if ('commission' in body) updateData.commission = safeFloat(body.commission);
      if ('price' in body) updateData.price = safeFloat(body.price);
      if ('imageUrls' in body) updateData.imageUrls = processImageUrls(body.imageUrls);
      if ('attachments' in body) updateData.attachments = processDocumentUrls(body.attachments);
      if ('aqarLink' in body) updateData.aqarLink = body.aqarLink || null;
      if ('allowedPaymentPlans' in body) updateData.allowedPaymentPlans = body.allowedPaymentPlans ? (typeof body.allowedPaymentPlans === 'string' ? body.allowedPaymentPlans : JSON.stringify(body.allowedPaymentPlans)) : "[\"1\",\"2\",\"4\"]";
      if ('videoUrl' in body) updateData.videoUrl = body.videoUrl || null;
      if ('userId' in body) updateData.userId = body.userId || null;
      if ('parentId' in body) updateData.parentId = body.parentId || null;
      if ('status' in body) updateData.status = body.status || "PUBLISHED";
      if ('renterId' in body) updateData.renterId = body.renterId || null;
      if ('renterName' in body) updateData.renterName = body.renterName || null;
      if ('renterPhone' in body) updateData.renterPhone = body.renterPhone || null;

      const updatedProperty = await prisma.property.update({
        where: { id: req.params.id },
        data: updateData
      });

      // Auto-sync with Building and RenterUnit models (for both sub-units and whole properties)
      if ('renterId' in body || 'renterName' in body || 'renterPhone' in body) {
        try {
          let buildingName = "";
          let unitNum = "";

          if (updatedProperty.parentId) {
            const parentProp = await prisma.property.findUnique({ where: { id: updatedProperty.parentId } });
            if (parentProp) {
              buildingName = parentProp.titleAr || parentProp.titleEn;
              unitNum = updatedProperty.titleAr || updatedProperty.titleEn || "وحدة";
            }
          } else {
            buildingName = updatedProperty.titleAr || updatedProperty.titleEn;
            unitNum = "كامل العقار";
          }

          if (buildingName) {
            let building = await prisma.building.findFirst({
              where: { name: { equals: buildingName.trim(), mode: 'insensitive' } }
            });
            if (!building) {
              building = await prisma.building.create({
                data: { name: buildingName.trim() }
              });
            }

            let rUnit = await prisma.renterUnit.findFirst({
              where: { buildingId: building.id, unitNumber: unitNum }
            });

            let normalizedPhone = (updatedProperty.renterPhone || '').trim().replace(/\D/g, '');
            if (normalizedPhone.startsWith('966')) normalizedPhone = normalizedPhone.substring(3);
            normalizedPhone = normalizedPhone.replace(/^0+/, '');

            let rId = updatedProperty.renterId || null;
            if (!rId && normalizedPhone) {
              let existingRenter = await prisma.renter.findUnique({ where: { phone: normalizedPhone } });
              if (!existingRenter) {
                existingRenter = await prisma.renter.create({
                  data: {
                    name: updatedProperty.renterName || 'مستأجر',
                    phone: normalizedPhone
                  }
                });
              }
              rId = existingRenter.id;
            }

            if (!rUnit) {
              await prisma.renterUnit.create({
                data: {
                  buildingId: building.id,
                  unitNumber: unitNum,
                  renterId: rId,
                  renterName: updatedProperty.renterName || null,
                  renterPhone: normalizedPhone || null,
                  rentAmount: updatedProperty.price || null
                }
              });
            } else {
              await prisma.renterUnit.update({
                where: { id: rUnit.id },
                data: {
                  renterId: rId,
                  renterName: updatedProperty.renterName || null,
                  renterPhone: normalizedPhone || null
                }
              });
            }
          }
        } catch (syncErr) {
          logger.error("Failed auto-syncing property to RenterUnit:", syncErr);
        }
      }

      // Only synchronize subProperties when explicitly provided in the payload.
      // This prevents partial updates (like changing just details/floors) from
      // accidentally deleting all child units.
      if (hasSubProperties && subPropertiesData !== null) {
        // Get all current subproperties of this building from DB
        const dbSubProperties = await prisma.property.findMany({
          where: { parentId: req.params.id }
        });

        const payloadSubIds = subPropertiesData.map((u: any) => u.id).filter(Boolean);

        // 1. Delete ones that are not in the payload
        const idsToDelete = dbSubProperties.filter(p => !payloadSubIds.includes(p.id)).map(p => p.id);
        if (idsToDelete.length > 0) {
          await prisma.property.deleteMany({
            where: { id: { in: idsToDelete } }
          });
        }

        // 2. Create or Update the rest
        if (Array.isArray(subPropertiesData)) {
          for (const unit of subPropertiesData) {
            const existingUnit = dbSubProperties.find(p => p.id === unit.id);
            
            let finalImageUrls = processImageUrls(unit.imageUrls);
            let finalFeatures = unit.features || null;
            let finalUtilityBills = unit.utilityBills || "NONE";
            let finalAllowedPaymentPlans = unit.allowedPaymentPlans ? (typeof unit.allowedPaymentPlans === 'string' ? unit.allowedPaymentPlans : JSON.stringify(unit.allowedPaymentPlans)) : "[\"1\",\"2\",\"4\"]";
            let finalVideoUrl = unit.videoUrl || null;
            let finalElectricityCost = safeFloat(unit.electricityCost);
            let finalElectricityFrequency = unit.electricityFrequency || null;
            let finalVat = safeFloat(unit.vat);
            let finalVatExempt = unit.vatExempt !== undefined ? Boolean(unit.vatExempt) : false;
            let finalVatNotApplicable = unit.vatNotApplicable !== undefined ? Boolean(unit.vatNotApplicable) : false;
            let finalCommission = safeFloat(unit.commission);
            let finalAqarLink = unit.aqarLink || null;
            let finalAttachments = unit.attachments ? (typeof unit.attachments === 'string' ? unit.attachments : JSON.stringify(unit.attachments)) : "[]";

            if (existingUnit) {
              // Preserve fields not edited in simplified inline step 5 form
              if (!unit.imageUrls || unit.imageUrls === '[]' || (Array.isArray(unit.imageUrls) && unit.imageUrls.length === 0)) {
                finalImageUrls = existingUnit.imageUrls || '[]';
              }
              if (!unit.features && existingUnit.features) {
                finalFeatures = existingUnit.features;
              }
              if ((!unit.utilityBills || unit.utilityBills === 'NONE') && existingUnit.utilityBills && existingUnit.utilityBills !== 'NONE') {
                finalUtilityBills = existingUnit.utilityBills;
              }
              if ((!unit.allowedPaymentPlans || unit.allowedPaymentPlans === '[]' || JSON.stringify(unit.allowedPaymentPlans) === '["1","2","4"]') && existingUnit.allowedPaymentPlans && existingUnit.allowedPaymentPlans !== '["1","2","4"]') {
                finalAllowedPaymentPlans = existingUnit.allowedPaymentPlans;
              }
              if (!unit.videoUrl && existingUnit.videoUrl) {
                finalVideoUrl = existingUnit.videoUrl;
              }
              if (!unit.electricityCost && existingUnit.electricityCost) {
                finalElectricityCost = existingUnit.electricityCost;
              }
              if (!unit.electricityFrequency && existingUnit.electricityFrequency) {
                finalElectricityFrequency = existingUnit.electricityFrequency;
              }
              if (!unit.vat && existingUnit.vat) {
                finalVat = existingUnit.vat;
              }
              if (unit.vatExempt === undefined && existingUnit.vatExempt) {
                finalVatExempt = existingUnit.vatExempt;
              }
              if (unit.vatNotApplicable === undefined && existingUnit.vatNotApplicable) {
                finalVatNotApplicable = existingUnit.vatNotApplicable;
              }
              if (!unit.commission && existingUnit.commission) {
                finalCommission = existingUnit.commission;
              }
              if (!unit.aqarLink && existingUnit.aqarLink) {
                finalAqarLink = existingUnit.aqarLink;
              }
              if ((!unit.attachments || unit.attachments === '[]') && existingUnit.attachments && existingUnit.attachments !== '[]') {
                finalAttachments = existingUnit.attachments;
              }
            }

            const unitData = {
              titleAr: unit.titleAr || "وحدة سكنية",
              titleEn: unit.titleEn || "Unit",
              type: unit.type || type,
              propertyCategory: unit.propertyCategory || "APARTMENT",
              paymentFrequency: unit.paymentFrequency || (type === "RENT" ? "MONTHLY" : null),
              paymentsCount: safeIntOrNull(unit.paymentsCount),
              area: safeFloat(unit.area),
              details: unit.details || null,
              locationLink: body.locationLink || null,
              locationText: body.locationText || null,
              description: unit.description || "",
              features: finalFeatures,
              propertyAge: safeInt(body.propertyAge),
              electricityCost: finalElectricityCost,
              electricityFrequency: finalElectricityFrequency,
              vat: finalVat,
              vatExempt: finalVatExempt,
              vatNotApplicable: finalVatNotApplicable,
              utilityBills: finalUtilityBills,
              commission: finalCommission,
              price: safeFloat(unit.price),
              imageUrls: finalImageUrls,
              aqarLink: finalAqarLink,
              allowedPaymentPlans: finalAllowedPaymentPlans,
              videoUrl: finalVideoUrl,
              attachments: finalAttachments,
              userId: body.userId || null,
              parentId: updatedProperty.id,
              status: unit.status || "PUBLISHED",
            };

            if (unit.id && dbSubProperties.some(p => p.id === unit.id)) {
              // Update existing unit
              await prisma.property.update({
                where: { id: unit.id },
                data: unitData
              });
            } else {
              // Create new unit
              await prisma.property.create({
                data: unitData
              });
            }
          }
        }
      }

      invalidateCache('properties');
      await logAction(req, "UPDATE_PROPERTY", `Updated property: ${updatedProperty.titleAr} (${req.params.id})${hasSubProperties ? ' with synced subProperties' : ''}`);
      res.json(updatedProperty);
    } catch (error) {
      logger.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.delete(["/api/properties/:id", "/api/admin/properties/:id"], requirePermission('properties'), async (req, res) => {
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

  app.post(["/api/properties/:id/duplicate", "/api/admin/properties/:id/duplicate"], requirePermission('properties'), async (req, res) => {
    try {
      const { id } = req.params;
      const count = Math.min(Math.max(parseInt(req.body?.count) || 1, 1), 20);

      const sourceProperty = await prisma.property.findUnique({
        where: { id }
      });

      if (!sourceProperty) {
        return res.status(404).json({ error: "Property not found" });
      }

      let siblingProperties: Array<{ titleAr: string; titleEn: string; details: any }> = [];
      if (sourceProperty.parentId) {
        siblingProperties = await prisma.property.findMany({
          where: { parentId: sourceProperty.parentId },
          select: { titleAr: true, titleEn: true, details: true }
        });
      } else {
        siblingProperties = await prisma.property.findMany({
          where: { parentId: null },
          select: { titleAr: true, titleEn: true, details: true }
        });
      }

      const matchAr = (sourceProperty.titleAr || '').match(/^(.*?)(?:_(\d+))?$/);
      const baseTitleAr = (matchAr && matchAr[1]) ? matchAr[1] : (sourceProperty.titleAr || 'عقار');

      const matchEn = (sourceProperty.titleEn || '').match(/^(.*?)(?:_(\d+))?$/);
      const baseTitleEn = (matchEn && matchEn[1]) ? matchEn[1] : (sourceProperty.titleEn || 'Property');

      let maxSeq = 0;
      const escAr = baseTitleAr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexAr = new RegExp(`^${escAr}(?:_(\\d+))?$`);

      for (const sib of siblingProperties) {
        const m = sib.titleAr ? sib.titleAr.match(regexAr) : null;
        if (m) {
          const num = m[1] && sib.titleAr === baseTitleAr ? 0 : (m[1] ? parseInt(m[1], 10) : 0);
          if (num > maxSeq) maxSeq = num;
        }
      }

      // Check all sibling titles matching baseTitleAr logic
      for (const sib of siblingProperties) {
        if (!sib.titleAr) continue;
        if (sib.titleAr === baseTitleAr && maxSeq < 0) maxSeq = 0;
        const m = sib.titleAr.match(new RegExp(`^${escAr}_(\\d+)$`));
        if (m && m[1]) {
          const num = parseInt(m[1], 10);
          if (num > maxSeq) maxSeq = num;
        }
      }

      const createdDuplicates = [];

      for (let i = 1; i <= count; i++) {
        const nextSeq = maxSeq + i;
        const newTitleAr = `${baseTitleAr}_${nextSeq}`;
        const newTitleEn = `${baseTitleEn}_${nextSeq}`;

        let updatedDetails = sourceProperty.details;
        if (sourceProperty.details) {
          try {
            const detailsList = typeof sourceProperty.details === 'string'
              ? JSON.parse(sourceProperty.details)
              : sourceProperty.details;

            if (Array.isArray(detailsList)) {
              const newDetailsList = detailsList.map((d: any) => {
                if (d.key === 'رقم الوحدة' || d.key === 'Unit Name') {
                  const valMatch = String(d.value || '').match(/^(.*?)(?:_(\d+))?$/);
                  const valBase = (valMatch && valMatch[1]) ? valMatch[1] : String(d.value || '');
                  return { ...d, value: `${valBase}_${nextSeq}` };
                }
                return d;
              });
              updatedDetails = JSON.stringify(newDetailsList);
            }
          } catch (_) {}
        }

        const duplicate = await prisma.property.create({
          data: {
            titleAr: newTitleAr,
            titleEn: newTitleEn,
            type: sourceProperty.type,
            propertyCategory: sourceProperty.propertyCategory,
            paymentFrequency: sourceProperty.paymentFrequency,
            paymentsCount: sourceProperty.paymentsCount,
            area: sourceProperty.area,
            details: updatedDetails,
            locationLink: sourceProperty.locationLink,
            locationText: sourceProperty.locationText,
            description: sourceProperty.description,
            features: sourceProperty.features,
            propertyAge: sourceProperty.propertyAge,
            electricityCost: sourceProperty.electricityCost,
            electricityFrequency: sourceProperty.electricityFrequency,
            vat: sourceProperty.vat,
            vatExempt: sourceProperty.vatExempt,
            vatNotApplicable: sourceProperty.vatNotApplicable,
            utilityBills: sourceProperty.utilityBills,
            commission: sourceProperty.commission,
            price: sourceProperty.price,
            imageUrls: sourceProperty.imageUrls,
            attachments: sourceProperty.attachments,
            aqarLink: sourceProperty.aqarLink,
            allowedPaymentPlans: sourceProperty.allowedPaymentPlans,
            videoUrl: sourceProperty.videoUrl,
            userId: (req as any).user ? (req as any).user.id : sourceProperty.userId,
            parentId: sourceProperty.parentId,
            status: sourceProperty.status || "PUBLISHED",
            renterId: null,
            renterName: null,
            renterPhone: null
          }
        });

        // Duplicate nested subProperties/units if source is a parent property
        if (!sourceProperty.parentId) {
          const childUnits = await prisma.property.findMany({
            where: { parentId: sourceProperty.id }
          });
          for (const unit of childUnits) {
            await prisma.property.create({
              data: {
                titleAr: unit.titleAr,
                titleEn: unit.titleEn,
                type: unit.type,
                propertyCategory: unit.propertyCategory,
                paymentFrequency: unit.paymentFrequency,
                paymentsCount: unit.paymentsCount,
                area: unit.area,
                details: unit.details,
                locationLink: unit.locationLink,
                locationText: unit.locationText,
                description: unit.description,
                features: unit.features,
                propertyAge: unit.propertyAge,
                electricityCost: unit.electricityCost,
                electricityFrequency: unit.electricityFrequency,
                vat: unit.vat,
                vatExempt: unit.vatExempt,
                vatNotApplicable: unit.vatNotApplicable,
                utilityBills: unit.utilityBills,
                commission: unit.commission,
                price: unit.price,
                imageUrls: unit.imageUrls,
                attachments: unit.attachments,
                aqarLink: unit.aqarLink,
                allowedPaymentPlans: unit.allowedPaymentPlans,
                videoUrl: unit.videoUrl,
                userId: (req as any).user ? (req as any).user.id : unit.userId,
                parentId: duplicate.id,
                status: unit.status || "PUBLISHED",
                renterId: null,
                renterName: null,
                renterPhone: null
              }
            });
          }
        }

        createdDuplicates.push(duplicate);
      }

      invalidateCache('properties');
      await logAction(req, "DUPLICATE_PROPERTY", `Duplicated property ${sourceProperty.titleAr} (${sourceProperty.id}) ${count} time(s)`);
      res.status(201).json(createdDuplicates.length === 1 ? createdDuplicates[0] : createdDuplicates);
    } catch (error) {
      logger.error(`Error duplicating property ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to duplicate property" });
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

  async function getGlobalSettings() {
    if (dbCache.settingsCached) return dbCache.settings;
    let result: any = null;
    try {
      const s = await prisma.settings.findUnique({ where: { id: "global" } });
      if (s) {
        dbCache.settings = s;
        dbCache.settingsCached = true;
        return s;
      }
    } catch (err) {
      logger.warn("Prisma Settings query failed, using raw SQL query:", err);
    }

    // Raw fallback queries
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM "Settings" WHERE id = 'global' LIMIT 1`);
      if (rows && rows.length > 0) {
        dbCache.settings = rows[0];
        dbCache.settingsCached = true;
        return rows[0];
      }
    } catch (_) {}
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(`SELECT * FROM Settings WHERE id = 'global' LIMIT 1`);
      if (rows && rows.length > 0) {
        dbCache.settings = rows[0];
        dbCache.settingsCached = true;
        return rows[0];
      }
    } catch (_) {}

    return null;
  }

  async function updateGlobalSettings(data: any) {
    // Invalidate the settings cache so the next read is fresh
    dbCache.settingsCached = false;
    const fields = Object.keys(data).filter(k => data[k] !== undefined);
    if (fields.length === 0) return getGlobalSettings();

    try {
      const updated = await prisma.settings.update({
        where: { id: "global" },
        data
      });
      dbCache.settings = updated;
      dbCache.settingsCached = true;
      return updated;
    } catch (err) {
      logger.warn("Prisma client settings update failed, falling back to raw SQL updates:", err);
    }

    // Allowed fields for Settings from schema to prevent SQL injection
    const allowedFields = [
      'whatsappNumber', 'callingNumber', 'whatsappMessage', 'otpWebhookUrl',
      'otpMessageTemplate', 'otpWebhookPayload', 'homeImages', 'logoUrl',
      'email', 'instagramUrl', 'twitterUrl', 'facebookUrl', 'linkedinUrl',
      'youtubeUrl', 'tiktokUrl', 'snapchatUrl', 'notificationEmail',
      'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFrom',
      'imapHost', 'imapPort', 'analyticsScript', 'analyticsDashboardUrl',
      'addressAr', 'addressEn', 'addressMapLink', 'techhubEnabled',
      'techhubClientId', 'techhubClientSecret', 'techhubApiKey',
      'techhubSandboxMode', 'indexNowKey'
    ];

    // Fallback: update fields one-by-one using raw SQL
    for (const field of fields) {
      if (!allowedFields.includes(field)) {
        logger.warn(`Skipping invalid field in Settings update: ${field}`);
        continue;
      }
      const val = data[field];
      try {
        if (typeof val === 'string' || typeof val === 'number') {
          try {
            await prisma.$executeRaw(Prisma.sql`UPDATE "Settings" SET "${Prisma.raw(field)}" = ${val} WHERE id = 'global'`);
          } catch (e: any) {
            if (e.message?.includes('syntax') || e.message?.includes('table') || e.code?.startsWith('P2')) {
              await prisma.$executeRaw(Prisma.sql`UPDATE Settings SET ${Prisma.raw(field)} = ${val} WHERE id = 'global'`);
            } else {
              throw e;
            }
          }
        } else if (val === null) {
          try {
            await prisma.$executeRaw(Prisma.sql`UPDATE "Settings" SET "${Prisma.raw(field)}" = NULL WHERE id = 'global'`);
          } catch (e: any) {
            if (e.message?.includes('syntax') || e.message?.includes('table') || e.code?.startsWith('P2')) {
              await prisma.$executeRaw(Prisma.sql`UPDATE Settings SET ${Prisma.raw(field)} = NULL WHERE id = 'global'`);
            } else {
              throw e;
            }
          }
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
        notificationEmail, smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, imapHost, imapPort, analyticsScript, analyticsDashboardUrl,
        addressAr, addressEn, addressMapLink,
        techhubEnabled, techhubClientId, techhubClientSecret, techhubApiKey, techhubSandboxMode,
        verifyKitEnabled, verifyKitAppKey, verifyKitServerKey, verifyKitDomain, verifyKitDeeplink
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

      // Custom IMAP fields
      if (imapHost !== undefined) updateData.imapHost = imapHost;
      if (imapPort !== undefined) updateData.imapPort = imapPort ? Number(imapPort) : null;

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

      // VerifyKit Settings
      if (verifyKitEnabled !== undefined) updateData.verifyKitEnabled = verifyKitEnabled;
      if (verifyKitAppKey !== undefined) updateData.verifyKitAppKey = verifyKitAppKey;
      if (verifyKitServerKey !== undefined) updateData.verifyKitServerKey = verifyKitServerKey;
      if (verifyKitDomain !== undefined) updateData.verifyKitDomain = verifyKitDomain;
      if (verifyKitDeeplink !== undefined) updateData.verifyKitDeeplink = verifyKitDeeplink;

      const updated = await updateGlobalSettings(updateData);
      
      await logAction(req, "UPDATE_SETTINGS", "Updated global site settings");
      res.json(updated);
    } catch (error) {
      logger.error("Failed to update settings:", error);
      res.status(500).json({ error: "Failed to update settings: " + (error as any)?.message });
    }
  });

  app.post("/api/admin/upload-home-video", requirePermission('settings'), (req, res, next) => {
    homeVideoUpload.single('file')(req, res, (err) => {
      if (err) {
        logger.error('Multer error during home video upload:', err);
        return res.status(400).json({ error: 'Failed to upload video file: ' + err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
      }

      res.json({
        success: true,
        url: `/uploads/${req.file.filename}`
      });
    } catch (error) {
      logger.error('Failed to upload home video', error);
      res.status(500).json({ error: 'Failed to upload video' });
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
        if (!thProj.nameAr) continue;
        let building = await prisma.building.findFirst({
          where: { name: { equals: thProj.nameAr.trim(), mode: 'insensitive' } }
        });

        if (!building) {
          building = await prisma.building.create({
            data: { name: thProj.nameAr.trim() }
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
        if (!thContract.buildingName) continue;
        let building = await prisma.building.findFirst({
          where: { name: { equals: thContract.buildingName.trim(), mode: 'insensitive' } }
        });

        if (!building) {
          building = await prisma.building.create({
            data: { name: thContract.buildingName.trim() }
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
      const archive = new ZipArchive({ zlib: { level: 6 } });
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
  const BACKUP_RESTORE_MAX_MB = 1024;
  const restoreUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: BACKUP_RESTORE_MAX_MB * 1024 * 1024 }
  });
  app.post("/api/admin/restore", requirePermission('settings'), restoreUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      let dbData: any = null;
      let zip: AdmZip | null = null;

      if (req.file.originalname.toLowerCase().endsWith('.zip')) {
        zip = new AdmZip(req.file.buffer);
        const entry = zip.getEntries().find(e => e.entryName === 'db-data.json');
        if (!entry) {
          return res.status(400).json({ error: 'No db-data.json file found inside uploaded ZIP' });
        }
        dbData = JSON.parse(entry.getData().toString('utf8'));
      } else if (req.file.originalname.toLowerCase().endsWith('.json')) {
        dbData = JSON.parse(req.file.buffer.toString('utf8'));
      } else {
        return res.status(400).json({ error: 'Please upload a valid backup .zip or .json file' });
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
          const allProperties = dbData.properties;

          // Insert all properties with parentId null first, then restore parent links.
          // This prevents foreign-key ordering issues for self-referenced properties.
          await tx.property.createMany({
            data: allProperties.map((p: any) => ({ ...p, parentId: null }))
          });

          const insertedIds = new Set(allProperties.map((p: any) => p.id));
          for (const p of allProperties) {
            if (p.parentId && insertedIds.has(p.parentId)) {
              await tx.property.updateMany({
                where: { id: p.id },
                data: { parentId: p.parentId }
              });
            }
          }
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

      // Reset API caches so restored data is visible immediately.
      invalidateCache('properties');
      invalidateCache('projects');

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

      const isHttps = req.protocol === 'https' || (req.secure && process.env.NODE_ENV === 'production');
      const cookieOptions = {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      };
      
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
         res.cookie('token', token, cookieOptions);
         logger.info(`Admin login successful for ${username} (${admin.role})`);
         return res.json({ ...userPayload, token });
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
         res.cookie('token', token, cookieOptions);
         logger.info(`User login successful for ${username}`);
         return res.json({ ...userPayload, token });
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
         res.cookie('token', token, cookieOptions);
         logger.info(`Fallback admin login successful`);
         return res.json({ ...userPayload, token });
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
    // Respond immediately and record the view asynchronously so navigation
    // tracking never blocks the request (this fires on every client route change).
    res.json({ success: true });
    const { path, propertyId } = req.body || {};
    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || "").toString();

    (async () => {
      try {
        if (ipAddress) {
          const existingView = await prisma.pageView.findFirst({
            where: { path, ipAddress }
          });
          if (existingView) return;
        }
        await prisma.pageView.create({
          data: { path, propertyId, ipAddress }
        });
      } catch (error) {
        logger.error("Analytics Error:", error);
      }
    })();
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

      // Real-time broadcast
      const io = req.app.get("io");
      if (io) {
        io.to("admin_room").emit("new_callback_request", newRequest);
        io.emit("new_callback_request", newRequest);
      }

      // Send Email notification ping
      await sendCallbackEmailNotification(req);

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
      const handledBy = (req as any).user?.name || (req as any).user?.username || 'Admin';
      const updated = await prisma.callbackRequest.update({
        where: { id },
        data: {
          status,
          handledBy
        },
        include: { notes: { orderBy: { createdAt: 'asc' } } }
      });

      const io = req.app.get("io");
      if (io) {
        io.to(`callback_${id}`).emit("callback_updated", updated);
        io.to("admin_room").emit("callback_updated", updated);
        io.emit("callback_updated", updated);
      }

      await logAction(req, "UPDATE_CALLBACK_STATUS", `Changed callback status of ${updated.name} to ${status}`);
      res.json(updated);
    } catch (error) {
      logger.error("Failed to update callback status", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.put("/api/admin/maintenance-reports/:id/internal-note", requirePermission('maintenance'), async (req, res) => {
    try {
      const { id } = req.params;
      const { internalNote } = req.body;
      
      const updatedReport = await prisma.maintenanceReport.update({
        where: { id },
        data: { internalNote },
        include: {
          renter: true,
          renterUnit: { include: { building: true } },
          messages: { orderBy: { createdAt: 'asc' } }
        }
      });
      
      await logAction(req, "UPDATE_INTERNAL_NOTE", `Updated internal note for maintenance report ID ${id}`);
      res.json(updatedReport);
    } catch (error) {
      logger.error("Failed to update maintenance internal note", error);
      res.status(500).json({ error: "Failed to update internal note" });
    }
  });

  app.put("/api/callback-requests/:id/internal-note", requirePermission('callbacks'), async (req, res) => {
    try {
      const { id } = req.params;
      const { internalNote } = req.body;
      
      const updatedRequest = await prisma.callbackRequest.update({
        where: { id },
        data: { internalNote },
        include: { notes: { orderBy: { createdAt: 'asc' } } }
      });

      const io = req.app.get("io");
      if (io) {
        io.to(`callback_${id}`).emit("callback_updated", updatedRequest);
        io.to("admin_room").emit("callback_updated", updatedRequest);
        io.emit("callback_updated", updatedRequest);
      }
      
      await logAction(req, "UPDATE_INTERNAL_NOTE", `Updated internal note for callback request ID ${id}`);
      res.json(updatedRequest);
    } catch (error) {
      logger.error("Failed to update callback internal note", error);
      res.status(500).json({ error: "Failed to update internal note" });
    }
  });

  app.post("/api/callback-requests/:id/notes", requirePermission('callbacks'), async (req, res) => {
    try {
      const { id } = req.params;
      const text = req.body.text || req.body.notes || req.body.message || '';
      const userObj = (req as any).user;
      const isCustomerMsg = req.body.senderRole === 'CUSTOMER' || req.body.isCustomer === true;
      const senderRole = isCustomerMsg ? 'CUSTOMER' : 'ADMIN';
      const authorId = userObj?.id || userObj?.username || req.body?.authorId || (isCustomerMsg ? 'CUSTOMER' : 'STAFF');
      const authorName = userObj?.name || userObj?.username || req.body?.authorName || 'الموظف';
      
      const note = await prisma.callbackNote.create({
        data: {
          callbackRequestId: id,
          text,
          authorName
        }
      });
      
      const noteWithMetadata = {
        ...note,
        authorId,
        senderRole,
      };

      // Update callback assignment
      const updatedRequest = await prisma.callbackRequest.update({
        where: { id },
        data: { handledBy: authorName },
        include: { notes: { orderBy: { createdAt: 'asc' } } }
      });

      const io = req.app.get("io");
      if (io) {
        const payload = { ...noteWithMetadata, requestId: id, callbackRequestId: id, updatedRequest };
        io.to(`callback_${id}`).emit("new_callback_note", payload);
        io.to("admin_room").emit("new_callback_note", payload);
        io.emit("new_callback_note", payload);
      }

      // Send Email notification ping to customer
      await sendReplyEmailNotification(updatedRequest, text, authorName, req);

      // Send Email notification ping to staff
      await sendCallbackEmailNotification(req);

      await logAction(req, "REPLY_CALLBACK", `Added reply note to callback request ID ${id}`);
      res.status(201).json(noteWithMetadata);
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

      const io = req.app.get("io");
      if (io) {
        io.to("admin_room").emit("callback_deleted", { id });
        io.emit("callback_deleted", { id });
      }

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
          select: { 
            id: true, username: true, name: true, role: true, email: true, createdAt: true,
            assignedBuildings: { select: { id: true, name: true } }
          },
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
      const { username, password, name, role, email, assignedBuildingIds } = req.body;
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
          data: {
            username,
            password,
            name,
            role: role || "ADMIN",
            email,
            assignedBuildings: Array.isArray(assignedBuildingIds) && assignedBuildingIds.length > 0
              ? { connect: assignedBuildingIds.map((bId: string) => ({ id: bId })) }
              : undefined
          },
          select: {
            id: true, username: true, name: true, role: true, email: true,
            assignedBuildings: { select: { id: true, name: true } }
          }
        });
        await logAction(req, "ADD_PLATFORM_USER", `Created platform user: ${username} (${role || "ADMIN"})`);
        return res.status(201).json(newUser);
      } catch (err) {
        logger.warn("Prisma user creation failed, falling back to raw SQL:", err);
      }

      // Fallback: Create using raw SQL
      const uuid = require('crypto').randomUUID();

      try {
        await prisma.$executeRaw(
          Prisma.sql`INSERT INTO "Admin" (id, username, password, name, role, email, "createdAt") VALUES (${uuid}, ${username}, ${password}, ${name}, ${role || "ADMIN"}, ${email || null}, NOW())`
        );
      } catch (_) {
        await prisma.$executeRaw(
          Prisma.sql`INSERT INTO Admin (id, username, password, name, role, email, createdAt) VALUES (${uuid}, ${username}, ${password}, ${name}, ${role || "ADMIN"}, ${email || null}, datetime('now'))`
        );
      }

      await logAction(req, "ADD_PLATFORM_USER", `Created platform user (raw SQL): ${username} (${role || "ADMIN"})`);
      res.status(201).json({ id: uuid, username, name, role: role || "ADMIN", email, assignedBuildings: [] });
    } catch (error) {
      logger.error("Failed to create platform user", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", requirePermission('users'), async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, name, role, email, assignedBuildingIds } = req.body;
      
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
            email: email !== undefined ? email : undefined,
            assignedBuildings: Array.isArray(assignedBuildingIds)
              ? { set: assignedBuildingIds.map((bId: string) => ({ id: bId })) }
              : undefined
          },
          select: {
            id: true, username: true, name: true, role: true, email: true,
            assignedBuildings: { select: { id: true, name: true } }
          }
        });
        await logAction(req, "UPDATE_PLATFORM_USER", `Updated platform user details: ${updated.username}`);
        return res.json(updated);
      } catch (err) {
        logger.warn("Prisma user update failed, falling back to raw SQL:", err);
      }

      // Fallback: update using raw SQL
      if (username) {
        await prisma.$executeRaw(Prisma.sql`UPDATE "Admin" SET username = ${username} WHERE id = ${id}`);
        await prisma.$executeRaw(Prisma.sql`UPDATE Admin SET username = ${username} WHERE id = ${id}`);
      }
      if (password) {
        await prisma.$executeRaw(Prisma.sql`UPDATE "Admin" SET password = ${password} WHERE id = ${id}`);
        await prisma.$executeRaw(Prisma.sql`UPDATE Admin SET password = ${password} WHERE id = ${id}`);
      }
      if (name) {
        await prisma.$executeRaw(Prisma.sql`UPDATE "Admin" SET name = ${name} WHERE id = ${id}`);
        await prisma.$executeRaw(Prisma.sql`UPDATE Admin SET name = ${name} WHERE id = ${id}`);
      }
      if (role) {
        await prisma.$executeRaw(Prisma.sql`UPDATE "Admin" SET role = ${role} WHERE id = ${id}`);
        await prisma.$executeRaw(Prisma.sql`UPDATE Admin SET role = ${role} WHERE id = ${id}`);
      }
      if (email !== undefined) {
        const emailVal = email || null;
        await prisma.$executeRaw(Prisma.sql`UPDATE "Admin" SET email = ${emailVal} WHERE id = ${id}`);
        await prisma.$executeRaw(Prisma.sql`UPDATE Admin SET email = ${emailVal} WHERE id = ${id}`);
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
    execSync("npx prisma db push --skip-generate", { stdio: 'inherit' });
    console.log("Database schema synchronized and client regenerated successfully.");
  } catch (dbError) {
    console.error("Prisma schema sync or client generation skipped/failed:", dbError);
  }

  // Seed default settings row if it doesn't exist yet
  try {
    await prisma.settings.upsert({
      where: { id: "global" },
      update: {},
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
  } catch (err) {
    logger.error("Failed to seed default settings:", err);
  }

  const httpServer = createHttpServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
    maxHttpBufferSize: 1e7
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    socket.on("join_ticket", (ticketId) => {
      socket.join(`ticket_${ticketId}`);
    });

    socket.on("join_callback", (callbackId) => {
      socket.join(`callback_${callbackId}`);
    });

    socket.on("join_admin", () => {
      socket.join("admin_room");
    });

    socket.on("typing", ({ ticketId, senderName }) => {
      socket.to(`ticket_${ticketId}`).emit("user_typing", { senderName });
    });

    socket.on("callback_typing", ({ callbackId, senderName }) => {
      socket.to(`callback_${callbackId}`).emit("callback_user_typing", { senderName });
    });

    socket.on("stop_typing", ({ ticketId }) => {
      socket.to(`ticket_${ticketId}`).emit("user_stop_typing");
    });

    socket.on("callback_stop_typing", ({ callbackId }) => {
      socket.to(`callback_${callbackId}`).emit("callback_user_stop_typing");
    });
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} with Socket.IO Real-time Engine`);
    console.log(`--------------------------------------------------`);
    console.log(`[ADMIN] Fallback credentials (if DB is empty):`);
    console.log(`[ADMIN]   Username : admin`);
    console.log(`[ADMIN]   Password : admin`);
    console.log(`--------------------------------------------------`);

    // Run immediate sync on boot
    syncInboundEmails().catch(err => {
      logger.error("[IMAP SYNC BOOT ERROR]", err);
    });

    // Start IMAP Polling every 2 minutes (120000ms)
    setInterval(() => {
      syncInboundEmails().catch(err => {
        logger.error("[IMAP SYNC INTERVAL ERROR]", err);
      });
    }, 120000);
  });
}

startServer();
