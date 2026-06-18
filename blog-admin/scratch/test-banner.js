const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Trying to insert a test banner into Prisma...");
  const banner = await prisma.banner.create({
    data: {
      title: "Test Banner",
      imageUrl: "https://example.com/test.png",
      linkUrl: "https://example.com",
      order: 0
    }
  });
  console.log("SUCCESS:", banner);
}

main()
  .catch(err => {
    console.error("PRISMA ERROR DETECTED:");
    console.error(err);
  })
  .finally(() => prisma.$disconnect());
