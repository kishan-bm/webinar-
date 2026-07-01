import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if summary is already cached in SiteConfig
    const cachedConfig = await prisma.siteConfig.findUnique({
      where: {
        pageKey_key: {
          pageKey: `blog-summary:${id}`,
          key: 'data',
        },
      },
    });

    if (cachedConfig) {
      try {
        const summaryData = JSON.parse(cachedConfig.value);
        return NextResponse.json({ success: true, data: summaryData });
      } catch (parseErr) {
        console.error('Failed to parse cached AI summary:', parseErr);
      }
    }

    return NextResponse.json({ success: false, cached: false }, { status: 404 });
  } catch (error: any) {
    console.error('Failed to fetch AI summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI summary' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Check cache first
    const cachedConfig = await prisma.siteConfig.findUnique({
      where: {
        pageKey_key: {
          pageKey: `blog-summary:${id}`,
          key: 'data',
        },
      },
    });

    if (cachedConfig) {
      try {
        const summaryData = JSON.parse(cachedConfig.value);
        return NextResponse.json({ success: true, data: summaryData });
      } catch (_) {}
    }

    // 2. Fetch the post from database
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // 3. Check for API keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY;

    if (!geminiKey && !claudeKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI API Key is missing. Please set GEMINI_API_KEY or CLAUDE_API_KEY in your environment variables.',
        },
        { status: 400 }
      );
    }

    let summaryJsonStr = '';

    // Strip HTML tags for clean prompts
    const cleanContent = post.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 15000); // safe limit

    if (geminiKey) {
      // Use Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const prompt = `You are an expert summarizer for options trading and day trading educational articles at Navigation Trading.
Analyze the following article and generate a premium summary. 
The summary must consist of:
1. A highly inspiring quote summarizing the main takeaway or core philosophy from the article. The quote should sound like an authoritative trading lesson or wisdom.
2. Exactly 3 to 5 Key Moments. Each key moment needs an engaging, short title and a concise 1-sentence description.

Article Title: ${post.title}
Article Excerpt: ${post.excerpt || ''}
Article Content:
${cleanContent}

You MUST return a JSON object with this exact structure:
{
  "quote": "string containing the inspiring summary quote",
  "keyMoments": [
    {
      "id": 1,
      "title": "Title of moment 1",
      "description": "Short description of moment 1"
    }
  ]
}
Do not add any explanations, markdown code blocks (like \`\`\`json), or extra text outside the JSON. Return raw valid JSON.`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Sanitization: sometimes models wrap JSON in code blocks despite instructions
      summaryJsonStr = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    } else if (claudeKey) {
      // Use Claude API
      const claudeUrl = 'https://api.anthropic.com/v1/messages';
      const prompt = `You are an expert summarizer for options trading and day trading educational articles at Navigation Trading.
Analyze the following article and generate a premium summary. 

Article Title: ${post.title}
Article Excerpt: ${post.excerpt || ''}
Article Content:
${cleanContent}

You MUST return a JSON object with this exact structure:
{
  "quote": "string containing the inspiring summary quote",
  "keyMoments": [
    {
      "id": 1,
      "title": "Title of moment 1",
      "description": "Short description of moment 1"
    }
  ]
}
Return ONLY valid JSON and nothing else.`;

      const response = await fetch(claudeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API returned status ${response.status}: ${errorText}`);
      }

      const resData = await response.json();
      const rawText = resData.content?.[0]?.text || '';
      summaryJsonStr = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    }

    // Validate if valid JSON
    let parsedData = null;
    try {
      parsedData = JSON.parse(summaryJsonStr);
      // Basic structure validation
      if (!parsedData.quote || !Array.isArray(parsedData.keyMoments)) {
        throw new Error('Invalid structure');
      }
    } catch (e) {
      console.error('Invalid AI summary output:', summaryJsonStr);
      return NextResponse.json(
        { success: false, error: 'AI returned an invalid response structure. Please try again.' },
        { status: 502 }
      );
    }

    // 4. Save to SiteConfig cache
    await prisma.siteConfig.upsert({
      where: {
        pageKey_key: {
          pageKey: `blog-summary:${id}`,
          key: 'data',
        },
      },
      update: {
        value: summaryJsonStr,
      },
      create: {
        pageKey: `blog-summary:${id}`,
        key: 'data',
        value: summaryJsonStr,
      },
    });

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Failed to generate AI summary:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate AI summary' },
      { status: 500 }
    );
  }
}
