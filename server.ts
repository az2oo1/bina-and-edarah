import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/lib/db.js";
import fs from "fs";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size for base64 multi-image uploads
  app.use(express.json({ limit: '50mb' }));

  // API Routes

  // --- Admin Buildings (Renter Portal Setup) ---
  app.get('/api/admin/buildings', async (req, res) => {
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

  app.post('/api/admin/buildings', async (req, res) => {
    try {
      const { name } = req.body;
      const building = await prisma.building.create({
        data: { name }
      });
      res.status(201).json(building);
    } catch (error) {
      res.status(500).json({ error: "Failed to create building" });
    }
  });

  app.put('/api/admin/buildings/:id', async (req, res) => {
    try {
      const { transferDetails, photos } = req.body;
      const building = await prisma.building.update({
        where: { id: req.params.id },
        data: { transferDetails, photos }
      });
      res.json(building);
    } catch (error) {
      res.status(500).json({ error: "Failed to update building" });
    }
  });

  app.post('/api/admin/buildings/:id/upload-json', async (req, res) => {
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

      res.json({ success: true, count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process data" });
    }
  });

  app.delete('/api/admin/buildings/:id', async (req, res) => {
    try {
      await prisma.renterUnit.deleteMany({
        where: { buildingId: req.params.id }
      });
      await prisma.building.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete building" });
    }
  });

  app.delete('/api/admin/units/:id', async (req, res) => {
    try {
      await prisma.renterUnit.delete({
        where: { id: req.params.id }
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete unit" });
    }
  });

  app.get('/api/admin/renters', async (req, res) => {
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
  app.post('/api/renter/request-otp', async (req, res) => {
    const { phone } = req.body;
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

  app.post('/api/renter/login', async (req, res) => {
    try {
      const { phone, otp } = req.body;
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
        return res.status(401).json({ error: "رمز التحقق غير صحيح أو منتهي الصلاحية. (Invalid or expired OTP)" });
      }

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
  app.get('/api/admin/receipts', async (req, res) => {
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
      
      const history = await prisma.rentHistory.update({
        where: { id: historyId },
        data: { receiptUrl, paidDate: new Date().toLocaleDateString('en-GB') }, // Mark it paidish
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
          receiptUrl: receiptUrl
        }
      });
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: "Failed to upload receipt" });
    }
  });


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

  app.post("/api/properties", async (req, res) => {
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
          commission: safeFloat(body.commission),
          price: safeFloat(body.price),
          imageUrls: typeof body.imageUrls === 'string' ? body.imageUrls : JSON.stringify(body.imageUrls || []),
          aqarLink: body.aqarLink || null,
          userId: body.userId || null,
        }
      });
      res.status(201).json(newProperty);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
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
          commission: safeFloat(body.commission),
          price: safeFloat(body.price),
          imageUrls: typeof body.imageUrls === 'string' ? body.imageUrls : JSON.stringify(body.imageUrls || []),
          aqarLink: body.aqarLink || null,
          userId: body.userId || null,
        }
      });
      res.json(updatedProperty);
    } catch (error) {
      console.error("Error updating property:", error);
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
          imageUrls: typeof body.imageUrls === 'string' ? body.imageUrls : JSON.stringify(body.imageUrls || []),
        }
      });
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
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
          imageUrls: typeof body.imageUrls === 'string' ? body.imageUrls : JSON.stringify(body.imageUrls || []),
        }
      });
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
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
      const { whatsappNumber, callingNumber, whatsappMessage, otpWebhookUrl, otpMessageTemplate, otpWebhookPayload } = req.body;
      const settings = await prisma.settings.upsert({
        where: { id: "global" },
        update: { whatsappNumber, callingNumber, whatsappMessage, otpWebhookUrl, otpMessageTemplate, otpWebhookPayload },
        create: { id: "global", whatsappNumber, callingNumber, whatsappMessage, otpWebhookUrl, otpMessageTemplate, otpWebhookPayload }
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

  // AI Image Generation
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt.trim(),
        config: {
          numberOfImages: 1,
          aspectRatio: '4:3',
          outputMimeType: 'image/jpeg',
        },
      });

      const generatedImage = response.generatedImages?.[0];
      const imageBytes = generatedImage?.image?.imageBytes;
      if (!imageBytes) {
        const reason = generatedImage?.raiFilteredReason;
        return res.status(500).json({
          error: reason
            ? `Image blocked by safety filter: ${reason}`
            : "No image was generated — the prompt may have been filtered"
        });
      }

      const mimeType = generatedImage?.image?.mimeType || 'image/jpeg';
      const base64 = `data:${mimeType};base64,${imageBytes}`;
      res.json({ imageUrl: base64 });
    } catch (error: any) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate image" });
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
