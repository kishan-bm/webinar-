const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database connection...');
  
  // Find or create a user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Admin Test',
        email: 'admin-test@navigationtrading.com'
      }
    });
    console.log('✅ Created User:', user.email);
  } else {
    console.log('✅ Found User:', user.email);
  }

  // Find or create a category
  let category = await prisma.category.findFirst({
    where: { slug: 'options-trading' }
  });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Options Trading',
        slug: 'options-trading'
      }
    });
    console.log('✅ Created Category:', category.name);
  } else {
    console.log('✅ Found Category:', category.name);
  }

  const slug = 'ultimate-options-trading-guide';
  
  // Delete existing post with same slug to prevent unique constraint error
  await prisma.post.deleteMany({
    where: { slug }
  });
  console.log('🧹 Deleted any existing post with slug:', slug);

  // HTML content matching the editor attributes
  const content = `
    <h1>Overview of Options Trading</h1>
    <p>Options are powerful tools for traders that offer leverage, hedging capabilities, and the ability to profit in any market direction. They are derivative contracts representing a financial transaction based on underlying assets like stocks or index products.</p>
    
    <hr style="width: 50%; height: 4px; border: none; background-color: #cbd5e1; margin-left: 0; margin-right: auto; margin-top: 24px; margin-bottom: 24px; display: block;" />
    
    <h2>1. What is an Option?</h2>
    <p>An option is a contract that gives the buyer the right, but not the obligation, to buy or sell an underlying asset at a specified price (strike price) within a specific time period (expiration date).</p>
    
    <hr style="width: 75%; height: 8px; border: none; background-color: #cbd5e1; margin-left: auto; margin-right: auto; margin-top: 24px; margin-bottom: 24px; display: block;" />
    
    <h3>2. Call Options vs Put Options</h3>
    <p>A call option gives the holder the right to buy, whereas a put option gives the holder the right to sell the underlying asset. Understanding the difference between calls and puts is foundational to options trading.</p>
    
    <hr style="width: 100%; height: 2px; border: none; background-color: #cbd5e1; margin-left: auto; margin-right: auto; margin-top: 24px; margin-bottom: 24px; display: block;" />
    
    <h4>3. Important Option Metrics</h4>
    <p>Traders must monitor several key metrics, including Delta (price sensitivity), Gamma (rate of change of delta), Theta (time decay), and Vega (volatility sensitivity). These are collectively known as the Options Greeks.</p>
  `;

  // Create the test post
  const post = await prisma.post.create({
    data: {
      title: 'Ultimate Options Trading Guide for Beginners',
      slug,
      content,
      seoTitle: 'Ultimate Options Trading Guide',
      seoDescription: 'A comprehensive guide on options trading with detailed sections.',
      status: 'PUBLISHED',
      authorId: user.id,
      categoryId: category.id
    }
  });
  console.log('✅ Created Post:', post.title);
  console.log('URL: http://localhost:3000/blogs/' + post.slug);
}

main()
  .catch(e => {
    console.error('❌ Error during script execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
