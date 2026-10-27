// src/app/api/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text')?.trim();
  const lang = searchParams.get('lang') || 'vi';

  if (!text) {
    return NextResponse.json({ error: 'Thiếu văn bản cần đọc' }, { status: 400 });
  }

  try {
    // Sử dụng client=gtx thay vì tw-ob để tránh lỗi 403 từ Google
    const googleTtsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text.slice(0, 180)
    )}&tl=${lang}&client=gtx`;

    const response = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        Referer: 'https://translate.google.com/',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream TTS lỗi' }, { status: 502 });
    }

    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi kết nối TTS' }, { status: 500 });
  }
}
