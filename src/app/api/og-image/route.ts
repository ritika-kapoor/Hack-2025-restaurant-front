import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  console.log('OG Image API called for URL:', url);

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OG Image Fetcher)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // OG画像を取得
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogImageSecure = document.querySelector('meta[property="og:image:secure_url"]')?.getAttribute('content');
    const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    
    // フォールバック画像
    const firstImg = document.querySelector('img')?.getAttribute('src');

    const imageUrl = ogImageSecure || ogImage || twitterImage || firstImg;

    console.log('Found OG images:', {
      ogImage,
      ogImageSecure,
      twitterImage,
      firstImg,
      selected: imageUrl
    });

    if (imageUrl) {
      // 相対URLの場合は絶対URLに変換
      const absoluteImageUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : new URL(imageUrl, url).toString();

      console.log('Returning image URL:', absoluteImageUrl);
      return NextResponse.json({ imageUrl: absoluteImageUrl });
    } else {
      console.log('No image found for URL:', url);
      return NextResponse.json({ imageUrl: null });
    }
  } catch (error) {
    console.error('OG image fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OG image', imageUrl: null },
      { status: 500 }
    );
  }
}
