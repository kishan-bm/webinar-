const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  });
  console.log('--- Current Banners ---');
  console.log(JSON.stringify(banners, null, 2));
}

main().finally(() => prisma.$disconnect());
