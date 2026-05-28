import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Execute SQLite robust options on startup to protect against malformed database disk images and simultaneous writes
prisma.$executeRawUnsafe(`PRAGMA journal_mode=WAL;`).then(() => {
  return prisma.$executeRawUnsafe(`PRAGMA busy_timeout=5000;`);
}).catch(err => {
  console.error("Failed to set robust SQLite options:", err);
});
