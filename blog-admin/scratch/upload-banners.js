const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Manually parse .env.local to load keys
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
  console.log('✅ Loaded environment variables from .env.local');
} catch (e) {
  console.error('❌ Failed to load .env.local:', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase keys in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BANNERS_DATA = [
  {
    localPath: '/Users/kishanbm/.gemini/antigravity-ide/brain/0a51d986-5eb6-4e00-8bbf-397c2e87608a/sidebar_banner_course_1781764314253.png',
    title: 'Options Trading Course',
    linkUrl: 'https://navigationtrading.com/',
    order: 0,
    storageName: `course_${Date.now()}.png`
  },
  {
    localPath: '/Users/kishanbm/.gemini/antigravity-ide/brain/0a51d986-5eb6-4e00-8bbf-397c2e87608a/sidebar_banner_alerts_1781764336384.png',
    title: 'Indicator & Alerts',
    linkUrl: 'https://navigationtrading.com/indicators',
    order: 1,
    storageName: `alerts_${Date.now()}.png`
  }
];

async function uploadFile(localPath, storageName) {
  console.log(`Uploading ${localPath} to Supabase storage as ${storageName}...`);
  const fileBuffer = fs.readFileSync(localPath);
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(`banners/${storageName}`, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(`banners/${storageName}`);

  return publicUrlData.publicUrl;
}

async function main() {
  // Clear existing banners
  console.log('Cleaning old banners from database...');
  await prisma.banner.deleteMany({});
  console.log('✅ Banners cleared.');

  // Upload and create new banners
  for (const banner of BANNERS_DATA) {
    try {
      const publicUrl = await uploadFile(banner.localPath, banner.storageName);
      console.log(`✅ Uploaded successfully. Public URL: ${publicUrl}`);

      const created = await prisma.banner.create({
        data: {
          title: banner.title,
          imageUrl: publicUrl,
          linkUrl: banner.linkUrl,
          order: banner.order
        }
      });
      console.log(`✅ Created Database record for Banner ID: ${created.id}, title: "${created.title}"`);
    } catch (err) {
      console.error(`❌ Failed to upload banner "${banner.title}":`, err);
    }
  }

  console.log('🎉 Banner upload completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
