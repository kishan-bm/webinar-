import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Meta requires PII (email, phone) to be normalized then SHA-256 hashed
// before it's sent — never send raw email/phone to the Graph API.
function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      // Credentials not set up yet. Don't throw — the site should keep
      // working normally, this just means the event silently isn't sent.
      console.warn('Meta CAPI skipped: META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not configured');
      return NextResponse.json({ success: false, error: 'Meta Conversions API not configured' });
    }

    const body = await request.json();
    const { event_name, event_id, event_source_url, email, phone, fbp, fbc } = body || {};

    if (!event_name || !event_id) {
      return NextResponse.json({ success: false, error: 'event_name and event_id are required' }, { status: 400 });
    }

    const userData: Record<string, unknown> = {};
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (clientIp) userData.client_ip_address = clientIp;
    const userAgent = request.headers.get('user-agent');
    if (userAgent) userData.client_user_agent = userAgent;
    if (email) userData.em = [sha256(email)];
    if (phone) userData.ph = [sha256(String(phone).replace(/[^0-9]/g, ''))];
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const eventPayload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url,
          action_source: 'website',
          user_data: userData,
        },
      ],
    };

    const testEventCode = process.env.META_TEST_EVENT_CODE;
    const params = new URLSearchParams({ access_token: accessToken });
    if (testEventCode) params.set('test_event_code', testEventCode);

    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });

    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      console.error('Meta CAPI error:', metaData);
      return NextResponse.json({ success: false, error: metaData });
    }

    return NextResponse.json({ success: true, result: metaData });
  } catch (error: any) {
    console.error('Meta CAPI exception:', error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' });
  }
}
