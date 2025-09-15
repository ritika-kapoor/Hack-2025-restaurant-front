import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meguru-food.com"),
  title: {
    default: "meguru - 店舗向け地域密着型フードロス削減プラットフォーム",
    template: "%s | meguru - 店舗向けフードロス削減プラットフォーム",
  },
  description: "meguruは店舗と地域コミュニティを繋ぎ、フードロス削減を支援する革新的なプラットフォームです。チラシ配信、在庫管理、お得な情報発信で持続可能なビジネスをサポート。",
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
  ],
  authors: [{ name: "meguru Team" }],
  creator: "meguru",
  publisher: "meguru",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://meguru-food.com",
    siteName: "meguru",
    title: "meguru - 店舗向け地域密着型フードロス削減プラットフォーム",
    description: "店舗と地域コミュニティを繋ぎ、フードロス削減を支援する革新的なプラットフォーム",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "meguru - フードロス削減プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meguru_official",
    creator: "@meguru_official",
    title: "meguru - 店舗向けフードロス削減プラットフォーム",
    description: "店舗と地域コミュニティを繋ぎ、フードロス削減を支援する革新的なプラットフォーム",
    images: ["/twitter-card.png"],
  },
  verification: {
    google: "google-site-verification-code-here",
    // yandex: "yandex-verification-code",
    // yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://meguru-food.com",
  },
  category: "Food & Sustainability",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* 構造化データ - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "meguru",
              "url": "https://meguru-food.com",
              "logo": "https://meguru-food.com/logo.png",
              "description": "店舗と地域コミュニティを繋ぎ、フードロス削減を支援する革新的なプラットフォーム",
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
            })
          }}
        />
        
        {/* 構造化データ - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "meguru",
              "url": "https://meguru-food.com",
              "description": "店舗向け地域密着型フードロス削減プラットフォーム",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://meguru-food.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "meguru",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://meguru-food.com/logo.png"
                }
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
