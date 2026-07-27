import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma };

export interface CreatePropertyInput {
  titleAr: string;
  titleEn: string;
  type: string;
  propertyCategory?: string;
  paymentFrequency?: string;
  paymentsCount?: number;
  area?: number;
  details?: string;
  locationLink?: string;
  locationText?: string;
  description: string;
  features?: string;
  propertyAge?: number;
  electricityCost?: number;
  electricityFrequency?: string;
  vat?: number;
  vatExempt?: boolean;
  vatNotApplicable?: boolean;
  utilityBills?: string;
  commission?: number;
  price: number;
  imageUrls?: string;
  attachments?: string;
  aqarLink?: string;
  allowedPaymentPlans?: string;
  videoUrl?: string;
  status?: string;
  userId?: string;
  parentId?: string;
}

export const propertyService = {
  async createProperty(data: CreatePropertyInput) {
    return await prisma.property.create({
      data: {
        ...data,
        status: data.status || 'PUBLISHED',
      },
    });
  },

  async updateProperty(id: string, data: Partial<CreatePropertyInput>) {
    return await prisma.property.update({
      where: { id },
      data,
    });
  },

  async deleteProperty(id: string) {
    return await prisma.$transaction(async (tx) => {
      // Clean sub-properties first if any
      await tx.property.deleteMany({ where: { parentId: id } });
      return await tx.property.delete({ where: { id } });
    });
  },
};

export interface UpsertUnitInput {
  id?: string;
  unitNumber: string;
  renterName: string;
  renterPhone: string;
  contractEndDate?: string;
  isTanfeeth?: boolean;
  nextRentDue?: string;
  rentAmount?: number;
  rentHistory?: Array<{
    id?: string;
    dueDate?: string;
    paidDate?: string;
    amount?: string;
    receiptUrl?: string;
  }>;
}

export const buildingService = {
  async createBuilding(data: { name: string; transferDetails?: string; photos?: string }) {
    return await prisma.building.create({ data });
  },

  async updateBuilding(id: string, data: { name?: string; transferDetails?: string; photos?: string }) {
    return await prisma.building.update({
      where: { id },
      data,
    });
  },

  async deleteBuilding(id: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.renterUnit.deleteMany({ where: { buildingId: id } });
      return await tx.building.delete({ where: { id } });
    });
  },

  async syncBuildingUnits(buildingId: string, units: UpsertUnitInput[]) {
    return await prisma.$transaction(async (tx) => {
      const updatedUnitIds: string[] = [];

      for (const unit of units) {
        let unitRecord;
        if (unit.id) {
          unitRecord = await tx.renterUnit.update({
            where: { id: unit.id },
            data: {
              unitNumber: unit.unitNumber,
              renterName: unit.renterName,
              renterPhone: unit.renterPhone,
              contractEndDate: unit.contractEndDate,
              isTanfeeth: unit.isTanfeeth ?? false,
              nextRentDue: unit.nextRentDue,
              rentAmount: unit.rentAmount,
            },
          });
        } else {
          unitRecord = await tx.renterUnit.create({
            data: {
              buildingId,
              unitNumber: unit.unitNumber,
              renterName: unit.renterName,
              renterPhone: unit.renterPhone,
              contractEndDate: unit.contractEndDate,
              isTanfeeth: unit.isTanfeeth ?? false,
              nextRentDue: unit.nextRentDue,
              rentAmount: unit.rentAmount,
            },
          });
        }
        updatedUnitIds.push(unitRecord.id);

        if (unit.rentHistory && Array.isArray(unit.rentHistory)) {
          for (const item of unit.rentHistory) {
            if (item.id) {
              await tx.rentHistory.update({
                where: { id: item.id },
                data: {
                  dueDate: item.dueDate,
                  paidDate: item.paidDate,
                  amount: item.amount,
                  receiptUrl: item.receiptUrl,
                },
              });
            } else {
              await tx.rentHistory.create({
                data: {
                  renterUnitId: unitRecord.id,
                  dueDate: item.dueDate,
                  paidDate: item.paidDate,
                  amount: item.amount,
                  receiptUrl: item.receiptUrl,
                },
              });
            }
          }
        }
      }
      return updatedUnitIds;
    });
  },
};

export const renterService = {
  async deleteUnit(unitId: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.rentHistory.deleteMany({ where: { renterUnitId: unitId } });
      return await tx.renterUnit.delete({ where: { id: unitId } });
    });
  },

  async processReceiptUpload(data: {
    historyId?: string;
    paidDate: string;
    receiptUrl: string;
    renterName: string;
    renterPhone: string;
    buildingName?: string;
    unitNumber?: string;
    amount?: string;
    dueDate?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      let updatedHistory = null;
      if (data.historyId) {
        updatedHistory = await tx.rentHistory.update({
          where: { id: data.historyId },
          data: {
            paidDate: data.paidDate,
            receiptUrl: data.receiptUrl,
          },
        });
      }

      return { updatedHistory };
    });
  },
};

export const callbackService = {
  async addNoteAndStatus(data: {
    callbackRequestId: string;
    text: string;
    authorName: string;
    status?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      const note = await tx.callbackNote.create({
        data: {
          callbackRequestId: data.callbackRequestId,
          text: data.text,
          authorName: data.authorName,
        },
      });

      if (data.status) {
        await tx.callbackRequest.update({
          where: { id: data.callbackRequestId },
          data: { status: data.status, handledBy: data.authorName },
        });
      }

      return note;
    });
  },
};

export const auditService = {
  async logAction(userId: string, userName: string, userRole: string, action: string, details: string) {
    return await prisma.actionLog.create({
      data: {
        userId,
        userName,
        userRole,
        action,
        details,
      },
    });
  },
};
