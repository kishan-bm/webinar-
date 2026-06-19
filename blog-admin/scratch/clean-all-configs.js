const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning all SiteConfig records from database...');
  const result = await prisma.siteConfig.deleteMany();
  console.log(`✅ Successfully deleted ${result.count} records from SiteConfig.`);
}

main()
  .catch(e => {
    console.error('❌ Error cleaning database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
