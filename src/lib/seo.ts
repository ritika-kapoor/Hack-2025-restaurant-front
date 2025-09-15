/**
 * SEO関連のヘルパー関数とユーティリティ
 */

import type { Metadata } from "next";

// サイトの基本設定
export const SITE_CONFIG = {
  name: "meguru",
  title: "meguru - 店舗向け地域密着型フードロス削減プラットフォーム",
  description: "meguruは店舗と地域コミュニティを繋ぎ、フードロス削減を支援する革新的なプラットフォームです。チラシ配信、在庫管理、お得な情報発信で持続可能なビジネスをサポート。",
  url: "https://meguru-food.com",
  ogImage: "/og-image.png",
  twitterHandle: "@meguru_official",
  keywords: [
    "フードロス削減",
    "店舗管理",
    "地域コミュニティ",
    "チラシ配信",
    "在庫管理",
    "食品廃棄削減",
    "持続可能性",
    "SDGs",
    "店舗経営",
    "食材管理",
    "地域密着",
    "環境保護"
  ]
};

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

/**
 * メタデータを生成するヘルパー関数
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    keywords = [],
    image = SITE_CONFIG.ogImage,
    url,
    type = "website",
    noIndex = false,
    noFollow = false,
    canonical,
    publishedTime,
    modifiedTime,
    authors = ["meguru Team"],
    section,
    tags = []
  } = props;

  const fullTitle = title 
    ? `${title} | ${SITE_CONFIG.name}` 
    : SITE_CONFIG.title;

  const fullUrl = url 
    ? `${SITE_CONFIG.url}${url.startsWith('/') ? url : `/${url}`}`
    : SITE_CONFIG.url;

  const imageUrl = image.startsWith('http') 
    ? image 
    : `${SITE_CONFIG.url}${image}`;

  const allKeywords = [...SITE_CONFIG.keywords, ...keywords];

  const metadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.url),
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: authors.map(name => ({ name })),
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: type === "article" ? "article" : "website",
      locale: "ja_JP",
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(type === "article" && publishedTime && {
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        authors: authors,
        section,
        tags
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonical || fullUrl,
    },
  };

  return metadata;
}

/**
 * パンくずリスト用のパス生成
 */
export function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'ホーム', url: '/' }];

  paths.reduce((acc, path) => {
    const url = `${acc}/${path}`;
    const name = getBreadcrumbName(path);
    breadcrumbs.push({ name, url });
    return url;
  }, '');

  return breadcrumbs;
}

/**
 * パンくずリストの名前を取得
 */
function getBreadcrumbName(path: string): string {
  const breadcrumbNames: Record<string, string> = {
    'store': '店舗管理',
    'login': 'ログイン',
    'shopRegister': '新規店舗登録',
    'editShop': '店舗情報編集',
    'flyer': 'チラシ管理',
    'orders': '注文管理',
    'notifications': '通知設定',
    'products': '商品管理',
    'productRegister': '商品登録',
    'stores': '店舗一覧',
    'product_register': '商品登録',
    'verify-email': 'メール認証',
  };

  return breadcrumbNames[path] || path;
}

/**
 * 構造化データ用の共通データを生成
 */
export function generateCommonStructuredData() {
  return {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url,
      "logo": `${SITE_CONFIG.url}/logo.png`,
      "description": SITE_CONFIG.description,
      "foundingDate": "2024",
      "sameAs": [
        "https://twitter.com/meguru_official",
        "https://www.facebook.com/meguru.official",
        "https://www.instagram.com/meguru_official"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+81-3-1234-5678",
        "contactType": "customer service",
        "areaServed": "JP",
        "availableLanguage": "Japanese"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Tokyo",
        "addressCountry": "JP"
      },
      "knowsAbout": [
        "フードロス削減",
        "持続可能性",
        "地域コミュニティ",
        "店舗管理",
        "食品廃棄物削減"
      ]
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url,
      "description": SITE_CONFIG.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_CONFIG.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_CONFIG.url}/logo.png`
        }
      }
    }
  };
}

/**
 * JSON-LD形式で構造化データを生成
 */
export function generateJsonLd(data: object): string {
  return JSON.stringify(data, null, process.env.NODE_ENV === 'development' ? 2 : 0);
}

/**
 * ページ種別に応じたメタデータプリセット
 */
export const META_PRESETS = {
  login: {
    title: "ログイン",
    description: "meguruの店舗向けプラットフォームにログインして、フードロス削減の取り組みを始めましょう。チラシ配信、在庫管理、地域コミュニティとの連携が可能です。",
    keywords: ["ログイン", "店舗管理", "meguru", "フードロス削減", "店舗アカウント", "サインイン"],
    noIndex: true,
    image: "/og-login.png"
  },
  register: {
    title: "新規店舗登録",
    description: "meguruでフードロス削減を始めませんか？簡単な店舗登録で地域コミュニティと繋がり、持続可能なビジネスを実現。チラシ配信、在庫管理、お得な情報発信が可能です。",
    keywords: ["新規登録", "店舗登録", "フードロス削減", "meguru", "店舗アカウント作成", "地域密着", "持続可能性", "無料登録"],
    image: "/og-register.png"
  },
  dashboard: {
    title: "店舗管理ダッシュボード",
    description: "meguruの店舗管理ダッシュボードで、フードロス削減の取り組みを効率的に管理。チラシ配信、在庫管理、地域情報を一元管理できます。",
    keywords: ["店舗管理", "ダッシュボード", "フードロス削減", "チラシ配信", "在庫管理"],
    noIndex: true,
    image: "/og-dashboard.png"
  },
  flyer: {
    title: "チラシ管理",
    description: "meguruでチラシを作成・配信し、地域のお客様にお得な情報を届けましょう。フードロス削減に貢献する効果的なチラシ配信システム。",
    keywords: ["チラシ配信", "チラシ作成", "地域配信", "フードロス削減", "お得情報"],
    image: "/og-flyer.png"
  }
};
