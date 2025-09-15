import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url

  // 静的ページのサイトマップエントリ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/store/shopRegister`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/verify-email`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  return staticPages
}

// robots.txtも合わせて生成
export async function generateRobotsTxt(): Promise<string> {
  return `
User-agent: *
Allow: /
Allow: /login
Allow: /store/shopRegister
Allow: /stores
Allow: /verify-email

# 認証が必要なページをブロック
Disallow: /store/
Disallow: /product_register/

# サイトマップの場所を指定
Sitemap: ${SITE_CONFIG.url}/sitemap.xml

# クローリング頻度の制限
Crawl-delay: 1
`.trim()
}
