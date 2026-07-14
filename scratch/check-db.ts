import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allPropertiesCount = await prisma.property.count();
  const parentPropertiesCount = await prisma.property.count({
    where: { parentId: null }
  });
  const subPropertiesCount = await prisma.property.count({
    where: { NOT: { parentId: null } }
  });

  console.log(`Total Properties in DB: ${allPropertiesCount}`);
  console.log(`Parent Properties (parentId = null): ${parentPropertiesCount}`);
  console.log(`Sub-Properties (parentId != null): ${subPropertiesCount}`);
  
  const sampleSub = await prisma.property.findFirst({
    where: { NOT: { parentId: null } }
  });
  console.log('Sample Sub-property:', sampleSub);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
