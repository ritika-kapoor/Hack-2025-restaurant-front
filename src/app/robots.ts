import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/login',
          '/store/shopRegister', 
          '/stores',
          '/verify-email',
        ],
        disallow: [
          '/store/',  // 認証が必要な店舗管理ページ
          '/product_register/',  // 商品登録ページ
          '/api/',    // APIエンドポイント
        ],
        crawlDelay: 1,
      },
      // 検索エンジンボット向けの特別ルール
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/login',
          '/store/shopRegister',
          '/stores',
          '/verify-email',
        ],
        disallow: [
          '/store/',
          '/product_register/',
          '/api/',
        ],
      },
      // 悪質なボットをブロック
      {
        userAgent: [
          'CCBot',
          'GPTBot', 
          'ChatGPT-User',
          'ChatGPT',
          'CCBot',
          'anthropic-ai'
        ],
        disallow: ['/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  }
}
