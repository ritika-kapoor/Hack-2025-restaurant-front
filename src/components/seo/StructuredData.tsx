/**
 * SEO用構造化データコンポーネント
 * JSON-LD形式でschema.orgの構造化データを出力
 */

import { FC } from 'react';

interface StructuredDataProps {
  data: object;
}

export const StructuredData: FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, process.env.NODE_ENV === 'development' ? 2 : 0)
      }}
    />
  );
};

// プリセット構造化データの型定義とファクトリー関数

export interface LocalBusinessData {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  url?: string;
  image?: string[];
  openingHours?: string[];
  priceRange?: string;
  servesCuisine?: string[];
  paymentAccepted?: string[];
}

export interface ProductData {
  name: string;
  description: string;
  image: string[];
  sku?: string;
  brand?: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
    validFrom?: string;
    validThrough?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface OfferData {
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  availability: string;
  validFrom: string;
  validThrough: string;
  url: string;
  seller: {
    name: string;
    type: string;
  };
}

// ローカルビジネス（店舗）の構造化データ
export const createLocalBusinessStructuredData = (data: LocalBusinessData) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": data.name,
  "description": data.description,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": data.address.streetAddress,
    "addressLocality": data.address.addressLocality,
    "addressRegion": data.address.addressRegion,
    "postalCode": data.address.postalCode,
    "addressCountry": data.address.addressCountry
  },
  "telephone": data.telephone,
  "url": data.url,
  "image": data.image,
  "openingHours": data.openingHours,
  "priceRange": data.priceRange,
  "servesCuisine": data.servesCuisine,
  "paymentAccepted": data.paymentAccepted,
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": data.url,
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    }
  }
});

// 商品の構造化データ
export const createProductStructuredData = (data: ProductData) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": data.name,
  "description": data.description,
  "image": data.image,
  "sku": data.sku,
  "brand": {
    "@type": "Brand",
    "name": data.brand || "meguru"
  },
  "offers": {
    "@type": "Offer",
    "price": data.offers.price,
    "priceCurrency": data.offers.priceCurrency,
    "availability": data.offers.availability,
    "validFrom": data.offers.validFrom,
    "validThrough": data.offers.validThrough,
    "seller": {
      "@type": "Organization",
      "name": "meguru"
    }
  },
  "aggregateRating": data.aggregateRating ? {
    "@type": "AggregateRating",
    "ratingValue": data.aggregateRating.ratingValue,
    "reviewCount": data.aggregateRating.reviewCount
  } : undefined
});

// 特別オファーの構造化データ
export const createOfferStructuredData = (data: OfferData) => ({
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": data.name,
  "description": data.description,
  "price": data.price,
  "priceCurrency": data.priceCurrency,
  "availability": data.availability,
  "validFrom": data.validFrom,
  "validThrough": data.validThrough,
  "url": data.url,
  "seller": {
    "@type": data.seller.type,
    "name": data.seller.name
  },
  "itemOffered": {
    "@type": "Product",
    "name": data.name,
    "description": data.description
  }
});

// パンくずリストの構造化データ
export const createBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// FAQ（よくある質問）の構造化データ
export const createFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// 記事の構造化データ
export const createArticleStructuredData = (article: {
  headline: string;
  description: string;
  image: string[];
  author: string;
  publisher: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.headline,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": article.publisher,
    "logo": {
      "@type": "ImageObject",
      "url": "https://meguru-food.com/logo.png"
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});
