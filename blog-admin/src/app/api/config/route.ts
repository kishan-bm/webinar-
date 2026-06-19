import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('page');

    if (!pageKey) {
      // If no page key, return all configs grouped by pageKey
      const configs = await prisma.siteConfig.findMany();
      const grouped: Record<string, Record<string, string>> = {};
      
      configs.forEach((item) => {
        if (!grouped[item.pageKey]) {
          grouped[item.pageKey] = {};
        }
        grouped[item.pageKey][item.key] = item.value;
      });

      return NextResponse.json({ success: true, data: grouped });
    }

    const configs = await prisma.siteConfig.findMany({
      where: { pageKey },
    });

    const configMap: Record<string, string> = {};
    configs.forEach((item) => {
      configMap[item.key] = item.value;
    });

    return NextResponse.json({ success: true, config: configMap });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageKey, config } = body;

    if (!pageKey || !config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload. pageKey and config object are required.' },
        { status: 400 }
      );
    }

    // Perform upsert for each config key-value pair in a transaction
    const operations = Object.entries(config).map(([key, val]) => {
      const stringVal = typeof val === 'string' ? val : String(val);
      return prisma.siteConfig.upsert({
        where: {
          pageKey_key: {
            pageKey,
            key,
          },
        },
        update: {
          value: stringVal,
        },
        create: {
          pageKey,
          key,
          value: stringVal,
        },
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true, message: 'Configuration saved successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
