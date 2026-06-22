const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@navigationtrading.com';
  const password = args[1] || 'admin123';

  console.log(`Setting up superuser with email: ${email}...`);

  const passwordHash = hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {
      passwordHash: passwordHash
    },
    create: {
      name: 'Admin User',
      email: email.toLowerCase().trim(),
      passwordHash: passwordHash
    }
  });

  console.log('--------------------------------------------------');
  console.log('✅ Superuser setup complete!');
  console.log(`Email:    ${user.email}`);
  console.log(`Password: ${password}`);
  console.log('--------------------------------------------------');
}

main()
  .catch(e => {
    console.error('❌ Error creating superuser:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
