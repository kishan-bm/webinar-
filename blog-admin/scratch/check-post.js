const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const post = await prisma.post.findUnique({
    where: { slug: 'custom-chat-seo-test' }
  });
  console.log("POST CONTENT:");
  console.log(post?.content || "POST NOT FOUND");
}
main().catch(console.error).finally(() => prisma.$disconnect());
